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

  // Mock responses for the AI
  const mockResponses = [
    "Random response #1",
    "Random response #2",
    "Random response #3",
    "Random response #4",
    "Random response #5",
    "Random response #6",
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
        setTimeout(resolve, 50 + Math.random() * 100)
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
    const randomResponse =
      mockResponses[Math.floor(Math.random() * mockResponses.length)];
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
          console.log("open", startMessage);
          if (startMessage) {
            onSubmit({ message: startMessage });
          }
          // Dialog Closed
        } else {
          console.log("closed");
          setMessages([]);
          onClose?.();
        }
      }}
    >
      <DialogTrigger>{children}</DialogTrigger>

      <DialogContent>
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
