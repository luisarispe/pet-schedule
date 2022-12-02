import { IsString, MaxLength } from "class-validator";

export class CreateSpeciesDto {

    @IsString()
    @MaxLength(100)
    name:string;
}
