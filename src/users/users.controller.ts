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
import { LoginUserDto } from './dto/login-user.dto';
import { IUser } from './entities/user.interface';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from './entities/role.enum';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserOwnerGuard } from '../auth/guards/userOwner.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { UpdateResult, DeleteResult } from 'typeorm';

@ApiTags('User')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}

  // Register a new user
  @Post('register')
  @ApiCreatedResponse({
    description: `User with id -- created.`,
    type: UserEntity,
  })
  @ApiBadRequestResponse({
    description: 'Error occurred while registering the user: ',
  })
  async register(@Body() registerUserDto: RegisterUserDto): Promise<IUser> {
    try {
      const createUser = await this.usersService.register(registerUserDto);
      this.logger.log(`User with id ${createUser.id} created.`);
      return createUser;
    } catch (error) {
      this.logger.error(`Error occurred while registering the user: ${error}`);
      throw error;
    }
  }

  // User login
  @Post('login')
  @ApiCreatedResponse({
    description: `User logged in.`,
    type: Promise<{ accessToken: string }>,
  })
  @ApiBadRequestResponse({
    description: 'Error occurred during user login: ',
  })
  @ApiUnauthorizedResponse({
    description: 'Error occurred during user login: Invalid credentials.',
  })
  async login(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<{ accessToken: string }> {
    try {
      const user = await this.usersService.login(loginUserDto);
      this.logger.log(`User logged in.`);
      return user;
    } catch (error) {
      this.logger.error(`Error occurred during user login: ${error}`);
      throw error;
    }
  }

  // Get all users (restricted to ADMIN role)
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Get()
  @ApiCreatedResponse({
    description: `All users retrieved.`,
    type: [UserEntity],
  })
  @ApiBadRequestResponse({
    description: 'Error occurred while retrieving users: ',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden resource',
  })
  findAll(): Promise<Array<UserEntity>> {
    try {
      const foundUsers = this.usersService.findAll();
      this.logger.log(`All users retrieved.`);
      return foundUsers;
    } catch (error) {
      this.logger.error(`Error occurred while retrieving users: ${error}`);
      throw error;
    }
  }

  // Get a single user by ID (restricted to ADMIN and USER roles)
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(JwtGuard, RolesGuard, UserOwnerGuard)
  @Get(':id')
  @ApiCreatedResponse({
    description: `User with id -- retrieved.`,
    type: UserEntity,
  })
  @ApiBadRequestResponse({
    description: 'Error occurred while retrieving a single user: ',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden resource',
  })
  findOne(@Param('id') id: number): Promise<UserEntity> {
    try {
      const foundUser = this.usersService.findOne(id);
      this.logger.log(`User with id ${id} retrieved.`);
      return foundUser;
    } catch (error) {
      this.logger.error(
        `Error occurred while retrieving a single user: ${error}`,
      );
      throw error;
    }
  }

  // Update a user by ID (restricted to ADMIN and USER roles)
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(JwtGuard, RolesGuard, UserOwnerGuard)
  @ApiCreatedResponse({
    description: `User with id -- updated.`,
    type: UpdateResult,
  })
  @ApiBadRequestResponse({
    description: 'Error occurred while updating a user: ',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden resource',
  })
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    try {
      const updateUser = await this.usersService.update(id, updateUserDto);
      this.logger.log(`User with id ${id} updated.`);
      return updateUser;
    } catch (error) {
      this.logger.error(`Error occurred while updating a user: ${error}`);
      throw error;
    }
  }

  // Delete a user by ID (restricted to ADMIN and USER roles)
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(JwtGuard, RolesGuard, UserOwnerGuard)
  @Delete(':id')
  @ApiCreatedResponse({
    description: `User with id -- removed.`,
    type: DeleteResult,
  })
  @ApiBadRequestResponse({
    description: 'Error occurred while removing a user: ',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden resource',
  })
  async delete(@Param('id') id: number): Promise<DeleteResult> {
    try {
      const deletedUser = this.usersService.delete(id);
      this.logger.log(`User with id ${id} removed.`);
      return deletedUser;
    } catch (error) {
      this.logger.error(`Error occurred while removing a user: ${error}`);
      throw error;
    }
  }
}
