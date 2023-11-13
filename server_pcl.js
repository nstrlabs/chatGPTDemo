require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
const path = require('path');
const fs = require('fs'); 


const app = express();
const port = process.env.PORT;


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY 
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

app.use(bodyParser.json());

const conversation = []

app.post('/init', async (req, res) => {
    try {
        // Si conversationArr no se utiliza, puedes eliminar esta línea
        const conversationArr = req.body.conversationArr;

        // Leer las especificaciones
        const specifications = fs.readFileSync(path.join(__dirname, 'public/uploads', 'pcl_documentation.md'), 'utf8');
        const instructions = fs.readFileSync(path.join(__dirname, 'public/uploads', 'instructions_pcl.md'), 'utf8');
        const logs = fs.readFileSync(path.join(__dirname, 'public/uploads', 'sample_log_apache.md'), 'utf8');

        // Create the initial message with the instructions a logs
        const initialMsg = { 
            role: 'system', 
            content: specifications,
            role: 'system', 
            content: instructions
        };

        // Add to conversation
        conversation.push(initialMsg);

        //const chatCompletion = await openai.chat.completions.create({
        //    messages: [initialMsg], 
        //    model: process.env.GPT_MODEL,
        //});

        //const contentStr = chatCompletion.choices[0].message.content.trim();

        const contentStr = 'hola en que puedo ayudarte'

        // Add response to conversation
        conversation.push({
            role: 'assistant', 
            content: contentStr
        });

        return res.json({content: contentStr});
    } catch (error) {
        console.error(error);
        res.status(500).send(error.toString());
    }
});

app.post('/fetch-reply', async (req, res) => {
    try {
        const input = req.body.input;

        conversation.push(input);

        const chatCompletion = await openai.chat.completions.create({
            messages: conversation,
            model: process.env.GPT_MODEL,
        });

        const result = chatCompletion.choices[0].message.content.trim()
        const response = { role: 'assistant', content: result };
        
        conversation.push(response);

        return res.json({ content: result });
    } catch (error) {
        console.error(error);
        return res.status(500).send('An error occurred');
    }
});


