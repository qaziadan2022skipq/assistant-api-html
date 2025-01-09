"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formSchema } from "./constants";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";
import { cn } from "@/lib/utils";
import useMessageStore from "@/hooks/message-store";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";
import { useToast } from "@/hooks/use-toast";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import Heading from "@/components/heading";
import { BotIcon, SproutIcon } from "lucide-react";
import { useEffect } from "react";

const Conversation = () => {
  const router = useRouter();
  const messages = useMessageStore();
  const { toast } = useToast();


  useEffect(() => {
    // create new thread
    localStorage.setItem("OpenAIAssistantThreadId", "");
    createThread();
    
  }, []);

  const createThread = async () => {
    const response = await axios.post("/api/create-thread");
    localStorage.setItem("OpenAIAssistantThreadId", response.data);
    console.log(response.data)
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      messages.addMessage({ role: "user", message_content: values.prompt });
      const botAnswer = await axios.post("/api/openai-assistant-bot", {
        userMessage: JSON.stringify(values.prompt),
        threadId: localStorage.getItem("OpenAIAssistantThreadId"),
      });
        console.log(botAnswer.data.text.value)
      messages.addMessage({
        role: "bot",
        message_content: botAnswer.data.text.value,
      });
      form.reset();
    } catch (error: any) {
      console.log(error);
    } finally {
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col min-h-screen border rounded-xl pb-1 shadow-md bg-white">
      <Heading
        title="Your Assistant"
        description="Chat with more powerful assistant"
        icon={BotIcon}
        iconColor="text-sky-500"
        bgColor="bg-sky-500/10"
      />
      <div className="flex-1 px-4 lg:px-8 overflow-auto">
        <div className="space-y-4 mt-4">
          <div className="flex flex-col gap-y-4">
            {messages.messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "p-6 w-full flex items-start gap-x-8 rounded-lg",
                  message.role === "user"
                    ? "bg-white border border-black/10"
                    : "bg-muted border border-black/20"
                )}
              >
                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                <p className="text-sm whitespace-pre-wrap">
                  {String(message.message_content)}
                </p>
              </div>
            ))}
          </div>
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader />
            </div>
          )}
          {messages.messages.length === 0 && !isLoading && (
            <Empty label="Chat With Assistant" />
          )}
        </div>
      </div>
      <div id="Message" className="px-4 lg:px-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
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
            <FormField
              name="prompt"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-10">
                  <FormControl className="m-0 p-0">
                    <Input
                      className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                      disabled={isLoading}
                      placeholder="How can I help you today?"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              className="col-span-12 lg:col-span-2 w-full bg-sky-500"
              type="submit"
              disabled={isLoading}
              size="icon"
            >
              Send
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Conversation;