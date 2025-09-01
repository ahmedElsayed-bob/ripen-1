import { FarmSectionType } from "@/types/farm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

interface Props {
  sections: FarmSectionType[];
  farmId: string;
  plot: string;
}

export function PlotHeadSection({ sections, farmId, plot }: Props) {
  const router = useRouter();

  const onSelectSection = (sectionId: string) => {
    router.push(`/fields/${farmId}/${sectionId}`);
  };

  if (!sections?.length) return null;

  return (
    <div className="flex items-center gap-2">
      <Select defaultValue={plot} onValueChange={onSelectSection}>
        <SelectTrigger className="bg-white w-40">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          {sections?.map((section) => (
            <SelectItem value={section.id} key={section.id}>
              Plot {section.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <LiveIndicator />
    </div>
  );
}

function LiveIndicator() {
  return (
    <div className="flex items-center gap-2 bg-white h-9 px-4 rounded-md border border-gray-200">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      <span className="text-sm">Live</span>
    </div>
  );
}
