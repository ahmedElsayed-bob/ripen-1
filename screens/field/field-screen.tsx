"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { deleteFarm, getFarmById } from "@/lib/storage";
import { FarmType } from "@/types/farm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bell,
  Calendar,
  ChevronRight,
  CircleDollarSign,
  Flame,
  Image,
  Mic,
  Send,
  Wheat,
} from "lucide-react";
import { FarmPlotsMap } from "./map/farm-plots-map";
import { useRouter } from "next/navigation";
import ChatAgent from "./chatbot/chatbot";
import { ReadinessOverlay } from "@/components/readiness-overlay";
import { LiveIndicator } from "@/components/live-indicator";
import { CalendarComponent } from "../farms/calendar";

export function FieldScreen({ id }: { id: string }) {
  const [farm, setFarm] = useState<FarmType>();
  const [isLoading, setIsLoading] = useState(true);
  const [chatboxMessage, setChatboxMessage] = useState<string>();
  const router = useRouter();
  const chatbotSendButton = useRef<HTMLButtonElement>(null);

  const handleSendKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      chatbotSendButton.current?.click();
    }
  };

  useEffect(() => {
    const farm = getFarmById(id);
    setFarm(farm);
    setIsLoading(false);
  }, [id]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        LOADING....
      </div>
    );

  if (!farm) return <EmptyState />;

  const handleDeleteFarm = () => {
    deleteFarm(id);
    router.push("/fields");
  };

  return (
    <div>
      <div className="border-b border-[#f5f2f0] py-4 mb-4">
        <div className="container mx-auto">
          <PageBreadcrumb />

          <h1 className="text-2xl font-bold mb-1">{farm.name}</h1>
          <p className="text-sm text-gray-500">
            Track crop conditions and assess field readiness for optimal
            harvest.
          </p>
        </div>
      </div>

      <div className="container mx-auto">
        <div className="flex gap-4">
          <div className="h-[700px] flex-1 bg-gray-200 rounded-xl overflow-hidden relative">
            <FarmPlotsMap farm={farm} />

            <div className="absolute bottom-4 left-4">
              <ReadinessOverlay />
            </div>

            <div className="absolute top-4 right-4">
              <div className="flex items-center gap-2">
                <CalendarComponent
                  value={new Date().toISOString()}
                  onChange={(value) => {}}
                />
                <LiveIndicator isLive={true} onClick={() => {}} />
              </div>
            </div>
          </div>

          <div className="w-[300px] flex flex-col gap-6">
            <Card className="py-4 gap-3 shadow-lg">
              <CardHeader className="px-4">
                <CardTitle className="flex items-center gap-2">
                  <Bell size={16} />
                  <p>Notifications</p>
                </CardTitle>
                <CardAction>
                  <ChevronRight size={16} />
                </CardAction>
              </CardHeader>
              <CardContent className="text-sm text-gray-500 flex flex-col gap-2 px-4">
                <div className="flex items-center gap-2">
                  <Flame size={14} />
                  <p>Heatwave risk expected next week</p>
                </div>
                <div className="flex items-center gap-2">
                  <Image size={14} />
                  <p>Photo overdue in Plot 4</p>
                </div>
                <div className="flex items-center gap-2">
                  <CircleDollarSign size={14} />
                  <p>Buyer price +5%</p>
                </div>
              </CardContent>
            </Card>

            <Card className="py-4 gap-3 shadow-lg">
              <CardHeader className="px-4">
                <CardTitle className="flex items-center gap-2">
                  <Calendar size={16} />
                  <p>Estimated Time To Harvest</p>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-500">
                <p>7 - 9 days</p>
              </CardContent>
            </Card>

            <Card className="py-4 gap-3 shadow-lg">
              <CardHeader
                className="px-4 cursor-pointer"
                onClick={() => router.push(`/fields/${id}/profitability`)}
              >
                <CardTitle className="flex items-center gap-2">
                  <Wheat size={16} />
                  <p>Forecasted Yield</p>
                </CardTitle>
                <CardAction>
                  <ChevronRight size={16} />
                </CardAction>
              </CardHeader>
              <CardContent className="text-sm text-gray-500">
                <p>1240 tons</p>
              </CardContent>
            </Card>

            <Card className="py-4 gap-3 shadow-lg">
              <CardHeader className="px-4">
                <CardTitle className="flex items-center gap-2">
                  <CircleDollarSign size={16} />
                  <p>Revenue</p>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-500">
                308,090.4 USD
              </CardContent>
            </Card>

            <Card className="p-0 shadow-lg">
              <CardContent className="p-0 relative">
                <textarea
                  value={chatboxMessage}
                  onChange={(e) => setChatboxMessage(e.target.value)}
                  onKeyDown={handleSendKeyDown}
                  className="w-full h-24 resize-none border border-transparent rounded-md p-2 text-sm outline-none"
                  placeholder="Ask Ripen"
                ></textarea>
                <div className="p-2 flex justify-end gap-2.5">
                  <Button
                    className="text-[#6B6661] hover:bg-green-200 cursor-pointer"
                    form="chat-agent-form"
                    variant="secondary"
                  >
                    <Mic size={16} />
                  </Button>
                  <ChatAgent
                    startMessage={chatboxMessage}
                    onClose={() => {
                      setChatboxMessage("");
                    }}
                  >
                    <Button
                      ref={chatbotSendButton}
                      disabled={!chatboxMessage}
                      size="sm"
                      className="h-full bg-green-500 text-white hover:bg-green-500/90 cursor-pointer"
                    >
                      <Send size={16} />
                    </Button>
                  </ChatAgent>
                </div>
              </CardContent>
            </Card>

            <Button variant="destructive" onClick={handleDeleteFarm}>
              Delete field
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PageBreadcrumb() {
  return (
    <Breadcrumb className="mb-3">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/fields">Fields</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Readiness heatmap</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

const EmptyState = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen gap-4">
      <p className="text-2xl font-bold">No data found</p>
      <Link href="/fields">
        <Button>Back to fields list</Button>
      </Link>
    </div>
  );
};
