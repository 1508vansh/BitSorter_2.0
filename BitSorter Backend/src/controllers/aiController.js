 const { GoogleGenAI } = require("@google/genai");
require('dotenv').config();

// The client gets the API key from the environment variable GEMINI_API_KEY.
const handleAi = async (req, res) => {
  try {
    const {message,problem} = req.body;
    const ai = new GoogleGenAI({
      apiKey: process.env.GOOGLE_API_KEY,
    });

    async function main() {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: message,
        config: {
          systemInstruction:
            `You are a DSA tutor, you will only response to dsa and the specific problem related quary not even about development or database or anything else, if user ask any other thing you will not response and kindly tell the user that your work is to only him/her to dsa and the specific problem related quary, your work is to assist the user and provide him solution , or hint or anything else only related to the problem. you will never means never go out of the topic or problem and dsa. the problem is ${JSON.stringify(problem)}`,
        },
      });
      //console.log(response.text);
      res.send({ message: response.text });
    }
    await main();
  } catch (err) {
    res.send({ message: "Facing an error man!" });
    console.log("error in google api!");
  }
};
module.exports = { handleAi };