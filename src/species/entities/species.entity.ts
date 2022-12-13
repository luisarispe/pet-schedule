import { Pet } from 'src/pets/entities/pet.entity';
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

@Entity()
export class Species {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {
    unique: true,
    length: 100,
  })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Pet, (pet) => pet.species)
  pets: Pet[];

  @BeforeInsert()
  columnInsertToLowerCase() {
    this.name = this.name.toLocaleLowerCase().trim();
  }

  @BeforeUpdate()
  columnUpdateToLowerCase() {
    this.name = this.name.toLocaleLowerCase().trim();
  }
}
