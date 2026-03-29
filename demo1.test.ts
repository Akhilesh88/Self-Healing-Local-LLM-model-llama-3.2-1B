import readline from "readline";

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

const messages: Message[] = [];

async function chat(prompt: string): Promise<string> {

  messages.push({
    role: "user",
    content: prompt
  });

  const response = await fetch("http://127.0.0.1:5000/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "Llama-3.2-1B-Instruct",
      messages: messages
    })
  });

  const data = await response.json();

  const reply: Message = data.choices[0].message;

  messages.push(reply);

  return reply.content;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("🤖 Local LLM Chat Started (type 'exit' to quit)");

rl.on("line", async (input) => {

  if (input.toLowerCase() === "exit") {
    rl.close();
    process.exit(0);
  }

  const response = await chat(input);

  console.log("AI:", response);
  rl.prompt();
});

rl.prompt();
  