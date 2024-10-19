import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  constructor(private readonly s3Service: AppService) {}

  @Post('')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'file', maxCount: 20 }]))
  async uploadFile(@UploadedFiles() files: any) {
    return await this.s3Service.uploadFile(files.file[0]);
  }

  @Get('/:key')
  async getFile(@Param('key') key: string) {
    return await this.s3Service.getFile(key);
  }

  @Delete('/:key')
  async deleteFile(@Param('key') key: string) {
    return await this.s3Service.deleteFile(key);
  }

  @Get()
  async listFiles() {
    return await this.s3Service.listFiles();
  }
}
