// =============================
// AI SELF-HEALING PLAYWRIGHT FRAMEWORK
// Plug & Play Project
// =============================

// 1. Install dependencies:
// npm init -y
// npm install @playwright/test node-fetch fs
// npx playwright install

// 2. Run local LLM (example using Ollama):
// ollama run qwen2.5:7b

// =============================
// FILE: healer.js
// =============================

// import fetch from "node-fetch";
import fs from "fs";

const CACHE_FILE = "locator-cache.json";

export async function safeClick(page, locator, intent) {
  try {
    await page.click(locator, { timeout: 2000 });
  } catch (err) {
    console.log("❌ Failed locator:", locator);

    const cached = getCachedLocator(intent);
    if (cached) {
      console.log("⚡ Using cached locator:", cached);
      return page.click(cached);
    }

    const elements = await extractElements(page);

    const heuristic = heuristicFix(locator, elements);
    if (heuristic) {
      console.log("⚡ Heuristic fix:", heuristic);
      cacheLocator(intent, heuristic);
      return page.click(heuristic);
    }

    const healed = await callLLM(locator, intent, elements);

    const valid = await validateLocator(page, healed);
    if (!valid) throw new Error("Healing failed ❌");

    console.log("✅ LLM Healed:", healed);
    cacheLocator(intent, healed);

    await page.click(healed);
  }
}

async function extractElements(page) {
  return await page.evaluate(() => {
    return Array.from(document.querySelectorAll("input, button"))
      .map(el => ({
        tag: el.tagName.toLowerCase(),
        id: el.id,
        type: el.type,
        text: el.innerText
      }));
  });
}

function heuristicFix(failed, elements) {
  const key = failed.replace("#", "");
  const match = elements.find(el => el.id && el.id.includes(key));
  return match ? `#${match.id}` : null;
}

async function callLLM(failedLocator, intent, elements) {
  const response = await fetch("http://127.0.0.1:5000/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "Llama-3.2-1B-Instruct",
      messages: [
        {
          role: "system",
          content: "Return only a valid CSS selector."
        },
        {
          role: "user",
          content: `
              Failed locator: ${failedLocator}
              Intent: ${intent}

              Elements:
              ${JSON.stringify(elements)}

             Rules:
                  - Prefer id
                  - Must be unique
                  - Return ONLY selector
                  `
        }
      ]
    })
  });

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

async function validateLocator(page, locator) {
  const count = await page.locator(locator).count();
  return count === 1;
}

function getCachedLocator(intent) {
  if (!fs.existsSync(CACHE_FILE)) return null;
  const data = JSON.parse(fs.readFileSync(CACHE_FILE));
  return data[intent];
}

function cacheLocator(intent, locator) {
  let data = {};
  if (fs.existsSync(CACHE_FILE)) {
    data = JSON.parse(fs.readFileSync(CACHE_FILE));
  }
  data[intent] = locator;
  fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2));
}



// =============================
// RUN PROJECT
// =============================

// npx playwright test

// =============================
// OUTPUT EXAMPLE
// =============================

// ❌ Failed locator: #passwor
// ⚡ Heuristic fix: #password
// OR
// ✅ LLM Healed: #password

// =============================
// DONE ✅
// =============================
