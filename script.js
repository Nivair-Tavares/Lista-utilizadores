const btnCarregar = document.getElementById("btnCarregar");
const listaUtilizadores = document.getElementById("listaUtilizadores");
const inputBusca = document.getElementById("busca");

class Utilizador {
  constructor(nome, email) {
    this.nome = nome;
    this.email = email;
  }

  mostrarnoDOM(lista) {
    const li = document.createElement("li");
    li.className = "item-utilizador";

    li.innerHTML = `
        <div class="info">
            <strong class="nome-grande">${this.nome}</strong>
            <span class="email-pequeno">${this.email}</span>
        </div>
        <button class="btn-deletar">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 30 30">
            <path d="M 14.984375 2.4863281 A 1.0001 1.0001 0 0 0 14 3.5 L 14 4 L 8.5 4 A 1.0001 1.0001 0 0 0 7.4863281 5 L 6 5 A 1.0001 1.0001 0 1 0 6 7 L 24 7 A 1.0001 1.0001 0 1 0 24 5 L 22.513672 5 A 1.0001 1.0001 0 0 0 21.5 4 L 16 4 L 16 3.5 A 1.0001 1.0001 0 0 0 14.984375 2.4863281 z M 6 9 L 7.7929688 24.234375 C 7.9109687 25.241375 8.7633438 26 9.7773438 26 L 20.222656 26 C 21.236656 26 22.088031 25.241375 22.207031 24.234375 L 24 9 L 6 9 z"></path>
          </svg>
        </button>
    `;

    const btnDeletar = li.querySelector(".btn-deletar");
    btnDeletar.addEventListener("click", () => {
      li.remove();
      // Atualiza o array global caso queira que o item sumir da busca também
      todosOsUtilizadores = todosOsUtilizadores.filter(u => u.email !== this.email);
    });

    lista.appendChild(li);
  }
}

class UtilizadorAPI {
  constructor(url) {
    this.url = url;
  }

  async buscarUtilizadores() {
    try {
      const response = await fetch(this.url);
      const dados = await response.json();
      return dados.map(item => new Utilizador(item.name, item.email));
    } catch (erro) {
      console.error("Erro ao buscar utilizadores: ", erro);
      return [];
    }
  }
}

const api = new UtilizadorAPI("https://jsonplaceholder.typicode.com/users");
let todosOsUtilizadores = []; 

// Função central de renderização com lógica de "Não encontrado"
function renderizarLista(listaParaExibir) {
  listaUtilizadores.innerHTML = "";

  if (listaParaExibir.length === 0 && inputBusca.value !== "") {
    listaUtilizadores.innerHTML = `<p class="aviso-vazio">Nenhum utilizador encontrado com este nome.</p>`;
    return;
  }

  listaParaExibir.forEach((u) => u.mostrarnoDOM(listaUtilizadores));
}

// Função para garantir que tem dados antes de filtrar
async function carregarSeVazio() {
  if (todosOsUtilizadores.length === 0) {
    todosOsUtilizadores = await api.buscarUtilizadores();
  }
}

// Evento de Carregar (Botão)
btnCarregar.addEventListener("click", async () => {
  todosOsUtilizadores = await api.buscarUtilizadores();
  renderizarLista(todosOsUtilizadores);
});

// Evento de Busca (Input)
inputBusca.addEventListener("input", async (evento) => {
  const termoBusca = evento.target.value.toLowerCase();

  // Se o campo estiver vazio, opcionalmente limpa a lista ou mostra todos
  if (termoBusca === "") {
    renderizarLista(todosOsUtilizadores);
    return;
  }

  // Carrega automaticamente se o usuário começar a digitar sem clicar no botão antes
  await carregarSeVazio();

  const utilizadoresFiltrados = todosOsUtilizadores.filter((utilizador) => {
    return (
      utilizador.nome.toLowerCase().includes(termoBusca) ||
      utilizador.email.toLowerCase().includes(termoBusca)
    );
  });

  renderizarLista(utilizadoresFiltrados);
});