/*
  Warnings:

  - You are about to drop the column `vector_coords` on the `KB_ARCHIVE` table. All the data in the column will be lost.
  - You are about to drop the column `vector_coords` on the `KB_MAIN` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "KB_ARCHIVE" DROP COLUMN "vector_coords";

-- AlterTable
ALTER TABLE "KB_MAIN" DROP COLUMN "vector_coords";
