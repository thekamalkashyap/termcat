#!/usr/bin/env node
import WebSocket from "ws";
import readline from "readline";
import { uid as generateUid } from "uid-promise";
import picocolors from "picocolors";
import { program } from "commander";
import { StringDecoder } from "string_decoder";
const { green, red, blue, bold } = picocolors;
const decoder = new StringDecoder("utf8");

program.name("termcat");
program.description("chat right from comfort of your terminal.");
program.option("-n, --name <your-name>");
program.option("-c, --connect <other-uid>");
program.parse();
const options = program.opts();

const ws = new WebSocket("wss://termcat-server.onrender.com/");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "",
});

let log = console.log;
console.log = (message) => {
  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0);
  log(message);
  rl.prompt(true);
};

let otherUid = null;

rl.on("line", (input) => {
  if (otherUid) {
    const data = {
      type: "message",
      message: input,
      receiver: otherUid,
    };
    ws.send(JSON.stringify(data));
  } else {
    console.log(red("you are not connected to any user."));
  }
  rl.prompt(true);
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
    connect: options.connect,
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
  console.log(red("exiting..."));
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
  console.log(red(`${otherUid} left the chat.`));
  otherUid = null;
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
  }
});

process.on("SIGINT", handleProgramExit);
