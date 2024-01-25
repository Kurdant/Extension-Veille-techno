        // JavaScript pour gérer la conversation avec ChatGPT
        document.addEventListener('DOMContentLoaded', function () {
            const chatMessages = document.getElementById('chat-messages');
            const userInput = document.getElementById('user-input');
            const sendButton = document.getElementById('send-button');
    
            // Remplacez 'YOUR_API_KEY' par votre propre clé d'API GPT-3
            const apiKey = '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';
            const endpoint = 'https://api.openai.com/v1/gpt-3.5/completions';
    
            sendButton.addEventListener('click', async function () {
                const userMessage = userInput.value;
                appendMessage('Vous : ' + userMessage);
                userInput.value = '';
    
                try {
                    const response = await fetch(endpoint, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${apiKey}`
                        },
                        body: JSON.stringify({
                            prompt: userMessage,
                            max_tokens: 150  // Limite de taille de réponse
                        })
                    });
    
                    if (response.ok) {
                        const data = await response.json();
                        const chatResponse = data.choices[0].text;
                        appendMessage('ChatGPT : ' + chatResponse);
                    } else {
                        appendMessage('Erreur lors de la communication avec ChatGPT.');
                    }
                } catch (error) {
                    appendMessage('Erreur : ' + error.message);
                }
            });
    
            function appendMessage(message) {
                const messageElement = document.createElement('p');
                messageElement.textContent = message;
                chatMessages.appendChild(messageElement);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        });

      
    