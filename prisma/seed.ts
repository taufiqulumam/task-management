import "dotenv/config"
import { TaskStatus, TaskPriority } from "@prisma/client"
import { prisma } from "../lib/prisma"
import bcrypt from "bcryptjs"

async function main() {
  console.log("🌱 Starting database seed...")

  // Clear existing data
  console.log("🗑️  Cleaning up existing data...")
  await prisma.comment.deleteMany()
  await prisma.task.deleteMany()
  await prisma.project.deleteMany()
  await prisma.passwordReset.deleteMany()
  await prisma.user.deleteMany()

  // Create Users
  console.log("👥 Creating users...")
  const hashedPassword = await bcrypt.hash("password123", 10)

  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: "Alice Johnson",
        email: "alice@example.com",
        password: hashedPassword,
      },
    }),
    prisma.user.create({
      data: {
        name: "Bob Smith",
        email: "bob@example.com",
        password: hashedPassword,
      },
    }),
    prisma.user.create({
      data: {
        name: "Charlie Brown",
        email: "charlie@example.com",
        password: hashedPassword,
      },
    }),
    prisma.user.create({
      data: {
        name: "Diana Prince",
        email: "diana@example.com",
        password: hashedPassword,
      },
    }),
  ])

  console.log(`✅ Created ${users.length} users`)

  // Create Projects
  console.log("📁 Creating projects...")
  const projects = await Promise.all([
    // Alice's Projects
    prisma.project.create({
      data: {
        name: "Website Redesign",
        description: "Complete redesign of company website with modern UI/UX",
        color: "#3B82F6",
        ownerId: users[0].id, // Alice
      },
    }),
    prisma.project.create({
      data: {
        name: "Mobile App Development",
        description: "Native mobile app for iOS and Android",
        color: "#10B981",
        ownerId: users[0].id, // Alice
      },
    }),
    // Bob's Projects
    prisma.project.create({
      data: {
        name: "API Integration",
        description: "Integrate third-party APIs for payment and authentication",
        color: "#8B5CF6",
        ownerId: users[1].id, // Bob
      },
    }),
    prisma.project.create({
      data: {
        name: "Database Optimization",
        description: "Optimize database queries and implement caching",
        color: "#F59E0B",
        ownerId: users[1].id, // Bob
      },
    }),
    // Charlie's Project
    prisma.project.create({
      data: {
        name: "Marketing Campaign",
        description: "Q4 digital marketing campaign across all channels",
        color: "#EF4444",
        ownerId: users[2].id, // Charlie
      },
    }),
    // Diana's Project
    prisma.project.create({
      data: {
        name: "Security Audit",
        description: "Comprehensive security audit and penetration testing",
        color: "#EC4899",
        ownerId: users[3].id, // Diana
      },
    }),
  ])

  console.log(`✅ Created ${projects.length} projects`)

  // Create Tasks
  console.log("📋 Creating tasks...")
  
  // Helper function to create random date within range
  const randomDate = (start: Date, end: Date) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  }

  const now = new Date()
  const futureDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days from now

  const tasksData = [
    // Website Redesign Project Tasks
    {
      title: "Design homepage mockup",
      description: "Create high-fidelity mockup for new homepage design",
      status: TaskStatus.DONE,
      priority: TaskPriority.HIGH,
      projectId: projects[0].id,
      createdById: users[0].id,
      assigneeId: users[0].id,
      dueDate: randomDate(now, futureDate),
    },
    {
      title: "Implement responsive navigation",
      description: "Build responsive navigation component with mobile menu",
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      projectId: projects[0].id,
      createdById: users[0].id,
      assigneeId: users[1].id,
      dueDate: randomDate(now, futureDate),
    },
    {
      title: "Setup color palette and typography",
      description: "Define design system colors and font families",
      status: TaskStatus.DONE,
      priority: TaskPriority.MEDIUM,
      projectId: projects[0].id,
      createdById: users[0].id,
      assigneeId: users[0].id,
      dueDate: randomDate(now, futureDate),
    },
    {
      title: "Create contact form",
      description: "Build and validate contact form with email integration",
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      projectId: projects[0].id,
      createdById: users[0].id,
      assigneeId: users[1].id,
      dueDate: randomDate(now, futureDate),
    },

    // Mobile App Development Tasks
    {
      title: "Setup React Native project",
      description: "Initialize React Native project with required dependencies",
      status: TaskStatus.DONE,
      priority: TaskPriority.URGENT,
      projectId: projects[1].id,
      createdById: users[0].id,
      assigneeId: users[1].id,
      dueDate: randomDate(now, futureDate),
    },
    {
      title: "Design app navigation flow",
      description: "Create navigation structure and screen flow",
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      projectId: projects[1].id,
      createdById: users[0].id,
      assigneeId: users[0].id,
      dueDate: randomDate(now, futureDate),
    },
    {
      title: "Implement authentication screens",
      description: "Build login, register, and forgot password screens",
      status: TaskStatus.IN_REVIEW,
      priority: TaskPriority.HIGH,
      projectId: projects[1].id,
      createdById: users[0].id,
      assigneeId: users[2].id,
      dueDate: randomDate(now, futureDate),
    },
    {
      title: "Add push notifications",
      description: "Integrate Firebase Cloud Messaging for push notifications",
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      projectId: projects[1].id,
      createdById: users[0].id,
      assigneeId: users[3].id,
      dueDate: randomDate(now, futureDate),
    },

    // API Integration Tasks
    {
      title: "Research payment gateway options",
      description: "Compare Stripe, PayPal, and other payment providers",
      status: TaskStatus.DONE,
      priority: TaskPriority.HIGH,
      projectId: projects[2].id,
      createdById: users[1].id,
      assigneeId: users[1].id,
      dueDate: randomDate(now, futureDate),
    },
    {
      title: "Integrate Stripe payments",
      description: "Implement Stripe checkout and webhook handling",
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.URGENT,
      projectId: projects[2].id,
      createdById: users[1].id,
      assigneeId: users[2].id,
      dueDate: randomDate(now, futureDate),
    },
    {
      title: "Setup OAuth authentication",
      description: "Implement Google and GitHub OAuth login",
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
      projectId: projects[2].id,
      createdById: users[1].id,
      assigneeId: users[3].id,
      dueDate: randomDate(now, futureDate),
    },

    // Database Optimization Tasks
    {
      title: "Analyze slow queries",
      description: "Identify and document all queries taking over 100ms",
      status: TaskStatus.DONE,
      priority: TaskPriority.HIGH,
      projectId: projects[3].id,
      createdById: users[1].id,
      assigneeId: users[1].id,
      dueDate: randomDate(now, futureDate),
    },
    {
      title: "Add database indexes",
      description: "Create indexes for frequently queried columns",
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      projectId: projects[3].id,
      createdById: users[1].id,
      assigneeId: users[0].id,
      dueDate: randomDate(now, futureDate),
    },
    {
      title: "Implement Redis caching",
      description: "Setup Redis for caching frequently accessed data",
      status: TaskStatus.IN_REVIEW,
      priority: TaskPriority.MEDIUM,
      projectId: projects[3].id,
      createdById: users[1].id,
      assigneeId: users[2].id,
      dueDate: randomDate(now, futureDate),
    },

    // Marketing Campaign Tasks
    {
      title: "Create social media calendar",
      description: "Plan content schedule for all social platforms",
      status: TaskStatus.DONE,
      priority: TaskPriority.HIGH,
      projectId: projects[4].id,
      createdById: users[2].id,
      assigneeId: users[2].id,
      dueDate: randomDate(now, futureDate),
    },
    {
      title: "Design ad creatives",
      description: "Create banner ads and promotional graphics",
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      projectId: projects[4].id,
      createdById: users[2].id,
      assigneeId: users[3].id,
      dueDate: randomDate(now, futureDate),
    },
    {
      title: "Setup email campaigns",
      description: "Configure automated email sequences in Mailchimp",
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      projectId: projects[4].id,
      createdById: users[2].id,
      assigneeId: users[0].id,
      dueDate: randomDate(now, futureDate),
    },
    {
      title: "Launch Google Ads campaign",
      description: "Setup and launch PPC campaigns on Google Ads",
      status: TaskStatus.TODO,
      priority: TaskPriority.URGENT,
      projectId: projects[4].id,
      createdById: users[2].id,
      assigneeId: users[2].id,
      dueDate: randomDate(now, futureDate),
    },

    // Security Audit Tasks
    {
      title: "Conduct vulnerability scanning",
      description: "Run automated security scans on all systems",
      status: TaskStatus.DONE,
      priority: TaskPriority.URGENT,
      projectId: projects[5].id,
      createdById: users[3].id,
      assigneeId: users[3].id,
      dueDate: randomDate(now, futureDate),
    },
    {
      title: "Review authentication mechanisms",
      description: "Audit all auth flows and token handling",
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.URGENT,
      projectId: projects[5].id,
      createdById: users[3].id,
      assigneeId: users[1].id,
      dueDate: randomDate(now, futureDate),
    },
    {
      title: "Test API endpoints for vulnerabilities",
      description: "Perform penetration testing on all API endpoints",
      status: TaskStatus.IN_REVIEW,
      priority: TaskPriority.HIGH,
      projectId: projects[5].id,
      createdById: users[3].id,
      assigneeId: users[0].id,
      dueDate: randomDate(now, futureDate),
    },
    {
      title: "Document security findings",
      description: "Create comprehensive security audit report",
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
      projectId: projects[5].id,
      createdById: users[3].id,
      assigneeId: users[3].id,
      dueDate: randomDate(now, futureDate),
    },
  ]

  const tasks = await Promise.all(
    tasksData.map((taskData) =>
      prisma.task.create({
        data: taskData,
      })
    )
  )

  console.log(`✅ Created ${tasks.length} tasks`)

  // Create some comments
  console.log("💬 Creating comments...")
  const comments = await Promise.all([
    prisma.comment.create({
      data: {
        content: "Great work on this! The design looks amazing.",
        taskId: tasks[0].id,
        authorId: users[1].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: "I have a few suggestions for the color palette. Let's discuss.",
        taskId: tasks[2].id,
        authorId: users[2].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: "The authentication flow is working perfectly now!",
        taskId: tasks[6].id,
        authorId: users[0].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: "Found some performance issues with the current implementation.",
        taskId: tasks[12].id,
        authorId: users[1].id,
      },
    }),
  ])

  console.log(`✅ Created ${comments.length} comments`)

  console.log("\n🎉 Seed completed successfully!")
  console.log("\n📊 Summary:")
  console.log(`   - Users: ${users.length}`)
  console.log(`   - Projects: ${projects.length}`)
  console.log(`   - Tasks: ${tasks.length}`)
  console.log(`   - Comments: ${comments.length}`)
  console.log("\n🔑 Login credentials:")
  console.log("   Email: alice@example.com")
  console.log("   Email: bob@example.com")
  console.log("   Email: charlie@example.com")
  console.log("   Email: diana@example.com")
  console.log("   Password: password123 (for all users)")
}

main()
  .catch((e) => {
    console.error("❌ Error during seed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
