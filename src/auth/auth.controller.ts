import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { AuthForgotDTO } from './dto/auth-forgot.dto';
import { AuthResetDTO } from './dto/auth-reset.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from 'src/decorators/user.decorator';
import { join } from 'path';
import { FileService } from 'src/file/file.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly fileService: FileService,
  ) {}

  @Post('login')
  async login(@Body() body: AuthLoginDTO) {
    return this.authService.login(body);
  }

  @Post('register')
  async register(@Body() body: AuthRegisterDTO) {
    return this.authService.register(body);
  }

  @Post('forgot')
  async forgot(@Body() body: AuthForgotDTO) {
    return this.authService.forgot(body);
  }

  @Post('reset')
  async reset(@Body() body: AuthResetDTO) {
    return this.reset(body);
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('photo')
  async uploadPhoto(@User() user, @UploadedFile() file: Express.Multer.File) {
    const path = join(
      __dirname,
      '..',
      '..',
      'storage',
      'photos',
      `photo-${user.id}.png`,
    );

    try {
      await this.fileService.upload(file, path);
    } catch (e) {
      throw new BadRequestException(e);
    }

    return { success: true };
  }
}
