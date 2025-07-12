const API = 'http://localhost:3000/estoque';

function carregarEstoque() {
  axios.get(API).then(res => {
    const tabela = document.getElementById('tabela-estoque');
    tabela.innerHTML = '';
    res.data.forEach(item => {
      tabela.innerHTML += `
        <tr>
          <td>${item.nome}</td>
          <td>${item.quantidade}</td>
          <td>
            <button onclick="entrada(${item.id}, ${item.quantidade})">Entrada</button>
            <button onclick="saida(${item.id}, ${item.quantidade})">Saída</button>
            <button onclick="remover(${item.id})">Remover</button>
          </td>
        </tr>
      `;
    });
  });
}

function adicionarComponente() {
  const nome = document.getElementById('nome').value;
  const quantidade = parseInt(document.getElementById('quantidade').value);

  if (!nome || quantidade <= 0) return alert('Preencha os campos corretamente');

  axios.post(API, { nome, quantidade }).then(() => {
    document.getElementById('nome').value = '';
    document.getElementById('quantidade').value = '';
    carregarEstoque();
  });
}

function entrada(id, atual) {
  axios.patch(`${API}/${id}`, { quantidade: atual + 1 }).then(carregarEstoque);
}

function saida(id, atual) {
  if (atual <= 0) return alert('Estoque zerado!');
  axios.patch(`${API}/${id}`, { quantidade: atual - 1 }).then(carregarEstoque);
}

function remover(id) {
  axios.delete(`${API}/${id}`).then(carregarEstoque);
}

carregarEstoque();
