import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { SlackService } from 'nestjs-slack';
import { v4 as uuid } from 'uuid';

@Injectable()
export class S3Service {
  constructor(private readonly slackService: SlackService) {}
  s3: AWS.S3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  async upload(file: Express.Multer.File, bucket: string) {
    const fileName = this.changeNameFile(file);
    const params = {
      Bucket: bucket,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    try {
      const { Location } = await this.s3.upload(params).promise();

      return Location;
    } catch (e) {
      this.slackService.sendText(JSON.stringify(e));
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
