document.addEventListener('DOMContentLoaded', function () {
  const servicoSelect = document.getElementById('servico');
  const tiposTosaDiv = document.getElementById('tiposTosa');
  const tipoTosaSelect = document.getElementById('tipoTosa');
  const dataInput = document.getElementById('data');
  const horaSelect = document.getElementById('hora');

  // Horários agendados (bloqueados)
  const horariosAgendados = {
    '2025-06-05': ['09:00', '13:00'],
    '2025-06-06': ['10:30', '14:00']
  };

  // Mostra/esconde tipo de tosa
  servicoSelect.addEventListener('change', function () {
    tiposTosaDiv.style.display = (this.value === 'Tosa') ? 'block' : 'none';
    if (this.value !== 'Tosa') tipoTosaSelect.value = '';
  });

  // Gera os horários disponíveis
  function gerarHorariosDisponiveis(dataSelecionada) {
    const horarios = [];
    const inicio = 8 * 60;
    const fim = 18 * 60;

    for (let min = inicio; min <= fim; min += 30) {
      const horas = String(Math.floor(min / 60)).padStart(2, '0');
      const minutos = String(min % 60).padStart(2, '0');
      horarios.push(`${horas}:${minutos}`);
    }

    const bloqueados = horariosAgendados[dataSelecionada] || [];
    return horarios.filter(h => !bloqueados.includes(h));
  }

  // Atualiza o select de horários
  dataInput.addEventListener('change', function () {
    let dataSelecionada = dataInput.value;
    if (!dataSelecionada) return;

    const horarios = gerarHorariosDisponiveis(dataSelecionada);
    horaSelect.innerHTML = '<option value="">Selecione</option>';

    horarios.forEach(horario => {
      const option = document.createElement('option');
      option.value = horario;
      option.textContent = horario;
      horaSelect.appendChild(option);
    });
  });

  // Envia para o WhatsApp
  document.getElementById('agendamentoForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const pet = document.getElementById('pet').value;
    const servico = servicoSelect.value;
    const tipoTosa = tipoTosaSelect.value;
    const data = dataInput.value;
    const hora = horaSelect.value;
    const endereco = document.getElementById('endereco').value;
    const porte = document.getElementById('porte').value;
    const obs = document.getElementById('observacoes').value;

    let mensagem = `Olá, sou ${nome}, gostaria de agendamento para meu pet *${pet}*%0A`;
    mensagem += `Serviço: *${servico}*%0A`;

    if (servico === 'Tosa' && tipoTosa) {
      mensagem += `- Tipo de Tosa: *${tipoTosa}*%0A`;
    }

    if (porte) {
      mensagem += `- Porte: *${porte}*%0A`;
    }

    if (obs) {
      mensagem += `- Observações: ${obs}%0A`;
    }

    mensagem += `- Data: *${data}*%0A`;
    mensagem += `- Hora: *${hora}*%0A`;
    mensagem += `- Endereço: *${endereco}*%0A`;

    mensagem += `Poderia confirmar o agendamento?`;

    const whatsappURL = `https://wa.me/5561981962696?text=${mensagem}`;
    window.open(whatsappURL, '_blank');
  });

  console.log("Script carregado com sucesso.");
});
