import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { CreateTrajetDto } from '../../application/dto/create-trajet.dto';
import { TrajetResponseDto } from '../../application/dto/trajet-response.dto';
import { CancelTrajetUseCase } from '../../application/use-cases/cancel-trajet.use-case';
import { CreateTrajetUseCase } from '../../application/use-cases/create-trajet.use-case';
import { GetTrajetByIdUseCase } from '../../application/use-cases/get-trajet-by-id.use-case';
import { ListTrajetsUseCase } from '../../application/use-cases/list-trajets.use-case';

@ApiTags('Trajets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('trajets')
export class TrajetsController {
  constructor(
    private readonly createTrajetUseCase: CreateTrajetUseCase,
    private readonly listTrajetsUseCase: ListTrajetsUseCase,
    private readonly getTrajetByIdUseCase: GetTrajetByIdUseCase,
    private readonly cancelTrajetUseCase: CancelTrajetUseCase,
  ) {}

  @Post()
  @Roles('CONDUCTEUR', 'LES_DEUX', 'ADMIN')
  @ApiOperation({ summary: 'Créer un trajet' })
  @ApiResponse({ status: 201, description: 'Trajet créé', type: TrajetResponseDto })
  async create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateTrajetDto,
  ): Promise<TrajetResponseDto> {
    return this.createTrajetUseCase.execute(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Rechercher des trajets' })
  @ApiQuery({ name: 'ville_depart', required: false, type: String })
  @ApiQuery({ name: 'ville_arrivee', required: false, type: String })
  @ApiQuery({ name: 'date_depart', required: false, type: String })
  @ApiQuery({ name: 'places_disponibles', required: false, type: Number })
  async list(
    @Query('ville_depart') ville_depart?: string,
    @Query('ville_arrivee') ville_arrivee?: string,
    @Query('date_depart') date_depart?: string,
    @Query('places_disponibles') places_disponibles?: string,
  ): Promise<TrajetResponseDto[]> {
    return this.listTrajetsUseCase.execute({
      ville_depart,
      ville_arrivee,
      date_depart: date_depart ? new Date(date_depart) : undefined,
      places_disponibles: places_disponibles !== undefined ? Number(places_disponibles) : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détail d’un trajet' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async getById(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('type_utilisateur') role: string,
  ): Promise<TrajetResponseDto> {
    return this.getTrajetByIdUseCase.execute(id, userId, role);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Annuler un trajet' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('type_utilisateur') role: string,
  ): Promise<void> {
    await this.cancelTrajetUseCase.execute(id, userId, role);
  }
}
