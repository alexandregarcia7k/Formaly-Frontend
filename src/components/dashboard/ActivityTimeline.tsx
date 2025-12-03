"use client";

import { useRouter } from "next/navigation";
import { FileText, MessageSquare, Edit, Trash2, ToggleLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import type { ActivityItem } from "@/schemas";

interface ActivityTimelineProps {
  activities: ActivityItem[];
}

const activityIcons = {
  form_created: FileText,
  form_updated: Edit,
  response_received: MessageSquare,
  form_deleted: Trash2,
  form_status_changed: ToggleLeft,
} as const;

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  const router = useRouter();

  const handleActivityClick = (activity: ActivityItem) => {
    const formId = activity.metadata?.formId;
    
    if (!formId) return;

    switch (activity.type) {
      case 'form_created':
      case 'form_updated':
      case 'form_status_changed':
        router.push(`/dashboard/forms/${formId}/edit`);
        break;
      case 'response_received':
        router.push(`/dashboard/responses?formId=${formId}`);
        break;
    }
  };

  // Validação: array vazio
  if (!activities || activities.length === 0) {
    return (
      <Card className="py-4">
        <CardHeader className="pb-3">
          <CardTitle>Atividades Recentes</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhuma atividade recente
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="py-4">
      <CardHeader className="pb-3">
        <CardTitle>Atividades Recentes</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {activities.map((activity, index) => {
            const Icon = activityIcons[activity.type];
            const isLast = index === activities.length - 1;
            const isDeleted = activity.type === 'form_deleted';
            
            return (
              <div 
                key={activity.id} 
                className={cn(
                  "flex gap-3 rounded-lg p-2 -m-2 transition-colors",
                  !isDeleted && "cursor-pointer hover:bg-accent/50",
                  isDeleted && "opacity-60 cursor-default"
                )}
                onClick={() => !isDeleted && handleActivityClick(activity)}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className={cn("flex-1 space-y-0.5", !isLast && "pb-3 border-b")}>
                  <p className="text-sm font-medium leading-none">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(activity.timestamp, {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
