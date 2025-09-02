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
      <div className="container mx-auto">
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
                width={100}
                height={100}
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
                  width={100}
                  height={100}
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

          <h2 className="text-3xl text-[#212D45] mb-4">
            Meet Ripen – Your Agriculture AI Expert
          </h2>
          <div className="h-[100px] bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
