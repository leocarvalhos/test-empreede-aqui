import { IsEnum, IsNumber, IsString, Min } from 'class-validator';
import { TypeAccount } from 'src/enums/typeAccount.enum';
import { User } from 'src/users/entities/user.entity';
import { DeepPartial } from 'typeorm';

export class CreateAccountDto {
  @IsString({ message: 'Name is required' })
  name: string;

  @IsNumber({}, { message: 'Balance is required' })
  @Min(0, { message: 'Insufficient value' })
  balance: number;

  @IsEnum(TypeAccount, { message: 'Incorrect account type' })
  type: TypeAccount;

  @IsString({ message: 'User ID is required' })
  user_id: DeepPartial<User>;
}
