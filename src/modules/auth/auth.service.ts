import { Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UserPayload } from "src/resources/types/UserPayload";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    const userAuthenticated = await bcrypt.compare(password, user.password);
    if(!userAuthenticated) throw new Error("Email ou senha inválidos");
    
    const payload: UserPayload = {
      name: user.name,
      email: user.email,
      phone: user.phone
    };

    return {
      user: {
        name: user.name,
        email: user.email,
        token: await this.jwtService.signAsync(payload)
      }, 
    };
  }
}