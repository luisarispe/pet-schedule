import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Pet } from 'src/pets/entities/pet.entity';
import { Owner } from 'src/owners/entities/owner.entity';
import { Schedule } from '../../schedules/entities/schedule.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {
    length: 100,
  })
  fullName: string;

  @Column('varchar', {
    length: 100,
    select: false,
  })
  password: string;

  @Column('varchar', {
    length: 100,
    unique: true,
  })
  email: string;

  @Column('boolean', {
    default: true,
  })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Pet, (pet) => pet.user)
  pets: Pet[];

  @OneToMany(() => Owner, (owner) => owner.user)
  owners: Owner[];

  @OneToMany(() => Schedule, (schedule) => schedule.user)
  schedules: Schedule[];

  @BeforeInsert()
  private columnsBeforeInsert() {
    this.fullName = this.fullName.toLocaleLowerCase().trim();
    this.email = this.email.toLocaleLowerCase().trim();
    this.password = bcrypt.hashSync(this.password, 10);
  }

  @BeforeUpdate()
  private columnBeforeUpdate() {
    this.fullName = this.fullName.toLocaleLowerCase().trim();
    this.email = this.email.toLocaleLowerCase().trim();
    if (this.password) {
      this.password = bcrypt.hashSync(this.password, 10);
    }
  }
}
