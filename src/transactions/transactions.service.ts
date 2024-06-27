import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountsService } from 'src/accounts/accounts.service';
import { uploadFile } from 'src/aws/aws-sdk';
import { Between, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { DateRangeDto } from './dto/date-range.dto';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    private accountsService: AccountsService,
  ) {}

  @Transactional()
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

    if (sender_account.balance < createTransactionDto.amount) {
      throw new BadRequestException('Insufficient funds.');
    }
    await this.accountsService.withdrawal(
      sender_account.id,
      createTransactionDto.amount,
    );

    await this.accountsService.deposit({
      amount: createTransactionDto.amount,
      number: createTransactionDto.receiver_account,
    });

    return await this.transactionsRepository.save({
      amount: createTransactionDto.amount,
      sender_account: { id: sender_account.id },
      receiver_account: { id: receiver_account.id },
    });
  }

  async uploadFile(id: string, file: Express.Multer.File) {
    const vouncher = await uploadFile(
      `${id}/${file.originalname}`,
      file.buffer,
      file.mimetype,
    );
    await this.transactionsRepository.update(id, {
      payment_voucher: vouncher.url,
    });

    return vouncher;
  }
  async extract(id: string, dateRange?: DateRangeDto) {
    const { startDate, endDate } = dateRange;

    const queryBuilder =
      this.transactionsRepository.createQueryBuilder('transaction');

    queryBuilder
      .select('transaction')
      .addSelect('SUM(transaction.amount)', 'totalAmount')
      .where('transaction.sender_account = :id', { id });

    if (startDate && endDate) {
      queryBuilder.andWhere(
        'transaction.transaction_date BETWEEN :startDate AND :endDate',
        { startDate, endDate },
      );
    }

    queryBuilder.groupBy('transaction.id');

    const result = await queryBuilder.getRawMany();

    if (!result.length) {
      throw new NotFoundException(
        `No transactions found for sender_account: ${id}`,
      );
    }

    return {
      transactions: result,
      totalAmount: parseFloat(result[0].totalAmount),
    };
  }
}
