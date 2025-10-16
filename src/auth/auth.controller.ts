import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAdminDto, loginAdminDto } from './dto/create-admin.dto';

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @UsePipes(new ValidationPipe())
  createNewAccount(@Body() createAdminDto: CreateAdminDto) {
    return this.authService.createAccount(createAdminDto);
  }
  @Post('/login')
  @UsePipes(new ValidationPipe())
  loginAccount(@Body() createAdminDto: loginAdminDto) {
    return this.authService.loginAccount(createAdminDto);
  }
}
