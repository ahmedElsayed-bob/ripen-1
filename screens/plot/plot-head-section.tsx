import { FarmSectionType } from "@/types/farm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { CalendarComponent } from "../farms/calendar";
import { isToday } from "date-fns";
import { LiveIndicator } from "@/components/live-indicator";

interface Props {
  sections: FarmSectionType[];
  farmId: string;
  plot: string;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

export function PlotHeadSection({
  sections,
  farmId,
  plot,
  selectedDate,
  setSelectedDate,
}: Props) {
  const router = useRouter();

  const onSelectSection = (sectionId: string) => {
    router.push(`/fields/${farmId}/${sectionId}`);
  };
  const isSelectedDateIsToday = isToday(selectedDate);

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

      <CalendarComponent
        value={selectedDate}
        onChange={(value) => {
          setSelectedDate(value);
        }}
      />
      <LiveIndicator
        isLive={isSelectedDateIsToday}
        onClick={() => setSelectedDate(new Date().toISOString())}
      />
    </div>
  );
}
