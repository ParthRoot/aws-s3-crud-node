import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AppService {
  private s3: S3;

  constructor(private configService: ConfigService) {
    this.s3 = new S3({
      accessKeyId: this.configService.get<string>('aws_access_key'),
      secretAccessKey: this.configService.get<string>('aws_secret_key'),
      region: this.configService.get<string>('aws_region'),
    });
  }

  // Upload file
  async uploadFile(file: Express.Multer.File) {
    const bucketName = this.configService.get<string>('aws_bucket_name');

    const timestamp = new Date().getTime();
    const params = {
      Bucket: bucketName,
      Key: `${timestamp}-${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype, // Specify the content type
    };

    try {
      const data = await this.s3.upload(params).promise();
      return data;
    } catch (error: any) {
      throw new Error(`Error uploading file: ${error?.message}`);
    }
  }

  // Get file
  async getFile(key: string) {
    const bucketName = this.configService.get<string>('aws_bucket_name');

    const params = {
      Bucket: bucketName,
      Key: key,
      Expires: 60, // Expiry time in seconds, default is 60 seconds
    };

    try {
      const signedUrl = await this.s3.getSignedUrlPromise('getObject', params);
      return { url: signedUrl }; // Returns the pre-signed URL for accessing the file
    } catch (error) {
      throw new Error('Error generating signed URL for file');
    }
  }

  // Delete file
  async deleteFile(key: string) {
    const bucketName = this.configService.get<string>('aws_bucket_name');
    const params = {
      Bucket: bucketName,
      Key: key,
    };

    try {
      await this.s3.deleteObject(params).promise();
      return { message: 'File deleted successfully' };
    } catch (error) {
      throw new Error('Error deleting file');
    }
  }

  // List files
  async listFiles() {
    const bucketName = this.configService.get<string>('aws_bucket_name');
    const params = {
      Bucket: bucketName,
      Prefix: '',
    };

    try {
      const data = await this.s3.listObjectsV2(params).promise();
      return data.Contents;
    } catch (error) {
      throw new Error('Error listing files');
    }
  }
}
