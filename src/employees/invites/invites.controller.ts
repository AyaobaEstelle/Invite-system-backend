import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { InvitesService } from './invites.service';
import { UserDocument } from 'src/schemas/user.schema';

@Controller('/api/invites')
export class InvitesController {
  constructor(private readonly invitesService: InvitesService) {}

  @Post('/')
  @UseGuards(AuthGuard)
  async createInvite(
    @Request() req: { user: UserDocument },
    @Body('email') email: string,
  ) {
    return this.invitesService.createInvite(req.user, email);
  }

  @Get('/')
  @UseGuards(AuthGuard)
  getInvites(@Request() req: { user: UserDocument }) {
    return this.invitesService.getInvites(req.user);
  }

  @Get('/:id')
  getSingleInvite(@Param('id') id: string) {
    return this.invitesService.getSingleInvite(id);
  }
  @Post('/:id/use')
  createEmployee(@Body() CreateEmployeeDto, @Param('id') id: string) {
    return this.invitesService.useInvite(id, CreateEmployeeDto);
  }
}
