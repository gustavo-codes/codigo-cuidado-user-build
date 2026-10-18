// =========================================================
// SISTEMA GLOBAL DE ACESSIBILIDADE - CÓDIGO CUIDADO
// =========================================================

let leitorAtivo = false;
let sinteseVoz = window.speechSynthesis;
let vozesDisponiveis = [];
let vozSelecionada = null;
let taxaVelocidade = 1.2;
let vlibrasInjetado = false; 

document.addEventListener("DOMContentLoaded", () => {
    criarGavetaSeNaoExistir();
    injetarLeitorAudio();
    configurarEventosLeitura();
    carregarVozes();

    // =========================================================
    // LÓGICA DO INTERRUPTOR DE LIBRAS (A Prisão Absoluta)
    // =========================================================
    const btnLibras = document.getElementById('btn-libras-custom');
    if (btnLibras) {
        btnLibras.addEventListener('click', () => {
            if (!vlibrasInjetado) {
                // Primeira vez: Injeta o VLibras dentro da nossa "Jaula"
                injetarVLibras();
                vlibrasInjetado = true;
                btnLibras.classList.add('ativo');
                document.getElementById('vlibras-cage').style.display = 'block';
            } else {
                // Liga/Desliga a "Jaula"
                const cage = document.getElementById('vlibras-cage');
                if (cage) {
                    const estaInvisivel = cage.style.display === 'none';
                    cage.style.display = estaInvisivel ? 'block' : 'none';
                    btnLibras.classList.toggle('ativo', estaInvisivel);
                    
                    // Se desligou, garante que o escudo suma e o jogo despause
                    if (!estaInvisivel) {
                        const escudo = document.getElementById('vlibras-escudo');
                        if (escudo) escudo.style.display = 'none';
                        if (typeof window.Engine !== 'undefined') window.Engine.jogoPausado = false;
                    }
                }
            }
        });
    }

    // =========================================================
    // LÓGICA DA GAVETA (Geometria Determinística Sem Saltos)
    // =========================================================
    const gaveta = document.getElementById('gaveta-acessibilidade');
    const btnToggle = document.getElementById('btn-toggle-acessibilidade');
    
    if (btnToggle && gaveta) {
        let isDragging = false;
        let startX, startY, clickOffsetInsideTab;

        // Inicia a gaveta centralizada logo no carregamento para a matemática ter uma base
        setTimeout(() => {
            // gaveta.style.top = (window.innerHeight / 2 - gaveta.offsetHeight / 2) + 'px';
            gaveta.style.top = '20px'; // <--- Posição inicial customizada (pode usar '15%' também)
            btnToggle.style.top = (gaveta.offsetHeight / 2 - btnToggle.offsetHeight / 2) + 'px';
        }, 100);

        btnToggle.addEventListener('pointerdown', (e) => {
            isDragging = false;
            startX = e.clientX;
            startY = e.clientY;
            
            // Grava ONDE exatamente você tocou dentro da aba
            const rectAba = btnToggle.getBoundingClientRect();
            clickOffsetInsideTab = e.clientY - rectAba.top;

            btnToggle.setPointerCapture(e.pointerId);
            gaveta.style.transition = 'none'; // Desliga a mola para não dar lag
            
            const onPointerMove = (eMove) => {
                const dy = eMove.clientY - startY;
                const dx = eMove.clientX - startX;
                
                // Se moveu mais de 5 pixels, considera arraste e não clique
                if (Math.abs(dy) > 5 || Math.abs(dx) > 5) {
                    isDragging = true;
                    
                    const windowH = window.innerHeight;
                    const gavetaH = gaveta.offsetHeight;
                    const abaH = btnToggle.offsetHeight;
                    
                    // 1. Posição alvo da aba na tela (nunca sai da tela)
                    let tabScreenY = eMove.clientY - clickOffsetInsideTab;
                    tabScreenY = Math.max(0, Math.min(tabScreenY, windowH - abaH));

                    // 2. Onde a gaveta deveria estar para centralizar a aba (nunca sai da tela)
                    let drawerTop = tabScreenY - (gavetaH / 2) + (abaH / 2);
                    drawerTop = Math.max(0, Math.min(drawerTop, windowH - gavetaH));

                    // 3. Onde a aba vai ficar deslizando DENTRO da gaveta (Cálculo perfeito)
                    let tabLocalY = tabScreenY - drawerTop;

                    // 4. Mágica do Arredondamento Dinâmico (0 a 15px)
                    let radiusTop = Math.min(15, tabLocalY);
                    let radiusBottom = Math.min(15, (gavetaH - abaH) - tabLocalY);

                    // Aplica as posições finais na hora
                    gaveta.style.top = drawerTop + 'px';
                    btnToggle.style.top = tabLocalY + 'px';
                    gaveta.style.setProperty('--br-top', radiusTop + 'px');
                    gaveta.style.setProperty('--br-bot', radiusBottom + 'px');

                    // 5. Troca de Lado
                    if (eMove.clientX < window.innerWidth / 2) {
                        gaveta.classList.add('lado-esquerdo');
                    } else {
                        gaveta.classList.remove('lado-esquerdo');
                    }
                }
            };
            
            const onPointerUp = () => {
                btnToggle.removeEventListener('pointermove', onPointerMove);
                btnToggle.removeEventListener('pointerup', onPointerUp);
                gaveta.style.transition = ''; // Devolve a mola para abrir/fechar
                
                // Se foi só um toque curto, ele executa o toggle!
                if (!isDragging) {
                    gaveta.classList.toggle('recolhida');
                }
            };
            
            btnToggle.addEventListener('pointermove', onPointerMove);
            btnToggle.addEventListener('pointerup', onPointerUp);
        });
    }
});

