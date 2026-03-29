import readline from "readline";
const messages: { role: string; content: any; }[] = [];

async function chat(prompt: string) {
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on("line", async (input) => {
  const response = await chat(input);
  console.log("AI:", response);
});

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

  const reply = data.choices[0].message;

  messages.push(reply);

  return reply.content;
  
}

console.log(await chat("Hello"));
console.log(await chat("What is 2 + 2?"));
console.log(await chat("Explain simply"));
export { };



