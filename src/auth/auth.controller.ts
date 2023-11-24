import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { AuthForgotDTO } from './dto/auth-forgot.dto';
import { AuthResetDTO } from './dto/auth-reset.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  async login(@Body() body: AuthLoginDTO) {
    return this.authService.login(body);
  }

  @Post('register')
  async register(@Body() body: AuthRegisterDTO) {
    return this.userService.create(body);
  }

  @Post('forgot')
  async forgot(@Body() body: AuthForgotDTO) {
    return this.authService.forgot(body);
  }

  @Post('reset')
  async reset(@Body() body: AuthResetDTO) {
    return this.reset(body);
  }
}
