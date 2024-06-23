import { nanoid } from 'nanoid';
import { TypeAccount } from 'src/enums/typeAccount.enum';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, default: () => nanoid(5) })
  number: string;

  @Column({ length: 500 })
  name: string;

  @Column({ enum: TypeAccount })
  type: string;

  @Column({ type: 'decimal' })
  balance: number;

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn()
  user_id: User;

  @OneToMany(() => Transaction, (transaction) => transaction.sender_account)
  sender_account: Transaction[];

  @OneToMany(() => Transaction, (transaction) => transaction.receiver_account)
  receiver_account: Transaction[];
}
