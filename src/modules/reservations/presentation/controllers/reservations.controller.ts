import { Controller, Post, Body, Param, UseGuards, Get, Put, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { CreateReservationDto } from '../../application/dto/create-reservation.dto';
import { CreateReservationUseCase } from '../../application/use-cases/create-reservation.use-case';
import { AcceptReservationUseCase } from '../../application/use-cases/accept-reservation.use-case';
import { RejectReservationUseCase } from '../../application/use-cases/reject-reservation.use-case';
import { CancelReservationUseCase } from '../../application/use-cases/cancel-reservation.use-case';
import { GetMyReservationsUseCase } from '../../application/use-cases/get-my-reservations.use-case';

@ApiTags('Reservations')
@Controller('reservations')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ReservationsController {
  constructor(
    private readonly createReservationUseCase: CreateReservationUseCase,
    private readonly acceptReservationUseCase: AcceptReservationUseCase,
    private readonly rejectReservationUseCase: RejectReservationUseCase,
    private readonly cancelReservationUseCase: CancelReservationUseCase,
    private readonly getMyReservationsUseCase: GetMyReservationsUseCase,
  ) {}

  @Post()
  @Roles('PASSAGER', 'LES_DEUX')
  @ApiOperation({ summary: 'Créer une réservation (passager)' })
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateReservationDto) {
    return this.createReservationUseCase.execute(userId, dto);
  }

  @Get('my')
  @Roles('PASSAGER', 'LES_DEUX')
  @ApiOperation({ summary: 'Obtenir mes réservations' })
  async getMyReservations(@CurrentUser('id') userId: string) {
    return this.getMyReservationsUseCase.execute(userId);
  }

  @Put(':id/accept')
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @Roles('CONDUCTEUR', 'LES_DEUX')
  @ApiOperation({ summary: 'Accepter une réservation (conducteur)' })
  async accept(@CurrentUser('id') userId: string, @Param('id', ParseUUIDPipe) id: string) {
    return this.acceptReservationUseCase.execute(id, userId);
  }

  @Put(':id/reject')
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @Roles('CONDUCTEUR', 'LES_DEUX')
  @ApiOperation({ summary: 'Refuser une réservation (conducteur)' })
  async reject(@CurrentUser('id') userId: string, @Param('id', ParseUUIDPipe) id: string) {
    return this.rejectReservationUseCase.execute(id, userId);
  }

  @Put(':id/cancel')
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @Roles('PASSAGER', 'LES_DEUX')
  @ApiOperation({ summary: 'Annuler une réservation (passager)' })
  async cancel(@CurrentUser('id') userId: string, @Param('id', ParseUUIDPipe) id: string) {
    return this.cancelReservationUseCase.execute(id, userId);
  }
}
