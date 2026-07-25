import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/lib/models/user.model";

export async function GET() {
  try {
    await dbConnect();

    // Check if users already exist
    const existingAdmin = await User.findOne({ email: "admin@leadflow.com" });
    if (existingAdmin) {
      return NextResponse.json(
        { message: "Seed data already exists. Skipping." },
        { status: 200 }
      );
    }

    const adminPassword = await bcrypt.hash("admin123", 12);
    const memberPassword = await bcrypt.hash("member123", 12);

    await User.create([
      {
        name: "Admin User",
        email: "admin@leadflow.com",
        password: adminPassword,
        role: "admin",
      },
      {
        name: "Sales Member",
        email: "member@leadflow.com",
        password: memberPassword,
        role: "member",
      },
    ]);

    return NextResponse.json(
      {
        message: "Seed data created successfully!",
        users: [
          { email: "admin@leadflow.com", password: "admin123", role: "admin" },
          { email: "member@leadflow.com", password: "member123", role: "member" },
        ],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 }
    );
  }
}