function criarGavetaSeNaoExistir() {
    let gaveta = document.getElementById('gaveta-acessibilidade');
    if (!gaveta) {
        // Descobre como o script foi chamado no HTML atual para ajustar o caminho relativo
        const scriptTag = document.querySelector('script[src$="acessibilidade.js"]');
        const prefixoCaminho = scriptTag ? scriptTag.getAttribute('src').replace('acessibilidade.js', '') : '../';
        const iconeLibras = prefixoCaminho + 'TemplateData/librasIcone.svg';

        gaveta = document.createElement('div');
        gaveta.id = 'gaveta-acessibilidade';
        gaveta.className = 'recolhida'; 
        gaveta.innerHTML = `
            <button id="btn-toggle-acessibilidade" aria-label="Opções de acessibilidade" title="Arrastar ou Clicar">
                <svg fill="white" viewBox="0 0 24 24" width="22" height="22"><path d="M20.5 6c-2.61.7-5.67 1-8.5 1s-5.89-.3-8.5-1L3 8c1.86.5 4 .83 6 1v13h2v-6h2v6h2V9c2-.17 4.14-.5 6-1l-.5-2zM12 6c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/></svg>
            </button>
            <button id="btn-libras-custom" class="btn-libras" aria-label="Ativar Tradutor de Libras">
                <img src="${iconeLibras}" alt="Libras" width="45" height="30" style="pointer-events: none;">
            </button>
        `;
        document.body.appendChild(gaveta);
        // <img src="../TemplateData/librasIcone.svg" alt="Libras" width="45" height="30" style="pointer-events: none;">
    }
}

// =========================================================
// 1. INJEÇÃO DO VLIBRAS (A Prisão Absoluta)
// =========================================================
function injetarVLibras() {
    // A Jaula invisível que guarda o VLibras
    const cage = document.createElement('div');
    cage.id = 'vlibras-cage';
    cage.style.display = 'none'; // Nasce morto
    
    const vlibrasDiv = document.createElement('div');
    vlibrasDiv.setAttribute('vw', '');
    vlibrasDiv.className = 'enabled'; 
    vlibrasDiv.innerHTML = `
        <div vw-access-button class="active"></div>
        <div vw-plugin-wrapper>
            <div class="vw-plugin-top-wrapper"></div>
        </div>
    `;
    cage.appendChild(vlibrasDiv);
    document.body.appendChild(cage);

    const script = document.createElement('script');
    script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
    script.onload = () => {
        new window.VLibras.Widget('https://vlibras.gov.br/app');
        
        // ESPIÃO: Procura pelo boneco 3D e cria o Escudo
        setInterval(() => {
            const wrapper = document.querySelector('.vw-plugin-wrapper');
            if (!wrapper) return;
            
            const aberto = wrapper.classList.contains('active');
            
            let escudo = document.getElementById('vlibras-escudo');
            if (!escudo) {
                escudo = document.createElement('div');
                escudo.id = 'vlibras-escudo';
                // O pointer-events:auto age como um vidro físico barrando os cliques nos cartões!
                escudo.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:9998;background:rgba(0,0,0,0.6);display:none;pointer-events:auto;';
                document.body.appendChild(escudo);
            }
            escudo.style.display = aberto ? 'block' : 'none';

            // Pausa a Engine localmente (se for minijogo)
            if (typeof window.Engine !== 'undefined') window.Engine.jogoPausado = aberto;
            
            // Pausa a Engine remotamente no iframe (se estiver rodando na raiz)
            const iframe = document.getElementById('iframe-principal');
            if (iframe && iframe.contentWindow && iframe.contentWindow.Engine) {
                iframe.contentWindow.Engine.jogoPausado = aberto;
            }
        }, 500);
    };
    document.body.appendChild(script);
}

