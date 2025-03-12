/*
  Warnings:

  - You are about to drop the `Symptoms` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `age` to the `health_record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `health_record` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Symptoms" DROP CONSTRAINT "Symptoms_healthRecordId_fkey";

-- AlterTable
ALTER TABLE "health_record" ADD COLUMN     "age" INTEGER NOT NULL,
ADD COLUMN     "familyHistory" TEXT[],
ADD COLUMN     "gender" TEXT NOT NULL;

-- DropTable
DROP TABLE "Symptoms";

-- CreateTable
CREATE TABLE "medication" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "reportedAt" TIMESTAMP(3) NOT NULL,
    "prescription" TEXT NOT NULL,
    "healthRecordId" INTEGER NOT NULL,

    CONSTRAINT "medication_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "medication" ADD CONSTRAINT "medication_healthRecordId_fkey" FOREIGN KEY ("healthRecordId") REFERENCES "health_record"("id") ON DELETE CASCADE ON UPDATE CASCADE;
