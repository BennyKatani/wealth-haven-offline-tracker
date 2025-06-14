
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface DashboardHeaderProps {
  onAddAccount: () => void;
}

export const DashboardHeader = ({ onAddAccount }: DashboardHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/20">
      <h1 className="text-3xl font-bold text-white">Financial Overview</h1>
      <Button onClick={onAddAccount} size="lg">
        <PlusCircle className="mr-2 h-5 w-5" />
        Add Account
      </Button>
    </div>
  );
};
