import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI();

export async function POST(request: Request) {
  const { messages, secret } = await request.json();

  if (!messages || !secret) {
    return NextResponse.json(
      { success: false, message: "Missing required fields" },
      {
        status: 400,
      }
    );
  }

  if (secret !== process.env.APP_SECRET_KEY) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      {
        status: 401,
      }
    );
  }

  try {
    const completion = await openai.chat.completions.create({
      messages,
      model: "gpt-4-0613",
    });

    const newMessage = completion.choices[0].message.content;

    return NextResponse.json(
      { success: true, message: newMessage },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false },
      {
        status: 500,
      }
    );
  }
}
