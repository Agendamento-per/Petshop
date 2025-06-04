const servicoSelect = document.getElementById('servico');
const tiposTosaDiv = document.getElementById('tiposTosa');
const tipoTosaSelect = document.getElementById('tipoTosa');

servicoSelect.addEventListener('change', function () {
  if (servicoSelect.value === 'Tosa') {
    tiposTosaDiv.style.display = 'block';
  } else {
    tiposTosaDiv.style.display = 'none';
    tipoTosaSelect.value = '';
  }
});

const taxiDogCheckbox = document.getElementById('taxiDog');
const taxaTaxiDogDiv = document.getElementById('taxaTaxiDog');

taxiDogCheckbox.addEventListener('change', function () {
  taxaTaxiDogDiv.style.display = this.checked ? 'block' : 'none';
});

document.getElementById('agendamentoForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const nome = document.getElementById('nome').value;
  //const telefone = document.getElementById('telefone').value;
  const pet = document.getElementById('pet').value;
  const servico = servicoSelect.value;
  const tipoTosa = tipoTosaSelect.value;
  const data = document.getElementById('data').value;
  const hora = document.getElementById('hora').value;
  const endereco = document.getElementById('endereco').value;
  const taxiDog = taxiDogCheckbox.checked;

  let mensagem = `Olá sou ${nome}, gostaria de agendamento para meu pet *${pet}*`;
  mensagem += `- Serviço: *${servico}*%0A`;

  if (servico === 'Tosa' && tipoTosa) {
    mensagem += `- Tipo de Tosa: *${tipoTosa}*%0A`;
  }

  mensagem += `- Data: *${data}*%0A`;
  mensagem += `- Hora: *${hora}*%0A`;
  mensagem += `- Endereço: *${endereco}*%0A`;

  if (taxiDog) {
    mensagem += `- Táxi Dog: *Solicitado* (R$ 5,00)%0A`;
  }

  mensagem += `%0AAgradecemos por escolher nosso PetShop! <3`;

  const whatsappURL = `https://wa.me/5561981962696?text=${mensagem}`;
  window.open(whatsappURL, '_blank');
});

