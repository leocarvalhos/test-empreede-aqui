import { PartialType } from '@nestjs/mapped-types';
import { CreateAccountDto } from './create-account.dto';
import { IsDecimal, IsString } from 'class-validator';

export class UpdateAccountDto extends PartialType(CreateAccountDto) {
  @IsString()
  name?: string;
}
