-- CreateTable
CREATE TABLE "health_record" (
    "id" SERIAL NOT NULL,
    "Symptoms" TEXT[],
    "userId" INTEGER NOT NULL,

    CONSTRAINT "health_record_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "health_record_userId_key" ON "health_record"("userId");

-- AddForeignKey
ALTER TABLE "health_record" ADD CONSTRAINT "health_record_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
