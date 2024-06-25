import { IsDecimal, IsEnum, IsString } from 'class-validator';
import { TypeAccount } from 'src/enums/typeAccount.enum';
import { User } from 'src/users/entities/user.entity';
import { DeepPartial } from 'typeorm';

export class CreateAccountDto {
  @IsString()
  name: string;

  @IsDecimal()
  balance: number;

  @IsEnum(TypeAccount)
  type: TypeAccount;

  @IsString()
  user_id: DeepPartial<User>;
}
