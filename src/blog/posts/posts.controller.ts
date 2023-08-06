import {
  Controller,
  Post,
  Get,
  Body,
  Logger,
  Param,
  Put,
  Delete,
  UseGuards,
  Request,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { UpdateResult, DeleteResult } from 'typeorm';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/posts.entity';
import { JwtGuard } from '../../auth/guards/jwt.guard';
import { IPost } from './entities/post.interface';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../users/entities/role.enum';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { PostOwnerGuard } from '../../auth/guards/postOwner.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Post')
@ApiBearerAuth()
@Controller('posts')
export class PostsController {
  private readonly logger = new Logger(PostsController.name);
  constructor(private readonly postsService: PostsService) {}

  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(JwtGuard, RolesGuard)
  @Post()
  @ApiCreatedResponse({
    description: `Post with id -- created.`,
    type: PostEntity,
  })
  @ApiBadRequestResponse({
    description: 'Error occurred while creating a post: ',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden resource',
  })
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @Request() req: any,
  ): Promise<IPost> {
    try {
      const createdPost = await this.postsService.createPost(
        req.user,
        createPostDto,
      );
      this.logger.log(`Post with id ${createdPost.id} created.`);
      return createdPost;
    } catch (error) {
      this.logger.error(`Error occurred while creating a post: ${error}`);
      throw error;
    }
  }

  // @Get()
  // async getAllPosts(): Promise<Array<PostEntity>> {
  //   try {
  //     const allPosts = await this.postsService.getAllPosts();
  //     this.logger.log('All posts retrieved.');
  //     return allPosts;
  //   } catch (error) {
  //     this.logger.error(`Error occurred while retrieving all posts: ${error}`);
  //   }
  // }

  @Get()
  @ApiCreatedResponse({
    description: `Selcterd posts retrieved.`,
    type: [PostEntity],
  })
  @ApiBadRequestResponse({
    description: 'Error occurred while retrieving selected posts: ',
  })
  async getSelectedPosts(
    @Query('take') take: number,
    @Query('skip') skip: number,
  ): Promise<Array<PostEntity>> {
    try {
      take = take > 15 ? 15 : take;
      const selectedPosts = await this.postsService.getSelectedPosts(
        take || 10,
        skip || 0,
      );
      this.logger.log('Selcterd posts retrieved.');
      return selectedPosts;
    } catch (error) {
      this.logger.error(
        `Error occurred while retrieving selected posts: ${error}`,
      );
      throw error;
    }
  }

  @Get(':postId')
  @ApiCreatedResponse({
    description: `Post with id -- retrieved.`,
    type: PostEntity,
  })
  @ApiBadRequestResponse({
    description: 'Error occurred while retrieving a single post: ',
  })
  async getPost(@Param('postId') postId: number): Promise<PostEntity> {
    try {
      const post = await this.postsService.getPost(postId);
      this.logger.log(`Post with id ${postId} retrieved.`);
      return post;
    } catch (error) {
      this.logger.error(
        `Error occurred while retrieving a single post: ${error}`,
      );
      throw error;
    }
  }

  @Roles(Role.USER)
  @UseGuards(JwtGuard, RolesGuard, PostOwnerGuard)
  @Put(':postId')
  @ApiCreatedResponse({
    description: `Post with id -- updated.`,
    type: UpdateResult,
  })
  @ApiBadRequestResponse({
    description: 'Error occurred while updating a post: ',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden resource',
  })
  async updatePost(
    @Param('postId') postId: number,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<UpdateResult> {
    try {
      const updatePost = await this.postsService.updatePost(
        postId,
        updatePostDto,
      );
      this.logger.log(`Post with id ${postId} updated.`);
      return updatePost;
    } catch (error) {
      this.logger.error(`Error occurred while updating a post: ${error}`);
      throw error;
    }
  }

  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(JwtGuard, RolesGuard, PostOwnerGuard)
  @Delete(':postId')
  @ApiCreatedResponse({
    description: `Post with id -- removed.`,
    type: DeleteResult,
  })
  @ApiBadRequestResponse({
    description: 'Error occurred while removing a post: ',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden resource',
  })
  async deletePost(@Param('postId') postId: number): Promise<DeleteResult> {
    try {
      const deletePost = await this.postsService.deletePost(postId);
      this.logger.log(`Post with id ${postId} removed.`);
      return deletePost;
    } catch (error) {
      this.logger.error(`Error occurred while deleting a post: ${error}`);
      throw error;
    }
  }
}
