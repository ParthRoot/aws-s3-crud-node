import {
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
  constructor(private readonly appService: AppService) {}

  @Post('')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'file', maxCount: 1 }]))
  async uploadFile(@UploadedFiles() files: any) {
    return await this.appService.uploadFile(files.file[0]);
  }

  @Get()
  async listFiles() {
    return await this.appService.listFiles();
  }

  @Get('/:key')
  async getFile(@Param('key') key: string) {
    return await this.appService.getFileByName(key);
  }

  @Delete('/:key')
  async deleteFile(@Param('key') key: string) {
    return await this.appService.deleteFile(key);
  }
}
