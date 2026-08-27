import { Module } from '@nestjs/common';
import { SignalementsController } from './presentation/controllers/signalements.controller';
import { AlertesSosController } from './presentation/controllers/alertes-sos.controller';
import { CreerSignalementUseCase } from './application/use-cases/creer-signalement.use-case';
import { DeclencherSosUseCase } from './application/use-cases/declencher-sos.use-case';
import { PrismaSignalementRepository } from './infrastructure/persistence/prisma-signalement.repository';
import { PrismaAlerteSosRepository } from './infrastructure/persistence/prisma-alerte-sos.repository';
import { SIGNALEMENT_REPOSITORY, ALERTE_SOS_REPOSITORY } from './domain/repositories/signalements.repository';
import { PrismaModule } from '../../infrastructure/database/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, NotificationsModule],
  controllers: [SignalementsController, AlertesSosController],
  providers: [
    { provide: SIGNALEMENT_REPOSITORY, useClass: PrismaSignalementRepository },
    { provide: ALERTE_SOS_REPOSITORY, useClass: PrismaAlerteSosRepository },
    CreerSignalementUseCase,
    DeclencherSosUseCase,
  ],
  exports: [SIGNALEMENT_REPOSITORY, ALERTE_SOS_REPOSITORY],
})
export class SignalementsModule {}
