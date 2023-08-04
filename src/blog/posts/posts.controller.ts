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
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { IPost } from './entities/post.interface';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/users/entities/role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PostOwnerGuard } from 'src/auth/guards/postOwner.guard';

@Controller('posts')
export class PostsController {
  private readonly logger = new Logger(PostsController.name);
  constructor(private readonly postsService: PostsService) {}

  @Roles(Role.USER)
  @UseGuards(JwtGuard, RolesGuard)
  @Post()
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
    }
  }

  @Get(':postId')
  async getPost(@Param('postId') postId: number): Promise<PostEntity> {
    try {
      const post = await this.postsService.getPost(postId);
      this.logger.log(`Post with id ${postId} retrieved.`);
      return post;
    } catch (error) {
      this.logger.error(
        `Error occurred while retrieving a single post: ${error}`,
      );
    }
  }

  @Roles(Role.USER) // Here i think its for best if ADMIN can not edit post
  @UseGuards(JwtGuard, RolesGuard, PostOwnerGuard)
  @Put(':postId')
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
    }
  }

  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(JwtGuard, RolesGuard, PostOwnerGuard)
  @Delete(':postId')
  async deletePost(@Param('postId') postId: number): Promise<DeleteResult> {
    try {
      const deletePost = await this.postsService.deletePost(postId);
      this.logger.log(`Post with id ${postId} removed.`);
      return deletePost;
    } catch (error) {
      this.logger.error(`Error occurred while deleting a post: ${error}`);
    }
  }
}
