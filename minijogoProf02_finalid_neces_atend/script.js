// ============================================================================
// REGRAS ESPECÍFICAS - FASE 2 (ATENDIMENTO)
// ============================================================================



// ============================================================================
// 1. DICIONÁRIO DE TEXTOS E DADOS (Padrão Ouro)
// ============================================================================
const DADOS_JOGO = {
    tema: {
        corPrincipal: "#00897b", // Verde-Azulado
        corEscura: "#004d40", 
        corClara: "#e0f2f1"
    },
    
    tempoMaximo: 60,
    metaAprovacao: 75,
    pontosAcerto: 10,
    pontosCombo: 15,
    penalidadeErro: -10,
    penalidadeGrave: -20,

    interface: {
        introTitulo: "Fase 2: Atendimento",
        introDesc: "Você está atendendo pacientes e deve solicitar apenas os dados necessários para o cuidado.",
        introDica: "Leia a situação médica e julgue se cada dado listado abaixo é realmente essencial para aquele momento clínico.",
        introMeta: "Meta de Aprovação: Analisar TODOS os dados com 75% de Precisão.",
        
        fimVitoriaTitulo: "Atendimento Concluído! ✅",
        fimVitoriaMsg: "Excelente! Você analisou todos os dados a tempo com precisão médica e segurança da informação.",
        fimDerrotaTempoTitulo: "Tempo Esgotado ❌",
        fimDerrotaTempoMsg: "O tempo acabou e os pacientes ficaram sem atendimento. As decisões de privacidade devem ser ágeis na saúde.",
        fimDerrotaMetaTitulo: "Meta Não Atingida ❌",
        fimDerrotaMetaMsg: "Sua precisão demonstra acessos indevidos. Lembre-se do princípio da Necessidade.",
        
        baseLegal: "<strong>⚖️ Art. 6º, I e III da LGPD:</strong> Na assistência em saúde, só devem ser acedidos os dados estritamente necessários ao atendimento (Necessidade) e para a devida razão clínica (Finalidade).",

        txtErroOmissao: "Omissão! Rejeitou um dado essencial para o atendimento. Isso pode prejudicar a conduta clínica.",
        txtErroExcesso: "Acesso indevido. A LGPD determina o tratamento restrito ao mínimo necessário (Princípio da Necessidade).",
        txtErroGrave: "Acesso inadequado! Consultar informações sensíveis sem necessidade contraria gravemente a LGPD."
    },

    bancoDeSituacoes: [
        {
            descricao: "Paciente veio buscar resultado de exame de sangue de rotina.",
            dados: [
                { nome: "Nome do paciente", precisa: true, grave: false },
                { nome: "Protocolo de retirada do exame", precisa: true, grave: false }, 
                // { nome: "CPF", precisa: false, grave: false },
                { nome: "CPF", precisa: true, grave: false },
                { nome: "Endereço residencial", precisa: false, grave: false },
                { nome: "Religião", precisa: false, grave: true },
                { nome: "Sexualidade", precisa: false, grave: true }
            ]
        },
        {
            descricao: "Paciente aguardando aplicação de vacina contra a Gripe.",
            dados: [
                // { nome: "Carteira de Vacinação", precisa: true, grave: false },
                { nome: "Cartão de Vacina (caso já possua)", precisa: true, grave: false },
                { nome: "Idade / Data de Nascimento", precisa: true, grave: false },
                { nome: "Renda Familiar", precisa: false, grave: false },
                { nome: "Histórico Psiquiátrico", precisa: false, grave: true }
            ]
        },
        {
            descricao: "Consulta de acompanhamento de rotina para Hipertensão.",
            dados: [
                { nome: "Pressão Arterial atual", precisa: true, grave: false },
                { nome: "Histórico de Medicação", precisa: true, grave: false },
                { nome: "Filiação Política", precisa: false, grave: true },
                { nome: "Histórico de ISTs na família", precisa: false, grave: true },
                { nome: "Profissão", precisa: false, grave: false }
            ]
        }
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
    document.getElementById('txt-intro-dica').innerText = DADOS_JOGO.interface.introDica;
    document.getElementById('txt-intro-meta').innerText = DADOS_JOGO.interface.introMeta;
    document.getElementById('txt-fim-lei').innerHTML = DADOS_JOGO.interface.baseLegal;
});



