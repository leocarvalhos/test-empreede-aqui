import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsModule } from './accounts/accounts.module';
import { Account } from './accounts/entities/account.entity';
import { AuthModule } from './auth/auth.module';
import { Transaction } from './transactions/entities/transaction.entity';
import { TransactionsModule } from './transactions/transactions.module';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [User, Transaction, Account],
      synchronize: true,
      autoLoadEntities: true,
    }),
    UsersModule,
    AccountsModule,
    TransactionsModule,
    AuthModule,
  ],
})
export class AppModule {}
