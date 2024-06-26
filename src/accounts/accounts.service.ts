import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  async create(createAccountDto: CreateAccountDto) {
    if (createAccountDto.balance < 0) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
    return this.accountRepository.insert(createAccountDto);
  }

  async findOneById(id: string) {
    return await this.accountRepository.findOneBy({ id });
  }

  async findOneByNumber(number: number) {
    return await this.accountRepository.findOne({
      where: { number },
      relations: { user_id: true },
    });
  }

  async update(id: string, updateAccountDto: UpdateAccountDto) {
    return await this.accountRepository.update(
      { user_id: { id } },
      updateAccountDto,
    );
  }

  async withdrawal(id: string, amount: number) {
    const account = await this.accountRepository.findOneBy({ id });

    let { amount: balance } = account;
    balance = Number(balance);

    if (amount < 0 || balance < amount) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
    const newAmount = (balance -= amount);

    return await this.accountRepository.update(id, { amount: newAmount });
  }

  async deposit(number: number, amount: number) {
    const account = await this.accountRepository.findOneBy({ number });

    let { amount: balance } = account;
    balance = Number(balance);

    if (amount < 0) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
    const newAmount = (balance += amount);

    return await this.accountRepository.update(
      { number },
      { amount: newAmount },
    );
  }

  async remove(id: string) {
    return await this.accountRepository.delete({ user_id: { id } });
  }
}
