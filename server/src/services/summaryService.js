import Anthropic from "@anthropic-ai/sdk";

const SUMMARY_MIN_LENGTH = 100;
const HTML_TAG_REGEX = /<[^>]+>/g;

function stripHtml(html) {
  return html.replace(HTML_TAG_REGEX, "").trim();
}

function isUsableSummary(description) {
  if (!description) return false;
  const stripped = stripHtml(description);
  return stripped.length >= SUMMARY_MIN_LENGTH;
}

async function generateAiSummary(title, content) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { summary: title, aiGenerated: false };
  }

  try {
    const client = new Anthropic();
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 200,
      messages: [
        {
          role: "user",
          content: `Fasse diesen Nachrichtenartikel in 2-3 Sätzen auf Deutsch zusammen. Nur die Zusammenfassung, keine Einleitung.\n\nTitel: ${title}\n\nInhalt: ${content}`,
        },
      ],
    });
    return { summary: message.content[0].text, aiGenerated: true };
  } catch (error) {
    console.error("AI summary failed:", error.message);
    return { summary: stripHtml(content).slice(0, 300), aiGenerated: false };
  }
}

export async function createSummary(item) {
  if (isUsableSummary(item.contentSnippet || item.content)) {
    return {
      summary: stripHtml(item.contentSnippet || item.content).slice(0, 500),
      aiGenerated: false,
    };
  }

  if (isUsableSummary(item.description)) {
    return {
      summary: stripHtml(item.description).slice(0, 500),
      aiGenerated: false,
    };
  }

  const content = item.contentSnippet || item.content || item.description || item.title;
  return generateAiSummary(item.title, stripHtml(content || ""));
}
