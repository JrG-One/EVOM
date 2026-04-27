const axios = require("axios");
const logger = require("./logger");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = process.env.OPENAI_API_URL;

const handleAxiosError = (error) => {
  if (error.response) {
    const status = error.response.status;
    if (status === 429 || status === 402) {
      logger.error('OpenAI Quota Exceeded or Rate Limited', { data: error.response.data });
      const err = new Error("AI Service down due to high traffic or quota limit.");
      err.statusCode = 503;
      err.code = "AI_QUOTA_EXCEEDED";
      throw err;
    } else if (status >= 500) {
      logger.error('OpenAI Server Error', { data: error.response.data });
      const err = new Error("AI Agent is down. Please try again later.");
      err.statusCode = 503;
      err.code = "AI_SERVICE_DOWN";
      throw err;
    }
  }
  logger.error('OpenAI Unknown Error', { error: error.message });
  throw error;
};

exports.createChatCompletion = async (systemPrompt, userPrompt, options = {}) => {
  const body = {
    model: "gpt-4o-mini", // updated model
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.7,
    max_tokens: 4000,
    ...options
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${OPENAI_API_KEY}`,
  };

  try {
    const response = await axios.post(OPENAI_API_URL, body, { headers });
    return response.data.choices[0].message.content;
  } catch (error) {
    handleAxiosError(error);
  }
};

exports.createChatCompletionWithHistory = async (messages) => {
  const body = {
    model: "gpt-4o-mini",
    messages, 
    temperature: 0.7,
    max_tokens: 4000,
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
  };

  try {
    const response = await axios.post(process.env.OPENAI_API_URL, body, { headers });
    return response.data.choices[0].message.content;
  } catch (error) {
    handleAxiosError(error);
  }
};