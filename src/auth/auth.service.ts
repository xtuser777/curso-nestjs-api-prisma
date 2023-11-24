import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { AuthForgotDTO } from './dto/auth-forgot.dto';
import { AuthResetDTO } from './dto/auth-reset.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async createToken() {
    //return this.jwtService.sign();
  }

  async checkToken() {
    //return this.jwtService.verify();
  }

  async login({ email, password }: AuthLoginDTO) {
    const user = this.prismaService.user.findFirst({
      where: {
        email,
        password,
      },
    });

    if (!user) {
      throw new UnauthorizedException('E-mail e/ou senha inválidos.');
    }

    return user;
  }

  async forgot({ email }: AuthForgotDTO) {
    const user = this.prismaService.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('E-mail está inválido.');
    }

    //TO DO: enviar e-mail.

    return true;
  }

  async reset({ password, token }: AuthResetDTO) {
    //TO DO: Validar token
    const id = 0;
    await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        password,
      },
    });

    return true;
  }
}
