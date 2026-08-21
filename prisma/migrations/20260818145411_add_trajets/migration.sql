-- CreateEnum
CREATE TYPE "TypeReservation" AS ENUM ('INSTANT', 'AVEC_APPROBATION');

-- CreateEnum
CREATE TYPE "StatutTrajet" AS ENUM ('OUVERT', 'COMPLET', 'ANNULE', 'TERMINE');

-- CreateTable
CREATE TABLE "trajets" (
    "id" TEXT NOT NULL,
    "conducteur_id" TEXT NOT NULL,
    "vehicule_id" TEXT NOT NULL,
    "ville_depart" TEXT NOT NULL,
    "ville_arrivee" TEXT NOT NULL,
    "latitude_depart" DOUBLE PRECISION NOT NULL,
    "longitude_depart" DOUBLE PRECISION NOT NULL,
    "latitude_arrivee" DOUBLE PRECISION NOT NULL,
    "longitude_arrivee" DOUBLE PRECISION NOT NULL,
    "date_depart" TIMESTAMP(3) NOT NULL,
    "heure_depart" TEXT NOT NULL,
    "places_disponibles" INTEGER NOT NULL,
    "prix_par_place" DECIMAL(10,2) NOT NULL,
    "type_reservation" "TypeReservation" NOT NULL DEFAULT 'INSTANT',
    "statut" "StatutTrajet" NOT NULL DEFAULT 'OUVERT',
    "recurrence" TEXT,
    "preferences" JSONB NOT NULL DEFAULT '{}',
    "description" TEXT,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_mise_a_jour" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trajets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "point_arrets" (
    "id" TEXT NOT NULL,
    "trajet_id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "ordre" INTEGER NOT NULL,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "point_arrets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "trajets_conducteur_id_idx" ON "trajets"("conducteur_id");

-- CreateIndex
CREATE INDEX "trajets_vehicule_id_idx" ON "trajets"("vehicule_id");

-- CreateIndex
CREATE INDEX "trajets_ville_depart_ville_arrivee_date_depart_idx" ON "trajets"("ville_depart", "ville_arrivee", "date_depart");

-- CreateIndex
CREATE INDEX "point_arrets_trajet_id_ordre_idx" ON "point_arrets"("trajet_id", "ordre");

-- AddForeignKey
ALTER TABLE "trajets" ADD CONSTRAINT "trajets_conducteur_id_fkey" FOREIGN KEY ("conducteur_id") REFERENCES "utilisateurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trajets" ADD CONSTRAINT "trajets_vehicule_id_fkey" FOREIGN KEY ("vehicule_id") REFERENCES "vehicules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "point_arrets" ADD CONSTRAINT "point_arrets_trajet_id_fkey" FOREIGN KEY ("trajet_id") REFERENCES "trajets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
