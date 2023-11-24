import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  public async create({ name, email, password }: CreateUserDTO) {
    return this.prismaService.user.create({
      data: {
        name,
        email,
        password,
      },
    });
  }

  public async read() {
    return this.prismaService.user.findMany();
  }

  public async readOne(id: number) {
    await this.exists(id);
    return this.prismaService.user.findUnique({ where: { id } });
  }

  public async update(
    id: number,
    { name, email, password, birth }: UpdatePutUserDTO,
  ) {
    await this.exists(id);
    let dateBirth = null;
    if (birth) dateBirth = new Date(birth);
    return this.prismaService.user.update({
      data: {
        name,
        email,
        password,
        birth: dateBirth,
      },
      where: {
        id,
      },
    });
  }

  public async updatePartial(
    id: number,
    { name, email, password, birth }: UpdatePatchUserDTO,
  ) {
    await this.exists(id);
    const data: any = {};
    if (birth) data.birth = new Date(birth);
    if (name) data.name = name;
    if (email) data.email = email;
    if (password) data.password = password;
    return this.prismaService.user.update({
      data,
      where: {
        id,
      },
    });
  }

  public async delete(id: number) {
    await this.exists(id);
    return this.prismaService.user.delete({ where: { id } });
  }

  public async exists(id: number) {
    if (!(await this.prismaService.user.count({ where: { id } }))) {
      throw new NotFoundException(`Usuário ${id} não existe.`);
    }
  }
}
