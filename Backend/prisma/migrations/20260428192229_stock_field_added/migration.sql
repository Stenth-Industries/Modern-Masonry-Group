-- AlterTable
ALTER TABLE "Variant" ADD COLUMN     "imagesUrl" TEXT[],
ADD COLUMN     "stock" TEXT DEFAULT 'In Stock';

-- CreateTable
CREATE TABLE "Quote" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT,
    "quantity" TEXT,
    "details" TEXT,
    "productId" TEXT,
    "isGeneral" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);
