import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Users from 'src/entities/users.entity';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt'
import { user } from './dto/user.dto';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    private readonly jwtService: JwtService,
  ) { }

  async register(createUserDto: CreateUserDto) {
    const checkUser = await this.findOneByUserName(createUserDto.user_name)
    if (checkUser) {
      throw new HttpException('user already exits', 400)
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // ساخت یوزر جدید با پسورد هش شده
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword, // قرار دادن پسورد هش شده
    });

    // ذخیره یوزر در دیتابیس
    await this.userRepository.save(user);


    return this.createAccessToken(user)

  }


  createAccessToken(user: user) {
    const accessToken = this.jwtService.sign({
      sub: user.id,
      userName:user.user_name
    })
    return {
      accessToken:accessToken
    }
  }

  async login(createUserDto: CreateUserDto) {
    const user = await this.findOneByUserName(createUserDto.user_name)
    if (!user) {
      throw new HttpException('user not founded', 404)
    }
    console.log(user);
    const isPasswordMatch = await bcrypt.compare(createUserDto.password, user.password)
    if (!isPasswordMatch) {
      throw new HttpException('login error', 400)
    }

    return this.createAccessToken(user)

  }


  findAll() {
    return this.userRepository.find();
  }

  async findOneByUserName(user_name: string) {
    const user = await this.userRepository.findOne({ where: { user_name }, select: ['user_name', 'password'] })
    return user;
  }

  async findOne(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }
    return this.userRepository.remove(user);
  }
}
