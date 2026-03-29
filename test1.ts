import { createCompletion, loadModel } from "gpt4all";

const model = await loadModel("Llama-3.2-1B-Instruct", {
    verbose: true, // logs loaded model configuration
    device: "gpu", // defaults to 'cpu'
    nCtx: 2048, // the maximum sessions context window size.
});

// initialize a chat session on the model. a model instance can have only one chat session at a time.
const chat = await model.createChatSession({
    // any completion options set here will be used as default for all completions in this chat session
    temperature: 0.8,
    // a custom systemPrompt can be set here. note that the template depends on the model.
    // if unset, the systemPrompt that comes with the model will be used.
    systemPrompt: "### System:\nYou are an advanced mathematician.\n\n",
});

// create a completion using a string as input
const res1 = await createCompletion(chat, "What is 1 + 1?");
console.debug(res1.choices[0].message);

// multiple messages can be input to the conversation at once.
// note that if the last message is not of role 'user', an empty message will be returned.
await createCompletion(chat, [
    {
        role: "user",
        content: "What is 2 + 2?",
    },
    {
        role: "assistant",
        content: "It's 5.",
    },
]);

const res3 = await createCompletion(chat, "Could you recalculate that?");
console.debug(res3.choices[0].message);

model.dispose();