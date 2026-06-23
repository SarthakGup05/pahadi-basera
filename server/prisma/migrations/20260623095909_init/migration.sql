-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "altitude" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "views" TEXT NOT NULL,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "difficulty" TEXT NOT NULL,
    "bestSeason" TEXT NOT NULL,
    "gearList" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "routeCoordinates" JSONB NOT NULL,
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "authorName" TEXT NOT NULL,
    "authorRole" TEXT NOT NULL,
    "authorAvatar" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityTrail" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "altitude" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "coordinates" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommunityTrail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityThread" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "replies" INTEGER NOT NULL DEFAULT 0,
    "upvotes" INTEGER NOT NULL DEFAULT 1,
    "authorName" TEXT NOT NULL,
    "authorAvatar" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommunityThread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocalRecipe" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "ingredients" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "steps" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LocalRecipe_pkey" PRIMARY KEY ("id")
);