// (Mantenha as funções injetarLeitorAudio, configurarEventosLeitura, etc, inalteradas)
// ... (Mantenha o restante do arquivo (LeitorAudio, Vozes, Hover) inalterado)
// ... (Mantenha todo o restante do arquivo: injetarLeitorAudio, configurarEventos, etc)
// ... (Mantenha o restante do arquivo a partir de injetarLeitorAudio inalterado!)

// =========================================================
// 2. INJEÇÃO DO LEITOR DE ÁUDIO COM PAINEL
// =========================================================
function injetarLeitorAudio() {
    const gaveta = document.getElementById('gaveta-acessibilidade'); // <--- NOVO
    if (!gaveta) return; // Segurança

    const container = document.createElement('div');
    container.id = 'acessibilidade-audio-widget';
    container.innerHTML = `
        <div id="painel-audio-config" class="painel-audio-oculto">
            <h4 style="margin:0 0 10px 0; color:#005088; font-size:16px; font-weight:900; text-align:center;">Ajustes de Áudio</h4>
            
            <label style="font-size:13px; color:#555; font-weight:bold;">Velocidade: <span id="lbl-velocidade">1.2x</span></label>
            <input type="range" id="audio-velocidade" min="0.5" max="2" step="0.1" value="1.2">
            
            <label style="font-size:13px; color:#555; font-weight:bold; margin-top:5px; display:block;">Voz:</label>
            <select id="audio-voz" style="width:100%; padding:8px; border-radius:8px; border:2px solid #00ACDE; font-size:13px; margin-top:5px; font-family: 'Roboto', sans-serif;"></select>
        </div>
        <div class="audio-widget-botoes">
            <button id="btn-leitor-audio" class="btn-audio-principal" aria-label="Ativar leitor de tela">🔊</button>
            <button id="btn-audio-config" class="btn-audio-config" aria-label="Configurações de voz">⚙️</button>
        </div>
    `;
    // document.body.appendChild(container); <-- REMOVER
    gaveta.appendChild(container); // <--- NOVO

    const btnAudio = document.getElementById('btn-leitor-audio');
    const btnConfig = document.getElementById('btn-audio-config');
    const painelConfig = document.getElementById('painel-audio-config');
    const sliderVelocidade = document.getElementById('audio-velocidade');
    const selectVoz = document.getElementById('audio-voz');
    const lblVelocidade = document.getElementById('lbl-velocidade');

    // Lógica de Ligar/Desligar Áudio
    btnAudio.addEventListener('click', () => {
        verificarNavegador();
        leitorAtivo = !leitorAtivo;
        
        if (leitorAtivo) {
            btnAudio.classList.add('ativo');
            falarTexto("Leitor ativado.");
        } else {
            btnAudio.classList.remove('ativo');
            sinteseVoz.cancel(); 
        }
    });

    // Lógica de Abrir/Fechar Painel de Configurações
    btnConfig.addEventListener('click', () => {
        painelConfig.classList.toggle('aberto');
    });

    // Fechar painel se clicar fora dele
    document.addEventListener('click', (e) => {
        if (!container.contains(e.target) && painelConfig.classList.contains('aberto')) {
            painelConfig.classList.remove('aberto');
        }
    });

    // Controle de Velocidade
    sliderVelocidade.addEventListener('input', (e) => {
        taxaVelocidade = parseFloat(e.target.value);
        lblVelocidade.innerText = taxaVelocidade.toFixed(1) + 'x';
    });

    // Seleção de Voz
    selectVoz.addEventListener('change', (e) => {
        vozSelecionada = vozesDisponiveis[e.target.value];
    });
}

// =========================================================
// 3. CARREGAR VOZES DO SISTEMA
// =========================================================
function carregarVozes() {
    vozesDisponiveis = sinteseVoz.getVoices();
    const selectVoz = document.getElementById('audio-voz');
    if (!selectVoz) return;
    
    selectVoz.innerHTML = '';
    
    // Filtra vozes em português
    let vozesPT = [];
    vozesDisponiveis.forEach((voz, index) => {
        if(voz.lang.includes('pt')) {
            vozesPT.push({ voz: voz, indexOriginal: index });
        }
    });

    // Preenche o Select
    if(vozesPT.length > 0) {
        vozesPT.forEach((item) => {
            const option = document.createElement('option');
            option.value = item.indexOriginal;
            option.textContent = item.voz.name;
            selectVoz.appendChild(option);
        });
        vozSelecionada = vozesPT[0].voz; // Define a primeira voz PT como padrão
    } else {
        // Fallback: se não tiver PT, mostra todas
        vozesDisponiveis.forEach((voz, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = voz.lang + " - " + voz.name;
            selectVoz.appendChild(option);
        });
    }
}

