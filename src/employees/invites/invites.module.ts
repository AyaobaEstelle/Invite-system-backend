import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { InvitesController } from './invites.controller';
import { InvitesService } from './invites.service';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Invite, InviteSchema } from 'src/schemas/invite.schema';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    AuthModule,
    MailModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Invite.name, schema: InviteSchema },
    ]),
  ],
  controllers: [InvitesController],
  providers: [InvitesService],
})
export class InvitesModule {}
