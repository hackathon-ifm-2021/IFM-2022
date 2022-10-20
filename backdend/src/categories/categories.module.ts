import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categories } from 'src/entities/Categories';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

@Module({
  imports: [ TypeOrmModule.forFeature([Categories]) ],
  controllers: [CategoriesController],
  providers: [CategoriesService]
})
export class CategoriesModule {}
