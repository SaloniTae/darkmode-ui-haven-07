
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface DataCardProps {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  cardClassName?: string;
  onClick?: () => void;
}

export function DataCard({ 
  title, 
  children, 
  footer, 
  className, 
  cardClassName,
  onClick
}: DataCardProps) {
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-300 glass-morphism", 
        onClick ? "cursor-pointer hover:translate-y-[-4px] hover:shadow-lg" : "",
        cardClassName
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className={cn("", className)}>
        {children}
      </CardContent>
      {footer && (
        <CardFooter className="border-t border-white/5 pt-4">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}
