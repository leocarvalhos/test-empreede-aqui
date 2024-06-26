import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountsService } from 'src/accounts/accounts.service';
import { uploadFile } from 'src/aws/aws-sdk';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';

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

    if (!sender_account)
      throw new NotFoundException("Sender's account not found");

    const receiver_account = await this.accountsService.findOneByNumber(
      createTransactionDto.receiver_account,
    );

    if (!receiver_account)
      throw new NotFoundException('Account of the recipient not found');

    await this.accountsService.withdrawal(
      sender_account.id,
      createTransactionDto.amount,
    );

    await this.accountsService.deposit({
      number: receiver_account.number,
      amount: createTransactionDto.amount,
    });

    const transaction = {
      amount: createTransactionDto.amount,
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
