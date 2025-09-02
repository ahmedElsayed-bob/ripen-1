import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Send, Mic } from "lucide-react";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

interface ChatAgentForm {
  message: string;
}

interface ChatMessage {
  id: string;
  message: string;
  isUser: boolean;
  isTyping?: boolean;
  timestamp?: string;
}

interface ChatAgentProps {
  startMessage?: string;
  children: React.ReactNode;
  onClose?: () => void;
}

const ChatAgent = ({ startMessage, children, onClose }: ChatAgentProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const responseIdx = useRef<number>(0);

  // Mock responses for the AI
  const mockResponses = [
    "I’d hold for one more day and start Thursday, Sep 4. Here’s why: the crop is already in good shape—about 88% harvest-ready today—but the model expects it to tick up to around 95% by Thursday, with grain moisture easing from ~22.6% to ~20.8%.\nIf we cut before Wednesday night’s light rain, we risk a quality hit and a bit of sprouting around the low spots; if we wait, we avoid drying costs and likely pick up a small price premium. Market signals are still slightly positive this week and soften after the weekend, so Thu/Fri is the sweet spot. If you want, I can replan the calendar to target Sep 4–5 and send a quick photo task for the B3 edge where confidence is lower.",
    "Here’s a clean two-day run. Crew A (six pickers plus one operator) with Harvester H-2 works plot 1, then plot2, then plot3; morning pass 06:30–10:30 and an evening pass 16:00–19:00 to stay out of the midday heat. Crew B (five pickers plus one operator) with Harvester H-3 finishes plot4 and perimeter passes on a 07:00–12:00 shift. Tractor T-7 handles haulage to Silo-1 with T-4 as backup; I’ll hold transport slots at 11:00 and 17:00 both days.\nThroughput should land around 310 tons per day—call it 620–630 tons total. With current rates (labor ~AED 15/h, operators ~AED 28/h, standard fuel/lube), daily operating cost is roughly AED 92k, so AED ~184k for the two days. At today’s spot price that pencils out to ~AED 720.7k in revenue and ~AED 536.7k gross margin—about AED 68k better than harvesting today.\nWant me to apply this plan, and generate the tractor routes?",
  ];

  const formMethods = useForm<ChatAgentForm>({
    defaultValues: {
      message: "",
    },
  });

  const isMessageValid = formMethods.formState.isValid;

  const simulateStreamingResponse = async (response: string) => {
    setIsAiTyping(true);

    // Add typing indicator
    const typingId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      {
        id: typingId,
        message: "AI is typing...",
        isUser: false,
        isTyping: true,
      },
    ]);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Remove typing indicator
    setMessages((prev) => prev.filter((msg) => msg.id !== typingId));

    // Add the actual response with streaming effect
    const responseId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      { id: responseId, message: "", isUser: false },
    ]);

    // Stream the response word by word
    const words = response.split(" ");
    for (let i = 0; i < words.length; i++) {
      await new Promise((resolve) =>
        setTimeout(resolve, 50 + Math.random() * 50)
      );
      const currentText = words.slice(0, i + 1).join(" ");

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === responseId ? { ...msg, message: currentText } : msg
        )
      );
    }

    setIsAiTyping(false);
  };

  const onSubmit: SubmitHandler<ChatAgentForm> = async (data) => {
    if (isAiTyping) return; // Prevent submission while AI is responding

    formMethods.reset();

    // Add user message
    const userMessage = {
      id: crypto.randomUUID(),
      message: data.message,
      isUser: true,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Get random AI response and simulate streaming
    const randomResponse = mockResponses[responseIdx.current];
    responseIdx.current = (responseIdx.current + 1) % 2;
    await simulateStreamingResponse(randomResponse);
  };

  const messageContainerClass = (isUser: ChatMessage["isUser"]) =>
    classNames("flex flex-col gap-1 w-2/3", {
      "self-end": isUser,
      "self-start": !isUser,
    });

  const messageTimeClass = (isUser: ChatMessage["isUser"]) =>
    classNames("text-xs text-bim-compliance-text-secondary", {
      "text-right": isUser,
      "text-left": !isUser,
    });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Dialog
      onOpenChange={(isOpen) => {
        if (isOpen) {
          if (startMessage) {
            onSubmit({ message: startMessage });
          }
          // Dialog Closed
        } else {
          responseIdx.current = 0;
          setMessages([]);
          onClose?.();
        }
      }}
    >
      <DialogTrigger>{children}</DialogTrigger>

      <DialogContent className="min-w-1/2">
        <DialogHeader className="flex gap-2 items-center px-3">
          <DialogTitle className="px-3 py-2 bg-bim-compliance-background-table rounded-lg text-sm font-medium text-bim-compliance-text-primary">
            Ask Ripen
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 border border-bim-compliance-secondary-border-alt py-3 rounded-2xl bg-gradient-1 h-[500px] overflow-auto">
          <div className="flex flex-col gap-3 flex-grow overflow-auto px-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={messageContainerClass(message.isUser)}
              >
                <div
                  className={classNames("rounded-lg p-2", {
                    "bg-[#f5f2f0]": message.isUser,
                    "bg-[#B6DBD4]": !message.isUser,
                    "animate-pulse": message.isTyping,
                  })}
                >
                  <p className="text-sm font-medium text-bim-compliance-text-primary">
                    {message.isTyping ? (
                      <span className="flex items-center gap-1">
                        AI is typing
                        <div className="flex gap-1">
                          <span
                            className="w-1 h-1 bg-current rounded-full animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          />
                          <span
                            className="w-1 h-1 bg-current rounded-full animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          />
                          <span
                            className="w-1 h-1 bg-current rounded-full animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          />
                        </div>
                      </span>
                    ) : (
                      message.message
                    )}
                  </p>
                </div>

                {!message.isTyping ? (
                  <p className={messageTimeClass(message.isUser)}>
                    {new Date(
                      message.timestamp || new Date().toISOString()
                    ).toLocaleTimeString()}
                  </p>
                ) : null}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form
            className="flex gap-2 items-center px-3"
            id="chat-agent-form"
            onSubmit={formMethods.handleSubmit(onSubmit)}
          >
            <Controller
              control={formMethods.control}
              name="message"
              render={({ field }) => (
                <div className="flex-1">
                  <Input
                    placeholder={
                      isAiTyping ? "AI is responding..." : "Ask anything..."
                    }
                    disabled={isAiTyping}
                    {...field}
                  />
                </div>
              )}
              rules={{ required: true }}
            />
            <Button
              className="text-[#6B6661] hover:bg-green-200 cursor-pointer"
              disabled={isAiTyping}
              form="chat-agent-form"
              variant="secondary"
            >
              <Mic size={16} />
            </Button>
            <Button
              className="bg-green-500 text-white hover:bg-green-500/90 cursor-pointer"
              disabled={!isMessageValid || isAiTyping}
              form="chat-agent-form"
              type="submit"
              variant="secondary"
            >
              <Send size={16} />
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatAgent;
