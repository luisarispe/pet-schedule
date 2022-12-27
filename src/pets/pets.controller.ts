import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PetsService } from './pets.service';
import { S3Service } from '../common/services/s3/s3.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('pets')
export class PetsController {
  constructor(
    private readonly petsService: PetsService,
    private readonly s3Service: S3Service,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createPetDto: CreatePetDto,
    //CARGA IMAGEN
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|gif)$/,
        })
        .addMaxSizeValidator({
          //3MB
          maxSize: 3000000,
        })
        .build({
          fileIsRequired: false,
        }),
    )
    file?: Express.Multer.File,
    //END CARGA IMAGEN
  ) {
    return this.petsService.create(createPetDto, file);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.petsService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.petsService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePetDto: UpdatePetDto,
    //CARGA IMAGEN
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|gif)$/,
        })
        .addMaxSizeValidator({
          //3MB
          maxSize: 3000000,
        })
        .build({
          fileIsRequired: false,
        }),
    )
    file?: Express.Multer.File,
    //END CARGA IMAGEN
  ) {
    return this.petsService.update(id, updatePetDto, file);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.petsService.remove(id);
  }
}
