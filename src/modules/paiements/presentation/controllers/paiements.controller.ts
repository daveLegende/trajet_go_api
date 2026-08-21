import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  ParseIntPipe,
  DefaultValuePipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { GetOrCreatePortefeuilleUseCase } from '../../application/use-cases/get-or-create-portefeuille.use-case';
import { CreditPortefeuilleUseCase } from '../../application/use-cases/credit-portefeuille.use-case';
import { PayerReservationUseCase } from '../../application/use-cases/payer-reservation.use-case';
import { GetHistoriqueTransactionsUseCase } from '../../application/use-cases/get-historique-transactions.use-case';
import { GetTransactionByIdUseCase } from '../../application/use-cases/get-transaction-by-id.use-case';
import { RemboursementUseCase } from '../../application/use-cases/remboursement.use-case';
import { CreditPortefeuilleDto } from '../../application/dto/credit-portefeuille.dto';
import { PayerReservationDto } from '../../application/dto/payer-reservation.dto';
import { RemboursementDto } from '../../application/dto/remboursement.dto';
import { PortefeuilleResponseDto } from '../../application/dto/portefeuille-response.dto';
import { TransactionResponseDto } from '../../application/dto/transaction-response.dto';

@ApiTags('Paiements')
@Controller('paiements')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PaiementsController {
  constructor(
    private readonly getOrCreatePortefeuilleUseCase: GetOrCreatePortefeuilleUseCase,
    private readonly creditPortefeuilleUseCase: CreditPortefeuilleUseCase,
    private readonly payerReservationUseCase: PayerReservationUseCase,
    private readonly getHistoriqueTransactionsUseCase: GetHistoriqueTransactionsUseCase,
    private readonly getTransactionByIdUseCase: GetTransactionByIdUseCase,
    private readonly remboursementUseCase: RemboursementUseCase,
  ) {}

  // ─── Mon portefeuille ─────────────────────────────────────────────────────

  @Get('portefeuille')
  @ApiOperation({
    summary: 'Consulter mon portefeuille',
    description:
      "Retourne le portefeuille de l'utilisateur connecté. Le crée automatiquement s'il n'existe pas encore.",
  })
  @ApiResponse({ status: 200, description: 'Portefeuille retourné', type: PortefeuilleResponseDto })
  async getPortefeuille(@CurrentUser('id') userId: string): Promise<PortefeuilleResponseDto> {
    return this.getOrCreatePortefeuilleUseCase.execute(userId);
  }

  // ─── Recharger ────────────────────────────────────────────────────────────

  @Post('credit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Recharger mon portefeuille (Mobile Money simulé)',
    description:
      "Crédite le portefeuille via un fournisseur Mobile Money. Idempotent : rejouer la même clé retourne la transaction existante sans double débit.",
  })
  @ApiResponse({ status: 200, description: 'Portefeuille crédité', type: TransactionResponseDto })
  async credit(
    @CurrentUser('id') userId: string,
    @Body() dto: CreditPortefeuilleDto,
  ): Promise<TransactionResponseDto> {
    return this.creditPortefeuilleUseCase.execute(userId, dto);
  }

  // ─── Payer une réservation ────────────────────────────────────────────────

  @Post('payer')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Payer une réservation via le portefeuille',
    description:
      "Débite le portefeuille du passager pour payer une réservation. Idempotent via la clé d'idempotence.",
  })
  @ApiResponse({ status: 200, description: 'Paiement effectué', type: TransactionResponseDto })
  async payer(
    @CurrentUser('id') userId: string,
    @Body() dto: PayerReservationDto,
  ): Promise<TransactionResponseDto> {
    return this.payerReservationUseCase.execute(userId, dto);
  }

  // ─── Historique ───────────────────────────────────────────────────────────

  @Get('transactions')
  @ApiOperation({ summary: 'Historique de mes transactions (paginé)' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiResponse({ status: 200, description: 'Historique retourné' })
  async getHistorique(
    @CurrentUser('id') userId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.getHistoriqueTransactionsUseCase.execute(userId, page, limit);
  }

  @Get('transactions/:id')
  @ApiOperation({ summary: "Détail d'une transaction" })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Transaction retournée', type: TransactionResponseDto })
  async getTransaction(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<TransactionResponseDto> {
    return this.getTransactionByIdUseCase.execute(userId, id);
  }

  // ─── Admin : Remboursement ─────────────────────────────────────────────────

  @Post('admin/remboursement')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '[ADMIN] Rembourser une transaction',
    description:
      "Crédite le portefeuille du passager et marque la transaction originale comme REMBOURSEE.",
  })
  @ApiResponse({ status: 200, description: 'Remboursement effectué', type: TransactionResponseDto })
  async remboursement(@Body() dto: RemboursementDto): Promise<TransactionResponseDto> {
    return this.remboursementUseCase.execute(dto);
  }
}
