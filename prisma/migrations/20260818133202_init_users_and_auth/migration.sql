-- CreateEnum
CREATE TYPE "StatutVerificationVehicule" AS ENUM ('NON_VERIFIE', 'EN_ATTENTE', 'VERIFIE', 'REJETE');

-- AlterTable
ALTER TABLE "utilisateurs" ADD COLUMN     "date_derniere_deconnexion" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "vehicules" (
    "id" TEXT NOT NULL,
    "proprietaire_id" TEXT NOT NULL,
    "marque" TEXT NOT NULL,
    "modele" TEXT NOT NULL,
    "couleur" TEXT NOT NULL,
    "immatriculation" TEXT NOT NULL,
    "nombre_places" INTEGER NOT NULL,
    "annee" INTEGER NOT NULL,
    "carte_grise_url" TEXT,
    "assurance_url" TEXT,
    "date_expiration_assurance" TIMESTAMP(3),
    "statut_verification" "StatutVerificationVehicule" NOT NULL DEFAULT 'EN_ATTENTE',
    "photos" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_mise_a_jour" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vehicules_immatriculation_key" ON "vehicules"("immatriculation");

-- CreateIndex
CREATE INDEX "vehicules_proprietaire_id_idx" ON "vehicules"("proprietaire_id");

-- AddForeignKey
ALTER TABLE "vehicules" ADD CONSTRAINT "vehicules_proprietaire_id_fkey" FOREIGN KEY ("proprietaire_id") REFERENCES "utilisateurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
