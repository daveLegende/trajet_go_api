import { Injectable, Inject } from '@nestjs/common';
import {
  NOTIFICATION_REPOSITORY,
  NotificationRepositoryPort,
  PUSH_NOTIFICATION_PROVIDER,
  PushNotificationPort,
  CreateNotificationInput,
} from '../../domain/repositories/notifications.repository';
import { Notification } from '../../domain/entities/notification.entity';

@Injectable()
export class CreateNotificationUseCase {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: NotificationRepositoryPort,
    @Inject(PUSH_NOTIFICATION_PROVIDER)
    private readonly pushProvider: PushNotificationPort,
  ) {}

  async execute(input: CreateNotificationInput): Promise<Notification> {
    // 1. Persist la notification en DB
    const notification = await this.notificationRepository.create(input);

    // 2. Tente l'envoi push (non-bloquant : si Firebase échoue, la notif est déjà en DB)
    this.pushProvider
      .send({
        userId: input.userId,
        titre: input.titre,
        message: input.message,
        data: input.donneesLiees
          ? Object.fromEntries(
              Object.entries(input.donneesLiees).map(([k, v]) => [k, String(v)]),
            )
          : undefined,
      })
      .catch((err) => {
        console.error('[PushNotification] Erreur lors de l\'envoi FCM :', err?.message);
      });

    return notification;
  }
}
