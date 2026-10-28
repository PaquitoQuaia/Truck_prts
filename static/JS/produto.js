document.addEventListener("DOMContentLoaded", () => {
    const quantidade = document.getElementById("quantidade");
    const diminuir = document.getElementById("diminuir");
    const aumentar = document.getElementById("aumentar");
    const subtotal = document.getElementById("subtotal");

    if (!quantidade || !diminuir || !aumentar || !subtotal) return;

    const precoUnitario = parseFloat(quantidade.getAttribute("data-preco")) || 0;

    function atualizarSubtotal() {
        const minimo = Number(quantidade.min) || 1;
        const maximo = Number(quantidade.max) || 1;

        let valor = parseInt(quantidade.value, 10);

        if (!Number.isFinite(valor)) {
            valor = minimo;
        }

        valor = Math.max(minimo, Math.min(maximo, valor));
        quantidade.value = valor;

        subtotal.textContent = (precoUnitario * valor).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

        diminuir.disabled = valor <= minimo;
        aumentar.disabled = valor >= maximo;
    }

    diminuir.addEventListener("click", () => {
        quantidade.value = Number(quantidade.value) - 1;
        atualizarSubtotal();
    });

    aumentar.addEventListener("click", () => {
        quantidade.value = Number(quantidade.value) + 1;
        atualizarSubtotal();
    });

    quantidade.addEventListener("input", atualizarSubtotal);
    quantidade.addEventListener("change", atualizarSubtotal);

    const formProduto = document.getElementById("form-produto");
    if (formProduto) {
        formProduto.addEventListener("submit", (evento) => {
            const valor = Number(quantidade.value);

            if (
                !Number.isInteger(valor) ||
                valor < Number(quantidade.min) ||
                valor > Number(quantidade.max)
            ) {
                evento.preventDefault();
                alert("Escolha uma quantidade válida para o estoque disponível.");
            }
        });
    }

    atualizarSubtotal();
});