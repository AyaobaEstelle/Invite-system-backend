import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    const condition = false;
    if (condition) {
      throw new BadRequestException('Error Here');
    } else {
      return 'Hello World!';
    }
  }
}
