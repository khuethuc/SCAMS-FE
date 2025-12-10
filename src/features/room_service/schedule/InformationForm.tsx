import ScheduleTabs from "./information_form/ScheduleTabs";
import Search from "./information_form/Search";
import Filter from "./information_form/Filter";
import { InformationFormProps } from "@/type/type";

export default function InformationForm({
  selectedTab,
  onTabChange,
  canViewMySchedule,
  searchTerm,
  onSearchChange,
  filters,
  onFiltersChange,
  availableRooms,
}: InformationFormProps) {
  return (
    <div className="w-full bg-white border rounded-2xl p-6 shadow-sm">
      <ScheduleTabs
        value={selectedTab}
        onChange={onTabChange}
        isAuthenticated={canViewMySchedule}
      />
      <div className="mt-6">
        <Search value={searchTerm} onChange={onSearchChange} />
      </div>
      <div className="border-t my-6" />
      <Filter
        filters={filters}
        onFiltersChange={onFiltersChange}
        rooms={availableRooms}
      />
    </div>
  );
}
