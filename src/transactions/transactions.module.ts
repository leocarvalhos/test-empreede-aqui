import { Module, forwardRef } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { AuthModule } from 'src/auth/auth.module';
import { AccountsModule } from 'src/accounts/accounts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    forwardRef(() => AuthModule),
    forwardRef(() => AccountsModule),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
