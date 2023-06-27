-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUDO', 'MANAGER', 'ADMIN', 'USER');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';
