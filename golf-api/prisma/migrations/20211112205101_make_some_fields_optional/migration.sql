-- AlterTable
ALTER TABLE "HoleInformation" ALTER COLUMN "par" DROP NOT NULL,
ALTER COLUMN "yardage" DROP NOT NULL,
ALTER COLUMN "handicap" DROP NOT NULL;

-- AlterTable
ALTER TABLE "UserHoleScore" ALTER COLUMN "par" DROP NOT NULL,
ALTER COLUMN "yardage" DROP NOT NULL,
ALTER COLUMN "handicap" DROP NOT NULL,
ALTER COLUMN "holeNumber" DROP NOT NULL,
ALTER COLUMN "strokes" DROP NOT NULL,
ALTER COLUMN "notes" DROP NOT NULL;
