// /app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ reply: "No message provided" }, { status: 400 });
    }

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // or gpt-4
      messages: [{ role: "user", content: message }],
    });

    const reply = chatCompletion.choices[0]?.message?.content ?? "No reply.";
    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ reply: "Something went wrong." }, { status: 500 });
  }
}
