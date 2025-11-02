import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { UsersController } from './users/users.controller';
import { InvitesModule } from './employees/invites/invites.module';
import { EmployeesModule } from './employees/employees.module';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI as string),
    AuthModule,
    ProfileModule,
    InvitesModule,
    EmployeesModule,
  ],
  controllers: [AppController, UsersController, AuthController],
  providers: [AppService],
})
export class AppModule {}
