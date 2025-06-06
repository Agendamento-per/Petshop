const chat = document.getElementById('chat');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

// Gera a lista de horários de 30 em 30 minutos
function gerarHorarios() {
    const horarios = [];
    const inicio = 8 * 60;
    const fim = 17 * 60 + 30;
    
    for (let min = inicio; min <= fim; min += 30) {
        const h = String(Math.floor(min / 60)).padStart(2, '0');
        const m = String(min % 60).padStart(2, '0');
        horarios.push(`${h}:${m}`);
    }

    return horarios;
}

// Etapas da conversa
const steps = [
    { question: "Qual seu nome?", field: "cliente" },
    { question: "Qual o nome do seu pet?", field: "pet" },
    { question: "Qual serviço?", field: "servico", options: ["Banho", "Tosa", "Consulta"] },
    { 
        question: "Qual o tipo de tosa?", 
        field: "tipoTosa", 
        options: ["Baby", "Geral", "Trimming", "Asiática", "Higiênica"], 
        conditional: (data) => data.servico === "Tosa" 
    },
    { question: "Qual o porte do pet?", field: "porte", options: ["Pequeno", "Médio", "Grande"] },
    { question: "Selecione a data do serviço:", field: "data", type: "date" },
    { question: "Selecione o horário desejado:", field: "hora", options: gerarHorarios() },
    { question: "Informe o endereço para atendimento:", field: "endereco" },
    { question: "Deseja adicionar alguma observação?", field: "querObservacao", options: ["Sim", "Não"] },
    { 
        question: "Digite sua observação:", 
        field: "observacoes", 
        conditional: (data) => data.querObservacao === "Sim" 
    },
    { question: "Perfeito! Confirmando seu pedido...", field: null, isFinal: true }
];

const orderData = {};
let currentStep = -1;

// Mensagens iniciais
addMessage("🐾 Bem-vindo ao Pet Mundo dos Pets!", true);
addMessage("Olá! Vamos agendar seu serviço.", true);

setTimeout(() => {
    processChoice('');
}, 500);

// Função para adicionar mensagens
function addMessage(text, isReceived) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isReceived ? 'received' : 'sent'}`;
    messageDiv.innerHTML = `
        ${text}
        <div class="time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
    `;
    chat.appendChild(messageDiv);
    chat.scrollTop = chat.scrollHeight;
}

// Opções em forma de botões
function addMessageWithOptions(text, options) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message received';
    const time = `<div class="time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>`;

    const buttonsHTML = options.map(opt => `<button class="option-btn">${opt}</button>`).join(' ');
    messageDiv.innerHTML = `${text}<br>${buttonsHTML}${time}`;
    chat.appendChild(messageDiv);
    chat.scrollTop = chat.scrollHeight;

    const buttons = messageDiv.querySelectorAll('.option-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const choice = btn.textContent;
            addMessage(choice, false);
            buttons.forEach(b => b.disabled = true);
            setTimeout(() => processChoice(choice), 500);
        });
    });
}

// Input para selecionar data
function addDateInput(question) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message received';
    const time = `<div class="time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>`;

    const inputHTML = `
        <input type="date" id="dateInput" class="date-input">
        <button class="confirm-date-btn">Confirmar</button>
    `;

    messageDiv.innerHTML = `${question}<br>${inputHTML}${time}`;
    chat.appendChild(messageDiv);
    chat.scrollTop = chat.scrollHeight;

    const dateInput = messageDiv.querySelector('#dateInput');
    const confirmButton = messageDiv.querySelector('.confirm-date-btn');

    confirmButton.addEventListener('click', () => {
        const value = dateInput.value;
        if (value) {
            const dataFormatada = value.split('-').reverse().join('/');
            addMessage(dataFormatada, false);
            processChoice(dataFormatada);
            dateInput.disabled = true;
            confirmButton.disabled = true;
        } else {
            alert("Por favor, selecione uma data antes de confirmar.");
        }
    });
}

// Processa a escolha do usuário
function processChoice(input) {
    if (currentStep >= 0 && currentStep < steps.length && steps[currentStep].field) {
        orderData[steps[currentStep].field] = input;
    }

    do {
        currentStep++;
    } while (
        currentStep < steps.length &&
        steps[currentStep].conditional &&
        !steps[currentStep].conditional(orderData)
    );

    if (currentStep < steps.length) {
        const step = steps[currentStep];

        setTimeout(() => {
            if (step.type === "date") {
                addDateInput(step.question);
            } else if (step.options) {
                addMessageWithOptions(step.question, step.options);
            } else {
                addMessage(step.question, true);
            }

            if (step.isFinal) {
                setTimeout(() => {
                    const mensagem =
`Olá, meu nome é *${orderData.cliente}*, gostaria de agendar para meu pet *${orderData.pet}*\n` +
`- Serviço: *${orderData.servico}*\n` +
(orderData.servico === "Tosa" ? `- Tipo de Tosa: *${orderData.tipoTosa}*\n` : '') +
`- Porte: *${orderData.porte}*\n` +
`- Data: *${orderData.data}*\n` +
`- Hora: *${orderData.hora}*\n` +
`- Endereço: *${orderData.endereco}*\n` +
(orderData.observacoes ? `- Observações: *${orderData.observacoes}*\n` : '') +
`\nPoderia confirmar meu agendamento?`;

                    addMessage("Resumo do Pedido:", true);
                    addMessage(mensagem.replace(/%0A/g, '\n'), true);
                    addMessage("✅ Seu pedido foi enviado para o WhatsApp!", true);

                    const whatsappURL = `https://wa.me/5561981962696?text=${encodeURIComponent(mensagem)}`;
                    
                    userInput.disabled = true;
                    sendButton.disabled = true;
                    userInput.placeholder = "Conversa encerrada";
                    window.location.href = whatsappURL;
                }, 1000);
            }
        }, 500);
    }
}

// Processa o texto enviado pelo usuário
function processUserInput() {
    const input = userInput.value.trim();
    if (!input) return;

    addMessage(input, false);
    userInput.value = '';
    processChoice(input);
}

// Listeners
sendButton.addEventListener('click', processUserInput);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        processUserInput();
    }
});
