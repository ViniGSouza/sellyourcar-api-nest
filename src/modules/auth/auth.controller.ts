import { Body, Controller, Post } from "@nestjs/common";
import { AuthDTO } from "./dto/Auth.dto";
import { AuthService } from "./auth.service";

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Body() { email, password }: AuthDTO) {
    return this.authService.login(email, password);
  }
}