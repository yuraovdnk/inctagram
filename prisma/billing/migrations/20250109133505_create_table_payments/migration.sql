-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payments_username_key" ON "payments"("username");

-- CreateIndex
CREATE UNIQUE INDEX "payments_email_key" ON "payments"("email");
