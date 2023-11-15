# chatGPTDemo
Demo about how use chatGPT to parse, build message and pipelelines creator

## Prerequisites

Before installing, ensure you have the following software installed:
- Node.js (Version 18.x or higher)
- npm (Version 8.x or higher)

You can check your current versions with these commands:
```bash
node -v
npm -v

Also, you must to create a .env file with the API key. An example in .env_example

## Installation

To install and run this project locally, follow these steps:

\```bash
git clone https://github.com/nstrlabs/chatGPTDemo.git
cd chatGPTDemo
npm install
\```

to run the parser assistant service use:
\```bash
node server_pcl.js 
\```

to run the message builder asistance  use:
\```bash
node server_msgbuilder.js 
\```

to run the pipeline assistance use:
\```bash
node server_msgbuilder.js 
\```

## Usage

Once the server is running, you can access the chatbot interface at `http://localhost:9000`. Enter your questions or comments in the chat input field and receive responses from ChatGPT. 