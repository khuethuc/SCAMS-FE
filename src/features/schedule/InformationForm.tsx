import ScheduleTabs from "./information_form/ScheduleTabs";
import Search from "./information_form/Search";
import Filter from "./information_form/Filter";

export default function InformationForm() {
  return (
    <div className="w-full bg-white border rounded-2xl p-6 shadow-sm">
      <ScheduleTabs />
      <div className="mt-6">
        <Search />
      </div>
      <div className="border-t my-6" />
      <Filter />
    </div>
  );
}
