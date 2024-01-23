import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { PrismaService } from "src/db/prisma.service";
import { HashPasswordPipe } from "src/resources/pipes/hash-password.pipe";

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, HashPasswordPipe],
})
export class UserModule {}