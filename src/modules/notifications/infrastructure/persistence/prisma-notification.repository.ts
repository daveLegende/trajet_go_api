import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';
import { NotificationRepositoryPort, CreateNotificationInput } from '../../domain/repositories/notifications.repository';
import { Notification, TypeNotification } from '../../domain/entities/notification.entity';

@Injectable()
export class PrismaNotificationRepository implements NotificationRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateNotificationInput): Promise<Notification> {
    const notif = await this.prisma.notification.create({
      data: {
        user_id: input.userId,
        titre: input.titre,
        message: input.message,
        type: input.type as any,
        donnees_liees: input.donneesLiees ?? undefined,
      },
    });
    return this.toDomain(notif);
  }

  async findByUserId(userId: string): Promise<Notification[]> {
    const notifs = await this.prisma.notification.findMany({
      where: { user_id: userId },
      orderBy: { date_creation: 'desc' },
    });
    return notifs.map((n) => this.toDomain(n));
  }

  async markAsRead(notificationId: string, userId: string): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { id: notificationId, user_id: userId },
      data: { lu: true },
    });
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { user_id: userId, lu: false },
      data: { lu: true },
    });
  }

  private toDomain(prismaData: any): Notification {
    return new Notification(
      prismaData.id,
      prismaData.user_id,
      prismaData.titre,
      prismaData.message,
      prismaData.type as TypeNotification,
      prismaData.lu,
      prismaData.date_creation,
      prismaData.donnees_liees as Record<string, any> | null,
    );
  }
}
