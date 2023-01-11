import { Module } from '@nestjs/common';
import { OwnersService } from './owners.service';
import { OwnersController } from './owners.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Owner } from './entities/owner.entity';
import { CommonModule } from 'src/common/common.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [OwnersController],
  providers: [OwnersService],
  imports: [TypeOrmModule.forFeature([Owner]), CommonModule, AuthModule],
  exports: [OwnersService],
})
export class OwnersModule {}
