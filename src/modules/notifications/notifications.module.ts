import { Module } from '@nestjs/common';
import { NotificationsController } from './presentation/controllers/notifications.controller';
import { CreateNotificationUseCase } from './application/use-cases/create-notification.use-case';
import { GetNotificationsUseCase } from './application/use-cases/get-notifications.use-case';
import { MarkNotificationAsReadUseCase } from './application/use-cases/mark-notification-read.use-case';
import { PrismaNotificationRepository } from './infrastructure/persistence/prisma-notification.repository';
import { FcmPushNotificationAdapter } from './infrastructure/providers/fcm-push-notification.adapter';
import { NOTIFICATION_REPOSITORY, PUSH_NOTIFICATION_PROVIDER } from './domain/repositories/notifications.repository';
import { PrismaModule } from '../../infrastructure/database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [NotificationsController],
  providers: [
    { provide: NOTIFICATION_REPOSITORY, useClass: PrismaNotificationRepository },
    { provide: PUSH_NOTIFICATION_PROVIDER, useClass: FcmPushNotificationAdapter },
    CreateNotificationUseCase,
    GetNotificationsUseCase,
    MarkNotificationAsReadUseCase,
  ],
  // Exporté pour que les autres modules puissent l'utiliser
  exports: [CreateNotificationUseCase],
})
export class NotificationsModule {}
