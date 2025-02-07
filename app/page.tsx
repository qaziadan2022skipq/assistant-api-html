"use client";

import { Message, useAssistant } from "ai/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";
import { Empty } from "@/components/empty";
import Heading from "@/components/heading";
import { BotIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import Markdown from 'react-markdown'

const Conversation = () => {
  const { status, messages, input, submitMessage, handleInputChange } =
    useAssistant({ api: "/api/assistant" });

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-col min-h-screen border rounded-xl pb-1 shadow-md bg-white">
      <Heading
        title="Your Assistant"
        description="Chat with a more powerful assistant"
        icon={BotIcon}
        iconColor="text-sky-500"
        bgColor="bg-sky-500/10"
      />
      <div className="flex-1 px-4 lg:px-8 overflow-hidden">
        <div className="space-y-4 mt-4">
          <div className="flex flex-col gap-y-4 overflow-y-auto max-h-[70vh]">
            {messages.map((m: Message) => (
              <div
                key={m.id}
                className={cn(
                  "p-6 w-full flex items-start gap-x-8 rounded-lg",
                  m.role === "user"
                    ? "bg-white border border-black/10"
                    : "bg-muted border border-black/20"
                )}
              >
                {m.role === "user" ? <UserAvatar /> : <BotAvatar />}
                <Markdown className="flex flex-col gap-y-3">
                  {m.role !== "data" && m.content}
                </Markdown>
              </div>
            ))}
            {/* Scroll target */}
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 0 && <Empty label="Chat With Assistant" />}
        </div>
      </div>
      <div className="flex items-center px-4 lg:px-8">
        <form
          onSubmit={submitMessage}
          className="
        rounded-lg 
        border 
        w-full 
        p-4 
        px-3 
        md:px-6 
        focus-within:shadow-sm
        grid
        grid-cols-12
        gap-2
      "
        >
          <input
            disabled={status !== "awaiting_message"}
            value={input}
            placeholder="What is the temperature in the living room?"
            onChange={handleInputChange}
            className="col-span-12 lg:col-span-10 p-2 rounded-xl border-gray-300 border-2"
          />
          <Button
            className="col-span-12 lg:col-span-2 w-full bg-sky-500"
            type="submit"
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Conversation;
