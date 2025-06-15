
import { Button } from "@/components/ui/button";
import { PlusCircle, Settings } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface DashboardHeaderProps {
  onAddAccount: () => void;
  onOpenSettings: () => void;
}

export const DashboardHeader = ({ onAddAccount, onOpenSettings }: DashboardHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/20">
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Financial Overview</h1>
      <div className="flex items-center space-x-2">
        <Button onClick={onAddAccount} size="lg" className="hidden sm:flex">
          <PlusCircle className="mr-2 h-5 w-5" />
          Add Account
        </Button>
        <Button onClick={onAddAccount} size="icon" className="flex sm:hidden rounded-full">
          <PlusCircle className="h-5 w-5" />
        </Button>
        <Button onClick={onOpenSettings} size="icon" variant="ghost" className="text-foreground rounded-full hover:bg-accent hover:text-accent-foreground">
          <Settings className="h-5 w-5" />
        </Button>
        <ThemeToggle />
      </div>
    </div>
  );
};
