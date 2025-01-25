import { IsString, IsNotEmpty, IsAlphanumeric, IsOptional, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 30)
  user_name: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 100)
  password: string;
}
