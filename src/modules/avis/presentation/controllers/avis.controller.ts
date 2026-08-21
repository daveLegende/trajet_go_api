import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { CreateAvisDto } from '../../application/dto/create-avis.dto';
import { AvisResponseDto } from '../../application/dto/avis-response.dto';
import { LaisserAvisUseCase } from '../../application/use-cases/laisser-avis.use-case';
import { GetAvisCibleUseCase } from '../../application/use-cases/get-avis-cible.use-case';

@ApiTags('Avis')
@Controller('avis')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AvisController {
  constructor(
    private readonly laisserAvisUseCase: LaisserAvisUseCase,
    private readonly getAvisCibleUseCase: GetAvisCibleUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Laisser un avis',
    description: 'Laisser un avis sur un conducteur ou un passager après un trajet.',
  })
  @ApiResponse({ status: 201, description: 'Avis enregistré avec succès', type: AvisResponseDto })
  async createAvis(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateAvisDto,
  ): Promise<AvisResponseDto> {
    return this.laisserAvisUseCase.execute(userId, dto);
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: 'Obtenir les avis reçus par un utilisateur',
  })
  @ApiParam({ name: 'userId', type: 'string', format: 'uuid' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  async getAvisUser(
    @Param('userId', ParseUUIDPipe) cibleId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.getAvisCibleUseCase.execute(cibleId, page, limit);
  }
}
