import { Sidebar } from "@/components/sidebar";

export default function FieldsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-row h-screen">
      <Sidebar />
      <div className="flex flex-col w-full bg-white m-4 ms-0 rounded-xl shadow-md overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
