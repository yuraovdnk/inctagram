-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "location" TEXT,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);
