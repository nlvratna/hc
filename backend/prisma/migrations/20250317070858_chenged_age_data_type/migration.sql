/*
  Warnings:

  - Changed the type of `age` on the `health_record` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "medication" DROP CONSTRAINT "medication_healthRecordId_fkey";

-- AlterTable
ALTER TABLE "health_record" DROP COLUMN "age",
ADD COLUMN     "age" DATE NOT NULL;

-- AddForeignKey
ALTER TABLE "medication" ADD CONSTRAINT "medication_healthRecordId_fkey" FOREIGN KEY ("healthRecordId") REFERENCES "health_record"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
