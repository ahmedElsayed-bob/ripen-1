import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CornerDownLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function FieldsDashboardsPage() {
  return (
    <div className="h-full relative">
      <Image
        src="/star-1.png"
        alt="star-1"
        width={100}
        height={100}
        className="absolute top-0 left-0 w-full h-full"
      />
      <div className="container mx-auto relative">
        <div className="py-24">
          <h1 className="text-4xl font-bold mb-4">Ripen</h1>
          <p className="text-2xl mb-4 text-[#212D45]">
            Know the day. Harvest the gain.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="h-[280px] rounded-xl overflow-hidden relative group">
              <Image
                src="/manage-farm.png"
                alt="manage-farm"
                width={1000}
                height={1000}
                className="w-full h-full object-cover"
              />

              <div className="absolute bottom-0 left-0 right-0 text-white p-4 text-3xl font-semibold group-hover:hidden flex items-center justify-between">
                <p>Manage my Farm</p>
                <Image
                  src="/logo-arrow.svg"
                  alt="Ripen"
                  width={30}
                  height={30}
                />
              </div>

              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white p-4 text-3xl font-semibold group-hover:flex hidden">
                Coming soon...
              </div>
            </div>
            <div className="h-[280px] rounded-xl overflow-hidden relative">
              <Link href="/fields">
                <Image
                  src="/manage-field.png"
                  alt="manage-farm"
                  width={1000}
                  height={1000}
                  className="w-full h-full object-cover"
                />

                <div className="absolute bottom-0 left-0 right-0 text-white p-4 text-3xl font-semibold flex items-center justify-between">
                  <p>Manage my Field</p>
                  <Image
                    src="/logo-arrow.svg"
                    alt="Ripen"
                    width={30}
                    height={30}
                  />
                </div>
              </Link>
            </div>
          </div>

          <h2 className="text-3xl text-[#212D45] mb-4 font-bold">
            Meet Ripen – Your Agriculture AI Expert
          </h2>
          <div className="shadow-lg rounded-xl p-4">
            <div className="flex items-center gap-4 mb-12">
              <Image
                src="/colored-logo.svg"
                width={30}
                height={30}
                alt="colored-logo"
              />
              <p className="bg-[#F9F7F6] py-2 px-4 rounded-xl">
                Welcome to Ripen! Ask me anything...{" "}
              </p>
            </div>

            <div className="flex items-center gap-2 bg-[#F9F7F6] rounded-xl p-2">
              <Input
                type="text"
                className="flex-1 bg-white"
                placeholder="Ask anything..."
              />
              <Button className="bg-[#0D826B] hover:bg-[#0D826B]/90">
                <CornerDownLeft />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
