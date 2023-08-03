import { Injectable } from '@nestjs/common';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { PostEntity } from './posts.entity';
import { v4 as uuid } from 'uuid';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IPost } from './post.interface';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  async createPost(createPostDto: CreatePostDto): Promise<IPost> {
    const id = uuid();
    return await this.postRepository.save({
      id: id,
      title: createPostDto.title,
      content: createPostDto.content,
      author: createPostDto.author,
      publicationDate: new Date(),
      tags: createPostDto.tags,
    });
  }

  async getPosts(): Promise<Array<IPost>> {
    return await this.postRepository.find();
  }

  async getPost(postId: string): Promise<IPost> {
    return await this.postRepository.findOneBy({ id: postId });
  }

  async updatePost(
    postId: string,
    updatePostDto: UpdatePostDto,
  ): Promise<UpdateResult> {
    return await this.postRepository.update(postId, updatePostDto);
  }

  async deletePost(postId: string): Promise<DeleteResult> {
    return await this.postRepository.delete(postId);
  }
}
