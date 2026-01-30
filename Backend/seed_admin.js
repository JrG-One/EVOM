require("dotenv").config();
const prisma = require("./lib/prisma");
const bcrypt = require("bcrypt");

async function seedSuperAdmin() {
    const email = "superadmin@entervue.ai";
    const password = "AdminPassword123"; // Change this in production!
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const admin = await prisma.user.upsert({
            where: { email },
            update: {
                role: "SUPERADMIN",
                isAdmin: true
            },
            create: {
                username: "SuperAdmin",
                email,
                password: hashedPassword,
                role: "SUPERADMIN",
                isAdmin: true,
                isVerified: true
            }
        });
        console.log("Super Admin created/updated successfully:", admin.email);
        console.log("Credentials -> Email: superadmin@entervue.ai, Password: AdminPassword123");
    } catch (error) {
        console.error("Error seeding Super Admin:", error);
    } finally {
        process.exit();
    }
}

seedSuperAdmin();
