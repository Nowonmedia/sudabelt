import { storage, DatabaseSchema } from './storageService';

type QueryFilter = Record<string, unknown>;

function matchesFilter(item: Record<string, unknown>, filter?: QueryFilter): boolean {
  if (!filter || Object.keys(filter).length === 0) return true;

  for (const [key, expected] of Object.entries(filter)) {
    if (key === '$or' && Array.isArray(expected)) {
      const orMatched = expected.some((subFilter) =>
        matchesFilter(item, subFilter as QueryFilter)
      );
      if (!orMatched) return false;
      continue;
    }

    const actualVal = item[key];

    if (key === '_id' || key === 'id') {
      const actualId = String(item._id || item.id);
      const expectedId = String(expected);
      if (actualId !== expectedId) return false;
      continue;
    }

    if (expected instanceof RegExp) {
      if (typeof actualVal !== 'string' || !expected.test(actualVal)) return false;
      continue;
    }

    if (expected && typeof expected === 'object' && !Array.isArray(expected)) {
      const expObj = expected as Record<string, unknown>;
      if ('$ne' in expObj) {
        if (actualVal === expObj.$ne) return false;
        continue;
      }
      if ('$in' in expObj && Array.isArray(expObj.$in)) {
        if (!expObj.$in.includes(actualVal)) return false;
        continue;
      }
    }

    if (actualVal !== expected) return false;
  }

  return true;
}

export function createModelAdapter<T extends Record<string, unknown>>(
  collectionName: keyof DatabaseSchema
) {
  const getItems = () => storage.getCollection(collectionName);

  const wrapDoc = (raw: Record<string, unknown> | null) => {
    if (!raw || typeof raw !== 'object') return raw;
    const doc = { ...raw };
    doc.save = async function () {
      const items = getItems();
      const id = String(doc._id || doc.id);
      const idx = items.findIndex((it) => String(it._id || it.id) === id);
      if (idx !== -1) {
        items[idx] = { ...doc, updatedAt: new Date().toISOString() };
        storage.save();
      }
      return doc;
    };
    return doc;
  };

  const makeQuery = <R>(data: R) => ({
    sort: (_sortObj?: Record<string, number>) => makeQuery(data),
    select: (_fields?: string) => makeQuery(data),
    lean: () => ({
      exec: async () => data,
    }),
    exec: async () => data,
    then: <TResult1 = R, TResult2 = never>(
      onfulfilled?: ((value: R) => TResult1 | PromiseLike<TResult1>) | null,
      onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
    ) => Promise.resolve(data).then(onfulfilled, onrejected),
    catch: <TResult = never>(
      onrejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | null
    ) => Promise.resolve(data).catch(onrejected),
  });

  const findOneAndUpdateFn = (
    filter: QueryFilter,
    update: Record<string, unknown>,
    _opts?: { new?: boolean }
  ) => {
    const items = getItems();
    const idx = items.findIndex((it) => matchesFilter(it, filter));
    if (idx === -1) {
      return makeQuery(null);
    }

    const patch = (update.$set as Record<string, unknown>) || update;
    const updated = {
      ...items[idx],
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    items[idx] = updated;
    storage.save();
    return makeQuery(wrapDoc(updated));
  };

  const findOneAndDeleteFn = (filter: QueryFilter) => {
    const items = getItems();
    const idx = items.findIndex((it) => matchesFilter(it, filter));
    if (idx === -1) {
      return makeQuery(null);
    }
    const [removed] = items.splice(idx, 1);
    storage.save();
    return makeQuery(wrapDoc(removed));
  };

  return {
    find: (filter?: QueryFilter) => {
      const items = getItems()
        .filter((item) => matchesFilter(item, filter))
        .map(wrapDoc);
      return makeQuery(items);
    },

    findOne: (filter?: QueryFilter) => {
      const item = getItems().find((it) => matchesFilter(it, filter)) || null;
      return makeQuery(wrapDoc(item));
    },

    findById: (id: string) => {
      const item = getItems().find((it) => String(it._id || it.id) === String(id)) || null;
      return makeQuery(wrapDoc(item));
    },

    create: async (payload: Partial<T> | Partial<T>[]): Promise<unknown> => {
      const now = new Date().toISOString();
      const items = getItems();

      if (Array.isArray(payload)) {
        const createdList = payload.map((p) => {
          const doc = {
            ...p,
            _id: p._id ? String(p._id) : storage.generateId(),
            createdAt: now,
            updatedAt: now,
          };
          items.push(doc);
          return wrapDoc(doc);
        });
        storage.save();
        return createdList;
      }

      const doc = {
        ...payload,
        _id: payload._id ? String(payload._id) : storage.generateId(),
        createdAt: now,
        updatedAt: now,
      };
      items.push(doc);
      storage.save();
      return wrapDoc(doc);
    },

    findOneAndUpdate: findOneAndUpdateFn,
    findOneAndDelete: findOneAndDeleteFn,

    findByIdAndUpdate: (
      id: string,
      update: Record<string, unknown>,
      opts?: { new?: boolean }
    ) => {
      return findOneAndUpdateFn({ _id: id }, update, opts);
    },

    findByIdAndDelete: (id: string) => {
      return findOneAndDeleteFn({ _id: id });
    },

    countDocuments: async (filter?: QueryFilter): Promise<number> => {
      return getItems().filter((it) => matchesFilter(it, filter)).length;
    },
  };
}
