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
import { Throttle } from '@nestjs/throttler';

@ApiTags('Post')
@ApiBearerAuth()
@Controller('posts')
export class PostsController {
  private readonly logger = new Logger(PostsController.name);
  constructor(private readonly postsService: PostsService) {}

  // Create a new post
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
      // Call the postsService to create a new post
      const createdPost = await this.postsService.createPost(
        req.user,
        createPostDto,
      );
      // Log the successful creation of the post
      this.logger.log(`Post with id ${createdPost.id} created.`);
      return createdPost;
    } catch (error) {
      // Log and rethrow any errors that occurred during post creation
      this.logger.error(`Error occurred while creating a post: ${error}`);
      throw error;
    }
  }

  // Get a list of selected posts
  @Throttle(5, 10)
  @Get()
  @ApiCreatedResponse({
    description: `Selected posts retrieved.`,
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
      // Set default values for take and skip if not provided
      take = take > 15 ? 15 : take;
      // Call the postsService to get a list of selected posts
      const selectedPosts = await this.postsService.getSelectedPosts(
        take || 10,
        skip || 0,
      );
      // Log the successful retrieval of selected posts
      this.logger.log('Selected posts retrieved.');
      return selectedPosts;
    } catch (error) {
      // Log and rethrow any errors that occurred during post retrieval
      this.logger.error(
        `Error occurred while retrieving selected posts: ${error}`,
      );
      throw error;
    }
  }

  // Get a single post by its ID
  @Throttle(5, 10)
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
      // Call the postsService to get a single post by its ID
      const post = await this.postsService.getPost(postId);
      // Log the successful retrieval of the post
      this.logger.log(`Post with id ${postId} retrieved.`);
      return post;
    } catch (error) {
      // Log and rethrow any errors that occurred during post retrieval
      this.logger.error(
        `Error occurred while retrieving a single post: ${error}`,
      );
      throw error;
    }
  }

  // Update a post by its ID
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
      // Call the postsService to update the post by its ID
      const updatePost = await this.postsService.updatePost(
        postId,
        updatePostDto,
      );
      // Log the successful update of the post
      this.logger.log(`Post with id ${postId} updated.`);
      return updatePost;
    } catch (error) {
      // Log and rethrow any errors that occurred during post update
      this.logger.error(`Error occurred while updating a post: ${error}`);
      throw error;
    }
  }

  // Delete a post by its ID
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
      // Call the postsService to delete the post by its ID
      const deletePost = await this.postsService.deletePost(postId);
      // Log the successful deletion of the post
      this.logger.log(`Post with id ${postId} removed.`);
      return deletePost;
    } catch (error) {
      // Log and rethrow any errors that occurred during post deletion
      this.logger.error(`Error occurred while deleting a post: ${error}`);
      throw error;
    }
  }
}
