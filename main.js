// Arquivo para código javascript

const API_URL = 'https://6a29e81ff59cb8f65f1dc039.mockapi.io/materiais';

let todosMateriais = [];
let itemSelecionado = null;

function validarRetirada(estoqueAtual, quantidadeRetirada) {
    if (quantidadeRetirada <= 0) return false;
    if (quantidadeRetirada > estoqueAtual) return false;
    return true;
}

async function carregarMateriais() {
    try {
        const res = await fetch(API_URL);
        const dados = await res.json();
        todosMateriais = dados;

        const lista = document.getElementById('lista-materiais');
        lista.innerHTML = '';

        dados.forEach(m => {
            const div = document.createElement('div');
            div.className = 'material-item';
            div.innerHTML = `
                <span><strong>${m.nome}</strong> — Quantidade: ${m.quantidade}</span>
                <div>
                    <button class="btn-baixar" onclick="abrirModal('${m.id}')">Baixar</button>
                    <button class="btn-excluir" onclick="excluirMaterial('${m.id}')">Excluir</button>
                </div>
            `;
            lista.appendChild(div);
        });
    } catch (erro) {
        console.error('Erro ao carregar materiais:', erro);
    }
}

async function cadastrarMaterial() {
    const nome = document.getElementById('input-nome').value.trim();
    const quantidade = parseInt(document.getElementById('input-quantidade').value);

    if (!nome || quantidade < 1) {
        alert('Preencha o nome e a quantidade.');
        return;
    }

    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, quantidade })
        });

        document.getElementById('input-nome').value = '';
        document.getElementById('input-quantidade').value = '';
        await carregarMateriais();
    } catch (erro) {
        console.error('Erro ao cadastrar:', erro);
    }
}

async function excluirMaterial(id) {
    if (!confirm('Deseja excluir este material?')) return;

    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        await carregarMateriais();
    } catch (erro) {
        console.error('Erro ao excluir:', erro);
    }
}

function abrirModal(id) {
    itemSelecionado = todosMateriais.find(m => m.id === id);
    if (!itemSelecionado) return;

    document.getElementById('modal-info').textContent =
        `${itemSelecionado.nome} — Disponível: ${itemSelecionado.quantidade}`;
    document.getElementById('input-retirada').value = '';
    document.getElementById('modal-retirada').style.display = 'flex';
}

function fecharModal() {
    itemSelecionado = null;
    document.getElementById('modal-retirada').style.display = 'none';
}

async function confirmarRetirada() {
    const quantidade = parseInt(document.getElementById('input-retirada').value);

    if (!validarRetirada(itemSelecionado.quantidade, quantidade)) {
        alert('Quantidade inválida. Verifique o estoque disponível.');
        return;
    }

    const novaQuantidade = itemSelecionado.quantidade - quantidade;

    try {
        await fetch(`${API_URL}/${itemSelecionado.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantidade: novaQuantidade })
        });

        fecharModal();
        await carregarMateriais();
    } catch (erro) {
        console.error('Erro ao registrar retirada:', erro);
    }
}

document.getElementById('btn-cadastrar').addEventListener('click', cadastrarMaterial);
document.getElementById('btn-confirmar-retirada').addEventListener('click', confirmarRetirada);
document.getElementById('btn-fechar-modal').addEventListener('click', fecharModal);

carregarMateriais();
