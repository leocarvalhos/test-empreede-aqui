import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @UseGuards(AuthGuard)
  @Post(':id/withdrawal')
  withdrawal(@Param('id') id: string, @Body() amount: number) {
    return this.accountsService.withdrawal(id, amount);
  }

  @UseGuards(AuthGuard)
  @Post('deposit')
  deposit(@Body() number: number, amount: number) {
    return this.accountsService.deposit(number, amount);
  }

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountsService.create(createAccountDto);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.accountsService.findOneById(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountsService.update(id, updateAccountDto);
  }
}
