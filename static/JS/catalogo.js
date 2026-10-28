function abrirProduto(url) {
    window.location.href = url;
}

function adicionarAoCarrinho(idProduto, event) {
    if (event) {
        event.stopPropagation();
    }

    fetch('/api/carrinho/adicionar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id_produto: idProduto,
            quantidade: 1
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao adicionar produto');
        }
        return response.json();
    })
    .then(data => {
        alert('Produto adicionado ao carrinho com sucesso!');
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Não foi possível adicionar o produto ao carrinho.');
    });
}