import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  const { message, threadId } = await req.json();

  console.log("from user", { message, threadId });

  if (!threadId || !message) {
    return NextResponse.json(
      { error: "threadId and message are required", success: false },
      { status: 400 }
    );
  }

  const openai = new OpenAI();

  try {
    const threadMessage = await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: message,
    });

    console.log("from openai", threadMessage);

    return NextResponse.json(
      { message: threadMessage, success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong", success: false },
      { status: 500 }
    );
  }
}
