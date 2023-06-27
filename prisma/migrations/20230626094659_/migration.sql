-- CreateTable
CREATE TABLE "ApprovedSubnet" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" SERIAL NOT NULL,
    "subnet" TEXT NOT NULL,
    "city" TEXT,
    "region" TEXT,
    "timezone" TEXT,
    "countryCode" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ApprovedSubnet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ApprovedSubnet_userId_idx" ON "ApprovedSubnet"("userId");

-- AddForeignKey
ALTER TABLE "ApprovedSubnet" ADD CONSTRAINT "ApprovedSubnet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
