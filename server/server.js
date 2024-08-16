const express = require("express");
const { YoutubeTranscript } = require("youtube-transcript");
const app = express();
const cors = require("cors");
const { default: ollama } = require("ollama"); // CJS
app.use(express.json());
app.use(
	cors({
		origin: "*",
	})
);
app.post("/create-model", async (req, res) => {
	const {prompt, modelName} = req.body;
	const modelFile = `
    FROM llama3.1

# set the temperature to 1 [higher is more creative, lower is more coherent]
PARAMETER temperature 1

# set the system message
SYSTEM """
${prompt}

"""
  `;
	try {
		await ollama.create({ model: modelName, modelfile: modelFile });
		return res.json({ message: "Model created successfully" });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal server error" });
	}
});
app.get("/list", async (req, res) => {
	try {
		const models = await ollama.list();
		return res.json(models);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal server error" });
	}
});
app.post("/chat", async (req, res) => {
	const { model, message } = req.body;
	try {
		const response = await ollama.chat({
			model,
			messages: [
				{
					role: "user",
					content: message,
				},
			],
		});
		return res.json(response);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal server error" });
	}
});
app.post("/", async (req, res) => {
	try {
		const response = await ollama.chat({
			model: "naruto",
			messages: [
				{
					role: "user",
					content: "hey",
				},
			],
		});
		res.json(response);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});
app.listen(3000, () => {
	console.log("Server is running on port 3000");
});
