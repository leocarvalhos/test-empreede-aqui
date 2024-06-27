import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountDto } from './dto/create-account.dto';
import { DepositDto } from './dto/deposit.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  async create(createAccountDto: CreateAccountDto) {
    return this.accountRepository.insert(createAccountDto);
  }

  async findOneById(id: string) {
    const account = await this.accountRepository.findOneBy({ id });
    if (!account) throw new NotFoundException('Account not found!');
    return account;
  }

  async findOneByNumber(number: number) {
    const account = await this.accountRepository.findOne({
      where: { number },
      relations: { user_id: true },
    });
    if (!account) throw new NotFoundException('Account not found!');

    return account;
  }

  async update(id: string, updateAccountDto: UpdateAccountDto) {
    const account = await this.accountRepository.update(id, updateAccountDto);
    if (!account) throw new NotFoundException('Account not found!');
    return account;
  }

  @Transactional()
  async withdrawal(id: string, amount: number) {
    const account = await this.accountRepository.findOneBy({ id });
    if (!account) throw new NotFoundException('Account not found!');

    if (account.balance < amount) {
      throw new BadRequestException('Insufficient funds');
    }
    return await this.accountRepository.update(id, {
      balance: (account.balance -= amount),
    });
  }

  @Transactional()
  async deposit(depositDto: DepositDto) {
    const { amount, number } = depositDto;

    const account = await this.accountRepository.findOneBy({ number });
    if (!account) throw new NotFoundException('Account not found!');

    return await this.accountRepository.update(
      { number },
      { balance: (account.balance += amount) },
    );
  }

  async remove(id: string) {
    return await this.accountRepository.delete({ user_id: { id } });
  }
}
