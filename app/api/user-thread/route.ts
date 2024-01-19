import { prismadb } from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function GET() {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json(
      { success: false, message: "unauthorized" },
      { status: 401 }
    );
  }

  // Get user threads from database
  const userThread = await prismadb.userThread.findUnique({
    where: { userId: user.id },
  });

  // If it does exist, return it
  if (userThread) {
    return NextResponse.json({ userThread, success: true }, { status: 200 });
  }

  try {
    // If it doesn't exist, create it from openai
    const openai = new OpenAI();
    const thread = await openai.beta.threads.create();

    // Save it to the database
    const newUserThread = await prismadb.userThread.create({
      data: {
        userId: user.id,
        threadId: thread.id,
      },
    });

    // Return it to the user
    return NextResponse.json(
      { userThread: newUserThread, success: true },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { success: false, message: "error creating thread" },
      { status: 500 }
    );
  }
}
