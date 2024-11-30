-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone_no" VARCHAR(15) NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone_no" VARCHAR(15) NOT NULL,
    "email" TEXT,
    "owner_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Spam" (
    "phone_no" VARCHAR(15) NOT NULL,
    "report_count" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Spam_pkey" PRIMARY KEY ("phone_no")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "spam_phone_no" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_no_key" ON "User"("phone_no");

-- CreateIndex
CREATE INDEX "User_phone_no_idx" ON "User"("phone_no");

-- CreateIndex
CREATE INDEX "User_name_idx" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Contact_owner_id_key" ON "Contact"("owner_id");

-- CreateIndex
CREATE INDEX "Contact_phone_no_idx" ON "Contact"("phone_no");

-- CreateIndex
CREATE UNIQUE INDEX "Spam_phone_no_key" ON "Spam"("phone_no");

-- CreateIndex
CREATE INDEX "Spam_phone_no_idx" ON "Spam"("phone_no");

-- CreateIndex
CREATE UNIQUE INDEX "Report_user_id_key" ON "Report"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Report_spam_phone_no_key" ON "Report"("spam_phone_no");

-- CreateIndex
CREATE UNIQUE INDEX "Report_user_id_spam_phone_no_key" ON "Report"("user_id", "spam_phone_no");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_phone_no_fkey" FOREIGN KEY ("phone_no") REFERENCES "Spam"("phone_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_phone_no_fkey" FOREIGN KEY ("phone_no") REFERENCES "Spam"("phone_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_spam_phone_no_fkey" FOREIGN KEY ("spam_phone_no") REFERENCES "Spam"("phone_no") ON DELETE RESTRICT ON UPDATE CASCADE;
