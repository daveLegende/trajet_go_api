import { Module } from '@nestjs/common';
import { TRAJET_REPOSITORY } from './domain/repositories/trajet.repository.interface';
import { PrismaTrajetRepository } from './infrastructure/persistence/prisma-trajet.repository';
import { CreateTrajetUseCase } from './application/use-cases/create-trajet.use-case';
import { ListTrajetsUseCase } from './application/use-cases/list-trajets.use-case';
import { GetTrajetByIdUseCase } from './application/use-cases/get-trajet-by-id.use-case';
import { CancelTrajetUseCase } from './application/use-cases/cancel-trajet.use-case';
import { TrajetsController } from './presentation/controllers/trajets.controller';
import { UsersModule } from '../users/users.module';
import { VehiculesModule } from '../vehicules/vehicules.module';

@Module({
  imports: [UsersModule, VehiculesModule],
  controllers: [TrajetsController],
  providers: [
    {
      provide: TRAJET_REPOSITORY,
      useClass: PrismaTrajetRepository,
    },
    CreateTrajetUseCase,
    ListTrajetsUseCase,
    GetTrajetByIdUseCase,
    CancelTrajetUseCase,
  ],
  exports: [TRAJET_REPOSITORY],
})
export class TrajetsModule {}
