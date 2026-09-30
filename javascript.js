document.addEventListener('DOMContentLoaded', () => {
    const pizzaCards = document.querySelectorAll('.product-item');
    const modalOverlay = document.getElementById('modalOverlay');
    const btnAdicionarButtons = document.querySelectorAll('.btn-adicionar');
    
    // Botões do Modal
    const btnMeioAMeio = document.getElementById('btnMeioAMeio');
    const btnInteira = document.getElementById('btnInteira');
    const btnConfirmarCompra = document.getElementById('btnConfirmarCompra');
    const modalMessage = document.querySelector('.modal-message');

    let selectedPizzaId = null; // Guarda o ID da pizza que está sendo processada
    let selectedFormat = '';  // 'Meio a Meio' ou 'Inteira'
    let cartItems = [];       // Array simulado de itens do carrinho

    // --- 1. FUNÇÃO DE ATIVAR O MODAL (A INTERATIVIDADE) ---
    const openModal = (cardElement) => {
        selectedPizzaId = cardElement.dataset.id; // Armazena o ID da pizza
        modalOverlay.classList.remove('hidden');
        btnConfirmarCompra.disabled = true;
        cartItems.push(null); // Limpa possíveis itens antigos

        // Reset de estilos dos botões
        [btnMeioAMeio, btnInteira].forEach(btn => {
            btn.classList.remove('selected');
        });
        selectedFormat = '';
    };

    // Adiciona o evento a todos os botões "Adicionar ao Carrinho"
    btnAdicionarButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const cardElement = e.target.closest('.product-item');
            openModal(cardElement);
        });
    });


    // --- 2. LÓGICA DE SELEÇÃO NO MODAL ---

    // Listener para o botão Meio a Meio
    btnMeioAMeio.addEventListener('click', () => {
        selectedFormat = 'Meio a Meio';
        btnMeioAMeio.classList.add('selected');
        btnInteira.classList.remove('selected');
        modalMessage.textContent = "Perfeito! Sua pizza será dividida, aguardamos sua confirmação.";
    });

    // Listener para o botão Inteira
    btnInteira.addEventListener('click', () => {
        selectedFormat = 'Inteira';
        btnInteira.classList.add('selected');
        btnMeioAMeio.classList.remove('selected');
        modalMessage.textContent = "Entendido! Uma pizza completa para sua família.";
    });

    // Listener de confirmação (botão principal do modal)
    btnConfirmarCompra.addEventListener('click', () => {
        if (!selectedPizzaId || !selectedFormat) {
            alert("Por favor, escolha o formato da sua pizza primeiro.");
            return;
        }

        const cardElement = document.querySelector(`.product-item[data-id="${selectedPizzaId}"]`);
        const name = cardElement.dataset.name;
        const price = parseFloat(cardElement.dataset.price).toFixed(2);
        const description = cardElement.dataset.desc;

        // Adiciona o item ao carrinho simulado
        cartItems.push({
            nome: name, 
            formato: selectedFormat, 
            preco: price, 
            descricao: description
        });

        alert(`🍕 Produto adicionado com sucesso! \n\n${name} (${selectedFormat}) - R$ ${price}.`);

        // Fecha o modal e prepara para o próximo item
        modalOverlay.classList.add('hidden');
    });


    // --- 3. FUNÇÃO FINALIZAR PEDIDO (WhatsApp) ---
    const finalizarButton = document.getElementById('finalizarPedido');
    finalizarButton.addEventListener('click', () => {
        if (cartItems.length === 0) {
            alert("Seu carrinho está vazio! Por favor, adicione pelo menos uma pizza.");
            return;
        }

        let mensagemWhatsApp = "🍕 **NOVO PEDIDO IMPÉRIO PIZZA**\n";
        mensagemWhatsApp += `--- DETALHAMENTO DO PEDIDO ---\n`;
        
        cartItems.forEach((item, index) => {
             // Formata a descrição do produto para o WhatsApp
            const itemDetalhado = `${index + 1}. ${item.nome} (${item.formato})\nDescrição: ${item.descricao}\nP$$${item.preco}\n`;
            mensagemWhatsApp += "-------------------------------\n";
            mensagemWhatsApp += itemDetalhado;
        });

        // Link direto do WhatsApp (Substitua o número)
        const waNumber = "55DDD9XXXXXXXX"; 
        const encodedMessage = encodeURIComponent(mensagemWhatsApp);
        const whatsappUrl = `https://wa.me/${waNumber}?text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');
    });

});
