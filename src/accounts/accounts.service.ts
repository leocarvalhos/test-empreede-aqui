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
    return await this.accountRepository.findOneBy({ user_id: { id } });
  }

  async update(id: string, updateAccountDto: UpdateAccountDto) {
    return await this.accountRepository.update(
      { user_id: { id } },
      updateAccountDto,
    );
  }

  async withdrawal(id: string, amount: number) {
    const user = await this.accountRepository.findOneBy({ user_id: { id } });

    let { amount: balance } = user;
    balance = Number(balance);
    amount = amount['amount'];

    if (amount < 0 || balance < amount) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
    const newAmount = (balance -= amount);
    return await this.accountRepository.update(
      { user_id: { id } },
      { amount: newAmount },
    );
  }

  async deposit(id: string, amount: number) {
    const user = await this.accountRepository.findOneBy({ user_id: { id } });

    let { amount: balance } = user;
    balance = Number(balance);
    amount = amount['amount'];

    if (amount < 0) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
    const newAmount = (balance += amount);

    return await this.accountRepository.update(
      { user_id: { id } },
      { amount: newAmount },
    );
  }

  async remove(id: string) {
    return await this.accountRepository.delete({ user_id: { id } });
  }
}
