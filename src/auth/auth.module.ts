import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtGuard } from './guards/jwt.guard';
import { JwtStrategy } from './guards/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { UsersController } from 'src/users/users.controller';
import { RolesGuard } from './guards/roles.guard';
import { BlogModule } from 'src/blog/blog.module';
import { PostOwnerGuard } from './guards/postOwner.guard';
import { UserOwnerGuard } from './guards/userOwner.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '3600s' },
      }),
    }),
    TypeOrmModule.forFeature([UserEntity]),
    BlogModule,
  ],
  providers: [
    UsersService,
    JwtGuard,
    JwtStrategy,
    RolesGuard,
    UserOwnerGuard,
    PostOwnerGuard,
  ],
  controllers: [UsersController],
})
export class AuthModule {}
