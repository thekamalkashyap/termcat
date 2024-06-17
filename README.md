# Termcat

<p>
  <a href="https://www.npmjs.com/package/termcat" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/termcat.svg">
  </a>
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

> chat with your colleagues right from the comfort of your terminal

<br/>

  <div align="center">

<a href='mailto:iamkamalkumar@proton.me'>![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)</a> <a href='https://www.linkedin.com/in/thekamalkashyap'>![LinkedIn](https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)</a>

</div>

<br/>

```sh
$ termcat -c 9xgC9VP3X81u

your id is: GwE2UGv8YPZh
Connected to: 9xgC9VP3X81u
[me]: hello world
[user]: hello from this side
[me]:
```

## 📑 Table of Contents

- [Termcat](#termcat)
  - [📑 Table of Contents](#-table-of-contents)
    - [Features](#features)
  - [Installation And Usage](#installation-and-usage)
    - [Usage](#usage)
    - [Installation](#installation)
      - [Using pnpm](#using-pnpm)
      - [development environment](#development-environment)
  - [Author](#author)

### Features

- Quickly chat with your colleagues and friends from the terminal
- set your username to be displayed in the chat
- get a unique id for your chat room
- your chat is private between you and your friend

## Installation And Usage

### Usage

1. set your username

```sh
termcat -n <name>
```

2. connect with other user

```sh
termcat -c <unique-id>
```

3. For help

```sh
termcat -h

Usage: termcat [options]

chat right from comfort of your terminal.

Options:
  -v, --version              output the version number
  -n, --name <your-name>     your name to display in chat
  -c, --connect <other-uid>  uid of the user you want to connect with
  -h, --help                 display help for command

```

<br/>

### Installation

#### Using pnpm

```sh
pnpm install -g termcat
```

or

```sh
npx termcat
```

#### development environment

To get a development environment running:

1. Clone the project and install its dependencies using pnpm

```sh
git clone https://github.com/thekamalkashyap/termcat.git
```

2. Navigate to the project's directory:

```sh
cd termcat
```

3. Install the project's dependencies:

```sh
pnpm install
```

4. make th desired changes in the code

<br/>

5. Running The Application

```sh
pnpm start
```

## Author

👤 **thekamalkashyap**
