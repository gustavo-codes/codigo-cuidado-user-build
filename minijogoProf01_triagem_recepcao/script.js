// ============================================================================
// REGRAS ESPECÍFICAS - FASE 1 (Recepção)
// ============================================================================



// ============================================================================
// 1. DICIONÁRIO DE TEXTOS E DADOS (Padrão Ouro)
// ============================================================================
const DADOS_JOGO = {
    tema: {
        corPrincipal: "#0277bd", // Azul
        corEscura: "#01579b", 
        corClara: "#e1f5fe"
    },
    
    tempoMaximo: 60,
    metaAprovacao: 75,
    pontosAcerto: 10,
    pontosCombo: 15,
    penalidadeErro: -10,

    interface: {
        introTitulo: "Fase 1: Recepção",
        introDesc: "Você precisa organizar todos os dados dos pacientes no sistema da UBS antes que o tempo acabe.",
        introDefinCurta: "<strong>Conceito:</strong> Dados sensíveis segundo a LGPD.",
        // introDefin: "<strong>Conceito:</strong> Dados sensíveis, segundo a LGPD, são informações pessoais que exigem proteção rigorosa por revelarem aspectos íntimos, como origem racial/étnica, convicção religiosa, opinião política, filiação sindical, saúde, vida sexual, ou dados genéticos/biométricos. Eles exigem consentimento específico e destacado, com maior risco de discriminação se vazados, e a unidade de saúde deve adotar medidas de segurança reforçadas para protegê-los, garantindo a privacidade e evitando danos aos pacientes.",
        introDefin: "<strong>Conceito:</strong> Dados sensíveis segundo a LGPD.<br>" +
                    "<strong>Base legal:</strong> " + "<strong>Art. 5º</strong><br>" +
                    "<strong>I. dado pessoal:</strong> informação relacionada a pessoa natural identificada ou identificável;<br>" +
                    "<strong>II. dado pessoal sensível:</strong> dado referente à saúde, origem racial, convicção religiosa, opinião política, dado genético ou biométrico;<br>" + 
                    "<strong>III. dado anonimizado:</strong> dado relativo a titular que não possa ser identificado, considerando a utilização de meios técnicos razoáveis e disponíveis na ocasião de seu tratamento.",
        introDica: "<strong>Arraste os cartões</strong> para as caixas corretas com base na classificação da LGPD.",
        introMeta: "Meta de Aprovação: Classificar TUDO com {META}% de Precisão.",
        
        fimVitoriaTitulo: "Triagem Concluída! ✅",
        fimVitoriaMsg: "Excelente! Você classificou TODOS os dados a tempo com precisão.",
        fimDerrotaTempoTitulo: "Tempo Esgotado ❌",
        fimDerrotaTempoMsg: "O tempo acabou e você deixou dados sem triagem. A LGPD exige que TODOS os dados recebam o tratamento de segurança adequado.",
        fimDerrotaMetaTitulo: "Meta Não Atingida ❌",
        fimDerrotaMetaMsg: "Sua precisão não atingiu a meta exigida para evitar vazamentos na unidade de saúde.",
        baseLegal: "<strong>⚖️ Art. 5º, I, II e III da LGPD:</strong> A classificação correta em Pessoal, Sensível ou Anonimizado é o pilar que define os níveis de segurança, sigilo e riscos que a unidade de saúde deve aplicar a cada dado.",

        txtToastCorreto: "Correto. Esse dado foi classificado adequadamente. A LGPD diferencia dado pessoal, sensível e anonimizado para definir o nível de proteção.",
        txtToastErro: "Atenção. Dado classificado incorretamente. Identificar o tipo do dado é o primeiro passo para protegê-lo adequadamente."
    },

    bancoDeDados: [
        // 🟦 Pessoais (3 itens)
        { texto: "Nome completo", tipo: "pessoal" },
        { texto: "CPF", tipo: "pessoal" },
        { texto: "Telefone", tipo: "pessoal" },
        
        // 🟥 Sensíveis (3 itens)
        { texto: "Resultado de exames (HIV, câncer, etc.)", tipo: "sensivel" },
        { texto: "Histórico de doenças", tipo: "sensivel" },
        { texto: "Dados genéticos", tipo: "sensivel" },
        
        // 🟩 Anonimizados (3 itens)
        { texto: "Relatório de produção", tipo: "anonimizado" },
        { texto: "Média de idade dos pacientes", tipo: "anonimizado" },
        { texto: "Percentual de casos por doença", tipo: "anonimizado" }
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
    document.getElementById('txt-intro-desc').innerText = DADOS_JOGO.interface.introDesc;
    document.getElementById('render-defin-curta').innerHTML = DADOS_JOGO.interface.introDefinCurta;
    document.getElementById('render-defin-longa').innerHTML = DADOS_JOGO.interface.introDefin;
    document.getElementById('render-defin-longa').innerHTML += "<br><br>"; // Espaço extra para evitar que o texto longo interfira visualmente com o "Retrair texto"
    document.getElementById('txt-intro-dica').innerHTML = DADOS_JOGO.interface.introDica;
    // Pega a frase, troca o marcador {META} pelo número, e injeta na tela
    const textoMetaDinamico = DADOS_JOGO.interface.introMeta.replace('{META}', DADOS_JOGO.metaAprovacao);
    document.getElementById('txt-intro-meta').innerText = textoMetaDinamico;
    document.getElementById('txt-fim-lei').innerHTML = DADOS_JOGO.interface.baseLegal;
});



