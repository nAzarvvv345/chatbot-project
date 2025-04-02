const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dialogflow = require("@google-cloud/dialogflow");
const uuid = require("uuid");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const sessionClient = new dialogflow.SessionsClient({
  keyFilename: "./dialogflow-key.json",
});

const projectId = "dyplombot-cssd"; // ← сюди встав свій Project ID

app.post("/chat", async (req, res) => {
  const message = req.body.message;
  const sessionId = uuid.v4();
  const sessionPath = sessionClient.projectAgentSessionPath(
    projectId,
    sessionId
  );

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message,
        languageCode: "en-US",
      },
    },
  };

  try {
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult.fulfillmentText;
    res.json({ reply: result });
  } catch (error) {
    console.error("Dialogflow error:", error);
    res.status(500).send("Error communicating with Dialogflow");
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
