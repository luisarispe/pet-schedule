import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';

@Injectable()
export class S3Service {
  constructor(private readonly configService: ConfigService) {}
  s3: AWS.S3 = new AWS.S3({
    accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY'),
    secretAccessKey: this.configService.get('AWS_S3_KEY_SECRET'),
  });

  async upload(file: Express.Multer.File, bucket: string) {
    const fileName = this.changeNameFile(file);
    const params = {
      Bucket: bucket,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      ContentDisposition: 'inline',
    };

    try {
      const { Location } = await this.s3.upload(params).promise();

      return Location;
    } catch (e) {
      throw new InternalServerErrorException(
        'Unexpected error, check server logs',
      );
    }
  }

  changeNameFile(file: Express.Multer.File) {
    const fileExtension = file.mimetype.split('/')[1];

    const fileName = `${uuid()}.${fileExtension}`;
    return fileName;
  }
}
