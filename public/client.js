

document.addEventListener('DOMContentLoaded', (event) => {
    sendInstructions();
});

async function sendInstructions() {
    try {
        const response = await fetch('/init', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        renderTypewriterText(data.content);
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

const chatbotConversation = document.getElementById('chatbot-conversation')

document.addEventListener('submit', (e) => {
    e.preventDefault();

    const userInput = document.getElementById('user-input');
    const userText = userInput.value; // Obtener el texto ingresado por el usuario

    const newSpeechBubble = document.createElement('div');
    newSpeechBubble.classList.add('speech', 'speech-human');
    newSpeechBubble.textContent = userText;
    chatbotConversation.appendChild(newSpeechBubble);

    const input = { 
        role: 'user',
        content: userText
    };

    userInput.value = '';
    chatbotConversation.scrollTop = chatbotConversation.scrollHeight;

    fetchReply(input); // Pasar 'input' a 'fetchReply'
});


async function fetchReply(input) {
    try {
        const response = await fetch('/fetch-reply', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ input }), // Asegúrate de que esto coincida con lo que espera tu servidor
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        renderTypewriterText(data.content);
        

    } catch (error) {
        console.error('Fetch error:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const chatbotContainer = document.querySelector('.chatbot-container');
    let isDragging = false;
    let offset = { x: 0, y: 0 };

    const onMouseDown = (e) => {
        isDragging = true;
        offset = {
            x: chatbotContainer.offsetLeft - e.clientX,
            y: chatbotContainer.offsetTop - e.clientY
        };
    };

    const onMouseMove = (e) => {
        if (!isDragging) return;
        chatbotContainer.style.left = e.clientX + offset.x + 'px';
        chatbotContainer.style.top = e.clientY + offset.y + 'px';
    };

    const onMouseUp = () => {
        isDragging = false;
    };

    chatbotContainer.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);
});


function renderTypewriterText(text) {
    console.log(text)
    if (!text) {
        console.error('No text provided to renderTypewriterText');
        // Considera mostrar un mensaje en la interfaz de usuario aquí
        return;
    }

    const newSpeechBubble = document.createElement('div');
    newSpeechBubble.classList.add('speech', 'speech-ai', 'blinking-cursor');
    chatbotConversation.appendChild(newSpeechBubble);

    let i = 0;
    const interval = setInterval(() => {
        if (text.length === i) {
            clearInterval(interval);
            newSpeechBubble.classList.remove('blinking-cursor');
            return;
        }

        newSpeechBubble.textContent += text[i];
        i++;
        chatbotConversation.scrollTop = chatbotConversation.scrollHeight;
    }, 50);
}
