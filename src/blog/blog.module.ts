import { Module } from '@nestjs/common';
import { PostsController } from './posts/posts.controller';
import { PostsService } from './posts/posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './posts/entities/posts.entity';
import { CommentsController } from './comments/comments.controller';
import { CommentsService } from './comments/comments.service';
import { CommentEntity } from './comments/entities/comment.entity';
@Module({
  imports: [TypeOrmModule.forFeature([PostEntity, CommentEntity])],
  controllers: [PostsController, CommentsController],
  providers: [PostsService, CommentsService],
  exports: [PostsService],
})
export class BlogModule {}
