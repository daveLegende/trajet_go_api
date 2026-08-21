import { Module } from '@nestjs/common';
import { PORTEFEUILLE_REPOSITORY } from './domain/repositories/portefeuille.repository.interface';
import { TRANSACTION_REPOSITORY } from './domain/repositories/transaction.repository.interface';
import { PAYMENT_PROVIDER } from './domain/ports/paiement-provider.port';
import { PrismaPortefeuilleRepository } from './infrastructure/persistence/prisma-portefeuille.repository';
import { PrismaTransactionRepository } from './infrastructure/persistence/prisma-transaction.repository';
import { MockPaymentProvider } from './infrastructure/providers/mock-payment.provider';
import { GetOrCreatePortefeuilleUseCase } from './application/use-cases/get-or-create-portefeuille.use-case';
import { CreditPortefeuilleUseCase } from './application/use-cases/credit-portefeuille.use-case';
import { PayerReservationUseCase } from './application/use-cases/payer-reservation.use-case';
import { GetHistoriqueTransactionsUseCase } from './application/use-cases/get-historique-transactions.use-case';
import { GetTransactionByIdUseCase } from './application/use-cases/get-transaction-by-id.use-case';
import { RemboursementUseCase } from './application/use-cases/remboursement.use-case';
import { PaiementsController } from './presentation/controllers/paiements.controller';
import { ReservationsModule } from '../reservations/reservations.module';

@Module({
  imports: [ReservationsModule],
  controllers: [PaiementsController],
  providers: [
    {
      provide: PORTEFEUILLE_REPOSITORY,
      useClass: PrismaPortefeuilleRepository,
    },
    {
      provide: TRANSACTION_REPOSITORY,
      useClass: PrismaTransactionRepository,
    },
    {
      provide: PAYMENT_PROVIDER,
      useClass: MockPaymentProvider,
    },
    GetOrCreatePortefeuilleUseCase,
    CreditPortefeuilleUseCase,
    PayerReservationUseCase,
    GetHistoriqueTransactionsUseCase,
    GetTransactionByIdUseCase,
    RemboursementUseCase,
  ],
  exports: [PORTEFEUILLE_REPOSITORY, TRANSACTION_REPOSITORY],
})
export class PaiementsModule {}
