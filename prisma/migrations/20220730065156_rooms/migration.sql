-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "userid" INTEGER NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "roomid" INTEGER NOT NULL,
    "query" TEXT NOT NULL,
    "answer" TEXT,
    "votes" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Room_userid_key" ON "Room"("userid");

-- CreateIndex
CREATE UNIQUE INDEX "Question_roomid_key" ON "Question"("roomid");

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_roomid_fkey" FOREIGN KEY ("roomid") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