// O Chrome exige um listener para carregar as vozes assincronamente
if (sinteseVoz.onvoiceschanged !== undefined) {
    sinteseVoz.onvoiceschanged = carregarVozes;
}

// =========================================================
// 4. EVENTOS DE LEITURA (Hover na tela)
// =========================================================
function configurarEventosLeitura() {
    document.body.addEventListener('mouseover', (e) => {
        if (!leitorAtivo) return;

        // Evita ler o próprio painel de acessibilidade enquanto configura
        if(e.target.closest('#acessibilidade-audio-widget')) return;

        // INCLUÍDO: .titulo-view e .divisor-equipe para capturar textos da equipe!
        // const alvo = e.target.closest('button, a, h1, h2, h3, p, span, li, .membro-card, .card-perfil, .tutorial-item, .sobre-box, div[id^="titulo"], .titulo-view, .divisor-equipe');
        // const alvo = e.target.closest('button, .btn, .card-perfil, .sobre-box, .tutorial-item, .membro-card, h3, h2, p, .instrucoes-pwa, .instrucoes-pwa h4, .instrucoes-pwa p, .instrucoes-pwa li');
        // const alvo = e.target.closest('button, div[class^="instrucao-so"], summary, .imagem-acessivel, small, h4, a, h1, span, li, .membro-card, div[id^="titulo"], .titulo-view, .divisor-equipe, .btn, .card-perfil, .sobre-box, .tutorial-item, .membro-card, h3, h2, p, .instrucoes-pwa, .instrucoes-pwa h4, .instrucoes-pwa p, .instrucoes-pwa li');
        const alvo = e.target.closest('button, div[class^="instrucao-so"], summary, .imagem-acessivel, small, h4, a, h1, span, li, .membro-card, div[id^="titulo"], .titulo-view, .divisor-equipe, .btn, .card-perfil, .sobre-box, .tutorial-item, .membro-card, h3, h2, p, .instrucoes-pwa, .instrucoes-pwa h4, .instrucoes-pwa p, .instrucoes-pwa li, .cartao-dado, .caixa-header, .hud-item, #toast-feedback, .mini-card, .notificacao-body, .nome-app');

        if (alvo) {
            const texto = alvo.getAttribute('aria-label') || alvo.innerText;
            if (texto && texto.trim() !== '') {
                // Impede que leia o mesmo elemento repetidamente se o mouse tremer
                if(alvo.dataset.lendo === "true") return;
                
                falarTexto(texto);
                
                alvo.dataset.lendo = "true";
                setTimeout(() => { alvo.dataset.lendo = "false"; }, 1500);
            }
        }
    });

    document.body.addEventListener('mouseout', (e) => {
        if (!leitorAtivo) return;
        const alvo = e.target.closest('button, a, .titulo-view, .divisor-equipe');
        if (alvo) {
            sinteseVoz.cancel();
        }
    });
}

// =========================================================
// 5. FUNÇÃO MOTOR DE VOZ
// =========================================================
function falarTexto(texto) {
    if (!sinteseVoz) return;
    
    sinteseVoz.cancel(); 
    
    const mensagem = new SpeechSynthesisUtterance(texto);
    mensagem.lang = 'pt-BR'; 
    mensagem.rate = taxaVelocidade;     
    
    if (vozSelecionada) {
        mensagem.voice = vozSelecionada;
    }
    
    sinteseVoz.speak(mensagem);
}

// =========================================================
// 6. AVISO DE COMPATIBILIDADE (Firefox)
// =========================================================
function verificarNavegador() {
    const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    
    if (isFirefox && !document.getElementById('modal-aviso-firefox')) {
        const modal = document.createElement('div');
        modal.id = 'modal-aviso-firefox';
        modal.className = 'modal-aviso-navegador';
        modal.innerHTML = `
            <div style="background: #F1FFF8; padding: 30px; border-radius: 15px; border: 4px solid #00ACDE; max-width: 400px; text-align: center; font-family: sans-serif;">
                <div style="font-size: 40px; margin-bottom: 10px;">⚠️</div>
                <h3 style="margin: 0 0 10px 0; color: #004357; font-weight: 900;">Atenção ao Navegador</h3>
                <p style="margin-bottom: 20px; color: #555; line-height: 1.5; font-weight: bold;">
                    O Firefox possui limitações com o leitor de voz nativo.<br>
                    Para uma melhor experiência de acessibilidade, recomendamos o uso do <strong>Google Chrome</strong>, <strong>Safari</strong> ou <strong>Edge</strong>.
                </p>
                <button onclick="document.getElementById('modal-aviso-firefox').classList.remove('ativa')" style="background: #00ACDE; color: white; border: none; padding: 10px 20px; font-size: 16px; border-radius: 20px; cursor: pointer; font-weight: bold;">Entendi</button>
            </div>
        `;
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('ativa'), 100);
    }
}