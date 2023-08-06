import { Injectable } from '@nestjs/common';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { PostEntity } from './entities/posts.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IUser } from '../../users/entities/user.interface';
import { IPost } from './entities/post.interface';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  // Create a new post in the database.
  async createPost(user: IUser, createPostDto: CreatePostDto): Promise<IPost> {
    createPostDto.author = user;
    return await this.postRepository.save(createPostDto);
  }

  // Get a list of selected posts with pagination.
  async getSelectedPosts(take, skip): Promise<PostEntity[]> {
    return await this.postRepository
      .findAndCount({ take, skip })
      .then((data) => {
        return data[0];
      });
  }

  // Get a single post by its ID along with the author details.
  async getPost(postId: number): Promise<PostEntity> {
    return await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .where('post.id = :postId', { postId })
      .select([
        'post.id',
        'post.title',
        'post.content',
        'post.publicationDate',
        'post.tags',
        'author.id',
        'author.firstName',
        'author.lastName',
        'author.email',
        'author.role',
      ])
      .getOne();
  }

  // Update an existing post in the database by its ID.
  async updatePost(
    postId: number,
    updatePostDto: UpdatePostDto,
  ): Promise<UpdateResult> {
    return await this.postRepository.update(postId, updatePostDto);
  }

  // Delete a post from the database by its ID.
  async deletePost(postId: number): Promise<DeleteResult> {
    return await this.postRepository.delete(postId);
  }
}
