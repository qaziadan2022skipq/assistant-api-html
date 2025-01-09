
import { NextResponse } from "next/server";
import OpenAI from "openai/index.mjs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const assistant_id = process.env.Assistant_ID || "";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { threadId, userMessage } = body;
    
    if (!openai.apiKey) {
      return new NextResponse("OpenAI API key is Invalid", { status: 500 });
    }
    if (!userMessage) {
      return new NextResponse("User Message is required", { status: 400 });
    }
    if (!threadId) {
      return new NextResponse("Thread id is required", { status: 400 });
    }
    const message = await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: userMessage,
    });

    const run = await openai.beta.threads.runs.createAndPoll(threadId, {
      assistant_id: assistant_id,
    });

    if (run.status === "completed") {
      const messages = await openai.beta.threads.messages.list(run.thread_id);
      const botMessage = messages.data[0];
      
      return NextResponse.json(botMessage.content[0], { status: 200 });
    } else {
      console.log(run.status);
    }
  } catch (error) {
    console.log("[CONVERSATION_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export const dynamic = "force-dynamic";
