import internal from "stream";
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Pet {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('varchar',{
        length:100,
        unique:true
    })
    name:string;

    @Column('varchar',{
        length:100
    })
    species:string;

    @Column('varchar',{
        length:100
    })
    sex:string;

    @Column('int')
    age:number;

    @BeforeInsert()
    columnToLowerCase(){
        this.name=this.name.toLocaleLowerCase();
        this.species=this.species.toLocaleLowerCase();
        this.sex=this.sex.toLocaleLowerCase();
    }
}
