import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UsersEntity)
    private usersRepo: Repository<UsersEntity>,
  ) {}

  // get list of all users
  async findAll(): Promise<UsersEntity[]> {
    return await this.usersRepo.find();
  }

  async findByPage(page: number, limit: number): Promise<{ data: UsersEntity[]; total: number }> {
    const [result, total] = await this.usersRepo.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data: result,
      total: total,
    };
  }
}
