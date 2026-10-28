
    const quantidade = document.getElementById("quantidade");
    const diminuir = document.getElementById("diminuir");
    const aumentar = document.getElementById("aumentar");
    const subtotal = document.getElementById("subtotal");

    const precoUnitario = Number(0);

    function atualizarSubtotal() {
        if (!quantidade) return;

        const minimo = Number(quantidade.min);
        const maximo = Number(quantidade.max);

        let valor = parseInt(quantidade.value, 10);

        if (!Number.isFinite(valor)) {
            valor = minimo;
        }

        valor = Math.max(minimo, Math.min(maximo, valor));
        quantidade.value = valor;

        subtotal.textContent = (precoUnitario * valor).toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );

        diminuir.disabled = valor <= minimo;
        aumentar.disabled = valor >= maximo;
    }

    if (quantidade) {
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

        document.getElementById("form-produto").addEventListener(
            "submit",
            (evento) => {
                const valor = Number(quantidade.value);

                if (
                    !Number.isInteger(valor) ||
                    valor < Number(quantidade.min) ||
                    valor > Number(quantidade.max)
                ) {
                    evento.preventDefault();
                    alert("Escolha uma quantidade válida para o estoque disponível.");
                }
            }
        );

        atualizarSubtotal();
    }
