import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-full">
      <div className="relative">
        <Image
          src="/hero.jpg"
          alt="hero"
          width={1000}
          height={1000}
          className="w-full max-h-[700px] object-cover"
        />

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full flex flex-col justify-center text-white max-w-[700px]">
          <h1 className="text-6xl font-bold text-[#F7C35F] mb-6">
            AI71’s Agriculture Suite
          </h1>
          <p className="text-2xl mb-6">
            A unified suite of AI agents that automates farming end to end—from
            seed to sale
          </p>

          <div>
            <Button
              className="bg-[#F7C35F] text-black min-w-[200px] hover:bg-[#F7C35F]/90"
              size="lg"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto py-18">
        <h2 className="text-4xl flex gap-2 mb-3">
          Agriculture by
          <Image src="/ai71-logo.svg" alt="logo" width={50} height={50} />
        </h2>

        <p className="text-3xl text-[#212D45] mb-6">
          From seed to sale, one AI suite
        </p>

        <p className="text-2xl font-bold mb-4">Our Agentic AI Solutions</p>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="relative rounded-xl overflow-hidden group">
            <Image
              src="/solution1.png"
              alt="Ripen"
              width={150}
              height={150}
              className="w-full h-[150px] object-cover"
            />
            <div className="absolute bottom-4 right-4 left-4 flex items-center justify-between text-white group-hover:hidden">
              <p className="text-2xl font-bold">Ripen71</p>
              <Image src="/logo-arrow.svg" alt="Ripen" width={30} height={30} />
            </div>

            <div className="inset-0 px-4 absolute bg-black/50 flex flex-col items-center gap-2 justify-center text-white text-center group-hover:flex hidden">
              <Link href="/login">
                <Button
                  variant={"outline"}
                  size={"lg"}
                  className="bg-transparent border-white text-white"
                >
                  Sign in
                </Button>
              </Link>
              <p>Know the day. Harvest the gain.</p>
            </div>
          </div>

          <div className="relative rounded-xl overflow-hidden group">
            <Image
              src="/solution2.png"
              alt="Ripen"
              width={150}
              height={150}
              className="w-full h-[150px] object-cover"
            />

            <div className="absolute bottom-4 right-4 left-4 flex items-center justify-between text-white group-hover:hidden">
              <p className="text-2xl font-bold">Canopy</p>
              <Image src="/logo-arrow.svg" alt="Ripen" width={30} height={30} />
            </div>

            <div className="inset-0 px-4 absolute bg-black/50 flex flex-col items-center gap-2 justify-center text-white text-center group-hover:flex hidden">
              <p className="text-xl font-bold">Coming Soon</p>
              <p>See issues early, act at the right moment.</p>
            </div>
          </div>

          <div className="relative rounded-xl overflow-hidden group">
            <Image
              src="/solution3.png"
              alt="Ripen"
              width={150}
              height={150}
              className="w-full h-[150px] object-cover"
            />
            <div className="absolute bottom-4 right-4 left-4 flex items-center justify-between text-white group-hover:hidden">
              <p className="text-2xl font-bold">Sort</p>
              <Image src="/logo-arrow.svg" alt="Ripen" width={30} height={30} />
            </div>
            <div className="inset-0 px-4 absolute bg-black/50 flex flex-col items-center gap-2 justify-center text-white text-center group-hover:flex hidden">
              <p className="text-xl font-bold">Coming Soon</p>
              <p>Grade right, first time—fewer rejections.</p>
            </div>
          </div>

          <div className="relative rounded-xl overflow-hidden group">
            <Image
              src="/solution4.png"
              alt="Ripen"
              width={150}
              height={150}
              className="w-full h-[150px] object-cover"
            />
            <div className="absolute bottom-4 right-4 left-4 flex items-center justify-between text-white group-hover:hidden">
              <p className="text-2xl font-bold">Agora</p>
              <Image src="/logo-arrow.svg" alt="Ripen" width={30} height={30} />
            </div>

            <div className="inset-0 px-4 absolute bg-black/50 flex flex-col items-center gap-2 justify-center text-white text-center group-hover:flex hidden">
              <p className="text-xl font-bold">Coming Soon</p>
              <p>Market intelligence that moves margins.</p>
            </div>
          </div>

          <div className="relative rounded-xl overflow-hidden group">
            <Image
              src="/solution5.png"
              alt="Ripen"
              width={150}
              height={150}
              className="w-full h-[150px] object-cover"
            />
            <div className="absolute bottom-4 right-4 left-4 flex items-center justify-between text-white group-hover:hidden">
              <p className="text-2xl font-bold">Nexus</p>
              <Image src="/logo-arrow.svg" alt="Ripen" width={30} height={30} />
            </div>

            <div className="inset-0 px-4 absolute bg-black/50 flex flex-col items-center gap-2 justify-center text-white text-center group-hover:flex hidden">
              <p className="text-xl font-bold">Coming Soon</p>
              <p>From field to port—faster, simpler, compliant.</p>
            </div>
          </div>

          <div className="relative rounded-xl overflow-hidden group">
            <Image
              src="/solution6.png"
              alt="Incrop"
              width={150}
              height={150}
              className="w-full h-[150px] object-cover"
            />
            <div className="absolute bottom-4 right-4 left-4 flex items-center justify-between text-white group-hover:hidden">
              <p className="text-2xl font-bold">Incrop</p>
              <Image
                src="/logo-arrow.svg"
                alt="Incrop arrow"
                width={30}
                height={30}
              />
            </div>

            <div className="inset-0 px-4 absolute bg-black/50 flex flex-col items-center gap-2 justify-center text-white text-center group-hover:flex hidden">
              <p className="text-xl font-bold">Coming Soon</p>
              <p>Forecast inputs. Source smarter.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
