// Mapping von RSS-Feed-Kategorien auf unsere Kategorien
const RSS_CATEGORY_MAP = {
  // Innenpolitik
  "inland": "Innenpolitik",
  "innenpolitik": "Innenpolitik",
  "politik": "Innenpolitik",
  "deutschland": "Innenpolitik",
  "bundestag": "Innenpolitik",
  "bundesregierung": "Innenpolitik",
  "parteien": "Innenpolitik",
  "wahlen": "Innenpolitik",

  // Außenpolitik
  "ausland": "Außenpolitik",
  "außenpolitik": "Außenpolitik",
  "international": "Außenpolitik",
  "europa": "Außenpolitik",
  "eu": "Außenpolitik",
  "welt": "Außenpolitik",
  "world": "Außenpolitik",

  // Wirtschaft
  "wirtschaft": "Wirtschaft",
  "finanzen": "Wirtschaft",
  "börse": "Wirtschaft",
  "unternehmen": "Wirtschaft",
  "economy": "Wirtschaft",
  "geld": "Wirtschaft",
  "arbeit": "Wirtschaft",

  // Klima & Umwelt
  "klima": "Klima & Umwelt",
  "umwelt": "Klima & Umwelt",
  "wetter": "Klima & Umwelt",
  "energie": "Klima & Umwelt",
  "natur": "Klima & Umwelt",

  // Gesellschaft
  "gesellschaft": "Gesellschaft",
  "kultur": "Gesellschaft",
  "panorama": "Gesellschaft",
  "leben": "Gesellschaft",
  "soziales": "Gesellschaft",
  "bildung": "Gesellschaft",
  "gesundheit": "Gesellschaft",
  "sport": "Gesellschaft",
  "medien": "Gesellschaft",
  "vermischtes": "Gesellschaft",

  // Technologie
  "technologie": "Technologie",
  "technik": "Technologie",
  "digital": "Technologie",
  "netzwelt": "Technologie",
  "wissenschaft": "Technologie",
  "tech": "Technologie",
  "internet": "Technologie",
  "ki": "Technologie",
};

// Keywords im Titel/Beschreibung → Kategorie
const KEYWORD_RULES = [
  {
    category: "Außenpolitik",
    keywords: [
      "usa", "china", "russland", "ukraine", "nato", "eu-gipfel", "vereinte nationen",
      "un-", "israel", "gaza", "palästina", "iran", "nordkorea", "krieg", "diplomati",
      "sanktion", "außenminister", "botschaft", "migration", "flüchtling", "asyl",
      "trump", "biden", "putin", "selenskyj", "macron", "brexit",
    ],
  },
  {
    category: "Klima & Umwelt",
    keywords: [
      "klima", "co2", "umwelt", "erderwärmung", "klimawandel", "erneuerbar",
      "solar", "windkraft", "emission", "nachhaltig", "naturschutz", "artenschutz",
      "kohle", "atomkraft", "energiewende", "klimaschutz", "klimakrise",
      "fridays for future", "letzte generation", "hochwasser", "dürre",
    ],
  },
  {
    category: "Wirtschaft",
    keywords: [
      "wirtschaft", "inflation", "arbeitsmarkt", "arbeitslos", "gewerkschaft",
      "streik", "tarif", "mindestlohn", "aktie", "dax", "ezb", "zinsen",
      "haushalt", "schulden", "steuern", "rente", "bürgergeld", "konzern",
      "insolvenz", "export", "import", "handelsabkommen", "bip",
    ],
  },
  {
    category: "Technologie",
    keywords: [
      "ki ", "künstliche intelligenz", "algorithm", "internet", "digital",
      "software", "hacker", "cyber", "datenschutz", "überwachung", "smartphone",
      "social media", "facebook", "google", "apple", "microsoft", "chatgpt",
      "startup", "tech-konzern",
    ],
  },
  {
    category: "Innenpolitik",
    keywords: [
      "bundestag", "bundesrat", "koalition", "opposition", "ampel",
      "cdu", "csu", "spd", "grüne", "fdp", "linke", "afd", "bsw",
      "merz", "scholz", "habeck", "baerbock", "lindner", "wagenknecht",
      "grundgesetz", "verfassung", "bundesverfassungsgericht", "wahl",
      "ministerpräsident", "innenminister", "justiz", "polizei",
      "demonstration", "protest", "reform",
    ],
  },
  {
    category: "Gesellschaft",
    keywords: [
      "gesellschaft", "kultur", "bildung", "schule", "universität",
      "gesundheit", "krankenhaus", "pflege", "rassismus", "diskriminierung",
      "gleichberechtigung", "religion", "kirche", "sport", "fußball",
      "kriminalität", "gericht", "urteil", "wohnung", "miete",
    ],
  },
];

/**
 * Versucht die Kategorie aus den RSS-Feed-Kategorien des Items zu bestimmen.
 * Gibt null zurück wenn keine Zuordnung möglich.
 */
function categorizeFromFeed(item) {
  const feedCategories = item.categories || [];
  if (feedCategories.length === 0) return null;

  for (const feedCat of feedCategories) {
    const normalized = (typeof feedCat === "string" ? feedCat : feedCat._ || "")
      .toLowerCase()
      .trim();

    // Exakter Match
    if (RSS_CATEGORY_MAP[normalized]) {
      return RSS_CATEGORY_MAP[normalized];
    }

    // Teilstring-Match (z.B. "Politik/Deutschland" enthält "politik")
    for (const [key, category] of Object.entries(RSS_CATEGORY_MAP)) {
      if (normalized.includes(key)) {
        return category;
      }
    }
  }

  return null;
}

/**
 * Versucht die Kategorie anhand von Keywords im Titel und der Beschreibung zu bestimmen.
 * Gibt null zurück wenn keine Zuordnung möglich.
 */
function categorizeFromKeywords(item) {
  const text = [
    item.title || "",
    item.contentSnippet || item.description || "",
  ]
    .join(" ")
    .toLowerCase();

  let bestMatch = null;
  let bestScore = 0;

  for (const rule of KEYWORD_RULES) {
    let score = 0;
    for (const keyword of rule.keywords) {
      if (text.includes(keyword)) {
        score++;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = rule.category;
    }
  }

  return bestScore > 0 ? bestMatch : null;
}

/**
 * Bestimmt die Kategorie eines RSS-Items.
 * Priorität: 1. RSS-Kategorie, 2. Keywords, 3. Fallback aus Source-Config
 */
export function categorizeArticle(item, sourceCategories) {
  const fromFeed = categorizeFromFeed(item);
  if (fromFeed) return fromFeed;

  const fromKeywords = categorizeFromKeywords(item);
  if (fromKeywords) return fromKeywords;

  // Fallback: erste Kategorie der Quelle
  return sourceCategories[0] || "Innenpolitik";
}
