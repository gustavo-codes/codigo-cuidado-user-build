// ============================================================================
// REGRAS ESPECÍFICAS - FASE 9 (INCIDENTE DE SEGURANÇA)
// ============================================================================



// ============================================================================
// 1. DICIONÁRIO DE TEXTOS E DADOS (Padrão Ouro)
// ============================================================================
const DADOS_JOGO = {
    tema: {
        corPrincipal: "#d32f2f", 
        corEscura: "#b71c1c", 
        corClara: "#ffebee"
    },

    tempoMaximo: 60,
    metaAprovacao: 75, // Mínimo de 75% de precisão para vitória final
    pontosAcerto: 30,
    penalidadeErro: -15,
    maxErros: 5, // Limite de erros (Derrota imediata)

    interface: {
        introTitulo: "Fase 9: Incidente de Segurança",
        introDesc: "Foi detectado um vazamento de informações! É preciso responder corretamente e com rapidez.",
        introDefinCurta: "<strong>ANPD:</strong> Autoridade Nacional de Proteção de Dados.",
        introDefin: "A <strong>ANPD</strong> é a autoridade responsável pela fiscalização e orientação em proteção de dados no Brasil. <br><br><strong>Incidente:</strong> Quando há um vazamento de dados com risco ou dano relevante, o controlador é obrigado por lei a avaliar a situação e adotar as comunicações cabíveis.",
        introDica: "Arraste os cards flutuantes para dentro do <strong>Plano de Ação</strong> no centro. O jogo termina automaticamente quando você separar as 3 ações corretas.",
        introMeta: "Meta de Aprovação: Classificar as ações com 75% de Precisão.",

        fimVitoriaTitulo: "Crise Contida! ✅",
        fimVitoriaMsg: "Você avaliou o incidente, registrou internamente e comunicou a ANPD e os titulares. Responder rapidamente reduz riscos.",
        fimDerrotaTempoTitulo: "Omissão Detectada ❌",
        fimDerrotaTempoMsg: "O tempo acabou. Atrasar a resposta a um incidente aumenta severamente os danos e as multas aplicáveis.",
        
        baseLegal: "<strong>⚖️ Art. 48 da LGPD:</strong> Comunicação de incidente de segurança à ANPD e ao titular quando houver risco ou dano relevante."
    },

    opcoesAcao: [
        { id: "opt1", texto: "Avaliar a ocorrência e os riscos do incidente", correta: true },
        { id: "opt2", texto: "Notificar imediatamente a ANPD", correta: true },
        { id: "opt3", texto: "Informar os pacientes (titulares) afetados", correta: true },
        { id: "opt4", texto: "Ignorar o incidente se ninguém descobrir", correta: false },
        { id: "opt5", texto: "Retardar a resposta para ocultar da direção", correta: false }
    ]
};

// Aplica o Tema CSS
// document.documentElement.style.setProperty('--cor-tema', DADOS_JOGO.tema.corPrincipal);
// document.documentElement.style.setProperty('--cor-tema-escuro', DADOS_JOGO.tema.corEscura);
// document.documentElement.style.setProperty('--cor-tema-claro', DADOS_JOGO.tema.corClara);

// ============================================================================
// CARREGAMENTO DO HTML (Textos)
// ============================================================================
// Aplica Textos na UI
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('txt-intro-titulo').innerText = DADOS_JOGO.interface.introTitulo;
    document.getElementById('txt-intro-desc').innerHTML = DADOS_JOGO.interface.introDesc;
    document.getElementById('render-defin-curta').innerHTML = DADOS_JOGO.interface.introDefinCurta;
    document.getElementById('render-defin-longa').innerHTML = DADOS_JOGO.interface.introDefin + "<br><br>";
    document.getElementById('txt-intro-dica').innerHTML = DADOS_JOGO.interface.introDica;
    document.getElementById('txt-intro-meta').innerText = DADOS_JOGO.interface.introMeta;
    document.getElementById('txt-fim-lei').innerHTML = DADOS_JOGO.interface.baseLegal;
});



