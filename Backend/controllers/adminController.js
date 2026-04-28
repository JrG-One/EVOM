const { Prisma } = require("@prisma/client");
const prisma = require("../lib/prisma");

const VALID_ROLES = ["USER", "ADMIN", "SUPERADMIN"];
const VALID_STATUS = ["ACTIVE", "SUSPENDED", "DELETED"];

const parsePagination = (query) => {
  const page = Math.max(1, parseInt(query.page || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || "10", 10)));
  return { page, limit, skip: (page - 1) * limit };
};

const toCsv = (rows) => {
  if (!rows?.length) return "";
  const headers = Object.keys(rows[0]);
  const escapeValue = (value) => {
    if (value === null || value === undefined) return "";
    const stringValue = typeof value === "object" ? JSON.stringify(value) : String(value);
    return `"${stringValue.replace(/"/g, '""')}"`;
  };

  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((header) => escapeValue(row[header])).join(","));
  }
  return lines.join("\n");
};

const logAdminAction = async ({ action, adminId, targetId, details }) => {
  await prisma.auditLog.create({
    data: { action, adminId, targetId, details },
  });
};

const ensureCreditQuota = async (userId) => {
  const now = new Date();
  const cycleEnd = new Date(now);
  cycleEnd.setMonth(cycleEnd.getMonth() + 1);

  return prisma.aICreditQuota.upsert({
    where: { userId },
    update: {},
    create: {
      userId,
      plan: "FREE",
      monthlyLimit: 1000,
      usedThisCycle: 0,
      cycleStart: now,
      cycleEnd,
    },
  });
};

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count({
      where: { status: { not: "DELETED" } },
    });
    const totalInterviews = await prisma.interview.count();
    const creditRows = await prisma.aICreditQuota.findMany({
      select: { monthlyLimit: true, usedThisCycle: true },
    });
    const exhaustedCredits = creditRows.filter((row) => row.usedThisCycle >= row.monthlyLimit).length;

    const interviews = await prisma.interview.findMany({
      select: { score: true },
    });

    const avgScore =
      interviews.length > 0
        ? (interviews.reduce((acc, curr) => acc + curr.score, 0) / interviews.length) * 10
        : 0;

    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      where: { status: { not: "DELETED" } },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        role: true,
        status: true,
      },
    });

    res.status(200).json({
      stats: {
        totalUsers,
        totalInterviews,
        avgScore: avgScore.toFixed(1),
        exhaustedCredits,
      },
      recentUsers,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAdminOverview = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get the start date for our 6-month chart
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1); // Start at the beginning of that month

    const [
      totalUsers,
      activeUsers30d,
      totalInterviews,
      flags,
      exhaustedUsers,
      recentUsers,
      usersForChart,      // <--- NEW: Raw user dates
      interviewsForChart  // <--- NEW: Raw interview dates
    ] = await Promise.all([
      prisma.user.count({ where: { status: { not: "DELETED" } } }),
      prisma.userActivityLog
        .groupBy({
          by: ["userId"],
          where: { createdAt: { gte: thirtyDaysAgo } },
        })
        .then((rows) => rows.length),
      prisma.interview.count(),
      prisma.featureFlag.findMany({
        orderBy: { key: "asc" },
        select: { key: true, enabled: true },
      }),
      prisma.aICreditQuota.count({
        where: {
          OR: [
            { usedThisCycle: { gte: 0 } },
          ],
        },
      }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        where: { status: { not: "DELETED" } },
        select: { id: true, username: true, email: true, createdAt: true, role: true, status: true },
      }),
      // Fetch dates for the last 6 months
      prisma.user.findMany({
        where: { createdAt: { gte: sixMonthsAgo } },
        select: { createdAt: true }
      }),
      prisma.interview.findMany({
        where: { createdAt: { gte: sixMonthsAgo } },
        select: { createdAt: true }
      })
    ]);

    // Format the Chart Data
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const chartMap = {};

    // Initialize the last 6 months with 0 so the chart always has a baseline
    for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const monthKey = monthNames[d.getMonth()];
        chartMap[monthKey] = { name: monthKey, users: 0, interviews: 0 };
    }

    // Tally up the users per month
    usersForChart.forEach(u => {
        const monthKey = monthNames[u.createdAt.getMonth()];
        if (chartMap[monthKey]) chartMap[monthKey].users += 1;
    });

    // Tally up the interviews per month
    interviewsForChart.forEach(i => {
        const monthKey = monthNames[i.createdAt.getMonth()];
        if (chartMap[monthKey]) chartMap[monthKey].interviews += 1;
    });

    const creditRows = await prisma.aICreditQuota.findMany({
      select: { monthlyLimit: true, usedThisCycle: true },
    });
    const exhausted = creditRows.filter((row) => row.usedThisCycle >= row.monthlyLimit).length;
    const warning95 = creditRows.filter(
      (row) => row.monthlyLimit > 0 && row.usedThisCycle / row.monthlyLimit >= 0.95,
    ).length;
    const warning80 = creditRows.filter(
      (row) => row.monthlyLimit > 0 && row.usedThisCycle / row.monthlyLimit >= 0.8,
    ).length;

    res.status(200).json({
      totalUsers,
      activeUsers30d,
      totalInterviews,
      featureFlags: {
        total: flags.length,
        enabled: flags.filter((f) => f.enabled).length,
      },
      credits: {
        trackedUsers: creditRows.length,
        exhausted,
        warning95,
        warning80,
        exhaustedUsers: exhaustedUsers || exhausted,
      },
      recentUsers,
      chartData: Object.values(chartMap)
    });
  } catch (error) {
    console.error("OVERVIEW ERROR:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllUsers = async (req, res) => {
  const { search = "", role } = req.query;
  const { page, limit, skip } = parsePagination(req.query);

  try {
    const where = {
      AND: [
        search
          ? {
              OR: [
                { username: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},
        role && VALID_ROLES.includes(role) ? { role } : {},
      ],
    };

    const users = await prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        // status: true, // Comment this out or delete it
        isVerified: true,
        createdAt: true,
        atsScore: true,
      },
    });

    const totalUsers = await prisma.user.count({ where });

    res.status(200).json({
      users,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
      totalUsers,
    });
  } catch (error) {
    console.error(error); // Log the actual error to your terminal
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

const updateUserRole = async (req, res) => {
  const userId = req.params.id || req.body.userId;
  const { role } = req.body;

  if (!userId || !VALID_ROLES.includes(role)) {
    return res.status(400).json({ error: "Invalid role update payload" });
  }

  if (req.user.role !== "SUPERADMIN" && role === "SUPERADMIN") {
    return res.status(403).json({ error: "Only super admins can assign SUPERADMIN role" });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, username: true, role: true },
    });

    await logAdminAction({
      action: `UPDATED_ROLE_TO_${role}`,
      adminId: req.user.id,
      targetId: userId,
      details: `Updated role for user ${updatedUser.username} to ${role}`,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    const code = error instanceof Prisma.PrismaClientKnownRequestError ? 404 : 500;
    res.status(code).json({ error: code === 404 ? "User not found" : "Internal server error" });
  }
};

const updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!VALID_STATUS.includes(status)) {
    return res.status(400).json({ error: "Invalid user status" });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { status },
      select: { id: true, username: true, status: true },
    });

    await logAdminAction({
      action: `UPDATED_STATUS_TO_${status}`,
      adminId: req.user.id,
      targetId: id,
      details: `Updated status for user ${updatedUser.username} to ${status}`,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    const code = error instanceof Prisma.PrismaClientKnownRequestError ? 404 : 500;
    res.status(code).json({ error: code === 404 ? "User not found" : "Internal server error" });
  }
};

