import { IsDecimal, IsNumber } from 'class-validator';

export class CreateTransactionDto {
  @IsNumber()
  receiver_account: number;

  @IsNumber()
  sender_account: number;

  @IsDecimal()
  amount: number;
}
