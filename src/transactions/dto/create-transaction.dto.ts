import { IsNumber, Min } from 'class-validator';

export class CreateTransactionDto {
  @IsNumber({}, { message: 'Destinion account is required' })
  receiver_account: number;

  @IsNumber({}, { message: 'Sender account is required' })
  sender_account: number;

  @IsNumber({}, { message: 'Value is required' })
  @Min(0, { message: 'Insufficient value' })
  amount: number;
}
