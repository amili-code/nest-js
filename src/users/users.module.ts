import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Users from 'src/entities/users.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    JwtModule.register({secret:'secret' , signOptions:{expiresIn:'1d'}})
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule { }
