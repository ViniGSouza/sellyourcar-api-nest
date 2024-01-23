import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDTO } from "./dto/CreateUser.dto";
import { UpdateUserDTO } from "./dto/UpdateUser.dto";
import { HashPasswordPipe } from "src/resources/pipes/hash-password.pipe";
import { JwtAuthGuard } from "../auth/auth.guard";
import { RequestUser } from "../auth/auth.strategy";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/:id")
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    return {
      id: user.id,
      name: user.name,
      email: user.email
    }
  }

  @Post()
  async create(
    @Body() {password, ...dataUser}: CreateUserDTO,
    @Body('password', HashPasswordPipe) hashedPassword: string
  ) {
    const userExists = await this.userService.findByEmail(dataUser.email);
    if (!userExists) {
      const user = await this.userService.create(
        {...dataUser, password: hashedPassword}
      );
      return {
        statusCode: 201,
        message: "Usuário criado com sucesso!",
        user: {
          name: user.name,
          email: user.email,
          phone: user.phone
        }
      }
    } else if (userExists) {
      return {
        statusCode: 409,
        message: "E-mail de usuário já existe!",
      }
    } return {
      statusCode: 500,
      message: "Erro ao criar usuário!",
    }
  }

  @Put("/:id")
  @UseGuards(JwtAuthGuard)
  async update(@Body() newDataUser: UpdateUserDTO, @Param('id') id: string, @Req () req: RequestUser) {
    const userExists = await this.userService.findById(id);
    if (req.user.email === userExists.email) {
      const user = await this.userService.update(id, newDataUser);
      return {
        message: "Usuário atualizado com sucesso!",
        user: {
          name: user.name,
          email: user.email
        }
      }
    }
    return {
      message: "Você não pode alterar os dados de outro usuário."
    }
  }

  @Delete("/:id")
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string, @Req () req: RequestUser) {
    const userExists = await this.userService.findById(id);
    if (req.user.email === userExists.email) {
      await this.userService.delete(id);
      return {
        message: "Conta apagado com sucesso!",
      }
    }
    return {
      message: "Você não pode apagar a conta de outro usuário."
    }
  }
  
}