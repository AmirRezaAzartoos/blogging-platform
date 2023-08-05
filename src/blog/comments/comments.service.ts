import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentEntity } from './entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { IUser } from '../../users/entities/user.interface';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
  ) {}

  async createComment(
    user: IUser,
    createCommentDto: CreateCommentDto,
  ): Promise<CommentEntity> {
    createCommentDto.author = user;
    return await this.commentRepository.save(createCommentDto);
  }

  // findAll() {
  //   return `This action returns all comments`;
  // }

  async getSelectedComments(take, skip): Promise<CommentEntity[]> {
    return await this.commentRepository
      .findAndCount({ take, skip })
      .then((data) => {
        return data[0];
      });
  }

  async getComment(commentId: number): Promise<CommentEntity> {
    return await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.author', 'author')
      .where('comment.id = :commentId', { commentId })
      .select([
        'comment.id',
        'comment.content',
        'comment.publicationDate',
        'author.id',
        'author.firstName',
        'author.lastName',
        'author.email',
        'author.role',
      ])
      .getOne();
  }

  async updateComment(
    commentId: number,
    updateCommentDto: UpdateCommentDto,
  ): Promise<UpdateResult> {
    return await this.commentRepository.update(commentId, updateCommentDto);
  }

  async deleteComment(postId: number): Promise<DeleteResult> {
    return await this.commentRepository.delete(postId);
  }
}
