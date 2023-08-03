import {
  Controller,
  Post,
  Get,
  Body,
  Logger,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { UpdateResult, DeleteResult } from 'typeorm';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { IPost } from './post.interface';

@Controller('posts')
export class PostsController {
  private readonly logger = new Logger(PostsController.name);
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async createPost(@Body() createPostDto: CreatePostDto): Promise<IPost> {
    try {
      const createdPost = await this.postsService.createPost(createPostDto);
      this.logger.log(`Post created with id: ${createdPost.id}`);
      return createdPost;
    } catch (error) {
      this.logger.error(`Error occurred while creating the post: ${error}`);
    }
  }

  @Get()
  async getPosts(): Promise<Array<IPost>> {
    try {
      const allPosts = await this.postsService.getPosts();
      this.logger.log('All posts returned.');
      return allPosts;
    } catch (error) {
      this.logger.error(`Error occurred while returing all posts: ${error}`);
    }
  }

  @Get(':postId')
  async getPost(@Param('postId') postId: string): Promise<IPost> {
    try {
      const post = await this.postsService.getPost(postId);
      this.logger.log(`Post returned with id: ${postId}`);
      return post;
    } catch (error) {
      this.logger.error(
        `Error occurred while returning a single post: ${error}`,
      );
    }
  }

  @Put(':postId')
  async updatePost(
    @Param('postId') postId: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<UpdateResult> {
    try {
      const updatePost = await this.postsService.updatePost(
        postId,
        updatePostDto,
      );
      this.logger.log(`Post updated with id: ${postId}`);
      return updatePost;
    } catch (error) {
      this.logger.error(`Error occurred while updating a post: ${error}`);
    }
  }

  @Delete(':postId')
  async deletePost(@Param('postId') postId: string): Promise<DeleteResult> {
    try {
      const deletePost = await this.postsService.deletePost(postId);
      this.logger.log(`Post deleted with id: ${postId}`);
      return deletePost;
    } catch (error) {
      this.logger.error(`Error occurred while deleting a post: ${error}`);
    }
  }
}
