import AWS from 'aws-sdk';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';
import { prisma } from '../config/database';

// Types
export interface StorageProvider {
  upload(file: Express.Multer.File, options?: UploadOptions): Promise<StorageResult>;
  delete(fileId: string): Promise<boolean>;
  getUrl(fileId: string, options?: GetUrlOptions): Promise<string>;
  list(prefix?: string): Promise<StorageFile[]>;
}

export interface UploadOptions {
  folder?: string;
  public?: boolean;
  generateThumbnail?: boolean;
  maxSize?: number;
  allowedMimeTypes?: string[];
  metadata?: Record<string, any>;
}

export interface StorageResult {
  id: string;
  url: string;
  publicUrl?: string;
  thumbnailUrl?: string;
  size: number;
  mimeType: string;
  metadata?: Record<string, any>;
  provider: 'local' | 's3' | 'cloudinary' | 'google-drive';
}

export interface GetUrlOptions {
  expiresIn?: number; // secondes
  download?: boolean;
  version?: string;
}

export interface StorageFile {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  createdAt: Date;
  url?: string;
}

// ==================== AWS S3 PROVIDER ====================
class S3Provider implements StorageProvider {
  private s3: AWS.S3;
  private bucket: string;
  private region: string;

  constructor() {
    this.bucket = process.env.AWS_BUCKET_NAME || 'traducxion-uploads';
    this.region = process.env.AWS_REGION || 'eu-west-3';

    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: this.region,
      signatureVersion: 'v4',
    });

    // Vérifier la configuration
    this.verifyBucket();
  }

  private async verifyBucket() {
    try {
      await this.s3.headBucket({ Bucket: this.bucket }).promise();
      console.log('✅ S3 Bucket accessible:', this.bucket);
    } catch (error) {
      console.error('❌ S3 Bucket error:', error);
      // Créer le bucket s'il n'existe pas
      if (error.code === 'NotFound') {
        await this.createBucket();
      }
    }
  }

  private async createBucket() {
    try {
      await this.s3.createBucket({
        Bucket: this.bucket,
        CreateBucketConfiguration: {
          LocationConstraint: this.region
        }
      }).promise();

      // Configurer CORS
      await this.s3.putBucketCors({
        Bucket: this.bucket,
        CORSConfiguration: {
          CORSRules: [{
            AllowedHeaders: ['*'],
            AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
            AllowedOrigins: [process.env.FRONTEND_URL || '*'],
            ExposeHeaders: ['ETag'],
            MaxAgeSeconds: 3000
          }]
        }
      }).promise();

      console.log('✅ S3 Bucket created:', this.bucket);
    } catch (error) {
      console.error('❌ Failed to create bucket:', error);
    }
  }

  async upload(file: Express.Multer.File, options?: UploadOptions): Promise<StorageResult> {
    const key = this.generateKey(file.originalname, options?.folder);
    
    // Upload principal
    const uploadParams: AWS.S3.PutObjectRequest = {
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: options?.public ? 'public-read' : 'private',
      Metadata: {
        originalName: file.originalname,
        ...options?.metadata
      },
      ServerSideEncryption: 'AES256',
      StorageClass: 'STANDARD_IA', // Pour économiser
    };

    const result = await this.s3.upload(uploadParams).promise();

    // Générer thumbnail si demandé
    let thumbnailUrl: string | undefined;
    if (options?.generateThumbnail && file.mimetype.startsWith('image/')) {
      thumbnailUrl = await this.generateThumbnail(file, key);
    }

    // URL publique ou signée
    const url = options?.public 
      ? result.Location 
      : await this.getSignedUrl(key);

    return {
      id: key,
      url,
      publicUrl: options?.public ? result.Location : undefined,
      thumbnailUrl,
      size: file.size,
      mimeType: file.mimetype,
      metadata: options?.metadata,
      provider: 's3'
    };
  }

  private async generateThumbnail(file: Express.Multer.File, originalKey: string): Promise<string> {
    const thumbnailKey = originalKey.replace(/(\.[^.]+)$/, '_thumb$1');
    
    const thumbnail = await sharp(file.buffer)
      .resize(300, 300, { 
        fit: 'cover',
        withoutEnlargement: true 
      })
      .jpeg({ quality: 80 })
      .toBuffer();

    await this.s3.upload({
      Bucket: this.bucket,
      Key: thumbnailKey,
      Body: thumbnail,
      ContentType: 'image/jpeg',
      ACL: 'public-read',
      CacheControl: 'max-age=31536000', // 1 an
    }).promise();

    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${thumbnailKey}`;
  }

  async delete(fileId: string): Promise<boolean> {
    try {
      await this.s3.deleteObject({
        Bucket: this.bucket,
        Key: fileId
      }).promise();

      // Supprimer aussi le thumbnail s'il existe
      const thumbnailKey = fileId.replace(/(\.[^.]+)$/, '_thumb$1');
      await this.s3.deleteObject({
        Bucket: this.bucket,
        Key: thumbnailKey
      }).promise().catch(() => {});

      return true;
    } catch (error) {
      console.error('S3 delete error:', error);
      return false;
    }
  }

  async getUrl(fileId: string, options?: GetUrlOptions): Promise<string> {
    if (options?.download) {
      return this.getSignedUrl(fileId, options.expiresIn, true);
    }
    return this.getSignedUrl(fileId, options?.expiresIn);
  }

  private async getSignedUrl(key: string, expiresIn = 3600, download = false): Promise<string> {
    const params: AWS.S3.GetObjectRequest = {
      Bucket: this.bucket,
      Key: key,
    };

    if (download) {
      params.ResponseContentDisposition = 'attachment';
    }

    return this.s3.getSignedUrlPromise('getObject', {
      ...params,
      Expires: expiresIn
    });
  }

  async list(prefix?: string): Promise<StorageFile[]> {
    const params: AWS.S3.ListObjectsV2Request = {
      Bucket: this.bucket,
      Prefix: prefix,
      MaxKeys: 1000
    };

    const result = await this.s3.listObjectsV2(params).promise();

    return (result.Contents || []).map(item => ({
      id: item.Key!,
      name: path.basename(item.Key!),
      size: item.Size!,
      mimeType: 'application/octet-stream',
      createdAt: item.LastModified!,
    }));
  }

  private generateKey(filename: string, folder?: string): string {
    const timestamp = Date.now();
    const random = crypto.randomBytes(8).toString('hex');
    const extension = path.extname(filename);
    const name = path.basename(filename, extension);
    const cleanName = name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    
    const key = `${cleanName}-${timestamp}-${random}${extension}`;
    
    if (folder) {
      return `${folder}/${key}`;
    }
    
    return key;
  }

  // Méthode pour upload multipart (gros fichiers)
  async uploadLarge(
    filePath: string, 
    key: string, 
    onProgress?: (progress: number) => void
  ): Promise<string> {
    const fileStream = fs.createReadStream(filePath);
    const fileStats = fs.statSync(filePath);

    const uploadParams: AWS.S3.PutObjectRequest = {
      Bucket: this.bucket,
      Key: key,
      Body: fileStream,
      ContentType: 'application/octet-stream',
    };

    const options = {
      partSize: 10 * 1024 * 1024, // 10 MB
      queueSize: 4
    };

    return new Promise((resolve, reject) => {
      const upload = this.s3.upload(uploadParams, options);

      if (onProgress) {
        upload.on('httpUploadProgress', (progress) => {
          const percentage = Math.round((progress.loaded / fileStats.size) * 100);
          onProgress(percentage);
        });
      }

      upload.send((err, data) => {
        if (err) reject(err);
        else resolve(data.Location);
      });
    });
  }
}

// ==================== CLOUDINARY PROVIDER ====================
class CloudinaryProvider implements StorageProvider {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true
    });
  }

  async upload(file: Express.Multer.File, options?: UploadOptions): Promise<StorageResult> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: options?.folder || 'traducxion',
          public_id: this.generatePublicId(file.originalname),
          resource_type: 'auto',
          access_mode: options?.public ? 'public' : 'authenticated',
          transformation: options?.generateThumbnail ? [
            { width: 300, height: 300, crop: 'fill', quality: 'auto' }
          ] : undefined,
          metadata: options?.metadata,
          invalidate: true,
          overwrite: false,
        },
        (error, result) => {
          if (error) return reject(error);

          resolve({
            id: result!.public_id,
            url: result!.secure_url,
            publicUrl: result!.secure_url,
            thumbnailUrl: options?.generateThumbnail 
              ? cloudinary.url(result!.public_id, {
                  width: 300,
                  height: 300,
                  crop: 'fill',
                  quality: 'auto',
                  secure: true
                })
              : undefined,
            size: result!.bytes,
            mimeType: file.mimetype,
            metadata: {
              ...options?.metadata,
              cloudinary: {
                version: result!.version,
                format: result!.format,
                resource_type: result!.resource_type
              }
            },
            provider: 'cloudinary'
          });
        }
      );

      uploadStream.end(file.buffer);
    });
  }

  async delete(fileId: string): Promise<boolean> {
    try {
      const result = await cloudinary.uploader.destroy(fileId, {
        invalidate: true,
        resource_type: 'auto'
      });
      return result.result === 'ok';
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      return false;
    }
  }

  async getUrl(fileId: string, options?: GetUrlOptions): Promise<string> {
    const urlOptions: any = {
      secure: true,
      sign_url: true,
    };

    if (options?.download) {
      urlOptions.attachment = true;
    }

    if (options?.version) {
      urlOptions.version = options.version;
    }

    if (options?.expiresIn) {
      urlOptions.expires_at = Math.floor(Date.now() / 1000) + options.expiresIn;
    }

    return cloudinary.url(fileId, urlOptions);
  }

  async list(prefix?: string): Promise<StorageFile[]> {
    try {
      const result = await cloudinary.api.resources({
        type: 'upload',
        prefix: prefix || 'traducxion',
        max_results: 500,
      });

      return result.resources.map((resource: any) => ({
        id: resource.public_id,
        name: resource.public_id.split('/').pop(),
        size: resource.bytes,
        mimeType: `${resource.resource_type}/${resource.format}`,
        createdAt: new Date(resource.created_at),
        url: resource.secure_url
      }));
    } catch (error) {
      console.error('Cloudinary list error:', error);
      return [];
    }
  }

  private generatePublicId(filename: string): string {
    const timestamp = Date.now();
    const random = crypto.randomBytes(4).toString('hex');
    const name = path.basename(filename, path.extname(filename));
    return `${name}_${timestamp}_${random}`;
  }
}

// ==================== GOOGLE DRIVE PROVIDER ====================
class GoogleDriveProvider implements StorageProvider {
  private drive: any;
  private folderId: string;

  constructor() {
    this.folderId = process.env.GOOGLE_DRIVE_FOLDER_ID || '';
    this.initializeDrive();
  }

  private async initializeDrive() {
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE,
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });

    const authClient = await auth.getClient();
    this.drive = google.drive({ version: 'v3', auth: authClient });
  }

  async upload(file: Express.Multer.File, options?: UploadOptions): Promise<StorageResult> {
    const fileMetadata = {
      name: file.originalname,
      parents: [this.folderId],
      description: JSON.stringify(options?.metadata || {}),
    };

    const media = {
      mimeType: file.mimetype,
      body: file.buffer,
    };

    const response = await this.drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, webViewLink, webContentLink, size',
    });

    // Définir les permissions
    if (options?.public) {
      await this.drive.permissions.create({
        fileId: response.data.id,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });
    }

    return {
      id: response.data.id,
      url: response.data.webContentLink,
      publicUrl: options?.public ? response.data.webViewLink : undefined,
      size: parseInt(response.data.size || '0'),
      mimeType: file.mimetype,
      metadata: options?.metadata,
      provider: 'google-drive'
    };
  }

  async delete(fileId: string): Promise<boolean> {
    try {
      await this.drive.files.delete({ fileId });
      return true;
    } catch (error) {
      console.error('Google Drive delete error:', error);
      return false;
    }
  }

  async getUrl(fileId: string, options?: GetUrlOptions): Promise<string> {
    const file = await this.drive.files.get({
      fileId,
      fields: 'webContentLink, webViewLink',
    });

    return options?.download 
      ? file.data.webContentLink 
      : file.data.webViewLink;
  }

  async list(prefix?: string): Promise<StorageFile[]> {
    const query = prefix 
      ? `'${this.folderId}' in parents and name contains '${prefix}'`
      : `'${this.folderId}' in parents`;

    const response = await this.drive.files.list({
      q: query,
      fields: 'files(id, name, size, mimeType, createdTime)',
      pageSize: 1000,
    });

    return response.data.files.map((file: any) => ({
      id: file.id,
      name: file.name,
      size: parseInt(file.size || '0'),
      mimeType: file.mimeType,
      createdAt: new Date(file.createdTime),
    }));
  }
}

// ==================== LOCAL STORAGE PROVIDER ====================
class LocalStorageProvider implements StorageProvider {
  private uploadPath: string;
  private publicPath: string;

  constructor() {
    this.uploadPath = path.join(process.cwd(), 'uploads');
    this.publicPath = '/uploads';
    
    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async upload(file: Express.Multer.File, options?: UploadOptions): Promise<StorageResult> {
    const filename = this.generateFilename(file.originalname);
    const folder = options?.folder || '';
    const folderPath = path.join(this.uploadPath, folder);
    
    // Créer le dossier si nécessaire
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const filePath = path.join(folderPath, filename);
    
    // Sauvegarder le fichier
    fs.writeFileSync(filePath, file.buffer);

    // Générer thumbnail si demandé
    let thumbnailUrl: string | undefined;
    if (options?.generateThumbnail && file.mimetype.startsWith('image/')) {
      thumbnailUrl = await this.generateThumbnail(file, filePath);
    }

    const relativePath = path.join(folder, filename);
    const url = `${this.publicPath}/${relativePath.replace(/\\/g, '/')}`;

    return {
      id: relativePath,
      url,
      publicUrl: url,
      thumbnailUrl,
      size: file.size,
      mimeType: file.mimetype,
      metadata: options?.metadata,
      provider: 'local'
    };
  }

  private async generateThumbnail(file: Express.Multer.File, originalPath: string): Promise<string> {
    const thumbPath = originalPath.replace(/(\.[^.]+)$/, '_thumb$1');
    
    await sharp(file.buffer)
      .resize(300, 300, { 
        fit: 'cover',
        withoutEnlargement: true 
      })
      .jpeg({ quality: 80 })
      .toFile(thumbPath);

    const relativePath = path.relative(this.uploadPath, thumbPath);
    return `${this.publicPath}/${relativePath.replace(/\\/g, '/')}`;
  }

  async delete(fileId: string): Promise<boolean> {
    try {
      const filePath = path.join(this.uploadPath, fileId);
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        
        // Supprimer aussi le thumbnail
        const thumbPath = filePath.replace(/(\.[^.]+)$/, '_thumb$1');
        if (fs.existsSync(thumbPath)) {
          fs.unlinkSync(thumbPath);
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Local delete error:', error);
      return false;
    }
  }

  async getUrl(fileId: string, options?: GetUrlOptions): Promise<string> {
    return `${this.publicPath}/${fileId.replace(/\\/g, '/')}`;
  }

  async list(prefix?: string): Promise<StorageFile[]> {
    const folderPath = prefix 
      ? path.join(this.uploadPath, prefix)
      : this.uploadPath;

    if (!fs.existsSync(folderPath)) {
      return [];
    }

    const files = fs.readdirSync(folderPath);
    const results: StorageFile[] = [];

    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isFile()) {
        results.push({
          id: prefix ? path.join(prefix, file) : file,
          name: file,
          size: stats.size,
          mimeType: 'application/octet-stream',
          createdAt: stats.birthtime,
        });
      }
    }

    return results;
  }

  private generateFilename(originalName: string): string {
    const timestamp = Date.now();
    const random = crypto.randomBytes(8).toString('hex');
    const extension = path.extname(originalName);
    const name = path.basename(originalName, extension);
    const cleanName = name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    
    return `${cleanName}-${timestamp}-${random}${extension}`;
  }
}

// ==================== STORAGE SERVICE PRINCIPAL ====================
export class StorageService {
  private providers: Map<string, StorageProvider>;
  private defaultProvider: string;

  constructor() {
    this.providers = new Map();
    this.defaultProvider = process.env.DEFAULT_STORAGE_PROVIDER || 'local';
    
    this.initializeProviders();
  }

  private initializeProviders() {
    // Local (toujours disponible)
    this.providers.set('local', new LocalStorageProvider());

    // AWS S3
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
      this.providers.set('s3', new S3Provider());
      console.log('✅ S3 storage provider initialized');
    }

    // Cloudinary
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      this.providers.set('cloudinary', new CloudinaryProvider());
      console.log('✅ Cloudinary storage provider initialized');
    }

    // Google Drive
    if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE) {
      this.providers.set('google-drive', new GoogleDriveProvider());
      console.log('✅ Google Drive storage provider initialized');
    }
  }

  getProvider(name?: string): StorageProvider {
    const providerName = name || this.defaultProvider;
    const provider = this.providers.get(providerName);
    
    if (!provider) {
      console.warn(`Provider ${providerName} not found, falling back to local`);
      return this.providers.get('local')!;
    }
    
    return provider;
  }

  async upload(
    file: Express.Multer.File, 
    options?: UploadOptions & { provider?: string }
  ): Promise<StorageResult> {
    const provider = this.getProvider(options?.provider);
    
    // Validation
    if (options?.maxSize && file.size > options.maxSize) {
      throw new Error(`File size exceeds maximum of ${options.maxSize} bytes`);
    }

    if (options?.allowedMimeTypes && !options.allowedMimeTypes.includes(file.mimetype)) {
      throw new Error(`File type ${file.mimetype} not allowed`);
    }

    // Upload
    const result = await provider.upload(file, options);

    // Sauvegarder en base de données
    await this.saveToDatabase(result, file, options);

    return result;
  }

  private async saveToDatabase(
    result: StorageResult, 
    file: Express.Multer.File,
    options?: any
  ) {
    try {
      await prisma.document.create({
        data: {
          name: file.originalname,
          originalName: file.originalname,
          filename: result.id,
          path: result.id,
          url: result.url,
          publicId: result.id,
          thumbnailUrl: result.thumbnailUrl,
          size: BigInt(file.size),
          format: path.extname(file.originalname).slice(1),
          mimeType: file.mimetype,
          type: this.getDocumentType(file.mimetype),
          storageType: result.provider.toUpperCase().replace('-', '_'),
          userId: options?.userId,
          projectId: options?.projectId,
          metadata: result.metadata,
        }
      });
    } catch (error) {
      console.error('Failed to save document to database:', error);
    }
  }

  private getDocumentType(mimeType: string): any {
    if (mimeType.startsWith('audio/')) return 'AUDIO';
    if (mimeType.startsWith('video/')) return 'VIDEO';
    if (mimeType.startsWith('image/')) return 'IMAGE';
    if (mimeType.includes('pdf')) return 'DOCUMENT';
    return 'DOCUMENT';
  }

  async delete(fileId: string, provider?: string): Promise<boolean> {
    const storageProvider = this.getProvider(provider);
    return storageProvider.delete(fileId);
  }

  async getUrl(fileId: string, options?: GetUrlOptions & { provider?: string }): Promise<string> {
    const provider = this.getProvider(options?.provider);
    return provider.getUrl(fileId, options);
  }

  async list(prefix?: string, provider?: string): Promise<StorageFile[]> {
    const storageProvider = this.getProvider(provider);
    return storageProvider.list(prefix);
  }

  // Méthode pour migrer des fichiers entre providers
  async migrate(
    fileId: string,
    fromProvider: string,
    toProvider: string
  ): Promise<StorageResult> {
    const from = this.getProvider(fromProvider);
    const to = this.getProvider(toProvider);

    // Télécharger depuis l'ancien provider
    const url = await from.getUrl(fileId, { download: true });
    
    // TODO: Implémenter le téléchargement et re-upload
    throw new Error('Migration not implemented yet');
  }
}

// Export singleton
export const storageService = new StorageService();