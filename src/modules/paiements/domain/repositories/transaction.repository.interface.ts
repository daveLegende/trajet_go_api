import { TransactionEntity, TransactionStatus, TransactionType } from '../entities/transaction.entity';

export const TRANSACTION_REPOSITORY = 'TRANSACTION_REPOSITORY';

export interface CreateTransactionData {
  portefeuille_id: string;
  reservation_id?: string | null;
  type: TransactionType;
  montant: number;
  statut: TransactionStatus;
  cle_idempotence: string;
  description?: string | null;
}

export interface TransactionRepositoryInterface {
  create(data: CreateTransactionData): Promise<TransactionEntity>;
  findById(id: string): Promise<TransactionEntity | null>;
  findByPortefeuilleId(
    portefeuille_id: string,
    page: number,
    limit: number,
  ): Promise<{ data: TransactionEntity[]; total: number }>;
  findByIdempotenceKey(cle_idempotence: string): Promise<TransactionEntity | null>;
  updateStatut(id: string, statut: TransactionStatus): Promise<TransactionEntity>;
}
