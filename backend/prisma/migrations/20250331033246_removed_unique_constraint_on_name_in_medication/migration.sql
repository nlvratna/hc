/*
  Warnings:

  - A unique constraint covering the columns `[name,healthRecordId]` on the table `medication` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "medication_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "medication_name_healthRecordId_key" ON "medication"("name", "healthRecordId");
