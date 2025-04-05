
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DataCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function DataCard({ title, children, className }: DataCardProps) {
  return (
    <div className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}>
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-xl font-semibold leading-none tracking-tight">{title}</h3>
      </div>
      <div className="p-6 pt-0">{children}</div>
    </div>
  );
}