// ============================================================================
// 2. ENGINE CENTRAL DO JOGO (Lógica de Necessidade)
// ============================================================================
const Engine = {
    ...GlobalEngine, // Herança do Pai!

    situacoes: [], situacaoAtualIndice: 0, dadoAtualIndice: 0, totalCartoes: 0,
    pontuacao: 0, acertos: 0, totalJogados: 0,
    acertosSeguidos: 0, errosSeguidos: 0,
    tempoRestante: 0, intervaloTempo: null, jogoPausado: true,
    toastTimer: null, ultimoToastStatus: null,
    tempoToastRestante: 0, tempoAlertaRestante: 0, // NOVO: Relógios internos dos alertas

    iniciar: function() {
        // CHAMA O PAI (Ele resolve CSS, pausas, tempo, reset global)
        GlobalEngine.iniciar.call(this, 'flex');

        const modoAleatorio = document.getElementById('toggle-dificuldade').checked;
        this.situacoes = JSON.parse(JSON.stringify(DADOS_JOGO.bancoDeSituacoes));
        this.totalCartoes = this.situacoes.reduce((acc, sit) => acc + sit.dados.length, 0); 
        
        if (modoAleatorio) {
            this.situacoes.forEach(sit => sit.dados.sort(() => Math.random() - 0.5));
        }

        this.situacaoAtualIndice = 0; this.dadoAtualIndice = 0;
        this.pontuacao = 0; this.acertos = 0; this.totalJogados = 0;
        this.errosSeguidos = 0; this.acertosSeguidos = 0; this.ultimoToastStatus = null; 
        this.tempoToastRestante = 0; this.tempoAlertaRestante = 0; // Zera ao reiniciar

        document.getElementById('lista-dados').innerHTML = ''; 
        this.carregarNovaSituacao();
    },

    // =========================================================
    // HOOK DO PAI: Atualiza a info na tela de fim
    // =========================================================
    atualizarEstatisticasFinais: function() {
        const elQtde = document.getElementById('final-qtde');
        if (elQtde) elQtde.innerText = `${this.totalJogados}/${this.totalCartoes}`;
    },



    // =========================================================
    // MECÂNICA EXCLUSIVA DA FASE 2
    // =========================================================
    carregarNovaSituacao: function() {
        if (this.situacaoAtualIndice >= this.situacoes.length) {
            // CORREÇÃO: Acabou as situações a tempo = Mandar TRUE
            this.encerrar(true); 
            return;
        }

        const sit = this.situacoes[this.situacaoAtualIndice];
        document.getElementById('texto-situacao').innerText = sit.descricao;
        document.getElementById('lista-dados').innerHTML = ''; 
        
        this.puxarNovoDado();
    },

    puxarNovoDado: function() {
        const sit = this.situacoes[this.situacaoAtualIndice];
        
        if (this.dadoAtualIndice >= sit.dados.length) {
            this.situacaoAtualIndice++;
            this.dadoAtualIndice = 0;
            this.jogoPausado = true;
            setTimeout(() => {
                this.jogoPausado = false;
                this.carregarNovaSituacao();
            }, 1000); 
            return;
        }

        const dadoObj = sit.dados[this.dadoAtualIndice];
        const lista = document.getElementById('lista-dados');
        
        const li = document.createElement('div');
        li.className = 'dado-linha ativo';
        li.id = 'linha-atual';
        li.innerHTML = `
            <span class="nome-dado">${dadoObj.nome}</span>
            <span class="status-dado pulse-aguardando">A aguardar decisão...</span>
        `;
        
        lista.appendChild(li);
        // li.scrollIntoView({ behavior: 'smooth', block: 'end' });
        lista.scrollTo({ top: lista.scrollHeight, behavior: 'smooth' });
    },

    classificar: function(escolhaDoJogador) {
        if (this.jogoPausado || this.situacaoAtualIndice >= this.situacoes.length) return;

        // NOVO: Limpa o toast principal
        const toast = document.getElementById('toast-feedback');
        toast.classList.remove('show');
        // if(this.toastTimer) clearTimeout(this.toastTimer);
        this.tempoToastRestante = 0;
        this.ultimoToastStatus = null; // Importante: permite que o mesmo erro dispare o alerta novamente se ocorrer em seguida

        // NOVO: Limpa também o alerta de penalidade extra
        const alertaCombo = document.getElementById('alerta-combo');
        alertaCombo.classList.remove('show');
        // if(this.alertaTimer) clearTimeout(this.alertaTimer);
        this.tempoAlertaRestante = 0;

        const sit = this.situacoes[this.situacaoAtualIndice];
        const dadoObj = sit.dados[this.dadoAtualIndice];
        const acertou = (escolhaDoJogador === dadoObj.precisa);
        
        this.totalJogados++;
        
        const li = document.getElementById('linha-atual');
        li.removeAttribute('id'); 
        li.classList.remove('ativo');
        
        li.classList.add(acertou ? 'acerto-jogador' : 'erro-jogador');
        
        const statusSpan = li.querySelector('.status-dado');
        statusSpan.classList.remove('pulse-aguardando');

        let iconeVerdade = dadoObj.precisa ? '✅ Necessário' : '❌ Não necessário';
        let classeVerdade = dadoObj.precisa ? 'sim-necessario' : 'nao-necessario';
        let alertaGrave = (!acertou && dadoObj.grave && !dadoObj.precisa) ? '<span style="color:#d32f2f; font-size:11px; display:block; margin-top:3px;">⚠️ Erro Grave</span>' : '';
        
        statusSpan.innerHTML = iconeVerdade + alertaGrave;
        statusSpan.className = 'status-dado ' + classeVerdade;

        if (acertou) {
            this.acertos++; this.acertosSeguidos++; this.errosSeguidos = 0;
            let isCombo = this.acertosSeguidos > 2;
            let pts = isCombo ? DADOS_JOGO.pontosCombo : DADOS_JOGO.pontosAcerto; 
            
            this.adicionarPontos(pts, isCombo);
            if (typeof AudioSys !== 'undefined') AudioSys.tocar(isCombo ? 'combo' : 'sucesso');
        } else {
            this.acertosSeguidos = 0;
            if (typeof AudioSys !== 'undefined') AudioSys.tocar('erro');
            
            if (dadoObj.precisa) {
                this.adicionarPontos(DADOS_JOGO.penalidadeErro, false, false);
                this.mostrarToast('erro_omissao');
            } else {
                if (dadoObj.grave) {
                    this.adicionarPontos(DADOS_JOGO.penalidadeGrave, false, true);
                    this.mostrarToast('erro_grave');
                } else {
                    this.adicionarPontos(DADOS_JOGO.penalidadeErro, false, false);
                    this.mostrarToast('erro_excesso');
                }

                this.errosSeguidos++;
                if (this.errosSeguidos >= 2) {
                    this.adicionarPontos(DADOS_JOGO.penalidadeErro, false, true);
                    this.dispararAlertaErros();
                    this.errosSeguidos = 0; 
                }
            }
        }

        this.atualizarHUD(true);
        
        this.dadoAtualIndice++;
        this.puxarNovoDado();
    },

    // =========================================================
    // POLIMORFISMO: O Minijogo 2 tem um Toast Customizado
    // =========================================================
    mostrarToast: function(status) {
        if (this.ultimoToastStatus === status) return;
        this.ultimoToastStatus = status;

        const toast = document.getElementById('toast-feedback');
        const titulo = document.getElementById('toast-titulo');
        const texto = document.getElementById('toast-texto');
        if (!toast || !titulo || !texto) return;

        toast.className = '';
        if (status === 'erro_omissao') {
            toast.classList.add('erro-omissao');
            titulo.innerText = "Informação Essencial ⚠️";
            texto.innerText = DADOS_JOGO.interface.txtErroOmissao;
        } else if (status === 'erro_grave') {
            toast.classList.add('erro-grave');
            titulo.innerText = "Acesso Inadequado 🛑";
            texto.innerText = DADOS_JOGO.interface.txtErroGrave;
        } else if (status === 'erro_excesso') {
            toast.classList.add('erro-excesso');
            titulo.innerText = "Acesso Indevido ❌";
            texto.innerText = DADOS_JOGO.interface.txtErroExcesso;
        }

        // toast.classList.add('show');
        // if(this.toastTimer) clearTimeout(this.toastTimer);
        // this.toastTimer = setTimeout(() => { toast.classList.remove('show'); this.ultimoToastStatus = null; }, 3500);

        toast.classList.add('show');

        // if(this.toastTimer) clearTimeout(this.toastTimer);

        // // NOVO: Tempo de 10 segundos (10000ms) para o toast principal, dando mais tempo para ler o conteúdo mais longo
        // this.toastTimer = setTimeout(() => { 
        //     toast.classList.remove('show'); 
        //     this.ultimoToastStatus = null; 
        // }, 10000); 

        // PADRÃO OURO: Abastece 10 segundos no relógio interno do jogo
        this.tempoToastRestante = 10;

        // NOVO: Evento para fechar imediatamente ao clicar
        toast.onclick = () => {
            if (this.jogoPausado) return; // Impede fechar se estiver pausado

            toast.classList.remove('show');
            this.ultimoToastStatus = null; // Libera para o mesmo erro aparecer de novo
            // clearTimeout(this.toastTimer);
            this.tempoToastRestante = 0;

            // Faz o alerta extra sumir junto, se estiver na tela
            const alertaCombo = document.getElementById('alerta-combo');
            if (alertaCombo) alertaCombo.classList.remove('show');
            // if(this.alertaTimer) clearTimeout(this.alertaTimer);
            this.tempoAlertaRestante = 0;
        };
    },

    dispararAlertaErros: function() {
        const alerta = document.getElementById('alerta-combo');
        if (alerta) alerta.classList.add('show');
        // setTimeout(() => alerta.classList.remove('show'), 3500);

        // // Limpa o timer anterior se houver
        // if(this.alertaTimer) clearTimeout(this.alertaTimer);

        // // Tempo de 10 segundos no Padrão Ouro
        // this.alertaTimer = setTimeout(() => { 
        //     alerta.classList.remove('show'); 
        // }, 10000);

        // PADRÃO OURO: Abastece 10 segundos sincronizados
        this.tempoAlertaRestante = 10;

        // Permite fechar a penalidade extra clicando nela mesma
        if (alerta) {
            alerta.onclick = () => {
                if (this.jogoPausado) return; // Impede fechar se estiver pausado

                alerta.classList.remove('show');
                // clearTimeout(this.alertaTimer);
                this.tempoAlertaRestante = 0;
            };
        }
    }
};
