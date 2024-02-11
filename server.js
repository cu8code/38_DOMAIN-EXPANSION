require('dotenv').config()

const express = require('express');
const app = express();
const path = require("path")
const Replicate = require("replicate")
const replicate = new Replicate({
  auth: process.env.KEY,
});
console.log(process.env.KEY);

app.use(express.json());

app.post('/predict', async (req, res) => {
  console.log("LOG: predict");
  try {
    console.log(req.body);
    const output = await replicate.run(
      "meta/llama-2-70b-chat",
      {
        input: {
          debug: false,
          top_p: 1,
          prompt: req.body.input,
          temperature: 0.5,
          system_prompt: `You are a helpful, respectful and honest assistant. Always answer as helpfully as possible, while being safe. Your answers should not include any harmful, unethical, racist, sexist, toxic, dangerous, or illegal content. Please ensure that your responses are socially unbiased and positive in nature.
          If a question does not make any sense, or is not factually coherent, explain why instead of answering something not correct. If you don't know the answer to a question, please don't share false information.`,
          max_new_tokens: 500,
          min_new_tokens: -1
        }
      }
    );
    console.log(output);
    res.send(output)
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    res.status(500).json({
      error: error.response ? error.response.data : error.message
    });
  }
});

app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
