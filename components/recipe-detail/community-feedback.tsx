import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface Feedback {
  id: number;
  name: string;
  date: string;
  comment: string;
}

interface CommunityFeedbackProps {
  feedbacks: Feedback[];
}

export function CommunityFeedback({ feedbacks }: CommunityFeedbackProps) {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Community Feedback</h2>

      <div className="space-y-4">
        {feedbacks.map((item) => (
          <div key={item.id} className="flex gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <Avatar className="size-10 shrink-0">
              <AvatarFallback className="bg-orange-100 text-orange-700">
                {item.name.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-900">{item.name}</span>
                <span className="text-xs text-slate-400">{item.date}</span>
              </div>
              <p className="mt-1 text-sm text-slate-600">{item.comment}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button className="bg-orange-600 text-white hover:bg-orange-700">
          Submit Recipe
        </Button>
      </div>
    </section>
  );
}
