import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './entities/role.enum';

describe('UsersController', () => {
  let usersController: UsersController;

  const mockUser = {
    id: 1,
    firstName: 'Amir',
    lastName: 'Reza',
    email: 'Amir.Reza@gmail.com',
    password: 'password',
    role: Role.USER,
    creationDate: new Date(),
  };

  const mockUsersService = {
    register: jest.fn().mockResolvedValue(mockUser),
    login: jest.fn().mockResolvedValue({ accessToken: 'mockAccessToken' }),
    findAll: jest.fn().mockReturnValue([mockUser]),
    findOne: jest.fn().mockReturnValue(mockUser),
    update: jest.fn().mockResolvedValue(mockUser),
    delete: jest.fn().mockResolvedValue(mockUser),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    usersController = moduleRef.get<UsersController>(UsersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const _creationDate = new Date();
      const registerUserDto: RegisterUserDto = {
        firstName: 'Amir',
        lastName: 'Reza',
        email: 'Amir.Reza@gmail.com',
        password: 'password',
        creationDate: _creationDate,
        role: Role.USER,
        posts: [],
      };

      const createdUser = await usersController.register(registerUserDto);

      expect(createdUser).toEqual(mockUser);
      expect(mockUsersService.register).toHaveBeenCalledWith(registerUserDto);
    });
  });

  describe('login', () => {
    it('should log in a user', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'Amir.Reza@gmail.com',
        password: 'password',
      };

      const loggedInUser = await usersController.login(loginUserDto);

      expect(loggedInUser).toEqual({ accessToken: 'mockAccessToken' });
      expect(mockUsersService.login).toHaveBeenCalledWith(loginUserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of all users', () => {
      const allUsers = usersController.findAll();

      expect(allUsers).toEqual([mockUser]);
      expect(mockUsersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user by ID', () => {
      const userId = 1;

      const foundUser = usersController.findOne(userId);

      expect(foundUser).toEqual(mockUser);
      expect(mockUsersService.findOne).toHaveBeenCalledWith(userId);
    });
  });

  describe('update', () => {
    it('should update a user by ID', async () => {
      const userId = 1;
      const updateUserDto: UpdateUserDto = {
        firstName: 'Updated Amir',
        lastName: 'Updated Reza',
      };

      const updatedUser = await usersController.update(userId, updateUserDto);

      expect(updatedUser).toEqual(mockUser);
      expect(mockUsersService.update).toHaveBeenCalledWith(
        userId,
        updateUserDto,
      );
    });
  });

  describe('delete', () => {
    it('should delete a user by ID', async () => {
      const userId = 1;

      const deletedUser = await usersController.delete(userId);

      expect(deletedUser).toEqual(mockUser);
      expect(mockUsersService.delete).toHaveBeenCalledWith(userId);
    });
  });
});
