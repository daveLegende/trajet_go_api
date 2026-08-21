import { Module } from '@nestjs/common';
import { USER_REPOSITORY } from './domain/repositories/user.repository.interface';
import { PrismaUserRepository } from './infrastructure/persistence/prisma-user.repository';
import { GetUserProfileUseCase } from './application/use-cases/get-user-profile.use-case';
import { UsersController } from './presentation/controllers/users.controller';

@Module({
  controllers: [UsersController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
    GetUserProfileUseCase,
  ],
  exports: [USER_REPOSITORY, GetUserProfileUseCase],
})
export class UsersModule {}
