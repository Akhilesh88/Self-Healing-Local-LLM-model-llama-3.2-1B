import { test, expect, Page } from "@playwright/test";
import { listenerCount, title } from "process";

test("has title", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/v1/");
  // Step-1 login into saucedemo and pick username and password with automation 
  //Fetch locator username values
  // let  user=await page.locator('//*[@id="login_credentials"]/h4/text()[1]').innerText();
  // let user= await page.locator('//*[@id="login_credentials"]',{has:page.locator("//text[text()='standard_user']")}).innerText(); 
  // console.log(user);
  const usernameList = await page.locator('#login_credentials').innerText();  
  const splittedUsernameList=usernameList.split("\n",6);
  console.log("Username after extraction is->",splittedUsernameList[1]);    
  const passwordText = await page.locator('div.login_password').innerText();
  const splittedPassword=passwordText.split("\n",6);
  console.log("Username after extraction is->",splittedPassword[1]);
  // await page.locator("#user-name").fill("standard_user");
  await page.locator("#user-name").fill(splittedUsernameList[1]);
  // await page.locator("#user-name").fill(user);
    await page.click("#passwor");
    // let  pwd=await page.locator('/html/body/div[2]/div[2]/div/div[2]/text()').innerText();
  // await page.locator("#password").fill("secret_sauce");
  await page.locator("#password").fill(splittedPassword[1]);
  // await page.locator("#password").fill(pwd);
  await page.click("#login-button");
});