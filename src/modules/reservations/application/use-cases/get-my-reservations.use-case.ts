import { Injectable, Inject } from '@nestjs/common';
import { RESERVATION_REPOSITORY, ReservationRepositoryInterface } from '../../domain/repositories/reservation.repository.interface';

@Injectable()
export class GetMyReservationsUseCase {
  constructor(
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: ReservationRepositoryInterface,
  ) {}

  async execute(passager_id: string) {
    return this.reservationRepository.findByPassagerId(passager_id);
  }
}
