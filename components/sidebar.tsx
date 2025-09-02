"use client";

import { Home, LayoutDashboard, Map, Bell, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="h-screen p-4 pt-6">
      <div className="h-full">
        <div className="mb-6">
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="logo"
              width={32}
              height={32}
              className="m-auto"
            />
          </Link>
        </div>
        <nav>
          <ul className="flex flex-col gap-1">
            <li>
              <Link
                href="/"
                className={`hover:bg-[#e8e2db] inline-block p-1.5 rounded-lg ${
                  isActive("/") ? "bg-[#e8e2db]" : ""
                }`}
              >
                <Home className="w-4 h-4" />
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className={`hover:bg-[#e8e2db] inline-block p-1.5 rounded-lg  ${
                  isActive("/dashboards") ? "bg-[#e8e2db]" : ""
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
              </Link>
            </li>
            <li>
              <Link
                href="/fields"
                className={`hover:bg-[#e8e2db] inline-block p-1.5 rounded-lg ${
                  isActive("/fields") ? "bg-[#e8e2db]" : ""
                }`}
              >
                <Map className="w-4 h-4" />
              </Link>
            </li>
            <li>
              <Link
                href="/calendar"
                className={`hover:bg-[#e8e2db] inline-block p-1.5 rounded-lg ${
                  isActive("/notifications") ? "bg-[#e8e2db]" : ""
                }`}
              >
                <Calendar className="w-4 h-4" />
              </Link>
            </li>
            <li>
              <Link
                href="/notifications"
                className={`hover:bg-[#e8e2db] inline-block p-1.5 rounded-lg ${
                  isActive("/notifications") ? "bg-[#e8e2db]" : ""
                }`}
              >
                <Bell className="w-4 h-4" />
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
