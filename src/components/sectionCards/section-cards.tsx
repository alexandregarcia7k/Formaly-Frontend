import { IconTrendingUp, IconTrendingDown } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
                <Badge variant="outline">
                  {stat.trend.isPositive ? (
                    <IconTrendingUp className="size-4" />
                  ) : (
                    <IconTrendingDown className="size-4" />
                  )}
                  {stat.trend.value}
                </Badge>
              </CardAction>
            )}
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {stat.description}
              {stat.trend && (
                stat.trend.isPositive ? (
                  <IconTrendingUp className="size-4" />
                ) : (
                  <IconTrendingDown className="size-4" />
                )
              )}
            </div>
            <div className="text-muted-foreground">{stat.footer}</div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
