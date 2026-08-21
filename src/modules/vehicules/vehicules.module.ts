import { Module } from '@nestjs/common';
import { VEHICULE_REPOSITORY } from './domain/repositories/vehicule.repository.interface';
import { PrismaVehiculeRepository } from './infrastructure/persistence/prisma-vehicule.repository';
import { CreateVehiculeUseCase } from './application/use-cases/create-vehicule.use-case';
import { GetMyVehiculesUseCase } from './application/use-cases/get-my-vehicules.use-case';
import { GetVehiculeByIdUseCase } from './application/use-cases/get-vehicule-by-id.use-case';
import { UpdateVehiculeUseCase } from './application/use-cases/update-vehicule.use-case';
import { DeleteVehiculeUseCase } from './application/use-cases/delete-vehicule.use-case';
import { VerifyVehiculeUseCase } from './application/use-cases/verify-vehicule.use-case';
import { VehiculesController } from './presentation/controllers/vehicules.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [VehiculesController],
  providers: [
    {
      provide: VEHICULE_REPOSITORY,
      useClass: PrismaVehiculeRepository,
    },
    CreateVehiculeUseCase,
    GetMyVehiculesUseCase,
    GetVehiculeByIdUseCase,
    UpdateVehiculeUseCase,
    DeleteVehiculeUseCase,
    VerifyVehiculeUseCase,
  ],
  exports: [VEHICULE_REPOSITORY],
})
export class VehiculesModule {}
