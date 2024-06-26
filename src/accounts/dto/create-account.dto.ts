import { IsEnum, IsNumber, IsString, Min } from 'class-validator';
import { TypeAccount } from 'src/enums/typeAccount.enum';
import { User } from 'src/users/entities/user.entity';
import { DeepPartial } from 'typeorm';

export class CreateAccountDto {
  @IsString({ message: 'Name is required' })
  name: string;

  @IsNumber({}, { message: 'Balance is required' })
  @Min(0, { message: 'The value cannot be less than 0' })
  balance: number;

  @IsEnum(TypeAccount, { message: 'Incorrect account type' })
  type: TypeAccount;

  @IsString({ message: 'User ID is required' })
  user_id: DeepPartial<User>;
}
