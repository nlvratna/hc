/*
  Warnings:

  - You are about to drop the column `Symptoms` on the `health_record` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "health_record" DROP COLUMN "Symptoms";

-- CreateTable
CREATE TABLE "Symptoms" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "reportedAt" TIMESTAMP(3) NOT NULL,
    "healthRecordId" INTEGER NOT NULL,

    CONSTRAINT "Symptoms_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Symptoms" ADD CONSTRAINT "Symptoms_healthRecordId_fkey" FOREIGN KEY ("healthRecordId") REFERENCES "health_record"("id") ON DELETE CASCADE ON UPDATE CASCADE;
