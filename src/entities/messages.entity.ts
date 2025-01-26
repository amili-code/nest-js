import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('messages')
export default class Messages{
    @PrimaryGeneratedColumn()
    id: number
    
    @ManyToOne(() => User, (user:any) => user.id)
    @JoinColumn({ name: 'sender_id' })
    sender: User

    @Column('text')
    content: string
    
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    timestamp: Date
    
    @Column({ default: 'sent' })
    status: 'sent' | 'delevired' | 'read'

    @Column({ default: 'text' })
    type: 'text' | 'image' | 'video' | 'file'
}