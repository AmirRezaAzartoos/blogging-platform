import { Injectable } from '@nestjs/common';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { PostEntity } from './entities/posts.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IUser } from 'src/users/entities/user.interface';
import { IPost } from './entities/post.interface';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  async createPost(user: IUser, createPostDto: CreatePostDto): Promise<IPost> {
    createPostDto.author = user;
    return await this.postRepository.save(createPostDto);
  }

  async getPosts(): Promise<PostEntity[]> {
    return await this.postRepository.find();
  }

  async getPost(postId: number): Promise<PostEntity> {
    return await this.postRepository.findOneBy({ id: postId });
  }

  async updatePost(
    postId: number,
    updatePostDto: UpdatePostDto,
  ): Promise<UpdateResult> {
    return await this.postRepository.update(postId, updatePostDto);
  }

  async deletePost(postId: number): Promise<DeleteResult> {
    return await this.postRepository.delete(postId);
  }
}
