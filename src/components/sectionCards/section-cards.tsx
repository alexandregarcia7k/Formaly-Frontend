import { TrendingUp, TrendingDown, Info } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface StatCard {
  title: string;
  value: string | number;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  description: string;
  footer: string;
}

interface SectionCardsProps {
  stats: StatCard[];
}

export function SectionCards({ stats }: SectionCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="@container/card">
          <CardHeader>
            <CardDescription>{stat.title}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {stat.value}
            </CardTitle>
            {stat.trend && (
              <CardAction>
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="touch-manipulation"
                        onClick={(e) => e.preventDefault()}
                      >
                        <Badge 
                          variant="outline"
                          className={cn(
                            "gap-1 cursor-help",
                            stat.trend.isPositive 
                              ? "border-primary/20 bg-primary/5 text-primary" 
                              : "border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-500"
                          )}
                        >
                          {stat.trend.isPositive ? (
                            <TrendingUp className="size-3.5" />
                          ) : (
                            <TrendingDown className="size-3.5" />
                          )}
                          {stat.trend.value}
                          <Info className="size-3 ml-0.5 opacity-60" />
                        </Badge>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p className="text-xs">
                        {stat.trend.value.includes('pp') 
                          ? 'pp = pontos percentuais. Diferença absoluta entre percentuais (ex: de 25% para 100% = +75pp)'
                          : stat.trend.value.includes('%')
                          ? 'Variação percentual em relação ao período anterior'
                          : stat.trend.value.includes('s')
                          ? 'Variação em segundos do tempo médio'
                          : 'Variação em relação ao período anterior'
                        }
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardAction>
            )}
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {stat.description}
            </div>
            <div className="text-muted-foreground">{stat.footer}</div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
