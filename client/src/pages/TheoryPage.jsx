import { BookOpen, ExternalLink } from "lucide-react";
import THEORY from "../lib/theory";

export default function TheoryPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <BookOpen className="w-8 h-8 text-red-400" />
        <h1 className="text-2xl font-bold text-white">Theorie-Ecke</h1>
      </div>
      <p className="text-gray-400 text-sm mb-8">
        Klassische Texte der sozialistischen und kommunistischen Bewegung — frei zugänglich.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {THEORY.map((author) => (
          <div key={author.author} className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-700 bg-red-900/10">
              <h2 className="text-white font-bold">{author.author}</h2>
            </div>
            <div className="divide-y divide-gray-700/50">
              {author.works.map((work) => (
                <a
                  key={work.title}
                  href={work.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-5 py-3 hover:bg-gray-700/20 transition-colors group"
                >
                  <div>
                    <p className="text-gray-200 text-sm font-medium group-hover:text-red-400 transition-colors">
                      {work.title}
                    </p>
                    <span className="text-gray-500 text-xs">{work.year}</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-500 group-hover:text-red-400 shrink-0" />
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
