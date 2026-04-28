-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'DELETED');

-- CreateEnum
CREATE TYPE "CreditPlan" AS ENUM ('FREE', 'STARTER', 'PRO', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "CreditChangeType" AS ENUM ('INIT', 'CONSUME', 'ADJUST', 'RESET', 'TOPUP');

-- AlterTable
ALTER TABLE "User" ADD COLUMN "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE "FeatureFlag" (
    "key" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "updatedById" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FeatureFlag_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "UserActivityLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "meta" JSONB,
    "ipHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AICreditQuota" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "plan" "CreditPlan" NOT NULL DEFAULT 'FREE',
    "monthlyLimit" INTEGER NOT NULL DEFAULT 1000,
    "usedThisCycle" INTEGER NOT NULL DEFAULT 0,
    "cycleStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cycleEnd" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AICreditQuota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AICreditLedger" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "changeType" "CreditChangeType" NOT NULL,
    "delta" INTEGER NOT NULL,
    "balanceAfter" INTEGER NOT NULL,
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AICreditLedger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyAdminMetric" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "activeUsers" INTEGER NOT NULL DEFAULT 0,
    "interviewsStarted" INTEGER NOT NULL DEFAULT 0,
    "interviewsCompleted" INTEGER NOT NULL DEFAULT 0,
    "creditsConsumed" INTEGER NOT NULL DEFAULT 0,
    "failedEvents" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "DailyAdminMetric_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserActivityLog_userId_createdAt_idx" ON "UserActivityLog"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "UserActivityLog_eventType_createdAt_idx" ON "UserActivityLog"("eventType", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AICreditQuota_userId_key" ON "AICreditQuota"("userId");

-- CreateIndex
CREATE INDEX "AICreditQuota_plan_idx" ON "AICreditQuota"("plan");

-- CreateIndex
CREATE INDEX "AICreditQuota_cycleEnd_idx" ON "AICreditQuota"("cycleEnd");

-- CreateIndex
CREATE INDEX "AICreditLedger_userId_createdAt_idx" ON "AICreditLedger"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "AICreditLedger_changeType_createdAt_idx" ON "AICreditLedger"("changeType", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "DailyAdminMetric_date_key" ON "DailyAdminMetric"("date");

-- AddForeignKey
ALTER TABLE "FeatureFlag" ADD CONSTRAINT "FeatureFlag_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserActivityLog" ADD CONSTRAINT "UserActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AICreditQuota" ADD CONSTRAINT "AICreditQuota_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AICreditLedger" ADD CONSTRAINT "AICreditLedger_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
