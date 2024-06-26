import { Account } from 'src/accounts/entities/account.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  amount: number;

  @Column({ nullable: true })
  payment_voucher: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  transaction_date: Date;

  @ManyToOne(() => Account, (account) => account.sender_account)
  @JoinColumn({ name: 'sender_account' })
  sender_account: Account;

  @ManyToOne(() => Account, (account) => account.receiver_account)
  @JoinColumn({ name: 'receiver_account' })
  receiver_account: Account;
}
