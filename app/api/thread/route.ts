import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST() {
  const openai = new OpenAI();
  const thread = await openai.beta.threads.create();

  return NextResponse.json({ thread }, { status: 201 });
}
