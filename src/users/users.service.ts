import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Users from 'src/entities/users.entity';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) { }

  async register(createUserDto: CreateUserDto) {
    const checkUser = await this.findOneByUserName(createUserDto.user_name)
    if (checkUser) {
      throw new HttpException('username already exits', 400)
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // ساخت یوزر جدید با پسورد هش شده
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword, // قرار دادن پسورد هش شده
    });

    // ذخیره یوزر در دیتابیس
    await this.userRepository.save(user);



    return
  }

  async login(createUserDto: CreateUserDto) {

  }


  findAll() {
    return this.userRepository.find();
  }

  async findOneByUserName(user_name: string) {
    const user = await this.userRepository.findOne({ where: { user_name } })
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
