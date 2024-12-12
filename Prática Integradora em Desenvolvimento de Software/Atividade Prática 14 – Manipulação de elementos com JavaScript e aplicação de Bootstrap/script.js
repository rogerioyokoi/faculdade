let clienteAtual = null; // Variável global para rastrear o cliente em edição

// Referências aos elementos principais
const tabelaBody = document.getElementById('clientesBody');
const emptyState = document.getElementById('emptyState');
const confirmDeleteButton = document.getElementById('confirmDeleteButton');
let clienteParaExcluir = null;

// Verifica se a tabela está vazia
function verificarTabelaVazia() {
  const linhas = tabelaBody.querySelectorAll('tr:not(#emptyState)');
  emptyState.style.display = linhas.length === 0 ? 'table-row' : 'none';
}

// Aplica estilização na validação do formulário
function ativaEstilizacaoFormularioValidado (estaValido) {
  const form = document.getElementById('form-client');
  if(estaValido) {
    form.classList.remove('was-validated')
  } else {
    form.classList.add('was-validated')
  }
}

// Adiciona ou edita uma linha na tabela
function adicionarOuEditarCliente(event) {
  ativaEstilizacaoFormularioValidado(true);
  event.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const sobrenome = document.getElementById('sobrenome').value.trim();
  const dataNascimento = document.getElementById('dataNascimento').value;
  const email = document.getElementById('email').value.trim();
  const endereco = document.getElementById('endereco').value.trim();

  if (!nome || !sobrenome || !dataNascimento || !email || !endereco) {
    ativaEstilizacaoFormularioValidado(false);
    return;
  }

  const nomeCompleto = `${nome} ${sobrenome}`;

  if (clienteAtual) {
    // Editar cliente existente
    clienteAtual.cells[0].innerText = nomeCompleto;
    clienteAtual.cells[1].innerText = dataNascimento;
    clienteAtual.cells[2].innerText = email;
    clienteAtual.cells[3].innerText = endereco;
    clienteAtual = null; // Limpar estado de edição
  } else {
    // Adicionar novo cliente
    const novaLinha = tabelaBody.insertRow();
    novaLinha.innerHTML = `
      <td>${nomeCompleto}</td>
      <td>${dataNascimento}</td>
      <td>${email}</td>
      <td>${endereco}</td>
      <td>
        <button class="btn btn-sm btn-warning me-2" onclick="editarCliente(this)">
          <i class="fas fa-edit"></i> Editar
        </button>
        <button class="btn btn-sm btn-danger" onclick="confirmarRemocao(this)">
          <i class="fas fa-trash-alt"></i> Remover
        </button>
      </td>
    `;
  }

  // Limpar formulário e verificar estado da tabela
  event.target.reset();
  verificarTabelaVazia();
  document.getElementById('submitButton').innerText = 'Adicionar cliente';
}

// Editar cliente
function editarCliente(botao) {
  clienteAtual = botao.closest('tr');
  const cells = clienteAtual.cells;

  document.getElementById('nome').value = cells[0].innerText.split(' ')[0];
  document.getElementById('sobrenome').value = cells[0].innerText.split(' ')[1];
  document.getElementById('dataNascimento').value = cells[1].innerText;
  document.getElementById('email').value = cells[2].innerText;
  document.getElementById('endereco').value = cells[3].innerText;

  document.getElementById('submitButton').innerText = 'Salvar Alterações';
}

// Confirmar remoção de cliente
function confirmarRemocao(botao) {
  clienteParaExcluir = botao.closest('tr');
  const modal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
  modal.show();
}

// Excluir cliente
confirmDeleteButton.addEventListener('click', () => {
  if (clienteParaExcluir) {
    clienteParaExcluir.remove();
    clienteParaExcluir = null;
    verificarTabelaVazia();

    // Fechar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal'));
    modal.hide();
  }
});

// Inicializar funcionalidade de adicionar cliente
document.querySelector('form').addEventListener('submit', adicionarOuEditarCliente);

// Inicializar estado vazio da tabela
verificarTabelaVazia();
