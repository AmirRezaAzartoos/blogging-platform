import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { LoginUserDto } from './dto/login-user.dto';
import { IUser } from './entities/user.interface';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  // Hashes the password using bcrypt with a salt factor of 10
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hashSync(password, 10);
  }

  // Generates a JSON Web Token (JWT) for the user with a specific payload
  private generateJwtToken(user: IUser): string {
    const payload = { id: user.id, email: user.email, role: user.role };
    return this.jwtService.sign(payload);
  }

  // Checks if a user with the given email already exists in the database
  private async checkUserExists(email: string): Promise<IUser> {
    return await this.userRepository.findOne({
      where: { email },
      select: ['id', 'firstName', 'lastName', 'email', 'password', 'role'],
    });
  }

  // Registers a new user with the provided information
  async register(registerUserDto: RegisterUserDto): Promise<IUser> {
    const user = await this.checkUserExists(registerUserDto.email);
    if (user) {
      throw new BadRequestException('Email already exists.');
    }
    registerUserDto.password = await this.hashPassword(
      registerUserDto.password,
    );
    const createUser = await this.userRepository.save(registerUserDto);
    delete createUser.password; // Removes the password from the returned user object for security reasons
    return createUser;
  }

  // Authenticates a user and generates an access token (JWT) upon successful login
  async login(loginUserDto: LoginUserDto): Promise<{ accessToken: string }> {
    const { email, password } = loginUserDto;
    const user = await this.checkUserExists(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }
    delete user.password; // Removes the password from the returned user object for security reasons
    const accessToken = this.generateJwtToken(user);
    return { accessToken };
  }

  // Retrieves all users from the database
  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  // Retrieves a single user by ID from the database
  async findOne(id: number): Promise<UserEntity> {
    return await this.userRepository.findOneBy({ id: id });
  }

  // Updates a user's information in the database
  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    return await this.userRepository.update(id, updateUserDto);
  }

  // Deletes a user from the database
  async delete(id: number): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }
}
