import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export default class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 30 })
  user_name: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true })
  profile: string;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true, type: 'text' })
  bio: string;

  @Column({ nullable: true, type: 'date' })
  birth_date: Date;

  @Column({ nullable: true, type: 'timestamp' })
  last_online: Date;
}
