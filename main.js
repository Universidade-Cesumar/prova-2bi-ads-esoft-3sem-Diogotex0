// Arquivo para código javascript

const API_URL = 'https://6a29e81ff59cb8f65f1dc039.mockapi.io/materiais';

async function carregarMateriais() {
    const lista = document.getElementById('lista-materiais');
    lista.innerHTML = '<p class="sem-resultados">Carregando...</p>';

    const res = await fetch(API_URL);
    const dados = await res.json();
    renderizarLista(dados);
}

async function cadastrarMaterial() {
    const nome = document.getElementById('input-nome').value.trim();
    const quantidade = parseInt(document.getElementById('input-quantidade').value);
    const categoria = document.getElementById('input-categoria').value;
    const validade = document.getElementById('input-validade').value;
    const instrutor = document.getElementById('input-instrutor').value.trim();

    if (!nome || isNaN(quantidade) || quantidade < 1) {
        alert('Preencha o nome e a quantidade do material.');
        return;
    }

    const novoMaterial = { nome, quantidade, categoria, validade, instrutor };

    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoMaterial)
    });

    limparFormulario();
    await carregarMateriais();
}

function renderizarLista(materiais) {
    const lista = document.getElementById('lista-materiais');
    lista.innerHTML = '';

    if (materiais.length === 0) {
        lista.innerHTML = '<p class="sem-resultados">Nenhum material cadastrado.</p>';
        return;
    }

    materiais.forEach(m => {
        const div = document.createElement('div');
        div.className = 'material-item';
        div.innerHTML = `
            <div class="material-info">
                <h4>${m.nome}</h4>
                <p>
                    Qtd: <strong>${m.quantidade}</strong>
                    ${m.categoria ? ` &bull; ${m.categoria === 'consumivel' ? 'Consumível' : 'Permanente'}` : ''}
                    ${m.validade ? ` &bull; Validade: ${formatarData(m.validade)}` : ''}
                </p>
            </div>
        `;
        lista.appendChild(div);
    });
}

function formatarData(iso) {
    if (!iso) return '';
    const [a, m, d] = iso.split('-');
    return `${d}/${m}/${a}`;
}

function limparFormulario() {
    ['input-nome', 'input-quantidade', 'input-instrutor', 'input-validade'].forEach(id => {
        document.getElementById(id).value = '';
    });
    document.getElementById('input-categoria').value = '';
}

document.getElementById('btn-cadastrar').addEventListener('click', cadastrarMaterial);

carregarMateriais();
