-- CreateTable
CREATE TABLE "User" (
    "id" VARCHAR(36) NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cars" (
    "id" VARCHAR(36) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "carOwnerEmail" TEXT NOT NULL,
    "carOwnerPhone" TEXT NOT NULL,

    CONSTRAINT "Cars_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_phone_key" ON "User"("email", "phone");

-- AddForeignKey
ALTER TABLE "Cars" ADD CONSTRAINT "Cars_carOwnerEmail_carOwnerPhone_fkey" FOREIGN KEY ("carOwnerEmail", "carOwnerPhone") REFERENCES "User"("email", "phone") ON DELETE RESTRICT ON UPDATE CASCADE;
