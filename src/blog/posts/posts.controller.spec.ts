import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostEntity } from '../posts/entities/posts.entity';
import { UsersService } from '../../users/users.service';
import { UserEntity } from '../../users/entities/user.entity';
import { Role } from '../../users/entities/role.enum';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { DeleteResult, UpdateResult } from 'typeorm';

describe('PostsController', () => {
  let postsController: PostsController;

  const mockAuthor: UserEntity = {
    id: 1,
    firstName: 'Amir',
    lastName: 'Reza',
    email: 'Amir.Reza@gmail.com',
    password: 'password',
    role: Role.USER,
    creationDate: new Date(),
    posts: [],
    comments: [],
  };

  const mockPost: PostEntity = {
    id: 1,
    title: 'Test Post',
    content: 'This is a test post',
    author: mockAuthor,
    publicationDate: new Date(),
    tags: ['test', 'nest'],
    comments: [],
  };

  const mockUpdateResult: UpdateResult = {
    affected: 1,
    raw: undefined,
    generatedMaps: [],
  };

  const mockDeleteResult: DeleteResult = {
    affected: 1,
    raw: undefined,
  };

  const mockPostsService = {
    createPost: jest.fn().mockResolvedValue(mockPost),
    getSelectedPosts: jest.fn().mockResolvedValue([mockPost]),
    getPost: jest.fn().mockResolvedValue(mockPost),
    updatePost: jest.fn().mockResolvedValue(mockUpdateResult),
    deletePost: jest.fn().mockResolvedValue(mockDeleteResult),
  };

  const mockUsersService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        { provide: PostsService, useValue: mockPostsService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    postsController = module.get<PostsController>(PostsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(postsController).toBeDefined();
  });

  describe('createPost', () => {
    it('should create a new post', async () => {
      const createPostDto: CreatePostDto = {
        title: 'Test Post',
        content: 'This is a test post',
        tags: ['test', 'nest'],
        publicationDate: new Date(),
        author: mockAuthor,
      };

      const createdPost = await postsController.createPost(createPostDto, {
        user: mockAuthor,
      });

      expect(createdPost).toEqual(mockPost);
      expect(mockPostsService.createPost).toHaveBeenCalledWith(
        mockAuthor,
        createPostDto,
      );
    });
  });

  describe('getSelectedPosts', () => {
    it('should return an array of selected posts', async () => {
      const take = 2;
      const skip = 0;

      const selectedPosts = await postsController.getSelectedPosts(take, skip);

      expect(selectedPosts).toEqual([mockPost]);
      expect(mockPostsService.getSelectedPosts).toHaveBeenCalledWith(
        take,
        skip,
      );
    });
  });

  describe('getPost', () => {
    it('should return a single post by ID', async () => {
      const postId = 1;

      const post = await postsController.getPost(postId);

      expect(post).toEqual(mockPost);
      expect(mockPostsService.getPost).toHaveBeenCalledWith(postId);
    });
  });

  describe('updatePost', () => {
    it('should update a post by ID', async () => {
      const postId = 1;
      const updatePostDto: UpdatePostDto = {
        title: 'Updated Post',
        content: 'This post has been updated',
        tags: ['update'],
      };

      const updateResult = await postsController.updatePost(
        postId,
        updatePostDto,
      );

      expect(updateResult).toEqual(mockUpdateResult);
      expect(mockPostsService.updatePost).toHaveBeenCalledWith(
        postId,
        updatePostDto,
      );
    });
  });

  describe('deletePost', () => {
    it('should delete a post by ID', async () => {
      const postId = 1;

      const deleteResult = await postsController.deletePost(postId);

      expect(deleteResult).toEqual(mockDeleteResult);
      expect(mockPostsService.deletePost).toHaveBeenCalledWith(postId);
    });
  });
});
