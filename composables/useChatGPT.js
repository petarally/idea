// composables/useChatGPT.js
import axios from "axios";

export const useChatGPT = () => {
  const translateText = async (text, targetLanguage) => {
    const prompt = `Translate the following text to ${targetLanguage}: ${text}`;

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "system", content: prompt }],
          max_tokens: 100,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Make sure to set your API key in environment variables
          },
        }
      );

      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error("Error translating text:", error);
      return null;
    }
  };

  return {
    translateText,
  };
};
