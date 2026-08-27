import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { App, initializeApp, getApps, cert } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import * as path from 'path';
import * as fs from 'fs';
import { PushNotificationPort, PushNotificationPayload } from '../../domain/repositories/notifications.repository';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';

@Injectable()
export class FcmPushNotificationAdapter implements PushNotificationPort, OnModuleInit {
  private readonly logger = new Logger(FcmPushNotificationAdapter.name);
  private firebaseApp: App | null = null;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  onModuleInit() {
    const serviceAccountPath = path.resolve(process.cwd(), 'firebase-adminsdk.json');

    if (!fs.existsSync(serviceAccountPath)) {
      this.logger.warn(
        'firebase-adminsdk.json introuvable à la racine du projet. ' +
          'Les notifications push FCM sont désactivées.',
      );
      return;
    }

    try {
      const existingApps = getApps();
      if (existingApps.length === 0) {
        const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));
        this.firebaseApp = initializeApp({ credential: cert(serviceAccount) });
        this.logger.log('Firebase Admin SDK initialisé avec succès.');
      } else {
        this.firebaseApp = existingApps[0];
        this.logger.log('Firebase Admin SDK déjà initialisé, instance récupérée.');
      }
    } catch (err: any) {
      this.logger.error(
        "Erreur lors de l'initialisation de Firebase Admin SDK :",
        err.message,
      );
    }
  }

  async send(payload: PushNotificationPayload): Promise<void> {
    if (!this.firebaseApp) {
      this.logger.warn(
        `[FCM] SDK non initialisé. Notification ignorée pour userId=${payload.userId}`,
      );
      return;
    }

    // Récupère le fcm_token du device depuis la DB
    const user = await this.prisma.user.findUnique({
      where: { id: payload.userId },
      select: { fcm_token: true },
    });

    if (!user?.fcm_token) {
      this.logger.debug(
        `[FCM] Aucun token FCM enregistré pour userId=${payload.userId}. Notification ignorée.`,
      );
      return;
    }

    try {
      await getMessaging(this.firebaseApp).send({
        token: user.fcm_token,
        notification: {
          title: payload.titre,
          body: payload.message,
        },
        data: payload.data ?? {},
        android: {
          priority: 'high',
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
            },
          },
        },
      });
      this.logger.log(`[FCM] Push envoyé avec succès pour userId=${payload.userId}`);
    } catch (err: any) {
      this.logger.error(`[FCM] Erreur d'envoi pour userId=${payload.userId}: ${err.message}`);
      // Si le token est invalide/expiré, on le supprime
      if (err.code === 'messaging/invalid-registration-token' ||
          err.code === 'messaging/registration-token-not-registered') {
        await this.prisma.user.update({
          where: { id: payload.userId },
          data: { fcm_token: null },
        });
        this.logger.warn(`[FCM] Token invalide supprimé pour userId=${payload.userId}`);
      }
    }
  }
}
