import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post('withdrawal/:id')
  withdrawal(
    @Param('id') id: string,
    @Body() amountObject: { amount: number },
  ) {
    return this.accountsService.withdrawal(id, amountObject);
  }

  @Post('deposit/:id')
  deposit(@Param('id') id: string, @Body() amountObject: { amount: number }) {
    return this.accountsService.deposit(id, amountObject);
  }

  @Post()
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountsService.create(createAccountDto);
  }

  @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.accountsService.findOneById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountsService.update(id, updateAccountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountsService.remove(id);
  }
}
