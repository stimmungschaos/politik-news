import { Calendar, Star } from "lucide-react";
import { getTodayInHistory, getNearestHistory } from "../lib/history";
import HISTORY from "../lib/history";

const MONTHS = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
];

export default function HistoryPage() {
  const today = getTodayInHistory();
  const now = new Date();
  const currentMonth = now.getMonth();

  // Group by month
  const byMonth = {};
  for (const e of HISTORY) {
    if (!byMonth[e.month]) byMonth[e.month] = [];
    byMonth[e.month].push(e);
  }
  // Sort within each month
  for (const m of Object.keys(byMonth)) {
    byMonth[m].sort((a, b) => a.day - b.day);
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <Calendar className="w-8 h-8 text-red-400" />
        <h1 className="text-2xl font-bold text-white">Heute in der Geschichte</h1>
      </div>
      <p className="text-gray-400 text-sm mb-8">
        Wichtige Daten der sozialistischen und antiimperialistischen Bewegung.
      </p>

      {/* Heute */}
      {today.length > 0 && (
        <div className="bg-gradient-to-r from-red-900/40 via-gray-800/60 to-red-900/40 rounded-2xl border border-red-900/30 p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-yellow-400" />
            <h2 className="text-lg font-bold text-white">
              Heute, {now.getDate()}. {MONTHS[currentMonth]}
            </h2>
          </div>
          <div className="space-y-4">
            {today.map((e, i) => (
              <div key={i} className="flex gap-4">
                <span className="text-lg font-black text-red-400 w-16 shrink-0">{e.year}</span>
                <p className="text-gray-200 leading-relaxed">{e.event}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alle nach Monat */}
      <div className="space-y-8">
        {Array.from({ length: 12 }, (_, i) => {
          const month = ((currentMonth + i) % 12) + 1;
          const events = byMonth[month];
          if (!events || events.length === 0) return null;
          const isCurrentMonth = month === currentMonth + 1;

          return (
            <div key={month}>
              <h2 className={`text-lg font-bold mb-4 ${isCurrentMonth ? "text-red-400" : "text-white"}`}>
                {isCurrentMonth && "► "}{MONTHS[month - 1]}
              </h2>
              <div className="space-y-2">
                {events.map((e, j) => {
                  const isToday = e.month === now.getMonth() + 1 && e.day === now.getDate();
                  return (
                    <div
                      key={j}
                      className={`flex gap-4 px-4 py-3 rounded-lg ${
                        isToday
                          ? "bg-red-900/20 border border-red-900/30"
                          : "bg-gray-800/30 hover:bg-gray-800/50 transition-colors"
                      }`}
                    >
                      <div className="flex items-center gap-2 shrink-0 w-24">
                        <span className="text-xs font-bold text-red-400 bg-red-400/10 px-2 py-1 rounded">
                          {e.day}.{e.month}.
                        </span>
                        <span className="text-sm font-bold text-gray-400">{e.year}</span>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">{e.event}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
