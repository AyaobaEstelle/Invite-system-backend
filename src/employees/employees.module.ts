import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [EmployeesController],
  providers: [EmployeesService],
})
export class EmployeesModule {}
