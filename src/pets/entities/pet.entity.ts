import internal from 'stream';
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
import { Species } from '../../species/entities/species.entity';
import { User } from 'src/auth/entities/user.entity';
import { Owner } from 'src/owners/entities/owner.entity';

@Entity()
export class Pet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {
    length: 100,
    unique: true,
  })
  name: string;

  @Column('varchar', {
    length: 100,
  })
  sex: string;

  @Column('int')
  age: number;

  @Column('varchar', {
    nullable: true,
    name: 'urlImage',
  })
  urlImage: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ name: 'idSpecies' })
  idSpecies: number;

  @ManyToOne(() => Species, (species) => species.pets, {
    eager: true,
    nullable: false,
  })
  @JoinColumn({ name: 'idSpecies' })
  species: Species;

  @Column({ name: 'idOwner' })
  idOwner: string;

  @ManyToOne(() => Owner, (owner) => owner.pets, {
    eager: true,
    nullable: false,
  })
  @JoinColumn({ name: 'idOwner' })
  owner: Owner;

  @ManyToOne(() => User, (user) => user.pets, {
    eager: true,
  })
  @JoinColumn({ name: 'idUser' })
  user: User;

  @BeforeInsert()
  columnInsertToLowerCase() {
    this.name = this.name.toLocaleLowerCase().trim();
    this.sex = this.sex.toLocaleLowerCase().trim();
  }

  @BeforeUpdate()
  columnUpdateToLowerCase() {
    this.name = this.name.toLocaleLowerCase().trim();
    this.sex = this.sex.toLocaleLowerCase().trim();
  }
}
