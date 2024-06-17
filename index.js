#!/usr/bin/env node
import WebSocket from "ws";
import readline from "readline";
import { uid as generateUid } from "uid-promise";
import picocolors from "picocolors";
import { program } from "commander";
import { StringDecoder } from "string_decoder";
import fs from "fs";

const { green, red, blue, bold } = picocolors;
const decoder = new StringDecoder("utf8");
const packageJson = JSON.parse(fs.readFileSync("./package.json"));

program.name(packageJson.name);
program.description(packageJson.description);
program.version(packageJson.version, "-v, --version");
program.option("-n, --name <your-name>", "your name to display in chat");
program.option(
  "-c, --connect <other-uid>",
  "uid of the user you want to connect with"
);
program.parse();

const options = program.opts();

const ws = new WebSocket("wss://ws.gurpreetkaur.tech");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: green("[me]: "),
});

const log = console.log;
console.log = (message) => {
  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0);
  log(message);
  rl.prompt(true);
};

const errorLog = console.error;
console.error = (message) => {
  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0);
  errorLog(red(message));
};

let otherUid = null;

rl.on("line", (input) => {
  rl.prompt(true);
  if (!input.trim()) return;
  if (!otherUid) {
    console.error("you are not connected to any user.");
    rl.prompt(true);
    return;
  }
  const data = {
    type: "message",
    message: input,
    receiver: otherUid,
  };
  ws.send(JSON.stringify(data));
});

ws.on("error", (error) => {
  console.error("Something went wrong");
});

ws.on("open", async () => {
  const uid = await generateUid(12);
  const data = {
    type: "connect",
    name: options.name ?? "user",
    uid: uid,
    connect: options.connect ?? null,
  };
  ws.send(JSON.stringify(data));
});

const handleConnected = (uid) => {
  console.log("your id is: " + blue(bold(uid)));
  rl.prompt();
};

const handleNewMessage = (message, sender) => {
  console.log(blue(`[${sender}]: `) + message);
};

const handleUserJoined = (connect) => {
  console.log(green("Connected to: ") + blue(bold(connect)));
  otherUid = connect;
};

const handleProgramExit = () => {
  console.error("exiting...");
  const data = {
    type: "exit",
    receiver: otherUid,
  };
  if (ws.readyState == WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
    ws.close();
  }
  process.exit(1);
};

const handleUserExit = () => {
  console.error(`${otherUid} left the chat.`);
  rl.prompt(true);
  otherUid = null;
};

const handleServerError = (message) => {
  console.error(message);
  process.exit(1);
};

ws.on("message", (data) => {
  const json = JSON.parse(decoder.write(data));
  const { type, uid, message, sender, connect } = json;
  switch (type) {
    case "connected":
      handleConnected(uid);
      break;
    case "joined":
      handleUserJoined(connect);
      break;
    case "message":
      handleNewMessage(message, sender);
      break;
    case "exit":
      handleUserExit();
      break;
    case "error":
      handleServerError(message);
      break;
  }
});

process.on("SIGINT", handleProgramExit);
