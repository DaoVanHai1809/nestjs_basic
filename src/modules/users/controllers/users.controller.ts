import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/users.dto';
import { AuthGuard } from '../guards/auth.guard';
import { ValidateCreateUserPipe } from '../pipes/validate-create-user.pipe';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  @Get()
  getUsers() {
    return [
      {
        username: 'Haidv123',
        email: 'dajoa@gmail.com',
      },
    ];
  }

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: string) {
    console.log({ id });
    return { id };
  }

  @Post('create')
  // @UsePipes(new ValidationPipe()) // in main.ts setup globally
  createUser(@Body(ValidateCreateUserPipe) userData: CreateUserDto) {
    console.log('success', userData);
    return {};
  }
}
