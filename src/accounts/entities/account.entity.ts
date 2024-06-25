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
const randomNumber = Math.floor(Math.random() * 100000);
@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: randomNumber })
  number: number;

  @Column({ length: 500 })
  name: string;

  @Column({ type: 'enum', enum: TypeAccount })
  type: string;

  @Column({ type: 'decimal' })
  amount: number;

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user_id: User;

  @OneToMany(() => Transaction, (transaction) => transaction.sender_account)
  sender_account: Transaction[];

  @OneToMany(() => Transaction, (transaction) => transaction.receiver_account)
  receiver_account: Transaction[];
}
