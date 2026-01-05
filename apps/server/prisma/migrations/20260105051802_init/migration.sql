-- CreateTable
CREATE TABLE "KB_MAIN" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "use_case" TEXT NOT NULL,
    "qualities" TEXT[],
    "outliers" TEXT[],
    "specs" TEXT[],
    "conv_rate" DOUBLE PRECISION NOT NULL,
    "vector_coords" DOUBLE PRECISION[],
    "archive" INTEGER[],
    "RFC" TEXT NOT NULL,

    CONSTRAINT "KB_MAIN_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KB_ARCHIVE" (
    "id" SERIAL NOT NULL,
    "parent_id" INTEGER NOT NULL,
    "use_case" TEXT NOT NULL,
    "qualities" TEXT[],
    "outliers" TEXT[],
    "specs" TEXT[],
    "conv_rate" DOUBLE PRECISION NOT NULL,
    "vector_coords" DOUBLE PRECISION[],

    CONSTRAINT "KB_ARCHIVE_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "KB_MAIN_category_use_case_key" ON "KB_MAIN"("category", "use_case");
