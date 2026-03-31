import { useState } from "react";
import { Quote, RefreshCw } from "lucide-react";
import { getRandomQuote } from "../lib/quotes";

export default function QuoteOfTheDay() {
  const [quote, setQuote] = useState(() => getRandomQuote());

  return (
    <div className="bg-gradient-to-r from-red-900/30 via-gray-800/50 to-red-900/30 rounded-xl border border-red-900/30 p-5 mb-6 relative">
      <Quote className="w-8 h-8 text-red-500/20 absolute top-3 left-3" />
      <div className="ml-6">
        <p className="text-gray-200 italic text-sm md:text-base leading-relaxed mb-3">
          „{quote.text}"
        </p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-red-400 font-semibold text-sm">{quote.author}</span>
            {quote.source && (
              <span className="text-gray-500 text-xs ml-2">— {quote.source}</span>
            )}
          </div>
          <button
            onClick={() => setQuote(getRandomQuote())}
            className="text-gray-500 hover:text-red-400 transition-colors p-1"
            title="Neues Zitat"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
