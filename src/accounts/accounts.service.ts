import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity';
import { DepositDto } from './dto/deposit.dto';

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
    return await this.accountRepository.findOne({
      where: { number },
      relations: { user_id: true },
    });
  }

  async update(id: string, updateAccountDto: UpdateAccountDto) {
    const account = await this.accountRepository.update(id, updateAccountDto);
    if (!account) throw new NotFoundException('Account not found!');
    return account;
  }

  async withdrawal(id: string, amount: number) {
    const account = await this.accountRepository.findOneBy({ id });
    if (!account) throw new NotFoundException('Account not found!');
    let { balance } = account;
    if (amount < 0 || balance < amount) {
      throw new BadRequestException();
    }
    return await this.accountRepository.update(id, {
      balance: (balance -= amount),
    });
  }

  async deposit(depositDto: DepositDto) {
    const { amount, number } = depositDto;

    const account = await this.accountRepository.findOneBy({ number });
    if (!account) throw new NotFoundException('Account not found!');

    let { balance } = account;

    if (amount < 0) {
      throw new BadRequestException('');
    }

    return await this.accountRepository.update(
      { number },
      { balance: (balance += amount) },
    );
  }

  async remove(id: string) {
    return await this.accountRepository.delete({ user_id: { id } });
  }
}
