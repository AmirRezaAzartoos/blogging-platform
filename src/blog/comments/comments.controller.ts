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

@Controller('comments')
export class CommentsController {
  private readonly logger = new Logger(CommentsController.name);
  constructor(private readonly commentsService: CommentsService) {}

  @Roles(Role.USER)
  @UseGuards(JwtGuard, RolesGuard)
  @Post()
  async createComment(
    @Body() createCommentDto: CreateCommentDto,
    @Request() req: any,
  ) {
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

  @Get()
  async getSelectedComments(
    @Query('take') take: number,
    @Query('skip') skip: number,
  ) {
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

  @Get(':id')
  async getComment(@Param('id') id: number) {
    try {
      const comment = await this.commentsService.getComment(id);
      this.logger.log(`Comment with id ${id} retrieved.`);
      return comment;
    } catch (error) {
      this.logger.error(`Error occurred while retrieving a comment: ${error}`);
      throw error;
    }
  }

  @Roles(Role.USER)
  @UseGuards(JwtGuard, RolesGuard, CommentOwnerGuard)
  @Put(':id')
  async updateComment(
    @Param('id') id: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
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

  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(JwtGuard, RolesGuard, CommentOwnerGuard)
  @Delete(':id')
  async deleteComment(@Param('id') id: number) {
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
