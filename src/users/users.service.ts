import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import Users from 'src/entities/users.entity'
import * as bcrypt from 'bcrypt'


@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // ساخت یوزر جدید با پسورد هش شده
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,  // قرار دادن پسورد هش شده
    });

    // ذخیره یوزر در دیتابیس
    return await this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find();
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
