import { User } from 'src/auth/entities/user.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Owner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {
    length: 100,
  })
  fullName: string;

  @Column('varchar', {
    length: 100,
    unique: true,
  })
  email: string;

  @Column('varchar', {
    length: 100,
    unique: true,
  })
  rut: string;

  @Column('varchar', { length: 100 })
  phone: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.owners, {
    eager: true,
  })
  @JoinColumn({ name: 'idUser' })
  user: User;

  @BeforeInsert()
  columnInsertToLowerCase() {
    this.fullName = this.fullName.toLocaleLowerCase().trim();
    this.email = this.email.toLocaleLowerCase().trim();
    this.phone = this.phone.trim();
  }

  @BeforeUpdate()
  columnUpdateToLowerCase() {
    this.fullName = this.fullName.toLocaleLowerCase().trim();
    this.email = this.email.toLocaleLowerCase().trim();
    this.phone = this.phone.trim();
  }
}
