const HISTORY = [
  // Januar
  {
    month: 1,
    day: 1,
    year: 1959,
    event: "Sieg der Kubanischen Revolution — Fidel Castro und die Guerillabewegung stürzen das Batista-Regime. Havanna wird befreit.",
  },
  {
    month: 1,
    day: 5,
    year: 1919,
    event: "Gründung der Kommunistischen Partei Deutschlands (KPD) durch Rosa Luxemburg, Karl Liebknecht und andere in Berlin.",
  },
  {
    month: 1,
    day: 15,
    year: 1919,
    event: "Rosa Luxemburg und Karl Liebknecht werden nach dem niedergeschlagenen Spartakusaufstand von Freikorps-Soldaten ermordet. Luxemburg wird in einen Kanal geworfen.",
  },
  {
    month: 1,
    day: 21,
    year: 1924,
    event: "Tod von Wladimir Iljitsch Lenin in Gorki. Führer der Russischen Revolution und Gründer der Sowjetunion.",
  },
  {
    month: 1,
    day: 26,
    year: 1905,
    event: "Beginn des Petersburger Blutsonntags — zaristische Truppen erschießen friedlich demonstrierende Arbeiter. Auslöser der Russischen Revolution von 1905.",
  },

  // Februar
  {
    month: 2,
    day: 5,
    year: 1848,
    event: "Karl Marx und Friedrich Engels vollenden das Kommunistische Manifest kurz vor der Europäischen Revolution von 1848.",
  },
  {
    month: 2,
    day: 21,
    year: 1848,
    event: "Erstveröffentlichung des Kommunistischen Manifests von Marx und Engels in London.",
  },
  {
    month: 2,
    day: 23,
    year: 1965,
    event: "Malcolm X wird in New York ermordet. Der Bürgerrechtsaktivist und schwarze Nationalist war eine prägende Stimme für Black Liberation.",
  },

  // März
  {
    month: 3,
    day: 5,
    year: 1953,
    event: "Tod von Josef Stalin in Moskau. Generalsekretär der KPdSU und Führer der Sowjetunion seit 1924.",
  },
  {
    month: 3,
    day: 8,
    year: 1857,
    event: "Internationaler Frauentag — Textilarbeiterinnen in New York streiken für bessere Löhne und kürzere Arbeitszeiten. Dieser Tag wird später zum Internationalen Frauentag.",
  },
  {
    month: 3,
    day: 14,
    year: 1883,
    event: "Tod von Karl Marx in London, im Alter von 64 Jahren. Engels hält die Grabrede am Highgate-Friedhof.",
  },
  {
    month: 3,
    day: 18,
    year: 1871,
    event: "Ausrufung der Pariser Kommune — erste Arbeiterregierung der Geschichte. Die Commune hält 72 Tage stand, bevor sie blutig niedergeschlagen wird.",
  },
  {
    month: 3,
    day: 28,
    year: 1871,
    event: "Die Pariser Kommune wählt einen revolutionären Stadtrat — erstmals regiert die Arbeiterklasse eine Großstadt. Frauen spielen eine zentrale Rolle.",
  },

  // April
  {
    month: 4,
    day: 4,
    year: 1968,
    event: "Ermordung von Martin Luther King Jr. in Memphis, Tennessee. Der Bürgerrechtler und Friedensnobelpreisträger wurde erschossen.",
  },
  {
    month: 4,
    day: 19,
    year: 1775,
    event: "Beginn der Amerikanischen Revolution mit dem Gefecht von Lexington und Concord — die Kolonien erheben sich gegen britische Kolonialherrschaft.",
  },
  {
    month: 4,
    day: 22,
    year: 1870,
    event: "Geburt von Wladimir Iljitsch Lenin in Simbirsk, Russland.",
  },

  // Mai
  {
    month: 5,
    day: 1,
    year: 1886,
    event: "Generalstreik in Chicago für den 8-Stunden-Tag — Beginn des Kampfes um den Internationalen Tag der Arbeit. Vier Tage später kommt es zum Haymarket-Massaker.",
  },
  {
    month: 5,
    day: 4,
    year: 1886,
    event: "Haymarket-Massaker in Chicago — Polizei eröffnet das Feuer auf Streikende. Als Reaktion wird der 1. Mai zum Internationalen Kampftag der Arbeiterklasse.",
  },
  {
    month: 5,
    day: 5,
    year: 1818,
    event: "Geburt von Karl Marx in Trier, Deutschland.",
  },
  {
    month: 5,
    day: 9,
    year: 1945,
    event: "Sieg über den Nationalsozialismus und das faschistische Deutschland — Ende des Zweiten Weltkriegs in Europa.",
  },

  // Juni
  {
    month: 6,
    day: 5,
    year: 1883,
    event: "Geburt von John Maynard Keynes — Ökonom, dessen Ideen staatlicher Eingriffe in die Wirtschaft zur Regulierung des Kapitalismus einflussreich wurden.",
  },
  {
    month: 6,
    day: 14,
    year: 1928,
    event: "Geburt von Ernesto 'Che' Guevara in Rosario, Argentinien.",
  },
  {
    month: 6,
    day: 16,
    year: 1976,
    event: "Soweto-Aufstand in Südafrika — schwarze Schüler protestieren gegen das Apartheid-Bildungssystem. Hunderte werden von der Polizei erschossen.",
  },
  {
    month: 6,
    day: 28,
    year: 1969,
    event: "Stonewall-Aufstand in New York — LGBTQ+-Menschen widersetzen sich Polizeigewalt. Geburtsstunde der modernen Queer-Emanzipationsbewegung.",
  },

  // Juli
  {
    month: 7,
    day: 14,
    year: 1789,
    event: "Sturm auf die Bastille in Paris — Beginn der Französischen Revolution. Das Volk erhebt sich gegen Monarchie und Feudalherrschaft.",
  },
  {
    month: 7,
    day: 26,
    year: 1953,
    event: "Angriff auf die Moncada-Kaserne durch Fidel Castro und seine Gefolgsleute — Beginn des kubanischen Aufstands gegen Batista.",
  },

  // August
  {
    month: 8,
    day: 4,
    year: 1987,
    event: "Thomas Sankara wird in Burkina Faso ermordet — Anführer der afrikanischen Revolution, der sein Land aus der Armut führen wollte.",
  },
  {
    month: 8,
    day: 6,
    year: 1945,
    event: "USA werfen Atombombe auf Hiroshima — 140.000 Menschen sterben sofort oder kurz danach. Drei Tage später folgt Nagasaki.",
  },
  {
    month: 8,
    day: 28,
    year: 1963,
    event: "March on Washington — über 250.000 Menschen demonstrieren für Bürgerrechte. Martin Luther King hält seine 'I Have a Dream'-Rede.",
  },

  // September
  {
    month: 9,
    day: 1,
    year: 1939,
    event: "Beginn des Zweiten Weltkriegs mit dem deutschen Überfall auf Polen durch das nationalsozialistische Deutschland.",
  },
  {
    month: 9,
    day: 3,
    year: 1783,
    event: "Ende des Amerikanischen Unabhängigkeitskriegs mit dem Frieden von Paris.",
  },
  {
    month: 9,
    day: 9,
    year: 1919,
    event: "Großer Polizeistreik in Boston — über 1.000 Beamte streiken. Beginn einer Welle von Arbeitskämpfen in den USA nach dem Ersten Weltkrieg.",
  },
  {
    month: 9,
    day: 11,
    year: 1973,
    event: "US-gestützter Putsch in Chile — General Pinochet stürzt den demokratisch gewählten Sozialisten Salvador Allende. Beginn einer blutigen Militärdiktatur.",
  },
  {
    month: 9,
    day: 28,
    year: 1864,
    event: "Gründung der Ersten Internationale (Internationale Arbeiterassoziation) in London — erster internationaler Zusammenschluss der Arbeiterbewegung.",
  },

  // Oktober
  {
    month: 10,
    day: 2,
    year: 1968,
    event: "Massaker von Tlatelolco in Mexiko-Stadt — kurz vor den Olympischen Spielen erschießen Soldaten Hunderte demonstrierende Studenten.",
  },
  {
    month: 10,
    day: 9,
    year: 1967,
    event: "Che Guevara wird in Bolivien gefangen genommen und erschossen — auf Befehl der CIA und der bolivianischen Armee.",
  },
  {
    month: 10,
    day: 25,
    year: 1917,
    event: "Oktoberrevolution in Russland — die Bolschewiki unter Lenin stürzen die Provisorische Regierung. Erste sozialistische Revolution der Geschichte.",
  },

  // November
  {
    month: 11,
    day: 7,
    year: 1917,
    event: "Die Bolschewiki übernehmen in Petrograd die Macht — offizieller Beginn der Sozialistischen Oktoberrevolution nach dem alten russischen Kalender.",
  },
  {
    month: 11,
    day: 9,
    year: 1918,
    event: "Novemberrevolution in Deutschland — Kaiser Wilhelm II. dankt ab. Ausrufung der Republik durch Philipp Scheidemann und der Sozialistischen Republik durch Karl Liebknecht.",
  },
  {
    month: 11,
    day: 9,
    year: 1989,
    event: "Fall der Berliner Mauer — Ende der deutschen Teilung und des Kalten Kriegs in Europa.",
  },
  {
    month: 11,
    day: 28,
    year: 1820,
    event: "Geburt von Friedrich Engels in Barmen, Deutschland — Mitbegründer des Marxismus und lebenslanger Weggenosse von Karl Marx.",
  },

  // Dezember
  {
    month: 12,
    day: 1,
    year: 1955,
    event: "Rosa Parks weigert sich, im Bus von Montgomery ihren Platz für einen weißen Fahrgast zu räumen — Auslöser des Montgomery-Busboykotts und der Bürgerrechtsbewegung.",
  },
  {
    month: 12,
    day: 5,
    year: 1870,
    event: "Geburt von Rosa Luxemburg in Zamość (heute Polen). Revolutionärin, Theoretikerin und Mitgründerin der KPD.",
  },
  {
    month: 12,
    day: 10,
    year: 1948,
    event: "Verabschiedung der Allgemeinen Erklärung der Menschenrechte durch die UN-Generalversammlung.",
  },
  {
    month: 12,
    day: 26,
    year: 1893,
    event: "Geburt von Mao Zedong in Shaoshan, China — Anführer der Chinesischen Revolution von 1949.",
  },
  {
    month: 12,
    day: 31,
    year: 1943,
    event: "Gründung der Polnischen Arbeiterpartei (PPR) als antifaschistische Widerstandsorganisation gegen die deutsche Besatzung.",
  },

  // Weitere wichtige Daten
  {
    month: 2,
    day: 4,
    year: 1961,
    event: "Beginn des bewaffneten Befreiungskampfs der MPLA in Angola gegen portugiesische Kolonialherrschaft.",
  },
  {
    month: 3,
    day: 21,
    year: 1960,
    event: "Massaker von Sharpeville in Südafrika — Polizei erschießt 69 friedlich demonstrierende schwarze Menschen beim Protest gegen die Passgesetze.",
  },
  {
    month: 4,
    day: 9,
    year: 1948,
    event: "Ermordung von Jorge Eliécer Gaitán in Bogotá, Kolumbien — Volksführer und Linkspolitiker. Sein Tod löst den 'Bogotazo' aus, einen massiven Volksaufstand.",
  },
  {
    month: 5,
    day: 25,
    year: 1963,
    event: "Gründung der Organisation Afrikanischer Einheit (OAU) in Addis Abeba — wichtiger Meilenstein der afrikanischen Unabhängigkeitsbewegung.",
  },
  {
    month: 7,
    day: 19,
    year: 1979,
    event: "Sieg der sandinistischen Revolution in Nicaragua — die FSLN stürzt die Somoza-Diktatur.",
  },
  {
    month: 8,
    day: 17,
    year: 1960,
    event: "Unabhängigkeit Gabuns — Teil der Welle afrikanischer Dekolonisierungen in den 1960er Jahren.",
  },
  {
    month: 9,
    day: 6,
    year: 1966,
    event: "Hendrik Verwoerd, Hauptarchitekt der südafrikanischen Apartheid, wird im Parlament ermordet.",
  },
  {
    month: 10,
    day: 15,
    year: 1987,
    event: "Ermordung von Thomas Sankara in Ouagadougou, Burkina Faso — der 'afrikanische Che Guevara' wird bei einem Putsch getötet.",
  },
  {
    month: 11,
    day: 19,
    year: 1915,
    event: "Hinrichtung des Arbeitersängers und IWW-Aktivisten Joe Hill in Utah, USA — er wird zum Märtyrer der Arbeiterbewegung.",
  },
  {
    month: 12,
    day: 16,
    year: 1838,
    event: "Gründung der Chartistenbewegung in Großbritannien — erste Massenbewegung der Arbeiterklasse für politische Rechte.",
  },
];

export function getTodayInHistory() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  return HISTORY.filter((e) => e.month === month && e.day === day);
}

// Fallback: Nächste Ereignisse, wenn heute nichts vorhanden
export function getNearestHistory(count = 3) {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const todayNum = month * 31 + day;

  return HISTORY.map((e) => ({
    ...e,
    dist: Math.abs(e.month * 31 + e.day - todayNum),
  }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, count);
}

export default HISTORY;
