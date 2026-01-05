/*
  Warnings:

  - A unique constraint covering the columns `[use_case]` on the table `KB_MAIN` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "KB_MAIN_use_case_key" ON "KB_MAIN"("use_case");
