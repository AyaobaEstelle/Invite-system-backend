import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateInviteDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}
