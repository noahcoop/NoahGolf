-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HoleInformation" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER NOT NULL,
    "holeNumber" INTEGER NOT NULL,
    "par" INTEGER NOT NULL,
    "yardage" INTEGER NOT NULL,
    "handicap" INTEGER NOT NULL,

    CONSTRAINT "HoleInformation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Round" (
    "id" SERIAL NOT NULL,
    "date" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Round_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserHoleScore" (
    "id" SERIAL NOT NULL,
    "roundId" INTEGER NOT NULL,
    "par" INTEGER NOT NULL,
    "yardage" INTEGER NOT NULL,
    "handicap" INTEGER NOT NULL,
    "holeNumber" INTEGER NOT NULL,
    "strokes" INTEGER NOT NULL,
    "notes" TEXT NOT NULL,

    CONSTRAINT "UserHoleScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Course_name_key" ON "Course"("name");

-- CreateIndex
CREATE UNIQUE INDEX "HoleInformation_courseId_key" ON "HoleInformation"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "UserHoleScore_roundId_key" ON "UserHoleScore"("roundId");

-- AddForeignKey
ALTER TABLE "HoleInformation" ADD CONSTRAINT "HoleInformation_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserHoleScore" ADD CONSTRAINT "UserHoleScore_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "Round"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
