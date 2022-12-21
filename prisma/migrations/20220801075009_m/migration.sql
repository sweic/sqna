-- DropIndex
DROP INDEX "Question_roomid_key";

-- CreateTable
CREATE TABLE "Poll" (
    "id" SERIAL NOT NULL,
    "roomid" INTEGER NOT NULL,
    "query" TEXT NOT NULL,
    "selections" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL,

    CONSTRAINT "Poll_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Choice" (
    "id" SERIAL NOT NULL,
    "pollid" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "votes" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Choice_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Poll" ADD CONSTRAINT "Poll_roomid_fkey" FOREIGN KEY ("roomid") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Choice" ADD CONSTRAINT "Choice_pollid_fkey" FOREIGN KEY ("pollid") REFERENCES "Poll"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
