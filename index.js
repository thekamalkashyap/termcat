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

const ws = new WebSocket("ws://localhost:3000");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
rl.setPrompt("");

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
  rl.prompt();
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

const handleMessage = (message, sender) => {
  console.log(blue(`[${sender}]: `) + message);
  rl.prompt();
};

const handleJoined = (connect) => {
  console.log(green("Connected to: ") + blue(bold(connect)));
  otherUid = connect;
};

const handleExit = () => {
  console.log(red("exiting..."));
  const data = {
    type: "exit",
    receiver: otherUid,
  };
  ws.send(JSON.stringify(data));
  ws.close();
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
      handleJoined(connect);
      break;
    case "message":
      handleMessage(message, sender);
      break;
    case "exit":
      console.log(red(`${otherUid} left the chat.`));
      otherUid = null;
      break;
  }
});

process.on("SIGINT", handleExit);
