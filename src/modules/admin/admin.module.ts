import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infrastructure/database/prisma.module';
import { AdminController } from './presentation/controllers/admin.controller';
import { GetDashboardStatsUseCase } from './application/use-cases/get-dashboard-stats.use-case';
import { ManageUserUseCase } from './application/use-cases/manage-user.use-case';
import { ResolveSignalementUseCase } from './application/use-cases/resolve-signalement.use-case';

@Module({
  imports: [PrismaModule],
  controllers: [AdminController],
  providers: [
    GetDashboardStatsUseCase,
    ManageUserUseCase,
    ResolveSignalementUseCase,
  ],
})
export class AdminModule {}
