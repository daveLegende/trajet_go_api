import { Injectable, Inject } from '@nestjs/common';
import {
  USER_REPOSITORY,
  UserRepositoryInterface,
} from '../../domain/repositories/user.repository.interface';

@Injectable()
export class UpdateFcmTokenUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async execute(userId: string, fcmToken: string): Promise<void> {
    await this.userRepository.updateFcmToken(userId, fcmToken);
  }
}
