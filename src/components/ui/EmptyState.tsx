
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center space-y-3 py-12 text-center", className)}>
      <div className="text-muted-foreground/50 h-16 w-16 flex items-center justify-center rounded-full bg-muted/20">
        {icon}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && <p className="text-sm text-muted-foreground max-w-md">{description}</p>}
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}
