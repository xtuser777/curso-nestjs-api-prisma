import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { AuthForgotDTO } from './dto/auth-forgot.dto';
import { AuthResetDTO } from './dto/auth-reset.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
  ) {}

  createToken(user: User) {
    return {
      token: this.jwtService.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        {
          expiresIn: '7 days',
          subject: String(user.id),
          issuer: 'login',
          audience: 'users',
        },
      ),
    };
  }

  checkToken(token: string) {
    try {
      const data = this.jwtService.verify(token, {
        audience: 'users',
        issuer: 'login',
      });

      return data;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  isValidToken(token: string) {
    try {
      this.checkToken(token);
      return true;
    } catch {
      return false;
    }
  }

  async login({ email, password }: AuthLoginDTO) {
    const user: User = await this.prismaService.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('E-mail e/ou senha inválidos.');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('E-mail e/ou senha inválidos.');
    }

    return this.createToken(user);
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
    const data = await this.checkToken(token);
    const user: User = await this.prismaService.user.update({
      where: {
        id: data.id,
      },
      data: {
        password,
      },
    });

    return this.createToken(user);
  }

  async register(data: AuthRegisterDTO) {
    const user = await this.userService.create(data);
    return this.createToken(user);
  }
}
