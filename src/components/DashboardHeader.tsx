
import { Button } from "@/components/ui/button";
import { PlusCircle, Settings } from "lucide-react";

interface DashboardHeaderProps {
  onAddAccount: () => void;
  onOpenSettings: () => void;
}

export const DashboardHeader = ({ onAddAccount, onOpenSettings }: DashboardHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/20">
      <h1 className="text-3xl font-bold text-white">Financial Overview</h1>
      <div className="flex items-center space-x-2">
        <Button onClick={onAddAccount} size="lg">
          <PlusCircle className="mr-2 h-5 w-5" />
          Add Account
        </Button>
        <Button onClick={onOpenSettings} size="icon" variant="ghost" className="text-white rounded-full hover:bg-white/10 hover:text-white">
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
