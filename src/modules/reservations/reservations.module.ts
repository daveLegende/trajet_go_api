import { Module } from '@nestjs/common';
import { RESERVATION_REPOSITORY } from './domain/repositories/reservation.repository.interface';
import { ReservationPrismaRepository } from './infrastructure/persistence/reservation.prisma.repository';
import { CreateReservationUseCase } from './application/use-cases/create-reservation.use-case';
import { AcceptReservationUseCase } from './application/use-cases/accept-reservation.use-case';
import { RejectReservationUseCase } from './application/use-cases/reject-reservation.use-case';
import { CancelReservationUseCase } from './application/use-cases/cancel-reservation.use-case';
import { GetMyReservationsUseCase } from './application/use-cases/get-my-reservations.use-case';
import { ReservationsController } from './presentation/controllers/reservations.controller';
import { TrajetsModule } from '../trajets/trajets.module';

@Module({
  imports: [TrajetsModule],
  controllers: [ReservationsController],
  providers: [
    {
      provide: RESERVATION_REPOSITORY,
      useClass: ReservationPrismaRepository,
    },
    CreateReservationUseCase,
    AcceptReservationUseCase,
    RejectReservationUseCase,
    CancelReservationUseCase,
    GetMyReservationsUseCase,
  ],
  exports: [
    RESERVATION_REPOSITORY,
  ],
})
export class ReservationsModule {}
