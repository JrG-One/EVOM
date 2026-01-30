const prisma = require("../lib/prisma");

const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await prisma.user.count();
        const totalInterviews = await prisma.interview.count();

        // Calculate average score across all interviews
        const interviews = await prisma.interview.findMany({
            select: { score: true }
        });
        const avgScore = interviews.length > 0
            ? (interviews.reduce((acc, curr) => acc + curr.score, 0) / interviews.length) * 10
            : 0;

        const recentUsers = await prisma.user.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: { id: true, username: true, email: true, createdAt: true, role: true }
        });

        res.status(200).json({
            stats: {
                totalUsers,
                totalInterviews,
                avgScore: avgScore.toFixed(1),
                successRate: "N/A" // Placeholder for now
            },
            recentUsers
        });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getAllUsers = async (req, res) => {
    const { page = 1, limit = 10, search = "" } = req.query;
    const skip = (page - 1) * limit;

    try {
        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { username: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } }
                ]
            },
            skip: parseInt(skip),
            take: parseInt(limit),
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                isVerified: true,
                createdAt: true,
                atsScore: true
            }
        });

        const totalUsers = await prisma.user.count({
            where: {
                OR: [
                    { username: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } }
                ]
            }
        });

        res.status(200).json({
            users,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: parseInt(page)
        });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

const updateUserRole = async (req, res) => {
    const { userId, role } = req.body;

    if (!["USER", "ADMIN", "SUPERADMIN"].includes(role)) {
        return res.status(400).json({ error: "Invalid role" });
    }

    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { role },
            select: { id: true, username: true, role: true }
        });

        // Create Audit Log
        await prisma.auditLog.create({
            data: {
                action: `UPDATED_ROLE_TO_${role}`,
                adminId: req.user.id,
                targetId: userId,
                details: `Updated role for user ${updatedUser.username} to ${role}`
            }
        });

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

const deleteUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ error: "User not found" });

        await prisma.user.delete({ where: { id: userId } });

        // Create Audit Log
        await prisma.auditLog.create({
            data: {
                action: "DELETED_USER",
                adminId: req.user.id,
                targetId: userId,
                details: `Deleted user: ${user.username} (${user.email})`
            }
        });

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

const getAllInterviews = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    try {
        const interviews = await prisma.interview.findMany({
            skip: parseInt(skip),
            take: parseInt(limit),
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { username: true, email: true }
                }
            }
        });

        const total = await prisma.interview.count();

        res.status(200).json({
            interviews,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page)
        });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

const deleteInterview = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.interview.delete({ where: { id } });
        res.status(200).json({ message: "Interview deleted" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

const getAllResources = async (req, res) => {
    try {
        const resources = await prisma.resource.findMany({
            orderBy: { id: 'desc' }
        });
        res.status(200).json(resources);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

const createResource = async (req, res) => {
    const { title, description, thumbnail, link } = req.body;
    try {
        const resource = await prisma.resource.create({
            data: { title, description, thumbnail, link }
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
            data: { title, description, thumbnail, link }
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
        res.status(200).json({ message: "Resource deleted" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    getDashboardStats,
    getAllUsers,
    updateUserRole,
    deleteUser,
    getAllInterviews,
    deleteInterview,
    getAllResources,
    createResource,
    updateResource,
    deleteResource
};
