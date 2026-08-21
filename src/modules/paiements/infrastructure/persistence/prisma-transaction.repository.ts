import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';
import {
  TransactionRepositoryInterface,
  CreateTransactionData,
} from '../../domain/repositories/transaction.repository.interface';
import { TransactionEntity, TransactionStatus } from '../../domain/entities/transaction.entity';
import { TransactionMapper } from '../mappers/transaction.mapper';

@Injectable()
export class PrismaTransactionRepository implements TransactionRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTransactionData): Promise<TransactionEntity> {
    const transaction = await this.prisma.transaction.create({
      data: {
        portefeuille_id: data.portefeuille_id,
        reservation_id: data.reservation_id ?? null,
        type: data.type as any,
        montant: data.montant,
        statut: data.statut as any,
        cle_idempotence: data.cle_idempotence,
        description: data.description ?? null,
      },
    });
    return TransactionMapper.toDomain(transaction);
  }

  async findById(id: string): Promise<TransactionEntity | null> {
    const transaction = await this.prisma.transaction.findUnique({ where: { id } });
    return transaction ? TransactionMapper.toDomain(transaction) : null;
  }

  async findByPortefeuilleId(
    portefeuille_id: string,
    page: number,
    limit: number,
  ): Promise<{ data: TransactionEntity[]; total: number }> {
    const skip = (page - 1) * limit;

    const [transactions, total] = await this.prisma.$transaction([
      this.prisma.transaction.findMany({
        where: { portefeuille_id },
        orderBy: { date_creation: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.transaction.count({ where: { portefeuille_id } }),
    ]);

    return {
      data: transactions.map(TransactionMapper.toDomain),
      total,
    };
  }

  async findByIdempotenceKey(cle_idempotence: string): Promise<TransactionEntity | null> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { cle_idempotence },
    });
    return transaction ? TransactionMapper.toDomain(transaction) : null;
  }

  async updateStatut(id: string, statut: TransactionStatus): Promise<TransactionEntity> {
    const transaction = await this.prisma.transaction.update({
      where: { id },
      data: { statut: statut as any },
    });
    return TransactionMapper.toDomain(transaction);
  }
}
