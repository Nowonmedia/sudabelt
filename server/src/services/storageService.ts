import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export interface DatabaseSchema {
  products: Record<string, unknown>[];
  articles: Record<string, unknown>[];
  projects: Record<string, unknown>[];
  subscribers: Record<string, unknown>[];
  campaigns: Record<string, unknown>[];
  users: Record<string, unknown>[];
  rfqs: Record<string, unknown>[];
  tickets: Record<string, unknown>[];
  leads: Record<string, unknown>[];
  trainings: Record<string, unknown>[];
  inquiries: Record<string, unknown>[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

const INITIAL_DB: DatabaseSchema = {
  products: [],
  articles: [],
  projects: [],
  subscribers: [],
  campaigns: [],
  users: [],
  rfqs: [],
  tickets: [],
  leads: [],
  trainings: [],
  inquiries: [],
};

class StorageService {
  private memoryDb: DatabaseSchema;
  private isLoaded = false;

  constructor() {
    this.memoryDb = { ...INITIAL_DB };
    this.load();
  }

  public load(): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        this.memoryDb = JSON.parse(raw);
      } else {
        this.save();
      }
      this.isLoaded = true;
    } catch (err) {
      console.error('[StorageService] Error loading db.json, using defaults:', err);
      this.memoryDb = { ...INITIAL_DB };
    }
  }

  public save(): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.memoryDb, null, 2), 'utf8');
    } catch (err) {
      console.error('[StorageService] Error saving db.json:', err);
    }
  }

  public getCollection(name: keyof DatabaseSchema): Record<string, unknown>[] {
    if (!this.memoryDb[name]) {
      this.memoryDb[name] = [];
    }
    return this.memoryDb[name];
  }

  public generateId(): string {
    return crypto.randomBytes(12).toString('hex');
  }
}

export const storage = new StorageService();
