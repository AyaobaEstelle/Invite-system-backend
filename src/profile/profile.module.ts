import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileService } from './profile.service';

import { ProfileController } from './profile.controller';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
