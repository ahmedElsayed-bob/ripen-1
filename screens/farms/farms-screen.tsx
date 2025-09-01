import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
        {/* <FarmsFilters /> */}
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

function FarmsFilters() {
  return (
    <div className="flex flex-row gap-2 justify-between items-center mb-4">
      <div className="flex flex-row gap-2">
        <Input className="bg-white w-80" placeholder="Search farms" />

        <Select defaultValue="0">
          <SelectTrigger className="bg-white w-40">
            <SelectValue placeholder="Select a Region" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="0">Regions: All</SelectItem>
            <SelectItem value="1">Region 1</SelectItem>
            <SelectItem value="2">Region 2</SelectItem>
            <SelectItem value="3">Region 3</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="0">
          <SelectTrigger className="bg-white w-40">
            <SelectValue placeholder="Select a Crop" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="0">crop: All</SelectItem>
            <SelectItem value="1">crop 1</SelectItem>
            <SelectItem value="2">crop 2</SelectItem>
            <SelectItem value="3">crop 3</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-row gap-2 items-center">
        <p>Sort by</p>
        <Select defaultValue="0">
          <SelectTrigger className="bg-white w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="0">Default</SelectItem>
            <SelectItem value="1">Next harvest</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
