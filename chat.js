/* ════════════════════════════════════════
   MINI CHAT WIDGET
════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function() {
    const hablemosBtn = document.getElementById('hablemos');
    const chatWidget = document.getElementById('chat-widget');
    const chatClose = document.getElementById('chat-close');
    const chatInput = document.getElementById('chat-input');
    const chatSendBtn = document.getElementById('chat-send-btn');
    const chatMessages = document.getElementById('chat-messages');

    // Abrir chat al hacer clic en "Hablemos"
    if (hablemosBtn) {
        hablemosBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openChat();
        });
    }

    // Cerrar chat al hacer clic en X
    if (chatClose) {
        chatClose.addEventListener('click', closeChat);
    }

    // Cerrar chat al hacer clic fuera (en el overlay)
    if (chatWidget) {
        chatWidget.addEventListener('click', function(e) {
            if (e.target === chatWidget) {
                closeChat();
            }
        });
    }

    // Enviar mensaje al hacer clic en botón o presionar Enter
    if (chatSendBtn) {
        chatSendBtn.addEventListener('click', sendMessage);
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }

    function openChat() {
        if (chatWidget) {
            chatWidget.classList.add('active');
            
            // Si es la primera vez que se abre, enviar mensaje de bienvenida
            if (chatMessages && chatMessages.children.length === 0) {
                setTimeout(() => {
                    addMessage('Buenos días, ¿necesita algo? ¿Tiene alguna duda? 😊', 'bot');
                }, 300);
            }
            
            chatInput?.focus();
        }
    }

    function closeChat() {
        if (chatWidget) {
            chatWidget.classList.remove('active');
        }
    }

    function sendMessage() {
        const message = chatInput?.value.trim();
        if (!message) return;

        // Agregar mensaje del usuario
        addMessage(message, 'user');

        // Limpiar input
        if (chatInput) {
            chatInput.value = '';
            chatInput.focus();
        }

        // Simular respuesta del bot después de 500ms
        setTimeout(() => {
            const botResponse = getBotResponse(message);
            addMessage(botResponse, 'bot');
        }, 500);
    }

    function addMessage(text, sender) {
        const messageEl = document.createElement('div');
        messageEl.classList.add('chat-message', `chat-${sender}`);
        messageEl.textContent = text;
        
        if (chatMessages) {
            chatMessages.appendChild(messageEl);
            // Scroll al último mensaje
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    function getBotResponse(userMessage) {
        // Respuestas simples basadas en palabras clave
        const msg = userMessage.toLowerCase();

        if (msg.includes('precio') || msg.includes('costo') || msg.includes('€')) {
            return 'Nuestros productos tienen diferentes precios. ¿Necesitas ayuda con algún producto específico? 😊';
        } else if (msg.includes('envío') || msg.includes('entrega')) {
            return 'Realizamos envíos a toda la región. ¿A qué zona necesitas enviar tu pedido? 📦';
        } else if (msg.includes('membresía') || msg.includes('miembro')) {
            return 'Tenemos planes de membresía básica, plus y gratuita. ¿Te gustaría conocer más detalles? ✨';
        } else if (msg.includes('gracias') || msg.includes('ok') || msg.includes('vale')) {
            return 'De nada. ¿Hay algo más en lo que pueda ayudarte? 😊';
        } else if (msg.includes('adiós') || msg.includes('adios') || msg.includes('hasta luego')) {
            return '¡Hasta pronto! Gracias por tu interés. 👋';
        } else {
            // Respuesta genérica
            const responses = [
                '¡Excelente pregunta! ¿Puedo ayudarte con algo más específico?',
                'Entendido. ¿Hay algo más que te gustaría saber?',
                'Claro, estamos aquí para ayudarte. ¿Algo más?',
                'Gracias por tu mensaje. ¿En qué más puedo asistirte?'
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
    }
});


