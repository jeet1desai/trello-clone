import { useState } from "react";
import { TICKET_LABELS } from "../config";
import { generateText } from "../services/genAiService";

export type AllowedLabel = (typeof TICKET_LABELS)[number];

export const useLabelSuggestions = () => {
  const [labels, setLabels] = useState<AllowedLabel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const suggestLabels = async (title = "", description = "") => {
    setLoading(true);
    setError(null);

    const prompt = `
      You are an intelligent label suggestion system.
      Given the title and description, return only a comma-separated list
      of relevant labels from the following list:
      [${TICKET_LABELS.join(", ")}]

      Title: ${title}
      Description: ${description}

      Only return labels from the list, separated by commas.
    `.trim();

    try {
      const text = await generateText(prompt);

      const parsed = text
        .split(",")
        .map((l: string) => l.trim())
        .filter((l: string): l is AllowedLabel =>
          TICKET_LABELS.includes(l as AllowedLabel)
        );

      setLabels(parsed);
    } catch (err) {
      console.error("Error generating labels:", err);
      setError("Failed to fetch label suggestions.");
    } finally {
      setLoading(false);
    }
  };

  return { labels, loading, error, suggestLabels };
};
