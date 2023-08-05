import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { JwtGuard } from '../../auth/guards/jwt.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { CommentOwnerGuard } from '../../auth/guards/commentOwner.guard';
import { Role } from '../../users/entities/role.enum';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

describe('CommentsController', () => {
  let commentsController: CommentsController;
  let commentsService: CommentsService;

  const mockComment = {
    id: 1,
    content: 'Test comment',
    user: {
      id: 1,
      firstName: 'Amir',
      lastName: 'Reza',
      email: 'Amir.Reza@gmail.com',
      password: 'password',
      role: Role.USER,
      creationDate: new Date(),
      posts: [],
      comments: [],
    },
    createdAt: new Date(),
  };

  const mockUpdateResult = {
    affected: 1,
    raw: undefined,
    generatedMaps: [],
  };

  const mockDeleteResult = {
    affected: 1,
    raw: undefined,
  };

  const mockCommentsService = {
    createComment: jest.fn().mockResolvedValue(mockComment),
    getSelectedComments: jest.fn().mockResolvedValue([mockComment]),
    getComment: jest.fn().mockResolvedValue(mockComment),
    updateComment: jest.fn().mockResolvedValue(mockUpdateResult),
    deleteComment: jest.fn().mockResolvedValue(mockDeleteResult),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        { provide: CommentsService, useValue: mockCommentsService },
        JwtGuard,
        RolesGuard,
        CommentOwnerGuard,
      ],
    }).compile();

    commentsController = module.get<CommentsController>(CommentsController);
    commentsService = module.get<CommentsService>(CommentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(commentsController).toBeDefined();
  });

  describe('createComment', () => {
    it('should create a new comment', async () => {
      const createCommentDto: CreateCommentDto = {
        content: 'Test comment',
      };

      const user = {
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

      const result = await commentsController.createComment(createCommentDto, {
        user,
      });

      expect(result).toEqual(mockComment);
      expect(commentsService.createComment).toHaveBeenCalledWith(
        user,
        createCommentDto,
      );
    });
  });

  describe('getSelectedComments', () => {
    it('should return an array of selected comments', async () => {
      const take = 2;
      const skip = 0;

      const result = await commentsController.getSelectedComments(take, skip);

      expect(result).toEqual([mockComment]);
      expect(commentsService.getSelectedComments).toHaveBeenCalledWith(
        take,
        skip,
      );
    });
  });

  describe('getComment', () => {
    it('should return a single comment by ID', async () => {
      const commentId = 1;

      const result = await commentsController.getComment(commentId);

      expect(result).toEqual(mockComment);
      expect(commentsService.getComment).toHaveBeenCalledWith(commentId);
    });
  });

  describe('updateComment', () => {
    it('should update a comment by ID', async () => {
      const commentId = 1;
      const updateCommentDto: UpdateCommentDto = {
        content: 'Updated comment',
      };

      const result = await commentsController.updateComment(
        commentId,
        updateCommentDto,
      );

      expect(result).toEqual(mockUpdateResult);
      expect(commentsService.updateComment).toHaveBeenCalledWith(
        commentId,
        updateCommentDto,
      );
    });
  });

  describe('deleteComment', () => {
    it('should delete a comment by ID', async () => {
      const commentId = 1;

      const result = await commentsController.deleteComment(commentId);

      expect(result).toEqual(mockDeleteResult);
      expect(commentsService.deleteComment).toHaveBeenCalledWith(commentId);
    });
  });
});
