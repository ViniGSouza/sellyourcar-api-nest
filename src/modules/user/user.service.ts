import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/db/prisma.service";
import { CreateUserDTO } from "./dto/CreateUser.dto";
import { UpdateUserDTO } from "./dto/UpdateUser.dto";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  
  async create({ name, email, password, phone }: CreateUserDTO) {
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password,
        phone,
      }
    });
    return user;
  }

  async update(id: string, newDataUser: UpdateUserDTO) {
    const user = await this.prisma.user.update({
      where: {
        id
      },
      data: newDataUser
    });
    return user;
    
  }

  async delete(id: string) {
    const user = await this.prisma.user.delete({
      where: {
        id
      }
    });
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email
      }
    });
    return {
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: user.password,
    };
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id
      }
    });
    return user;
  }
}