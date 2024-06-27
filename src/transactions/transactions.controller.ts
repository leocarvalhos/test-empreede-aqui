import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionsService } from './transactions.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { DateRangeDto } from './dto/date-range.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @UseGuards(AuthGuard)
  @Post(':id/upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.transactionsService.uploadFile(id, file);
  }

  @UseGuards(AuthGuard)
  @Post(':id/transfer')
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  }
  @UseGuards(AuthGuard)
  @Get(':accountNumber')
  extract(
    @Param('accountNumber') id: string,
    @Query() dateRange?: DateRangeDto,
  ) {
    return this.transactionsService.extract(id, dateRange);
  }
}
