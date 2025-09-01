import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";

interface PlotPageHeaderProps {
  title: string;
  subtitle: string;
  farmName: string;
  id: string;
  breadcrumbSuffix: { label: string; href?: string }[];
}

export function PlotPageHeader(props: PlotPageHeaderProps) {
  const { farmName, id, breadcrumbSuffix, title, subtitle } = props;

  return (
    <div className="border-b border-[#f5f2f0] py-4 mb-4">
      <div className="container mx-auto">
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
              <BreadcrumbLink href={`/fields/${id}`}>{farmName}</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            {breadcrumbSuffix.map((item, index) => {
              if (item.href) {
                return (
                  <React.Fragment key={index}>
                    <BreadcrumbItem key={index}>
                      <BreadcrumbLink href={item.href}>
                        {item.label}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                  </React.Fragment>
                );
              }

              return (
                <BreadcrumbItem key={index}>
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                </BreadcrumbItem>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="text-2xl font-bold mb-1">{title}</h1>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
}
