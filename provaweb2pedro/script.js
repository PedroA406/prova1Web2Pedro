
let catalogo = JSON.parse(localStorage.getItem("catalogo")) || [];
let editIndex = -1;


function renderizarCatalogo() {
    const catalogList = document.getElementById("catalog-list");
    catalogList.innerHTML = '';

    catalogo.forEach((item, index) => {
        const li = document.createElement("li");
        li.className = "catalog-item";
        li.innerHTML = `
      <div>
        <strong>${item.nome}</strong><br>
        Preço: R$ ${item.preco}<br>
        ${item.descricao}<br>
        ${item.endereco}
      </div>
      <button class="btdv" onclick="editarItem(${index})">Editar</button>
      <button class="btdv" onclick="removerItem(${index})">Remover</button>
    `;
        catalogList.appendChild(li);
    });
}


function adicionarItem() {
    const nome = document.getElementById("nome").value.trim();
    const preco = document.getElementById("preco").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const cep = document.getElementById("cep").value.trim();
    const endereco = document.getElementById("endereco").value.trim();


    if (!nome || !preco || !descricao || !cep) {
        document.getElementById("errorMessage").textContent = "Todos os campos são obrigatórios!";
        return;
    }

    const item = { nome, preco, descricao, cep, endereco };

    if (editIndex === -1) {
        catalogo.push(item);
    } else {
        catalogo[editIndex] = item;
        editIndex = -1;
        document.getElementById("adicionarBtn").textContent = "Adicionar Item";
    }


    localStorage.setItem("catalogo", JSON.stringify(catalogo));
    renderizarCatalogo();
    limparCampos();
}


function editarItem(index) {
    const item = catalogo[index];
    document.getElementById("nome").value = item.nome;
    document.getElementById("preco").value = item.preco;
    document.getElementById("descricao").value = item.descricao;
    document.getElementById("cep").value = item.cep;
    document.getElementById("endereco").value = item.endereco;

    editIndex = index;
    document.getElementById("adicionarBtn").textContent = "Atualizar Item";
}


function removerItem(index) {
    catalogo.splice(index, 1);
    localStorage.setItem("catalogo", JSON.stringify(catalogo));
    renderizarCatalogo();
}


function limparCampos() {
    document.getElementById("nome").value = "";
    document.getElementById("preco").value = "";
    document.getElementById("descricao").value = "";
    document.getElementById("cep").value = "";
    document.getElementById("endereco").value = "";
    document.getElementById("errorMessage").textContent = "";
}

async function buscarEndereco() {
    const cep = document.getElementById("cep").value.trim();
    if (cep.length === 8) {
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
            if (data.erro) {
                document.getElementById("endereco").value = "CEP não encontrado.";
            } else {
                document.getElementById("endereco").value = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
            }
        } catch (error) {
            console.error("Erro ao buscar o CEP:", error);
        }
    }
}


document.getElementById("cep").addEventListener("blur", buscarEndereco);


renderizarCatalogo();