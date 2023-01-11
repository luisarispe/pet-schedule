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
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/auth/entities/user.entity';
import { GetUser } from 'src/auth/decorators/getuser.decorator';

@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post()
  @Auth()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @GetUser() user: User,
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
    return this.petsService.create(createPetDto, user, file);
  }

  @Get()
  @Auth()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.petsService.findAll(paginationDto);
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.petsService.findOne(id);
  }

  @Patch(':id')
  @Auth()
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
  @Auth()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.petsService.remove(id);
  }
}
