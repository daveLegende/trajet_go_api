import { Module } from '@nestjs/common';
import { AVIS_REPOSITORY } from './domain/repositories/avis.repository.interface';
import { PrismaAvisRepository } from './infrastructure/persistence/prisma-avis.repository';
import { LaisserAvisUseCase } from './application/use-cases/laisser-avis.use-case';
import { GetAvisCibleUseCase } from './application/use-cases/get-avis-cible.use-case';
import { AvisController } from './presentation/controllers/avis.controller';
import { UsersModule } from '../users/users.module';
import { TrajetsModule } from '../trajets/trajets.module';
import { ReservationsModule } from '../reservations/reservations.module';

@Module({
  imports: [UsersModule, TrajetsModule, ReservationsModule],
  controllers: [AvisController],
  providers: [
    {
      provide: AVIS_REPOSITORY,
      useClass: PrismaAvisRepository,
    },
    LaisserAvisUseCase,
    GetAvisCibleUseCase,
  ],
  exports: [AVIS_REPOSITORY],
})
export class AvisModule {}
