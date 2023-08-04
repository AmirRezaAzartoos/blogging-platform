import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Logger,
  BadRequestException,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login-user.dto';
import { IUser } from './entities/user.interface';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from './entities/role.enum';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto): Promise<IUser> {
    try {
      const createUser = await this.usersService.register(registerUserDto);
      this.logger.log(`User with id ${createUser.id} created.`);
      return createUser;
    } catch (error) {
      this.logger.error(`Error occurred while registering the user: ${error}`);
      throw new BadRequestException(
        'Registration failed. Please check your input.',
      );
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
    try {
      const user = await this.usersService.login(loginDto);
      this.logger.log(`User logged in.`);
      return user;
    } catch (error) {
      this.logger.error(`Error occurred during user login: ${error}`);
      throw new BadRequestException('Login failed. Invalid credentials.');
    }
  }

  @Get()
  findAll() {
    try {
      const foundUsers = this.usersService.findAll();
      this.logger.log(`All users retrieved.`);
      return foundUsers;
    } catch (error) {
      this.logger.error(`Error occurred while retrieving users: ${error}`);
    }
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    try {
      const foundUser = this.usersService.findOne(id);
      this.logger.log(`User with id ${id} retrieved.`);
      return foundUser;
    } catch (error) {
      this.logger.error(`Error occurred while retrieving users: ${error}`);
    }
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    try {
      const updateUser = await this.usersService.update(id, updateUserDto);
      this.logger.log(`User with id ${id} updated.`);
      return updateUser;
    } catch (error) {
      this.logger.error(`Error occurred while retrieving users: ${error}`);
    }
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Delete(':id')
  async delete(@Param('id') id: number) {
    try {
      const deletedUser = this.usersService.delete(id);
      this.logger.log(`User with id ${id} removed.`);
      return deletedUser;
    } catch (error) {
      this.logger.error(`Error occurred while retrieving users: ${error}`);
    }
  }
}
