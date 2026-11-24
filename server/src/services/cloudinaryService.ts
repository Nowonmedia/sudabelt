import crypto from 'node:crypto';

export interface CloudinaryUploadResult {
  secureUrl: string;
  optimizedUrl: string;
  publicId: string;
  format?: string;
  resourceType: 'image' | 'raw' | 'video' | 'auto';
}

export const isCloudinaryConfigured = (): boolean => {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
};

/**
 * Injects Cloudinary f_auto,q_auto optimization flags into a standard Cloudinary image URL.
 */
export const injectCloudinaryOptimization = (url: string): string => {
  if (!url.includes('res.cloudinary.com')) return url;
  if (url.includes('/image/upload/') && !url.includes('/f_auto')) {
    return url.replace('/image/upload/', '/image/upload/f_auto,q_auto/');
  }
  return url;
};

/**
 * Uploads a base64 data URI or remote HTTP(S) URL to Cloudinary using signed REST API.
 * Uses native Node.js fetch and crypto - zero external SDK dependencies required.
 */
export const uploadToCloudinary = async (options: {
  fileSource: string; // data:image/...;base64,... OR https://...
  folder?: string;
  publicId?: string;
  resourceType?: 'image' | 'raw' | 'auto';
}): Promise<CloudinaryUploadResult> => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim().toLowerCase();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary environment variables are not configured.');
  }

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const folder = options.folder || 'sudabelt';
  const resourceType = options.resourceType || 'auto';

  const paramsToSign: Record<string, string> = {
    folder,
    timestamp,
  };
  if (options.publicId) {
    paramsToSign.public_id = options.publicId;
  }

  const sortedParamStr = Object.keys(paramsToSign)
    .sort()
    .map((key) => `${key}=${paramsToSign[key]}`)
    .join('&');

  const signature = crypto
    .createHash('sha1')
    .update(`${sortedParamStr}${apiSecret}`)
    .digest('hex');

  const formBody = new URLSearchParams({
    file: options.fileSource,
    api_key: apiKey,
    timestamp,
    folder,
    signature,
  });

  if (options.publicId) {
    formBody.append('public_id', options.publicId);
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formBody.toString(),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Cloudinary upload failed (${response.status}): ${errText}`);
  }

  const data = (await response.json()) as {
    secure_url: string;
    public_id: string;
    format?: string;
    resource_type: 'image' | 'raw' | 'video';
  };

  return {
    secureUrl: data.secure_url,
    optimizedUrl:
      data.resource_type === 'image'
        ? injectCloudinaryOptimization(data.secure_url)
        : data.secure_url,
    publicId: data.public_id,
    format: data.format,
    resourceType: data.resource_type,
  };
};
