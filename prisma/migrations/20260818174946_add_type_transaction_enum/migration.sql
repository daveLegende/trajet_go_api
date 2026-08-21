-- CreateEnum
CREATE TYPE "StatutTransaction" AS ENUM ('EN_ATTENTE', 'REUSSIE', 'ECHEC', 'REMBOURSEE');

-- CreateEnum
CREATE TYPE "TypeTransaction" AS ENUM ('CREDIT', 'DEBIT', 'REMBOURSEMENT', 'PAIEMENT_RESERVATION');

-- CreateTable
CREATE TABLE "portefeuilles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "solde" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_mise_a_jour" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portefeuilles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "portefeuille_id" TEXT NOT NULL,
    "reservation_id" TEXT,
    "type" "TypeTransaction" NOT NULL,
    "montant" DECIMAL(12,2) NOT NULL,
    "statut" "StatutTransaction" NOT NULL DEFAULT 'EN_ATTENTE',
    "cle_idempotence" TEXT NOT NULL,
    "description" TEXT,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_mise_a_jour" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "portefeuilles_user_id_key" ON "portefeuilles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_cle_idempotence_key" ON "transactions"("cle_idempotence");

-- CreateIndex
CREATE INDEX "transactions_portefeuille_id_idx" ON "transactions"("portefeuille_id");

-- CreateIndex
CREATE INDEX "transactions_cle_idempotence_idx" ON "transactions"("cle_idempotence");

-- AddForeignKey
ALTER TABLE "portefeuilles" ADD CONSTRAINT "portefeuilles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "utilisateurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_portefeuille_id_fkey" FOREIGN KEY ("portefeuille_id") REFERENCES "portefeuilles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
