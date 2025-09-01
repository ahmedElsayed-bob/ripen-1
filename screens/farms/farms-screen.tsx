import { FarmsList } from "./farms-list";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Filter, ListFilter } from "lucide-react";

export function FarmsScreen() {
  return (
    <div>
      <div className="border-b border-[#f5f2f0] py-4 mb-4">
        <div className="container mx-auto">
          <Breadcrumb className="mb-3">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Fields</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h1 className="text-2xl font-bold mb-1">My Fields</h1>
          <p className="text-sm text-gray-500">
            Track existing fields or add new fields.
          </p>
        </div>
      </div>

      <div className="container mx-auto">
        <div className="flex flex-row gap-6 justify-end text-sm text-gray-700 mb-4">
          <div className="flex flex-row gap-2 items-center">
            <Filter size={12} />
            Filters
          </div>
          <div className="flex flex-row gap-2 items-center">
            <ListFilter size={12} />
            Sort
          </div>
        </div>
        <FarmsList />
      </div>
    </div>
  );
}