const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    await prisma.user.update({
      where: { id: userId },
      data: { status: "DELETED" },
    });

    await logAdminAction({
      action: "SOFT_DELETED_USER",
      adminId: req.user.id,
      targetId: userId,
      details: `Soft deleted user: ${user.username} (${user.email})`,
    });

    res.status(200).json({ message: "User marked as deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllInterviews = async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);

  try {
    const interviews = await prisma.interview.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { username: true, email: true },
        },
      },
    });

    const total = await prisma.interview.count();

    res.status(200).json({
      interviews,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteInterview = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.interview.delete({ where: { id } });
    await logAdminAction({
      action: "DELETED_INTERVIEW",
      adminId: req.user.id,
      targetId: id,
      details: "Deleted interview record",
    });
    res.status(200).json({ message: "Interview deleted" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllResources = async (req, res) => {
  try {
    const resources = await prisma.resource.findMany({
      orderBy: { id: "desc" },
    });
    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const createResource = async (req, res) => {
  const { title, description, thumbnail, link } = req.body;
  if (!title || !description || !thumbnail || !link) {
    return res.status(400).json({ error: "All resource fields are required" });
  }

  try {
    const resource = await prisma.resource.create({
      data: { title, description, thumbnail, link },
    });
    await logAdminAction({
      action: "CREATED_RESOURCE",
      adminId: req.user.id,
      targetId: resource.id,
      details: `Created resource ${resource.title}`,
    });
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateResource = async (req, res) => {
  const { id } = req.params;
  const { title, description, thumbnail, link } = req.body;
  try {
    const resource = await prisma.resource.update({
      where: { id },
      data: { title, description, thumbnail, link },
    });
    await logAdminAction({
      action: "UPDATED_RESOURCE",
      adminId: req.user.id,
      targetId: id,
      details: `Updated resource ${resource.title}`,
    });
    res.status(200).json(resource);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteResource = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.resource.delete({ where: { id } });
    await logAdminAction({
      action: "DELETED_RESOURCE",
      adminId: req.user.id,
      targetId: id,
      details: "Deleted resource",
    });
    res.status(200).json({ message: "Resource deleted" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getFeatureFlags = async (req, res) => {
  try {
    const flags = await prisma.featureFlag.findMany({
      orderBy: { key: "asc" },
    });
    res.status(200).json(flags);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const upsertFeatureFlag = async (req, res) => {
  const { key } = req.params;
  const { enabled, description } = req.body;
  if (typeof enabled !== "boolean") {
    return res.status(400).json({ error: "enabled must be boolean" });
  }

  try {
    const flag = await prisma.featureFlag.upsert({
      where: { key },
      update: { enabled, description, updatedById: req.user.id },
      create: { key, enabled, description, updatedById: req.user.id },
    });

    await logAdminAction({
      action: enabled ? "ENABLED_FEATURE_FLAG" : "DISABLED_FEATURE_FLAG",
      adminId: req.user.id,
      targetId: key,
      details: `Feature flag ${key} set to ${enabled}`,
    });
    res.status(200).json(flag);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUserActivityLogs = async (req, res) => {
  const { id } = req.params;
  const { eventType, from, to } = req.query;
  const { page, limit, skip } = parsePagination(req.query);

  try {
    const where = {
      userId: id,
      ...(eventType ? { eventType } : {}),
      ...(from || to
        ? {
            createdAt: {
              ...(from ? { gte: new Date(from) } : {}),
              ...(to ? { lte: new Date(to) } : {}),
            },
          }
        : {}),
    };

    const [logs, total] = await Promise.all([
      prisma.userActivityLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.userActivityLog.count({ where }),
    ]);

    res.status(200).json({
      logs,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getCreditsSummary = async (req, res) => {
  try {
    const usersWithoutQuota = await prisma.user.findMany({
      where: { aiCreditQuota: null, status: { not: "DELETED" } },
      select: { id: true },
    });
    if (usersWithoutQuota.length) {
      const now = new Date();
      const cycleEnd = new Date(now);
      cycleEnd.setMonth(cycleEnd.getMonth() + 1);
      await prisma.aICreditQuota.createMany({
        data: usersWithoutQuota.map((user) => ({
          userId: user.id,
          plan: "FREE",
          monthlyLimit: 1000,
          usedThisCycle: 0,
          cycleStart: now,
          cycleEnd,
        })),
        skipDuplicates: true,
      });
    }

    const quotas = await prisma.aICreditQuota.findMany({
      include: {
        user: {
          select: { id: true, username: true, email: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const totals = quotas.reduce(
      (acc, item) => {
        acc.monthlyLimit += item.monthlyLimit;
        acc.used += item.usedThisCycle;
        if (item.usedThisCycle >= item.monthlyLimit) acc.exhausted += 1;
        return acc;
      },
      { monthlyLimit: 0, used: 0, exhausted: 0 },
    );

    const warningThresholds = {
      warning80: quotas.filter(
        (q) => q.monthlyLimit > 0 && q.usedThisCycle / q.monthlyLimit >= 0.8,
      ).length,
      warning95: quotas.filter(
        (q) => q.monthlyLimit > 0 && q.usedThisCycle / q.monthlyLimit >= 0.95,
      ).length,
    };

    res.status(200).json({
      totals,
      warningThresholds,
      users: quotas.map((q) => ({
        userId: q.userId,
        username: q.user.username,
        email: q.user.email,
        plan: q.plan,
        monthlyLimit: q.monthlyLimit,
        usedThisCycle: q.usedThisCycle,
        remaining: Math.max(0, q.monthlyLimit - q.usedThisCycle),
        cycleEnd: q.cycleEnd,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUserCredits = async (req, res) => {
  const { id } = req.params;
  try {
    const quota = await ensureCreditQuota(id);
    const ledger = await prisma.aICreditLedger.findMany({
      where: { userId: id },
      take: 50,
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      quota: {
        ...quota,
        remaining: Math.max(0, quota.monthlyLimit - quota.usedThisCycle),
      },
      ledger,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const exportAdminReport = async (req, res) => {
  const { type } = req.params;
  const format = String(req.query.format || "csv").toLowerCase();

  const exportMap = {
    users: async () =>
      prisma.user.findMany({
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          status: true,
          createdAt: true,
        },
      }),
    interviews: async () =>
      prisma.interview.findMany({
        select: {
          id: true,
          userId: true,
          role: true,
          company: true,
          score: true,
          createdAt: true,
        },
      }),
    credits: async () =>
      prisma.aICreditQuota.findMany({
        select: {
          userId: true,
          plan: true,
          monthlyLimit: true,
          usedThisCycle: true,
          cycleEnd: true,
        },
      }),
  };

  if (!exportMap[type]) {
    return res.status(400).json({ error: "Unsupported export type" });
  }

  try {
    const rows = await exportMap[type]();

    if (format !== "csv") {
      return res.status(400).json({ error: "Only csv export is supported in V1" });
    }

    const csv = toCsv(rows);

    await logAdminAction({
      action: "EXPORTED_REPORT",
      adminId: req.user.id,
      targetId: type,
      details: `Exported ${type} report as ${format}`,
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="${type}-report.csv"`);
    return res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getDashboardStats,
  getAdminOverview,
  getAllUsers,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  getAllInterviews,
  deleteInterview,
  getAllResources,
  createResource,
  updateResource,
  deleteResource,
  getFeatureFlags,
  upsertFeatureFlag,
  getUserActivityLogs,
  getCreditsSummary,
  getUserCredits,
  exportAdminReport,
};
