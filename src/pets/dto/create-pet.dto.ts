import { Type } from "class-transformer";
import { IsIn, IsNumber, IsString, MaxLength, MinLength } from "class-validator";

export class CreatePetDto {

    @IsString()
    @MinLength(4)
    @MaxLength(100)
    name:string;

    @IsIn(['gato', 'perro', 'ave', 'conejo', 'caballo'])
    species:string;

    @IsIn(['fem','male'])
    sex:string;

    @IsNumber()
    @Type(()=>Number)
    age:number;
}
