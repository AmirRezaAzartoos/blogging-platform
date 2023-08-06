import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Request,
  UseGuards,
  Put,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../users/entities/role.enum';
import { JwtGuard } from '../../auth/guards/jwt.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { CommentOwnerGuard } from '../../auth/guards/commentOwner.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CommentEntity } from './entities/comment.entity';
import { UpdateResult, DeleteResult } from 'typeorm';

@ApiTags('Comment')
@ApiBearerAuth()
@Controller('comments')
export class CommentsController {
  private readonly logger = new Logger(CommentsController.name);
  constructor(private readonly commentsService: CommentsService) {}

  // Creates a new comment with the provided information
  @Roles(Role.USER)
  @UseGuards(JwtGuard, RolesGuard)
  @Post()
  @ApiCreatedResponse({
    description: `Comment with id -- created.`,
    type: CommentEntity,
  })
  @ApiBadRequestResponse({
    description: 'Error occurred while creating a comment: ',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden resource',
  })
  async createComment(
    @Body() createCommentDto: CreateCommentDto,
    @Request() req: any,
  ): Promise<CommentEntity> {
    try {
      const createdComment = await this.commentsService.createComment(
        req.user,
        createCommentDto,
      );
      this.logger.log(`Comment with id ${createdComment.id} created.`);
      return createdComment;
    } catch (error) {
      this.logger.error(`Error occurred while creating a comment: ${error}`);
    }
  }

  // Retrieves a list of selected comments with pagination
  @Get()
  @ApiCreatedResponse({
    description: `Selcterd comments retrieved.`,
    type: [CommentEntity],
  })
  @ApiBadRequestResponse({
    description: 'Error occurred while retrieving selected comments: ',
  })
  async getSelectedComments(
    @Query('take') take: number,
    @Query('skip') skip: number,
  ): Promise<Array<CommentEntity>> {
    try {
      const comments = await this.commentsService.getSelectedComments(
        take,
        skip,
      );
      this.logger.log(`Selected comments retrieved.`);
      return comments;
    } catch (error) {
      this.logger.error(`Error occurred while retrieving a comment: ${error}`);
      throw error;
    }
  }

  // Retrieves a single comment by ID
  @Get(':id')
  @ApiCreatedResponse({
    description: `Comment with id -- retrieved.`,
    type: CommentEntity,
  })
  @ApiBadRequestResponse({
    description: 'Error occurred while retrieving a single comment: ',
  })
  async getComment(@Param('id') id: number): Promise<CommentEntity> {
    try {
      const comment = await this.commentsService.getComment(id);
      this.logger.log(`Comment with id ${id} retrieved.`);
      return comment;
    } catch (error) {
      this.logger.error(`Error occurred while retrieving a comment: ${error}`);
      throw error;
    }
  }

  // Updates an existing comment with the provided information
  @Roles(Role.USER)
  @UseGuards(JwtGuard, RolesGuard, CommentOwnerGuard)
  @Put(':id')
  @ApiCreatedResponse({
    description: `Comment with id -- updated.`,
    type: UpdateResult,
  })
  @ApiBadRequestResponse({
    description: 'Error occurred while updating a comment: ',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden resource',
  })
  async updateComment(
    @Param('id') id: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<UpdateResult> {
    try {
      const updateComment = await this.commentsService.updateComment(
        id,
        updateCommentDto,
      );
      this.logger.log(`Comment with id ${id} updated.`);
      return updateComment;
    } catch (error) {
      this.logger.error(`Error occurred while updating a comment: ${error}`);
      throw error;
    }
  }

  // Deletes a comment with the specified ID
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(JwtGuard, RolesGuard, CommentOwnerGuard)
  @Delete(':id')
  @ApiCreatedResponse({
    description: `Comment with id -- removed.`,
    type: DeleteResult,
  })
  @ApiBadRequestResponse({
    description: 'Error occurred while removing a comment: ',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden resource',
  })
  async deleteComment(@Param('id') id: number): Promise<DeleteResult> {
    try {
      const deleteComment = await this.commentsService.deleteComment(id);
      this.logger.log(`Comment with id ${id} removed.`);
      return deleteComment;
    } catch (error) {
      this.logger.error(`Error occurred while deleting a comment: ${error}`);
      throw error;
    }
  }
}
