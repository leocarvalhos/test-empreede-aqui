import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { AccountsModule } from 'src/accounts/accounts.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => TransactionsModule),
    forwardRef(() => AccountsModule),
    JwtModule.register({
      global: true,
      secret: 'xxt',
      signOptions: {
        expiresIn: '2h',
      },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
