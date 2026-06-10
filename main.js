// Arquivo para código javascript

const API_URL = 'https://6a29e81ff59cb8f65f1dc039.mockapi.io/materiais';

async function carregarMateriais() {
    const res = await fetch(API_URL);
    const dados = await res.json();

    const lista = document.getElementById('lista-materiais');
    lista.innerHTML = '';

    dados.forEach(m => {
        const div = document.createElement('div');
        div.className = 'material-item';
        div.innerHTML = `<strong>${m.nome}</strong> — Quantidade: ${m.quantidade}`;
        lista.appendChild(div);
    });
}

async function cadastrarMaterial() {
    const nome = document.getElementById('input-nome').value.trim();
    const quantidade = parseInt(document.getElementById('input-quantidade').value);

    if (!nome || quantidade < 1) {
        alert('Preencha o nome e a quantidade.');
        return;
    }

    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, quantidade })
    });

    document.getElementById('input-nome').value = '';
    document.getElementById('input-quantidade').value = '';
    await carregarMateriais();
}

document.getElementById('btn-cadastrar').addEventListener('click', cadastrarMaterial);

carregarMateriais();
