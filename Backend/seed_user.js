const prisma = require('./lib/prisma');
const bcrypt = require('bcrypt');

async function main() {
    const email = 'pivehol501@arugy.com';
    const password = 'Test1234@';
    const username = 'Test User';

    console.log(`Seeding user: ${email}`);

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    try {
        const user = await prisma.user.upsert({
            where: { email },
            update: {
                password: hash
            },
            create: {
                email,
                username,
                password: hash,
                isAdmin: false,
                atsScore: 0,
                profilePic: "",
            },
        });
        console.log(`User ${user.email} successfully seeded with ID: ${user.id}`);
    } catch (error) {
        console.error("Error seeding user:", error);
        process.exit(1);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
