const QUOTES = [
  // Karl Marx
  {
    text: "Die Philosophen haben die Welt nur verschieden interpretiert; es kommt aber darauf an, sie zu verändern.",
    author: "Karl Marx",
    source: "Thesen über Feuerbach, 1845",
  },
  {
    text: "Die Geschichte aller bisherigen Gesellschaft ist die Geschichte von Klassenkämpfen.",
    author: "Karl Marx & Friedrich Engels",
    source: "Das Kommunistische Manifest, 1848",
  },
  {
    text: "Die Religion ist der Seufzer der bedrängten Kreatur, das Gemüt einer herzlosen Welt, wie sie der Geist geistloser Zustände ist. Sie ist das Opium des Volkes.",
    author: "Karl Marx",
    source: "Zur Kritik der Hegelschen Rechtsphilosophie, 1844",
  },
  {
    text: "Das Kapital hat keinen persönlichen Willen; es ist eine gesellschaftliche Macht.",
    author: "Karl Marx",
    source: "Das Kapital, Band 1, 1867",
  },
  {
    text: "Proletarier aller Länder, vereinigt euch!",
    author: "Karl Marx & Friedrich Engels",
    source: "Das Kommunistische Manifest, 1848",
  },
  {
    text: "Aus jedem nach seinen Fähigkeiten, jedem nach seinen Bedürfnissen.",
    author: "Karl Marx",
    source: "Kritik des Gothaer Programms, 1875",
  },
  {
    text: "Das Sein bestimmt das Bewusstsein.",
    author: "Karl Marx",
    source: "Zur Kritik der Politischen Ökonomie, 1859",
  },

  // Friedrich Engels
  {
    text: "Die Freiheit besteht nicht darin, von den Gesetzen der Natur unabhängig zu sein, sondern darin, diese Gesetze zu kennen und sie planmäßig zu bestimmten Zwecken anwenden zu können.",
    author: "Friedrich Engels",
    source: "Anti-Dühring, 1878",
  },
  {
    text: "Die erste Bedingung für die Befreiung der Frau ist die Rückkehr des gesamten weiblichen Geschlechts in die öffentliche Industrie.",
    author: "Friedrich Engels",
    source: "Der Ursprung der Familie, des Privateigentums und des Staats, 1884",
  },

  // Wladimir Iljitsch Lenin
  {
    text: "Der Imperialismus ist das höchste Stadium des Kapitalismus.",
    author: "Wladimir Iljitsch Lenin",
    source: "Der Imperialismus als höchstes Stadium des Kapitalismus, 1917",
  },
  {
    text: "Lernen, lernen, nochmals lernen.",
    author: "Wladimir Iljitsch Lenin",
    source: "Politisches Testament, 1923",
  },
  {
    text: "Es gibt keine revolutionäre Bewegung ohne revolutionäre Theorie.",
    author: "Wladimir Iljitsch Lenin",
    source: "Was tun?, 1902",
  },
  {
    text: "Der Staat ist eine Maschine zur Unterdrückung einer Klasse durch eine andere.",
    author: "Wladimir Iljitsch Lenin",
    source: "Staat und Revolution, 1917",
  },
  {
    text: "Die revolutionäre Situation entsteht dann, wenn die Herrschenden nicht mehr können wie bisher und die Beherrschten nicht mehr wollen wie bisher.",
    author: "Wladimir Iljitsch Lenin",
    source: "Der Zusammenbruch der II. Internationale, 1915",
  },

  // Rosa Luxemburg
  {
    text: "Freiheit ist immer die Freiheit der Andersdenkenden.",
    author: "Rosa Luxemburg",
    source: "Zur russischen Revolution, 1918",
  },
  {
    text: "Wer sich nicht bewegt, spürt seine Fesseln nicht.",
    author: "Rosa Luxemburg",
    source: "Briefe aus dem Gefängnis, 1917",
  },
  {
    text: "Die Massen sind der entscheidende Faktor, sie sind der Fels, auf dem der endgültige Sieg der Revolution errichtet wird.",
    author: "Rosa Luxemburg",
    source: "Der Massenstreik, 1906",
  },
  {
    text: "Entweder herrscht der Sozialismus und die internationale Demokratie, oder es herrscht die imperialistische Reaktion.",
    author: "Rosa Luxemburg",
    source: "Junius-Broschüre, 1916",
  },
  {
    text: "Ich war, ich bin, ich werde sein.",
    author: "Rosa Luxemburg",
    source: "Letzter Artikel in der Roten Fahne, 14. Januar 1919",
  },

  // Che Guevara
  {
    text: "Seien wir realistisch — verlangen wir das Unmögliche.",
    author: "Che Guevara",
    source: "Rede an die Jugend, 1960",
  },
  {
    text: "Die Revolution ist nicht ein Apfelbaum, der gepflanzt und bewässert werden muss. Sie ist ein wildes Feuer.",
    author: "Che Guevara",
    source: "Guerrilla Warfare, 1961",
  },
  {
    text: "Hasta la victoria siempre — Bis zum endgültigen Sieg, immer.",
    author: "Che Guevara",
    source: "Abschiedsbrief an Fidel Castro, 1965",
  },
  {
    text: "Wenn du zitterst vor Empörung bei jeder Ungerechtigkeit, dann bist du mein Genosse.",
    author: "Che Guevara",
    source: "Brief an seinen Vater, 1965",
  },

  // Angela Davis
  {
    text: "I am no longer accepting the things I cannot change. I am changing the things I cannot accept.",
    author: "Angela Davis",
    source: "Rede an der UCLA, 1969",
  },
  {
    text: "Prisons do not disappear social problems, they disappear human beings.",
    author: "Angela Davis",
    source: "Are Prisons Obsolete?, 2003",
  },
  {
    text: "Radical simply means grasping things at the root.",
    author: "Angela Davis",
    source: "Women, Race & Class, 1981",
  },
  {
    text: "The most important thing that we as people can do is to act in the face of doubt and uncertainty.",
    author: "Angela Davis",
    source: "Interview, 2014",
  },

  // Bertolt Brecht
  {
    text: "Erst kommt das Fressen, dann kommt die Moral.",
    author: "Bertolt Brecht",
    source: "Die Dreigroschenoper, 1928",
  },
  {
    text: "Der Staat lügt in allen Zungen der Tugend, und er lügt selbst mit dem Stahl in der Hand: es lügt der Richter, der Soldat, der Priester.",
    author: "Bertolt Brecht",
    source: "Aus einem Lesebuch für Städtebewohner, 1930",
  },
  {
    text: "Wer kämpft, kann verlieren. Wer nicht kämpft, hat schon verloren.",
    author: "Bertolt Brecht",
    source: "Die Mutter, 1932",
  },
  {
    text: "In den finsteren Zeiten, wird da auch gesungen werden? Da wird auch gesungen werden. Von den finsteren Zeiten.",
    author: "Bertolt Brecht",
    source: "Motto der Svendborger Gedichte, 1939",
  },
  {
    text: "Stell dir vor, es ist Krieg, und keiner geht hin.",
    author: "Bertolt Brecht",
    source: "Kriegsfibel, 1955",
  },

  // Antonio Gramsci
  {
    text: "Pessimismus des Verstandes, Optimismus des Willens.",
    author: "Antonio Gramsci",
    source: "Gefängnishefte, 1929–1935",
  },
  {
    text: "Die Krise besteht gerade darin, dass das Alte stirbt und das Neue nicht zur Welt kommen kann.",
    author: "Antonio Gramsci",
    source: "Gefängnishefte, 1929–1935",
  },
  {
    text: "Alle Menschen sind Intellektuelle, aber nicht alle Menschen haben in der Gesellschaft die Funktion von Intellektuellen.",
    author: "Antonio Gramsci",
    source: "Gefängnishefte, 1929–1935",
  },

  // Frantz Fanon
  {
    text: "Jede Generation muss in relativer Dunkelheit seine Mission entdecken, sie erfüllen oder verraten.",
    author: "Frantz Fanon",
    source: "Die Verdammten dieser Erde, 1961",
  },
  {
    text: "Der Kolonialismus ist nicht ein Denkapparat, der überzeugt werden muss; er ist eine Gewalt, der man nur einer noch größeren Gewalt entgegentreten kann.",
    author: "Frantz Fanon",
    source: "Die Verdammten dieser Erde, 1961",
  },
  {
    text: "Wir sind nichts, lasst uns alles werden.",
    author: "Frantz Fanon",
    source: "Die Verdammten dieser Erde, 1961",
  },

  // Thomas Sankara
  {
    text: "You cannot carry out fundamental change without a certain amount of madness. In this case, it comes from nonconformity, the courage to turn your back on the old formulas.",
    author: "Thomas Sankara",
    source: "Rede, 1985",
  },
  {
    text: "The enemies of a people are those who keep them in ignorance.",
    author: "Thomas Sankara",
    source: "Rede in Harlem, 1984",
  },
  {
    text: "Imperialism is a system of exploitation that occurs not only in the brutal form of those who come with guns to conquer territory. Imperialism often occurs in more subtle forms.",
    author: "Thomas Sankara",
    source: "Thomas Sankara Speaks, 1988",
  },

  // Weitere wichtige Stimmen
  {
    text: "In a racist society, it is not enough to be non-racist. We must be anti-racist.",
    author: "Angela Davis",
    source: "Interview, 2019",
  },
  {
    text: "Die Arbeiterklasse hat kein Vaterland.",
    author: "Karl Marx & Friedrich Engels",
    source: "Das Kommunistische Manifest, 1848",
  },
  {
    text: "Der Weg zur Hölle ist gepflastert mit Privateigentum.",
    author: "Karl Marx",
    source: "Ökonomisch-philosophische Manuskripte, 1844",
  },
];

export function getRandomQuote() {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

export default QUOTES;
