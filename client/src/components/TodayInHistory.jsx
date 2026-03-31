import { Calendar } from "lucide-react";
import { getTodayInHistory, getNearestHistory } from "../lib/history";

export default function TodayInHistory() {
  const today = getTodayInHistory();
  const events = today.length > 0 ? today : getNearestHistory(3);
  const isToday = today.length > 0;

  if (events.length === 0) return null;

  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="w-4 h-4 text-red-400" />
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
          {isToday ? "Heute in der Geschichte" : "Aus der Geschichte"}
        </h3>
      </div>
      <div className="space-y-3">
        {events.map((e, i) => (
          <div key={i} className="flex gap-3">
            <div className="flex items-center justify-center w-12 shrink-0">
              <span className="text-xs font-bold text-red-400 bg-red-400/10 px-2 py-1 rounded">
                {e.year}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-gray-300 text-sm leading-relaxed">
                {e.event}
              </p>
              {!isToday && (
                <span className="text-gray-500 text-[10px]">
                  {e.day}.{e.month}.
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
