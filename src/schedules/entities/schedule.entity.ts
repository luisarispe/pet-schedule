import { User } from 'src/auth/entities/user.entity';
import { STATUS } from 'src/constants/status';
import { Pet } from 'src/pets/entities/pet.entity';
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
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {
    length: 100,
  })
  title: string;

  @Column({ type: 'datetime' })
  dateStart: Date;

  @Column({ type: 'datetime' })
  dateEnd: Date;

  @Column({ type: 'enum', enum: STATUS })
  status: string;

  @Column({ name: 'idPet' })
  idPet: string;

  @ManyToOne(() => Pet, (pet) => pet.schedules, {
    eager: true,
    nullable: false,
  })
  @JoinColumn({ name: 'idPet' })
  pet: Pet;

  @Column({ name: 'idUser' })
  idUser: string;

  @ManyToOne(() => User, (user) => user.schedules, {
    eager: true,
  })
  @JoinColumn({ name: 'idUser' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  private columnsBeforeInsert() {
    this.title = this.title.toLocaleLowerCase().trim();
  }

  @BeforeUpdate()
  private columnsBeforeUpdate() {
    this.title = this.title.toLocaleLowerCase().trim();
  }
}
