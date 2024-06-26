import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { AccountsService } from 'src/accounts/accounts.service';
import { uploadFile } from 'src/aws/aws-sdk';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transcationsRepository: Repository<Transaction>,
    private accountsService: AccountsService,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    const sender_account = await this.accountsService.findOneByNumber(
      createTransactionDto.sender_account,
    );

    const receiver_account = await this.accountsService.findOneByNumber(
      createTransactionDto.receiver_account,
    );

    if (
      Number(sender_account.amount) < Number(createTransactionDto.amount) ||
      Number(createTransactionDto.amount) < 0 ||
      !receiver_account
    ) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }

    await this.accountsService.withdrawal(
      sender_account.id,
      Number(createTransactionDto.amount),
    );

    await this.accountsService.deposit(
      receiver_account.number,
      Number(createTransactionDto.amount),
    );

    const transaction = {
      amount: Number(createTransactionDto.amount),
      sender_account: { id: sender_account.id },
      receiver_account: { id: receiver_account.id },
    };
    return await this.transcationsRepository.insert(transaction);
  }

  async uploadFile(id: string, file: Express.Multer.File) {
    const vouncher = await uploadFile(
      `${id}/${file.originalname}`,
      file.buffer,
      file.mimetype,
    );
    await this.transcationsRepository.update(id, {
      payment_voucher: vouncher.url,
    });

    return vouncher;
  }
  findAll() {
    return `This action returns all transactions`;
  }
}
