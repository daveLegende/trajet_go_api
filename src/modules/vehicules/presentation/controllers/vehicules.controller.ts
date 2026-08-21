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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { CreateVehiculeDto } from '../../application/dto/create-vehicule.dto';
import { UpdateVehiculeDto } from '../../application/dto/update-vehicule.dto';
import { VehiculeResponseDto } from '../../application/dto/vehicule-response.dto';
import { VerifyVehiculeDto } from '../../application/dto/verify-vehicule.dto';
import { CreateVehiculeUseCase } from '../../application/use-cases/create-vehicule.use-case';
import { DeleteVehiculeUseCase } from '../../application/use-cases/delete-vehicule.use-case';
import { GetMyVehiculesUseCase } from '../../application/use-cases/get-my-vehicules.use-case';
import { GetVehiculeByIdUseCase } from '../../application/use-cases/get-vehicule-by-id.use-case';
import { UpdateVehiculeUseCase } from '../../application/use-cases/update-vehicule.use-case';
import { VerifyVehiculeUseCase } from '../../application/use-cases/verify-vehicule.use-case';

@ApiTags('Vehicules')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('vehicules')
export class VehiculesController {
  constructor(
    private readonly createVehiculeUseCase: CreateVehiculeUseCase,
    private readonly getMyVehiculesUseCase: GetMyVehiculesUseCase,
    private readonly getVehiculeByIdUseCase: GetVehiculeByIdUseCase,
    private readonly updateVehiculeUseCase: UpdateVehiculeUseCase,
    private readonly deleteVehiculeUseCase: DeleteVehiculeUseCase,
    private readonly verifyVehiculeUseCase: VerifyVehiculeUseCase,
  ) {}

  @Post()
  @Roles('CONDUCTEUR', 'LES_DEUX', 'ADMIN')
  @ApiOperation({ summary: 'Ajouter un nouveau véhicule' })
  @ApiResponse({ status: 201, description: 'Véhicule créé avec succès', type: VehiculeResponseDto })
  @ApiResponse({ status: 400, description: 'Immatriculation déjà utilisée ou données invalides' })
  @ApiResponse({ status: 403, description: 'Réservé aux conducteurs' })
  async create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateVehiculeDto,
  ): Promise<VehiculeResponseDto> {
    return this.createVehiculeUseCase.execute(userId, dto);
  }

  @Get('my')
  @ApiOperation({ summary: 'Lister mes véhicules' })
  @ApiResponse({ status: 200, description: 'Liste des véhicules du conducteur', type: [VehiculeResponseDto] })
  async getMyVehicules(
    @CurrentUser('id') userId: string,
  ): Promise<VehiculeResponseDto[]> {
    return this.getMyVehiculesUseCase.execute(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détail d\'un véhicule (propriétaire ou admin)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, type: VehiculeResponseDto })
  @ApiResponse({ status: 403, description: 'Accès refusé' })
  @ApiResponse({ status: 404, description: 'Véhicule introuvable' })
  async getById(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('type_utilisateur') role: string,
  ): Promise<VehiculeResponseDto> {
    return this.getVehiculeByIdUseCase.execute(id, userId, role);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modifier un véhicule (propriétaire uniquement)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, type: VehiculeResponseDto })
  @ApiResponse({ status: 403, description: 'Accès refusé' })
  @ApiResponse({ status: 404, description: 'Véhicule introuvable' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateVehiculeDto,
  ): Promise<VehiculeResponseDto> {
    return this.updateVehiculeUseCase.execute(id, userId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un véhicule (propriétaire ou admin)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Véhicule supprimé avec succès' })
  @ApiResponse({ status: 403, description: 'Accès refusé' })
  @ApiResponse({ status: 404, description: 'Véhicule introuvable' })
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('type_utilisateur') role: string,
  ): Promise<void> {
    return this.deleteVehiculeUseCase.execute(id, userId, role);
  }

  @Patch(':id/verify')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Valider ou rejeter un véhicule (Admin uniquement)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Statut mis à jour', type: VehiculeResponseDto })
  @ApiResponse({ status: 400, description: 'Motif requis si rejet' })
  @ApiResponse({ status: 403, description: 'Accès réservé aux admins' })
  @ApiResponse({ status: 404, description: 'Véhicule introuvable' })
  async verify(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: VerifyVehiculeDto,
  ): Promise<VehiculeResponseDto> {
    return this.verifyVehiculeUseCase.execute(id, dto);
  }
}
