document.addEventListener('DOMContentLoaded', function () {

    const scrollSalvo = sessionStorage.getItem('cart-scroll-pos');
    if (scrollSalvo) {
        const valorScroll = Number(scrollSalvo) || 0;
        requestAnimationFrame(() => {
            window.scrollTo({ top: valorScroll, behavior: 'auto' });
        });
        sessionStorage.removeItem('cart-scroll-pos');
    }

    document.querySelectorAll(
        'form[action*="/aumentar_quantidade/"] , form[action*="/diminuir_quantidade/"]'
    ).forEach((form) => {
        form.addEventListener('submit', () => {
            sessionStorage.setItem('cart-scroll-pos', String(window.scrollY || document.documentElement.scrollTop || 0));
        });
    });

    const cartModal = document.getElementById('modal-estoque');

    if (cartModal) {
        const abrirModal = () => cartModal.classList.remove('hidden');
        const fecharModal = () => cartModal.classList.add('hidden');

        const params = new URLSearchParams(window.location.search);
        if (params.has('erro')) {
            abrirModal();
        }

        cartModal.querySelector('.modal-fechar')?.addEventListener('click', fecharModal);
        cartModal.querySelector('.modal-btn')?.addEventListener('click', fecharModal);
        cartModal.addEventListener('click', (event) => {
            if (event.target === cartModal) {
                fecharModal();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && !cartModal.classList.contains('hidden')) {
                fecharModal();
            }
        });
    }

    const popup = document.createElement('div');
    popup.id = 'cart-popup';

    Object.assign(popup.style, {
        position: 'fixed',
        right: '20px',
        bottom: '20px',
        background: '#ff2424',
        color: '#fff',
        padding: '12px 18px',
        borderRadius: '10px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.18)',
        fontWeight: 'bold',
        zIndex: '9999',
        opacity: '0',
        transform: 'translateY(10px)',
        transition: 'all 0.25s ease',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
    });

    const message = document.createElement('span');
    message.textContent = 'Produto adicionado ao carrinho!';

    const cartButton = document.createElement('a');
    cartButton.href = '/carrinho';
    cartButton.textContent = 'Ver carrinho';

    Object.assign(cartButton.style, {
        background: '#fff',
        color: '#ff2424',
        padding: '7px 12px',
        borderRadius: '7px',
        textDecoration: 'none',
        fontWeight: 'bold',
        cursor: 'pointer',
        whiteSpace: 'nowrap'
    });

    popup.appendChild(message);
    popup.appendChild(cartButton);
    document.body.appendChild(popup);

    function showPopup(text) {
        message.textContent = text;
        popup.style.opacity = '1';
        popup.style.transform = 'translateY(0)';
        popup.style.pointerEvents = 'auto';

        clearTimeout(showPopup.timeoutId);
        showPopup.timeoutId = setTimeout(() => {
            popup.style.opacity = '0';
            popup.style.transform = 'translateY(10px)';
            popup.style.pointerEvents = 'none';
        }, 2500);
    }

    window.showPopup = showPopup;

    const grid = document.getElementById('grid');
    if (grid) {
        grid.addEventListener('click', (event) => {
            const btnCarrinho = event.target.closest('.btn-add-carrinho');
            
            if (btnCarrinho) {
                event.stopPropagation();
                event.preventDefault();
                const idProduto = btnCarrinho.getAttribute('data-id');
                adicionarAoCarrinho(idProduto, btnCarrinho);
                return;
            }

            const card = event.target.closest('.card');
            if (card) {
                const url = card.getAttribute('data-url');
                if (url) {
                    window.location.href = url;
                }
            }
        });
    }

    document.querySelectorAll('form[action*="/add_to_cart/"]').forEach((form) => {
        form.addEventListener('submit', async function (event) {
            event.preventDefault();

            const button = form.querySelector('button[type="submit"]');
            if (button) {
                button.disabled = true;
                const originalText = button.textContent;
                button.textContent = 'Adicionando...';

                try {
                    const formData = new FormData(form);

                    const response = await fetch(form.action, {
                        method: 'POST',
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest'
                        },
                        body: formData
                    });

                    const contentType = response.headers.get('content-type') || '';
                    if (contentType.includes('application/json')) {
                        const data = await response.json();
                        if (response.ok && data.success !== false) {
                            showPopup(data.message || 'Produto adicionado ao carrinho!');
                        } else {
                            showPopup(data.message || 'Não foi possível adicionar ao carrinho.');
                        }
                    } else if (response.ok || response.redirected) {
                        showPopup('Produto adicionado ao carrinho!');
                    } else {
                        showPopup('Não foi possível adicionar ao carrinho.');
                    }
                } catch (error) {
                    showPopup('Erro ao adicionar ao carrinho.');
                } finally {
                    button.disabled = false;
                    button.textContent = originalText;
                }
            }
        });
    });
});

async function adicionarAoCarrinho(idProduto, buttonElement) {
    if (!idProduto) return;

    let textoOriginal = '';
    if (buttonElement) {
        buttonElement.disabled = true;
        textoOriginal = buttonElement.textContent;
        buttonElement.textContent = 'Adicionando...';
    }

    try {
        const response = await fetch(`/add_to_cart/${idProduto}`, {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantidade: 1 })
        });

        const contentType = response.headers.get('content-type') || '';
        
        if (contentType.includes('application/json')) {
            const data = await response.json();
            if (response.ok && data.success !== false) {
                window.showPopup(data.message || 'Produto adicionado ao carrinho!');
            } else {
                window.showPopup(data.message || 'Estoque insuficiente ou erro no pedido.');
            }
        } else if (response.ok || response.redirected) {
            window.showPopup('Produto adicionado ao carrinho!');
        } else {
            window.showPopup('Erro ao adicionar ao carrinho.');
        }

    } catch (error) {
        console.error('Erro:', error);
        window.showPopup('Erro de conexão com o servidor.');
    } finally {
        if (buttonElement) {
            buttonElement.disabled = false;
            buttonElement.textContent = textoOriginal;
        }
    }
}