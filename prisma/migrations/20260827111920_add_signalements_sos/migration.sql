-- CreateEnum
CREATE TYPE "MotifSignalement" AS ENUM ('COMPORTEMENT_INAPPROPRIE', 'CONDUITE_DANGEREUSE', 'RETARD_EXCESSIF', 'AUTRE');

-- CreateEnum
CREATE TYPE "StatutSignalement" AS ENUM ('EN_ATTENTE', 'EN_COURS', 'RESOLU', 'REJETE');

-- CreateEnum
CREATE TYPE "StatutAlerteSos" AS ENUM ('ACTIVE', 'PRISE_EN_CHARGE', 'RESOLUE', 'FAUSSE_ALERTE');

-- CreateTable
CREATE TABLE "signalements" (
    "id" TEXT NOT NULL,
    "auteur_id" TEXT NOT NULL,
    "cible_id" TEXT NOT NULL,
    "trajet_id" TEXT,
    "motif" "MotifSignalement" NOT NULL,
    "description" TEXT,
    "statut" "StatutSignalement" NOT NULL DEFAULT 'EN_ATTENTE',
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_mise_a_jour" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "signalements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alertes_sos" (
    "id" TEXT NOT NULL,
    "utilisateur_id" TEXT NOT NULL,
    "trajet_id" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "statut" "StatutAlerteSos" NOT NULL DEFAULT 'ACTIVE',
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_mise_a_jour" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "alertes_sos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "signalements_auteur_id_idx" ON "signalements"("auteur_id");

-- CreateIndex
CREATE INDEX "signalements_cible_id_idx" ON "signalements"("cible_id");

-- CreateIndex
CREATE INDEX "signalements_trajet_id_idx" ON "signalements"("trajet_id");

-- CreateIndex
CREATE INDEX "alertes_sos_utilisateur_id_idx" ON "alertes_sos"("utilisateur_id");

-- CreateIndex
CREATE INDEX "alertes_sos_trajet_id_idx" ON "alertes_sos"("trajet_id");

-- AddForeignKey
ALTER TABLE "signalements" ADD CONSTRAINT "signalements_auteur_id_fkey" FOREIGN KEY ("auteur_id") REFERENCES "utilisateurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "signalements" ADD CONSTRAINT "signalements_cible_id_fkey" FOREIGN KEY ("cible_id") REFERENCES "utilisateurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "signalements" ADD CONSTRAINT "signalements_trajet_id_fkey" FOREIGN KEY ("trajet_id") REFERENCES "trajets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alertes_sos" ADD CONSTRAINT "alertes_sos_utilisateur_id_fkey" FOREIGN KEY ("utilisateur_id") REFERENCES "utilisateurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alertes_sos" ADD CONSTRAINT "alertes_sos_trajet_id_fkey" FOREIGN KEY ("trajet_id") REFERENCES "trajets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
