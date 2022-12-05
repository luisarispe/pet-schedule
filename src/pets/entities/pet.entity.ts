import internal from 'stream';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Species } from '../../species/entities/species.entity';

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
    name: 'url_image',
  })
  urlImage: string;

  @Column({ name: 'id_species' })
  idSpecies: number;

  @ManyToOne(() => Species, (species) => species.pets, {
    eager: true,
    nullable: false,
  })
  @JoinColumn({ name: 'id_species' })
  species: Species;

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