// ============================================================================
// 2. ENGINE CENTRAL DO JOGO (Lógica de Drag and Drop)
// ============================================================================
const Engine = {
    ...GlobalEngine, // Herança: Traz todas as funções padrões e utilitários do motor global para dentro do escopo do Engine específico deste minijogo

    filaCartoes: [], cartaAtual: null, totalCartoesRodada: 0,
    pontuacao: 0, acertos: 0, totalJogados: 0,
    acertosSeguidos: 0, errosSeguidos: 0,
    tempoRestante: 0, intervaloTempo: null, jogoPausado: true,
    toastTimer: null, ultimoToastAcerto: null,
    tempoToastRestante: 0, tempoAlertaRestante: 0, // NOVO: Relógios internos dos alertas
    elCartao: null, cloneDrag: null, offsetX: 0, offsetY: 0,

    mostrarTutorial: function() {
        this.iniciar(); // Inicia o jogo e carrega a carta

        document.getElementById('tela-tutorial').classList.remove('oculto'); // Mostra a tela de tutorial
        this.jogoPausado = true; // Congela o tempo

        // Criamos uma função com NOME para podermos matá-la depois
        const tratarPrimeiroToque = (e) => {
            // Pequena segurança: se ele decidisse clicar em "Sair" durante a animação, abortaria a mágica
            // Agora, se tocar no botão Sair, apenas ignora (o espião continua vivo aguardando o toque certo)
            if (e.target.closest('.btn-voltar')) return;

            // Se tocou em qualquer outro lugar
            document.getElementById('tela-tutorial').classList.add('oculto'); // Remove a mãozinha
            this.jogoPausado = false; // Inicia o jogo de fato, liberando o arraste

            // MATA O ESPIÃO! (Substitui o once: true com perfeição)
            document.removeEventListener('pointerdown', tratarPrimeiroToque, { capture: true });
        };

        // Adiciona o espião sem o once: true
        // ====================================================
        // A MÁGICA DO PRIMEIRO TOQUE (EVENT CAPTURE)
        // ====================================================
        // O "capture: true" intercepta o clique do usuário ANTES de ele chegar no cartão.
        // O "once: true", que garantia que esse código só rodasse uma única vez foi substituído pelo espião com nome, que mata a si mesmo depois de ser acionado.
        document.addEventListener('pointerdown', tratarPrimeiroToque, { capture: true });
    },

    iniciar: function() {
        // super() não funciona em objetos literais, então chamamos diretamente a função do GlobalEngine:
        // GlobalEngine.iniciar.call(this);
        // Pode usar o .call(this) (ou .call(this, argumento1, argumento2) se a função precisar de parâmetros)
        // para qualquer outra função do pai que você queira estender!

        // 1. CHAMA O "SUPER" DO PAI (Ele vai resolver telas, áudio, pausas, tempo e intervalos)
        // Como a Fase 1 usa display: 'flex', enviamos esse parâmetro (se fosse a Fase 9, mandaríamos 'block')
        GlobalEngine.iniciar.call(this, 'flex');

        // 2. DAQUI PRA BAIXO, SÓ CÓDIGO 100% EXCLUSIVO DA FASE 1:
        document.getElementById('mini-pessoal').innerHTML = '';
        document.getElementById('mini-sensivel').innerHTML = '';
        document.getElementById('mini-anonimo').innerHTML = '';

        const modoAleatorio = document.getElementById('toggle-dificuldade').checked;
        this.filaCartoes = [...DADOS_JOGO.bancoDeDados];
        if (modoAleatorio) this.filaCartoes.sort(() => Math.random() - 0.5);
        this.totalCartoesRodada = this.filaCartoes.length;

        // Zera contadores locais
        this.acertos = 0; 
        this.totalJogados = 0;
        this.errosSeguidos = 0; 
        this.acertosSeguidos = 0; 
        this.ultimoToastAcerto = null;

        // Puxa a primeira carta
        this.puxarNovaCarta();
    },

    // function encerrar local antiga foi removida
    // // POLIMORFISMO: O Minijogo 1 substitui a regra de tempo esgotado do Pai!
    // tempoEsgotado: function() {
    //     if (this.encerrar) this.encerrar(true); //como estava no minijogo 1 (triagem)
    // },

    // =========================================================
    // O PAI VAI CHAMAR ISTO AUTOMATICAMENTE DURANTE O ENCERRAR
    // =========================================================
    // =========================================================
    // HOOK DO PAI: Atualiza a info exclusiva desta fase na tela de fim
    // =========================================================
    atualizarEstatisticasFinais: function() {
        const elQtde = document.getElementById('final-qtde');
        if (elQtde) elQtde.innerText = `${this.totalJogados}/${this.totalCartoesRodada}`;
    },



    // =========================================================
    // MECÂNICA EXCLUSIVA: Drag & Drop e Avaliação
    // =========================================================
    puxarNovaCarta: function() {
        const container = document.getElementById('container-cartao');
        if (this.elCartao) this.elCartao.remove();

        // if (this.filaCartoes.length === 0) {
        //     this.encerrar(false); //fimTempo = false; //passou = false, motivo = "meta", mas isso não é mais necessário porque a função de encerrar do pai já tem uma validação universal para meta de aprovação, então só precisa saber se foi derrota por tempo ou não.
        //     return;
        // }
        // CONDIÇÃO DE VITÓRIA: Fila zerou antes do tempo acabar!
        if (this.filaCartoes.length === 0) {
            this.encerrar(true); //passou = true, motivo = null
            return;
        }

        this.cartaAtual = this.filaCartoes.pop();
        
        this.elCartao = document.createElement('div');
        this.elCartao.className = 'cartao-dado';
        this.elCartao.innerText = this.cartaAtual.texto;
        
        this.elCartao.addEventListener('pointerdown', (e) => this.iniciarArraste(e));
        container.appendChild(this.elCartao);
        
        // Funções limpas passadas por bind para remover com facilidade depois
        this._arrastarBound = this.arrastar.bind(this);
        this._finalizarArrasteBound = this.finalizarArraste.bind(this);
        this._abortarArrasteBound = this.abortarArraste.bind(this);

        document.addEventListener('pointermove', this._arrastarBound);
        document.addEventListener('pointerup', this._finalizarArrasteBound);
        document.addEventListener('pointercancel', this._abortarArrasteBound);
    },

    iniciarArraste: function(e) {
        if (this.jogoPausado || (e.button !== 0 && e.type !== 'touchstart')) return; 
        e.preventDefault();
        
        const rect = this.elCartao.getBoundingClientRect();
        this.offsetX = e.clientX - rect.left;
        this.offsetY = e.clientY - rect.top;

        this.cloneDrag = this.elCartao.cloneNode(true);
        this.cloneDrag.className = 'cartao-dado cartao-dragging';
        this.cloneDrag.style.position = 'absolute';
        this.cloneDrag.style.left = rect.left + 'px';
        this.cloneDrag.style.top = rect.top + 'px';
        this.cloneDrag.style.width = rect.width + 'px';
        
        document.body.appendChild(this.cloneDrag);
        this.elCartao.style.opacity = '0'; 
    },

    arrastar: function(e) {
        if (!this.cloneDrag) return;
        e.preventDefault();
        this.cloneDrag.style.left = (e.clientX - this.offsetX) + 'px';
        this.cloneDrag.style.top = (e.clientY - this.offsetY) + 'px';
    },

    finalizarArraste: function(e) {
        if (!this.cloneDrag) return;

        const rectClone = this.cloneDrag.getBoundingClientRect();
        const centroX = rectClone.left + rectClone.width / 2;
        const centroY = rectClone.top + rectClone.height / 2;

        const alvos = [
            document.getElementById('alvo-pessoal'),
            document.getElementById('alvo-sensivel'),
            document.getElementById('alvo-anonimo')
        ];

        let alvoEncontrado = null;

        for (let alvo of alvos) {
            const rectAlvo = alvo.getBoundingClientRect();
            if (centroX >= rectAlvo.left && centroX <= rectAlvo.right && 
                centroY >= rectAlvo.top && centroY <= rectAlvo.bottom) {
                alvoEncontrado = alvo;
                break;
            }
        }

        if (alvoEncontrado) {
            this.processarSoltura(alvoEncontrado.dataset.tipo, alvoEncontrado);
        } else {
            this.abortarArraste();
        }
    },

    abortarArraste: function() {
        if (this.elCartao) this.elCartao.style.opacity = '1';
        if (this.cloneDrag) this.cloneDrag.remove();
        this.cloneDrag = null;
    },

    processarSoltura: function(tipoCaixa, divCaixa) {
        this.abortarArraste(); 

        const acertou = (tipoCaixa === this.cartaAtual.tipo);

        if ( (acertou && this.ultimoToastAcerto === false) || (!acertou && this.ultimoToastAcerto === true) ) {
            // PADRÃO OURO: Limpa os alertas instantaneamente ao soltar uma carta
            const toast = document.getElementById('toast-feedback');
            if (toast) toast.classList.remove('show');
            // if(this.toastTimer) clearTimeout(this.toastTimer);
            this.tempoToastRestante = 0;
            // this.ultimoToastAcerto = null;

            // PADRÃO OURO: Limpa os alertas instantaneamente ao soltar uma carta
            const alertaCombo = document.getElementById('alerta-combo');
            if (alertaCombo) alertaCombo.classList.remove('show');
            // if(this.alertaTimer) clearTimeout(this.alertaTimer);
            this.tempoAlertaRestante = 0;
        }

        // this.ultimoToastAcerto = acertou; // Não pode atualizar o anti-spam aqui porque a função de mostrarToast tem uma lógica extra para decidir se deve ou não mostrar o toast, então só deve atualizar essa variável lá dentro, quando realmente for mostrar o toast.
        this.totalJogados++;

        divCaixa.classList.add('flash');
        setTimeout(() => divCaixa.classList.remove('flash'), 250);

        const containerMiniaturas = divCaixa.querySelector('.miniaturas-container');
        const mini = document.createElement('div');
        mini.className = 'mini-card ' + (acertou ? 'sucesso' : 'erro');
        mini.innerText = this.cartaAtual.texto;
        containerMiniaturas.appendChild(mini);

        if (acertou) {
            this.acertos++; this.acertosSeguidos++; this.errosSeguidos = 0;
            let isCombo = this.acertosSeguidos > 2;
            let pts = isCombo ? DADOS_JOGO.pontosCombo : DADOS_JOGO.pontosAcerto; 
            
            this.adicionarPontos(pts, isCombo);
            if (typeof AudioSys !== 'undefined') AudioSys.tocar(isCombo ? 'combo' : 'sucesso');

            // this.mostrarToast(true);
            // Chama a função global de Toast usando o texto do dicionário
            this.mostrarToast('sucesso', DADOS_JOGO.interface.txtToastCorreto);
        } else {
            this.acertosSeguidos = 0; this.errosSeguidos++;
            this.adicionarPontos(DADOS_JOGO.penalidadeErro, false, true);
            if (typeof AudioSys !== 'undefined') AudioSys.tocar('erro');
            
            if (this.errosSeguidos >= 3) this.dispararAlertaErros();
            // this.mostrarToast(false);
            // Chama a função global de Toast usando o texto do dicionário
            this.mostrarToast('erro', DADOS_JOGO.interface.txtToastErro);
        }

        this.atualizarHUD(true);
        
        this.elCartao.style.display = 'none'; 
        
        document.removeEventListener('pointermove', this._arrastarBound);
        document.removeEventListener('pointerup', this._finalizarArrasteBound);
        document.removeEventListener('pointercancel', this._abortarArrasteBound);

        setTimeout(() => this.puxarNovaCarta(), 100); 
    },



    // mostrarToast: function(tipo, mensagem) {
    //     if (this.ultimoToastAcerto === acertou) return;
    //     this.ultimoToastAcerto = acertou; //acertou não está definido neste escopo e estava bugando o codigo

    //     GlobalEngine.mostrarToast.call(this, tipo, mensagem);
    // },

    // POLIMORFISMO: O Minijogo 1 tem um filtro anti-spam antes de chamar o Toast global!
    mostrarToast: function(tipo, mensagem) {
        // Descobre se foi um acerto avaliando a string do "tipo"
        const acertou = (tipo === 'sucesso');

        // Se o resultado for igual ao anterior, aborta silenciosamente
        if (this.ultimoToastAcerto === acertou) return;
        // Atualiza a memória
        this.ultimoToastAcerto = acertou;

        // Agora sim, manda o Pai desenhar o Toast na tela
        GlobalEngine.mostrarToast.call(this, tipo, mensagem);
    },

    // mostrarToast: function(acertou) {
    //     if (this.ultimoToastAcerto === acertou) return;
    //     this.ultimoToastAcerto = acertou;

    //     const toast = document.getElementById('toast-feedback');
    //     toast.className = '';
    //     if (acertou) {
    //         toast.classList.add('sucesso');
    //         document.getElementById('toast-titulo').innerText = "Correto ✅";
    //         document.getElementById('toast-texto').innerText = DADOS_JOGO.interface.txtToastCorreto;
    //     } else {
    //         toast.classList.add('erro');
    //         document.getElementById('toast-titulo').innerText = "Incorreto ❌";
    //         document.getElementById('toast-texto').innerText = DADOS_JOGO.interface.txtToastErro;
    //     }

    //     toast.classList.add('show');

    //     // if(this.toastTimer) clearTimeout(this.toastTimer);
    //     // // this.toastTimer = setTimeout(() => { toast.classList.remove('show'); }, 3500);

    //     // // NOVO: 10 Segundos de duração
    //     // this.toastTimer = setTimeout(() => { 
    //     //     toast.classList.remove('show'); 
    //     //     // this.ultimoToastAcerto = null; // Libera o anti-spam
    //     // }, 10000);

    //     // NOVO: Abastece 10 segundos no relógio interno do jogo
    //     this.tempoToastRestante = 10;

    //     // NOVO: Evento para fechar imediatamente ao clicar
    //     toast.onclick = () => {
    //         if (this.jogoPausado) return; // PADRÃO OURO: Impede fechar se estiver pausado

    //         toast.classList.remove('show');
    //         // this.ultimoToastAcerto = null;
    //         // clearTimeout(this.toastTimer);
    //         this.tempoToastRestante = 0;

    //         // Se o alerta extra estiver na tela, some com ele também
    //         const alertaCombo = document.getElementById('alerta-combo');
    //         if (alertaCombo) alertaCombo.classList.remove('show');
    //         // if(this.alertaTimer) clearTimeout(this.alertaTimer);
    //         this.tempoAlertaRestante = 0;
    //     };
    // },

    dispararAlertaErros: function() {
        // const alerta = document.getElementById('alerta-combo');
        // alerta.classList.add('show');
        // this.errosSeguidos = 0;
        // setTimeout(() => alerta.classList.remove('show'), 3000);

        const alerta = document.getElementById('alerta-combo');
        if (alerta) alerta.classList.add('show');
        this.errosSeguidos = 0; // Zera a contagem para o próximo combo de erros
        this.ultimoToastAcerto = null; // Libera o anti-spam do toast para que ele possa aparecer novamente

        // if(this.alertaTimer) clearTimeout(this.alertaTimer);

        // // PADRÃO OURO: 10 segundos
        // this.alertaTimer = setTimeout(() => { 
        //     alerta.classList.remove('show'); 
        // }, 10000);

        // PADRÃO OURO: Abastece 10 segundos no relógio interno do jogo
        this.tempoAlertaRestante = 10;

        // Permite fechar a penalidade extra clicando nela mesma
        if (alerta) {
            alerta.onclick = () => {
                if (this.jogoPausado) return; // PADRÃO OURO: Impede fechar se estiver pausado

                alerta.classList.remove('show');
                // clearTimeout(this.alertaTimer);
                this.tempoAlertaRestante = 0;
            };
        }
    },

    // encerrar: function(fimTempo) {
    //     clearInterval(this.intervaloTempo);
    //     this.jogoPausado = true;
        
    //     const precisao = this.totalJogados > 0 ? Math.round((this.acertos / this.totalJogados) * 100) : 0;
    //     this.precisao = precisao; // Armazena a precisão final para exibir no progresso da fase, no hub2d.html
    //     const completouTudo = this.totalJogados === this.totalCartoesRodada;
    //     const passou = completouTudo && precisao >= DADOS_JOGO.metaAprovacao;

    //     document.getElementById('final-qtde').innerText = `${this.totalJogados}/${this.totalCartoesRodada}`;
    //     document.getElementById('final-tempo').innerText = `${Math.max(0, this.tempoRestante)}s`;
    //     document.getElementById('final-pontos').innerText = this.pontuacao;
        
    //     const spanTaxa = document.getElementById('final-taxa');
    //     spanTaxa.innerText = `${precisao}%`;
    //     spanTaxa.style.color = passou ? "#2e7d32" : "#c62828";
        
    //     const titulo = document.getElementById('txt-fim-titulo');
    //     const msg = document.getElementById('txt-fim-msg');
    //     const botoesFim = document.getElementById('botoes-fim');

    //     if (passou) {
    //         titulo.innerText = DADOS_JOGO.interface.fimVitoriaTitulo; titulo.style.color = "var(--cor-tema-escuro)";
    //         msg.innerHTML = DADOS_JOGO.interface.fimVitoriaMsg;
    //             // Aviso visual na tela final de que o recorde não vale
    //             if (this.registroInvalido) { msg.innerHTML += "<br><br><span style='color: #d32f2f; font-size: 12px; font-weight: bold;'>⚠️ Tempo Extra Ativado: Este resultado não será registrado como record!</span>"; }
    //         botoesFim.innerHTML = `<button class="btn-acao" onclick="Engine.finalizarFase()">Continuar</button>`;
    //     } else {
    //         titulo.style.color = "#c62828";
    //         if (fimTempo && !completouTudo) {
    //             titulo.innerText = DADOS_JOGO.interface.fimDerrotaTempoTitulo;
    //             msg.innerHTML = DADOS_JOGO.interface.fimDerrotaTempoMsg;
    //         } else {
    //             titulo.innerText = DADOS_JOGO.interface.fimDerrotaMetaTitulo;
    //             msg.innerHTML = `${DADOS_JOGO.interface.fimDerrotaMetaMsg} Sua precisão foi de <strong>${precisao}%</strong> (Mínimo: ${DADOS_JOGO.metaAprovacao}%).`;
    //         }
    //         botoesFim.innerHTML = `
    //             <button class="btn-acao" onclick="Engine.voltarAoMenu()">Tentar Novamente</button>
    //             <button class="btn-acao btn-secundario" onclick="Engine.cancelar()">Sair</button>
    //         `;
    //     }

    //     document.getElementById('area-jogo').style.display = 'none';
    //     document.getElementById('toast-feedback').classList.remove('show');
    //     document.getElementById('alerta-combo').classList.remove('show');
    //     document.getElementById('tela-fim').classList.remove('oculto');
    // }
};
