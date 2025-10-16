import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { ProfileService } from './profile.service';
import { UserDocument } from 'src/schemas/user.schema';

@Controller('/api/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
  @Get('/')
  @UseGuards(AuthGuard)
  getProfile(@Request() req: { user: UserDocument }) {
    return this.profileService.getProfile(req.user);
  }
}
