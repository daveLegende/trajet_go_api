-- CreateEnum
CREATE TYPE "StatutReservation" AS ENUM ('EN_ATTENTE', 'ACCEPTEE', 'REFUSEE', 'ANNULEE');

-- CreateTable
CREATE TABLE "reservations" (
    "id" TEXT NOT NULL,
    "trajet_id" TEXT NOT NULL,
    "passager_id" TEXT NOT NULL,
    "statut" "StatutReservation" NOT NULL DEFAULT 'EN_ATTENTE',
    "places_reservees" INTEGER NOT NULL DEFAULT 1,
    "montant_total" DECIMAL(10,2) NOT NULL,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_mise_a_jour" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reservations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "reservations_trajet_id_idx" ON "reservations"("trajet_id");

-- CreateIndex
CREATE INDEX "reservations_passager_id_idx" ON "reservations"("passager_id");

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_trajet_id_fkey" FOREIGN KEY ("trajet_id") REFERENCES "trajets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_passager_id_fkey" FOREIGN KEY ("passager_id") REFERENCES "utilisateurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
