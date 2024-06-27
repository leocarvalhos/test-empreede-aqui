import { IsNumber, Min } from 'class-validator';

export class DepositDto {
  @IsNumber({}, { message: 'Account number is required' })
  number: number;

  @IsNumber({}, { message: 'Balance is required' })
  @Min(0, { message: 'Insufficient value' })
  amount: number;
}
