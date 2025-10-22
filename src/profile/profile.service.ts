import { Injectable } from '@nestjs/common';
import { UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class ProfileService {
  getProfile(user: UserDocument) {
    return user;
  }
}
