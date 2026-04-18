const API_BASE_URL = "https://chatbotback-7zvm.onrender.com";

export async function sendMessage(message) {
  try{
     const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      return Promise.resolve({
          reply: "😅 I'd love to keep talking, but I've hit my daily limit. Even AIs need boundaries. Please come back tomorrow!",
          error: true,
          status: response.status,
        });
      }
      return response.json();

  }
  catch (error) {
    return Promise.resolve({
          reply: "😅 I'd love to keep talking, but I've hit my daily limit. Even AIs need boundaries. Please come back tomorrow!",
          error: true,
          status: 500,
        });
      }


  }
  

/**
 * Generate an image from a prompt
 * @param {string} prompt
 * @returns {Promise<{ image_url: string }>}
 */
export async function generateImage(prompt) {
  const response = await fetch(`${API_BASE_URL}/image`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate image");
  }

  return response.json();
}