// ============================================================================
// 2. ENGINE CENTRAL DO JOGO (Drag & Drop Dinâmico)
// ============================================================================
const Engine = {
    ...GlobalEngine, // HERANÇA DO MOTOR GLOBAL

    pontuacao: 0, tempoRestante: 0, intervaloTempo: null, jogoPausado: true,
    tempoToastRestante: 0,
    
    opcoesEmbaralhadas: [],
    
    // Contadores matemáticos de Precisão e Erros Fatais
    totalCardsArrastados: 0,     
    totalCardsCorretosArrastados: 0, 
    tentativasErradas: 0, // Conta quantos erros foram cometidos no total

    iniciar: function() {
        // CHAMA O PAI (Ele resolve CSS, pausas, tempo, reset global)
        GlobalEngine.iniciar.call(this, 'block');

        this.totalCardsArrastados = 0;
        this.totalCardsCorretosArrastados = 0;
        this.tentativasErradas = 0;

        // Limpa painel e repõe ao centro default
        const painel = document.getElementById('zona-plano');
        painel.style.transform = 'translate(-50%, -50%)'; // <-- ADICIONE ESTA LINHA AQUI
        painel.style.left = '50%';
        painel.style.top = '50%';
        document.getElementById('container-slots-plano').innerHTML = '<div class="texto-vazio" id="txt-vazio">Arraste os cards para cá</div>';
        
        const modoAleatorio = document.getElementById('toggle-dificuldade').checked;
        this.opcoesEmbaralhadas = JSON.parse(JSON.stringify(DADOS_JOGO.opcoesAcao));
        if (modoAleatorio) this.opcoesEmbaralhadas.sort(() => Math.random() - 0.5);

        this.renderizarCards();
        this.adicionarEventosPointerPainel(); // Torna o painel móvel

        // Ouve redimensionamentos de tela para recalcular órbitas (O "voltarAoMenu" global limpa isto automaticamente!)
        this.handleResize = this.handleResize.bind(this);
        window.addEventListener('resize', this.handleResize);
    },

    // =========================================================
    // POLIMORFISMO: Cálculo de Precisão Específico (Fase 9)
    // =========================================================
    calcularPrecisao: function() {
        if (this.totalCardsArrastados === 0) return 0;
        return Math.round((this.totalCardsCorretosArrastados / this.totalCardsArrastados) * 100);
    },

    // =========================================================
    // HOOK DO PAI: Atualiza a info na tela de fim
    // =========================================================
    atualizarEstatisticasFinais: function() {
        const elQtde = document.getElementById('final-qtde');
        const corretosNoPlano = document.querySelectorAll('.card-slot.correto').length;
        if (elQtde) elQtde.innerText = `${Math.min(3, corretosNoPlano)}/3`;
    },

    // =========================================================
    // MOTOR FÍSICO E RESPONSIVIDADE
    // =========================================================
    handleResize: () => {
        if (document.getElementById('area-jogo').style.display !== 'none' && !Engine.jogoPausado) {
            Engine.espalharCards(true);
        }
    },

    renderizarCards: function() {
        const scatter = document.getElementById('container-scatter');
        scatter.innerHTML = '';

        this.opcoesEmbaralhadas.forEach((opcao, index) => {
            const card = document.createElement('div');
            card.className = 'card-flutuante';
            card.id = opcao.id;
            card.innerText = opcao.texto;
            card.dataset.correta = opcao.correta;
            card.dataset.index = index;
            card.dataset.movidoManual = "false"; // Controle de Posição Livre

            this.adicionarEventosPointerCard(card);
            scatter.appendChild(card);
        });

        // Espera renderizar para calcular medidas reais
        setTimeout(() => this.espalharCards(false), 50);
    },

    // espalharCards: function(isResize) {
    //     const scatter = document.getElementById('container-scatter');
    //     const area = document.getElementById('area-jogo');

    //     const cx = area.clientWidth / 2;
    //     const cy = area.clientHeight / 2;
        
    //     // Raio flexível baseado no tamanho da tela
    //     const raioX = area.clientWidth * 0.35;
    //     const raioY = area.clientHeight * 0.35;
    //     const angleStep = (Math.PI * 2) / this.opcoesEmbaralhadas.length;

    //     Array.from(scatter.children).forEach((card) => {
    //         // No resize, preserva cards que o utilizador largou noutro sítio livremente
    //         if (isResize && card.dataset.movidoManual === "true") return;

    //         const index = parseInt(card.dataset.index);
    //         const angulo = index * angleStep - (Math.PI / 2);
            
    //         let posX = cx + Math.cos(angulo) * raioX;
    //         let posY = cy + Math.sin(angulo) * raioY;

    //         // Limites de segurança
    //         posX = Math.max(90, Math.min(posX, area.clientWidth - 90));
    //         posY = Math.max(90, Math.min(posY, area.clientHeight - 90));

    //         card.style.left = `${posX - 90}px`;
    //         card.style.top = `${posY - 30}px`;

    //         // Guarda a base (Origem Diametral)
    //         card.dataset.origX = card.style.left;
    //         card.dataset.origY = card.style.top;
    //     });
    // },
    espalharCards: function(isResize) {
        const scatter = document.getElementById('container-scatter');
        const area = document.getElementById('area-jogo');
        const painel = document.getElementById('zona-plano'); // Pega o painel central

        const cx = area.clientWidth / 2;
        const cy = area.clientHeight / 2;
        
        // CÁLCULO DINÂMICO DA ÓRBITA:
        const margemRespiroH = 50; // Espaçamento visual entre o painel e o card
        const margemRespiroV = 50; // Espaçamento visual entre o painel e o card
        // Metade da largura/altura do painel + margem para acomodar o card inteiro + margem de respiro
        let raioX = (painel.offsetWidth / 2) + margemRespiroH;
        let raioY = (painel.offsetHeight / 2) + margemRespiroV;

        // Trava de segurança para telas muito apertadas (evita que o card suma)
        raioX = Math.min(raioX, area.clientWidth * 0.45);
        raioY = Math.min(raioY, area.clientHeight * 0.45);

        const angleStep = (Math.PI * 2) / this.opcoesEmbaralhadas.length;

        Array.from(scatter.children).forEach((card) => {
            // No resize, preserva cards que o utilizador largou soltos
            if (isResize && card.dataset.movidoManual === "true") return;

            const index = parseInt(card.dataset.index);
            const angulo = index * angleStep - (Math.PI / 2);
            
            // // Calcula a largura estimada do card (Notebook ~180px, Celular ~130px)
            // const metadeCardW = area.clientWidth > 600 ? 90 : 65;
            // const metadeCardH = area.clientWidth > 600 ? 35 : 25;
            const metadeCardW = card.offsetWidth / 2;
            const metadeCardH = card.offsetHeight / 2;

            // =========================================================
            // COMPENSAÇÃO GEOMÉTRICA PARA AS QUINAS DO PAINEL
            // Empurra os cards que caem nas diagonais mais para fora, 
            // evitando que colidam com as bordas retangulares do painel.
            // =========================================================
            const compensacaoY = Math.abs(Math.cos(angulo)) * 45; 
            const compensacaoX = Math.abs(Math.sin(angulo)) * 20;

            let posX = cx + Math.cos(angulo) * (raioX + metadeCardW + compensacaoX);
            let posY = cy + Math.sin(angulo) * (raioY + metadeCardH + compensacaoY);

            // Limites de segurança para não vazar pelas bordas da tela
            posX = Math.max(metadeCardW, Math.min(posX, area.clientWidth - metadeCardW));
            posY = Math.max(metadeCardH + 60, Math.min(posY, area.clientHeight - metadeCardH));

            // card.style.left = `${posX - metadeCardW}px`;
            // card.style.top = `${posY - metadeCardH}px`;

            // CONVERSÃO MÁGICA PARA PORCENTAGEM
            const leftPx = posX - metadeCardW;
            const topPx = posY - metadeCardH;
            
            card.style.left = `${(leftPx / area.clientWidth) * 100}%`;
            card.style.top = `${(topPx / area.clientHeight) * 100}%`;

            // Guarda a base (Origem Diametral)
            card.dataset.origX = card.style.left;
            card.dataset.origY = card.style.top;
        });
    },

    // // Arraste do Card Flutuante
    // adicionarEventosPointerCard: function(card) {
    //     let isDragging = false;
    //     let startX, startY, initialLeft, initialTop;

    //     card.onpointerdown = (e) => {
    //         if (this.jogoPausado) return;
    //         isDragging = true;
    //         card.setPointerCapture(e.pointerId);
    //         card.classList.add('arrastando');
            
    //         // Eleva todo o container scatter acima de tudo (incluindo o alerta)
    //         document.getElementById('container-scatter').classList.add('drag-active');
            
    //         startX = e.clientX;
    //         startY = e.clientY;
    //         initialLeft = parseFloat(card.style.left) || 0;
    //         initialTop = parseFloat(card.style.top) || 0;
    //     };

    //     card.onpointermove = (e) => {
    //         if (!isDragging) return;
    //         const dx = e.clientX - startX;
    //         const dy = e.clientY - startY;
    //         card.style.left = `${initialLeft + dx}px`;
    //         card.style.top = `${initialTop + dy}px`;
    //     };

    //     card.onpointerup = (e) => {
    //         if (!isDragging) return;
    //         isDragging = false;
    //         card.releasePointerCapture(e.pointerId);
    //         card.classList.remove('arrastando');
    //         document.getElementById('container-scatter').classList.remove('drag-active');

    //         // Verifica colisão com o Painel de Ação
    //         const planoRect = document.getElementById('zona-plano').getBoundingClientRect();
    //         const cardRect = card.getBoundingClientRect();
            
    //         const cardCenterX = cardRect.left + cardRect.width / 2;
    //         const cardCenterY = cardRect.top + cardRect.height / 2;

    //         if (cardCenterX > planoRect.left && cardCenterX < planoRect.right &&
    //             cardCenterY > planoRect.top && cardCenterY < planoRect.bottom) {
    //             this.adicionarAoPlano(card);
    //         } else {
    //             // Caiu livre no cenário: Mantém a nova posição!
    //             card.dataset.movidoManual = "true";
    //         }
    //     };
    // },
    adicionarEventosPointerCard: function(card) {
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;
        const area = document.getElementById('area-jogo');

        card.onpointerdown = (e) => {
            if (this.jogoPausado) return;
            isDragging = true;
            card.setPointerCapture(e.pointerId);
            card.classList.add('arrastando');
            document.getElementById('container-scatter').classList.add('drag-active');
            
            // Pega a posição real em pixels independente de estar em % ou px
            const rect = card.getBoundingClientRect();
            const areaRect = area.getBoundingClientRect();
            initialLeft = rect.left - areaRect.left;
            initialTop = rect.top - areaRect.top;

            card.style.left = `${initialLeft}px`;
            card.style.top = `${initialTop}px`;
            
            startX = e.clientX;
            startY = e.clientY;
        };

        card.onpointermove = (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            card.style.left = `${initialLeft + dx}px`;
            card.style.top = `${initialTop + dy}px`;
        };

        card.onpointerup = (e) => {
            if (!isDragging) return;
            isDragging = false;
            card.releasePointerCapture(e.pointerId);
            card.classList.remove('arrastando');
            document.getElementById('container-scatter').classList.remove('drag-active');

            const planoRect = document.getElementById('zona-plano').getBoundingClientRect();
            const cardRect = card.getBoundingClientRect();
            
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const cardCenterY = cardRect.top + cardRect.height / 2;

            if (cardCenterX > planoRect.left && cardCenterX < planoRect.right &&
                cardCenterY > planoRect.top && cardCenterY < planoRect.bottom) {
                this.adicionarAoPlano(card);
            } else {
                card.dataset.movidoManual = "true";
                // CONVERTE A NOVA POSIÇÃO LIVRE PARA PORCENTAGEM
                const finalLeftPx = parseFloat(card.style.left);
                const finalTopPx = parseFloat(card.style.top);
                card.style.left = `${(finalLeftPx / area.clientWidth) * 100}%`;
                card.style.top = `${(finalTopPx / area.clientHeight) * 100}%`;
            }
        };
    },

    // // Arraste do Painel Central
    // adicionarEventosPointerPainel: function() {
    //     const painel = document.getElementById('zona-plano');
    //     let isDragging = false;
    //     let startX, startY, initialLeft, initialTop;

    //     painel.onpointerdown = (e) => {
    //         if (this.jogoPausado) return;
    //         // Se clicou num slot interno, ignora o arraste do painel
    //         if (e.target.closest('.card-slot')) return;
            
    //         isDragging = true;
    //         painel.setPointerCapture(e.pointerId);
    //         startX = e.clientX;
    //         startY = e.clientY;
    //         initialLeft = painel.offsetLeft;
    //         initialTop = painel.offsetTop;
    //     };

    //     painel.onpointermove = (e) => {
    //         if (!isDragging) return;
    //         const dx = e.clientX - startX;
    //         const dy = e.clientY - startY;
    //         painel.style.left = `${initialLeft + dx}px`;
    //         painel.style.top = `${initialTop + dy}px`;
    //     };

    //     painel.onpointerup = (e) => {
    //         if (!isDragging) return;
    //         isDragging = false;
    //         painel.releasePointerCapture(e.pointerId);
    //     };
    // },
    adicionarEventosPointerPainel: function() {
        const painel = document.getElementById('zona-plano');
        const area = document.getElementById('area-jogo');
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        painel.onpointerdown = (e) => {
            if (this.jogoPausado) return;
            if (e.target.closest('.card-slot')) return;
            
            isDragging = true;
            painel.setPointerCapture(e.pointerId);
            
            // Pega a posição real na tela e desliga o transform de centralização
            const rect = painel.getBoundingClientRect();
            const areaRect = area.getBoundingClientRect();
            initialLeft = rect.left - areaRect.left;
            initialTop = rect.top - areaRect.top;
            
            painel.style.transform = 'none';
            painel.style.left = `${initialLeft}px`;
            painel.style.top = `${initialTop}px`;
            
            startX = e.clientX;
            startY = e.clientY;
        };

        painel.onpointermove = (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            painel.style.left = `${initialLeft + dx}px`;
            painel.style.top = `${initialTop + dy}px`;
        };

        painel.onpointerup = (e) => {
            if (!isDragging) return;
            isDragging = false;
            painel.releasePointerCapture(e.pointerId);
            
            // CONVERTE A NOVA POSIÇÃO DO PAINEL PARA PORCENTAGEM
            const finalLeftPx = parseFloat(painel.style.left);
            const finalTopPx = parseFloat(painel.style.top);
            painel.style.left = `${(finalLeftPx / area.clientWidth) * 100}%`;
            painel.style.top = `${(finalTopPx / area.clientHeight) * 100}%`;
        };
    },

    // =========================================================
    // LÓGICA DE CLASSIFICAÇÃO
    // =========================================================
    adicionarAoPlano: function(card) {
        const isCorreto = card.dataset.correta === "true";
        
        card.style.display = 'none';

        const containerSlots = document.getElementById('container-slots-plano');
        const txtVazio = document.getElementById('txt-vazio');
        if (txtVazio) txtVazio.style.display = 'none';

        const slot = document.createElement('div');
        slot.className = `card-slot ${isCorreto ? 'correto' : 'errado'}`;
        slot.innerText = card.innerText;
        slot.dataset.origId = card.id; 
        
        // Remove slot ao clicar
        slot.onpointerdown = (e) => {
            e.stopPropagation(); // Evita arrastar o painel
            this.removerDoPlano(slot, card);
        };
        
        containerSlots.appendChild(slot);

        // MATEMÁTICA DE PRECISÃO RIGOROSA
        this.totalCardsArrastados++;
        
        if (isCorreto) {
            this.totalCardsCorretosArrastados++;
            if(typeof AudioSys !== 'undefined') AudioSys.tocar('sucesso');
            this.adicionarPontos(DADOS_JOGO.pontosAcerto, true);
        } else {
            this.tentativasErradas++;
            if(typeof AudioSys !== 'undefined') AudioSys.tocar('erro');
            this.adicionarPontos(DADOS_JOGO.penalidadeErro, false, true);
            this.mostrarToast('erro', "Ação inadequada! Clique nela para remover do plano.");
            
            // Falha Fatal por limite de erros
            if (this.tentativasErradas >= DADOS_JOGO.maxErros) {
                return this.encerrar(false, 'limite_erros');
            }
        }

        this.verificarCondicaoVitoria();
    },

    removerDoPlano: function(slot, cardOriginal) {
        if (this.jogoPausado) return;
        if(typeof AudioSys !== 'undefined') AudioSys.tocar('click');
        
        slot.remove();
        
        const containerSlots = document.getElementById('container-slots-plano');
        if (containerSlots.children.length === 1 && containerSlots.children[0].id === 'txt-vazio') {
            document.getElementById('txt-vazio').style.display = 'block';
        }

        // Devolve o card para sua posição Diametral Original
        cardOriginal.style.left = cardOriginal.dataset.origX;
        cardOriginal.style.top = cardOriginal.dataset.origY;
        cardOriginal.dataset.movidoManual = "false"; 
        cardOriginal.style.display = 'flex';
        
        this.verificarCondicaoVitoria();
    },

    verificarCondicaoVitoria: function() {
        const slots = document.querySelectorAll('.card-slot');
        let corretosPresentes = 0;
        let erradosPresentes = 0;

        slots.forEach(slot => {
            if (slot.classList.contains('correto')) corretosPresentes++;
            if (slot.classList.contains('errado')) erradosPresentes++;
        });

        // Só ganha se tiver EXATAMENTE os 3 certos e NENHUM errado no plano
        if (corretosPresentes === 3 && erradosPresentes === 0) {
            setTimeout(() => this.encerrar(true), 400);
        }
    }
};
