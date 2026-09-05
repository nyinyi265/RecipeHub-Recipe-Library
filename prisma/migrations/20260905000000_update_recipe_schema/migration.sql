-- CreateEnum
CREATE TYPE "RecipeStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'PRIVATE');

-- AlterEnum: Drop old Difficulty values and create new ones
BEGIN;
CREATE TYPE "Difficulty_new" AS ENUM ('EASY', 'INTERMEDIATE', 'EXPERT');
ALTER TABLE "Recipe" ALTER COLUMN "difficulty" TYPE "Difficulty_new" USING "difficulty"::text::"Difficulty_new";
ALTER TYPE "Difficulty" RENAME TO "Difficulty_old";
ALTER TYPE "Difficulty_new" RENAME TO "Difficulty";
DROP TYPE "Difficulty_old";
COMMIT;

-- AlterTable: Recipe - add new columns and make existing ones optional
ALTER TABLE "Recipe" ADD COLUMN "category" TEXT,
ADD COLUMN "status" "RecipeStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "search_visibility" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "allow_comments" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "slug" SET DEFAULT '',
ALTER COLUMN "cover_image" DROP NOT NULL,
ALTER COLUMN "prep_time" DROP NOT NULL,
ALTER COLUMN "cook_time" DROP NOT NULL,
ALTER COLUMN "total_time" DROP NOT NULL,
ALTER COLUMN "servings" SET DEFAULT 1,
ALTER COLUMN "Calories" SET DEFAULT 0,
ALTER COLUMN "Protein" SET DEFAULT 0,
ALTER COLUMN "Carbs" SET DEFAULT 0,
ALTER COLUMN "Fat" SET DEFAULT 0;

-- AlterTable: RecipeIngredient - add group_name
ALTER TABLE "RecipeIngredient" ADD COLUMN "group_name" TEXT;

-- AlterTable: RecipeStep - make timer_min and voice_text optional
ALTER TABLE "RecipeStep" ALTER COLUMN "timer_min" DROP NOT NULL,
ALTER COLUMN "voice_text" DROP NOT NULL;
