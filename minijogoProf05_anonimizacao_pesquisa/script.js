// ============================================================================
// REGRAS ESPECÍFICAS - FASE 5 (PESQUISA NA APS)
// ============================================================================



// ============================================================================
// 1. DICIONÁRIO DE TEXTOS E DADOS (Padrão Ouro)
// ============================================================================
const DADOS_JOGO = {
    tema: {
        corPrincipal: "#512da8", // Roxo
        corEscura: "#311b92", 
        corClara: "#ede7f6"
    },
    
    tempoMaximo: 60,
    metaAprovacao: 75,
    pontosPorTabela: 20,
    pontosComboTabela: 30,
    penalidadePorErro: -10,

    interface: {
        introTitulo: "Fase 5: Pesquisa na APS",
        // introDesc: "Você precisa exportar tabelas para uma pesquisa, <strong>removendo</strong> as informações que identifiquem o paciente.",
        introDesc: "Você precisa exportar tabelas de dados para uma pesquisa na <strong>APS</strong> (Atenção Primária à Saúde), <strong>removendo</strong> as informações que identifiquem diretamente os pacientes.", //" hipertensos e oncológicos.",
        // introDefinCurta: "<strong>Conceito:</strong> Dados para pesquisa na APS (Atenção Primária à Saúde).",
        introDica: "Toque nas linhas da tabela para <span style='background:#212121;color:white;padding:2px 6px;border-radius:4px;font-size:12px;'>⬛ Censurar</span> o dado. Mantenha os dados úteis para a pesquisa e exporte.",
        introMeta: "Meta de Aprovação: Tratar todas as tabelas com 75% de Precisão.",
        
        fimVitoriaTitulo: "Pesquisa Exportada! ✅",
        fimVitoriaMsg: "Excelente! Você exportou as tabelas a tempo, mantendo a integridade da pesquisa e protegendo os pacientes.",
        fimDerrotaTempoTitulo: "Tempo Esgotado ❌",
        fimDerrotaTempoMsg: "O tempo acabou e a pesquisa está atrasada. O tratamento de dados deve ser eficiente e seguro.",
        fimDerrotaMetaTitulo: "Meta Não Atingida ❌",
        fimDerrotaMetaMsg: "Os seus erros demonstraram risco de vazamento de identidade.",
        
        baseLegal: "<strong>⚖️ Art. 5º, III da LGPD:</strong> Só há anonimização quando a pessoa não puder ser identificada por meios razoáveis. A proteção do paciente exige a retirada de identificadores diretos.",

        txtErroVazamento: "Vazamento! Tentou exportar campos que identificam o paciente.",
        txtErroEstatistica: "Excesso! Removeu campos úteis que não identificavam o paciente."
    },

    bancoDeSituacoes: [
        {
            descricao: "Dados para uma pesquisa sobre pacientes hipertensos da Unidade.",
            dados: [
                { nome: "Nome completo do paciente", identifica: true },
                { nome: "CPF", identifica: true },
                { nome: "Endereço residencial", identifica: true },
                { nome: "Sexo", identifica: false },
                { nome: "Diagnóstico médico (hipertensão)", identifica: false },
                { nome: "Pressão arterial média", identifica: false }
            ]
        },
        {
            descricao: "Dados de exames preventivos com alteração.",
            dados: [
                { nome: "Número do prontuário", identifica: true },
                { nome: "E-mail do paciente", identifica: true },
                { nome: "Telefone de contato", identifica: true },
                { nome: "Idade", identifica: false },
                { nome: "Tumor: resultado citopatológico", identifica: false },
                { nome: "Tipo de encaminhamento para especialista", identifica: false }
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
    document.getElementById('txt-intro-desc').innerHTML = DADOS_JOGO.interface.introDesc;
    document.getElementById('txt-intro-dica').innerHTML = DADOS_JOGO.interface.introDica;
    document.getElementById('txt-intro-meta').innerText = DADOS_JOGO.interface.introMeta;
    document.getElementById('txt-fim-lei').innerHTML = DADOS_JOGO.interface.baseLegal;
});



// ============================================================================
// 2. ENGINE CENTRAL DO JOGO (Avaliação em Lote)
// ============================================================================
const Engine = {
    ...GlobalEngine, // HERANÇA DO MOTOR GLOBAL

    situacoes: [], situacaoAtualIndice: 0, estadoCampos: [],
    totalCampos: 0, acertosTotais: 0, totalTabelasExportadas: 0,
    pontuacao: 0, comboAcertos: 0,
    tempoRestante: 0, intervaloTempo: null, jogoPausado: true, toastTimer: null, ultimoToastStatus: null,
    tempoToastRestante: 0, // NOVO: Relógio interno do alerta

    iniciar: function() {
        // CHAMA O PAI (Ele resolve CSS, pausas, tempo, reset global)
        GlobalEngine.iniciar.call(this, 'flex');

        const modoAleatorio = document.getElementById('toggle-dificuldade').checked;
        this.situacoes = JSON.parse(JSON.stringify(DADOS_JOGO.bancoDeSituacoes));
        this.totalCampos = this.situacoes.reduce((acc, sit) => acc + sit.dados.length, 0); 
        
        if (modoAleatorio) {
            this.situacoes.forEach(sit => sit.dados.sort(() => Math.random() - 0.5));
        }

        this.situacaoAtualIndice = 0; this.pontuacao = 0;
        this.acertosTotais = this.totalCampos; // Inicia com 100%
        this.totalTabelasExportadas = 0; this.comboAcertos = 0;
        this.ultimoToastStatus = null;
        this.tempoToastRestante = 0; // Zera ao reiniciar

        document.getElementById('grid-campos').innerHTML = '';
        this.carregarTabela();
    },

    // =========================================================
    // POLIMORFISMO: Cálculo de Precisão Customizado
    // =========================================================
    calcularPrecisao: function() {
        if (this.totalCampos === 0) return 0;
        return Math.round((this.acertosTotais / this.totalCampos) * 100);
    },

    // =========================================================
    // HOOK DO PAI: Atualiza a info na tela de fim
    // =========================================================
    atualizarEstatisticasFinais: function() {
        const elQtde = document.getElementById('final-qtde');
        if (elQtde) elQtde.innerText = `${this.totalTabelasExportadas}/${this.situacoes.length}`;
    },

    // =========================================================
    // MECÂNICA EXCLUSIVA DA FASE 5
    // =========================================================
    carregarTabela: function() {
        // CONDIÇÃO DE TÉRMINO: Terminamos todas as tabelas a tempo
        if (this.situacaoAtualIndice >= this.situacoes.length) {
            this.encerrar(true); 
            return;
        }

        const sit = this.situacoes[this.situacaoAtualIndice];
        document.getElementById('texto-situacao').innerText = sit.descricao;
        document.getElementById('contador-tabelas').innerText = `${this.situacaoAtualIndice + 1} / ${this.situacoes.length}`;
        
        const grid = document.getElementById('grid-campos');
        grid.innerHTML = ''; 
        this.estadoCampos = []; 
        
        sit.dados.forEach((dado, index) => {
            this.estadoCampos.push({ censurado: false, ...dado }); 
            
            const linha = document.createElement('div');
            linha.className = 'linha-tabela';
            linha.id = `linha-${index}`;
            linha.innerHTML = `
                <div class="col-dado"><span class="nome-campo">${dado.nome}</span></div>
                <div class="col-status"><div class="badge-status" id="badge-${index}">👁️ Mantido</div></div>
            `;
            
            // linha.onpointerdown = () => this.alternarCampo(index);
            linha.onclick = () => this.alternarCampo(index);
            grid.appendChild(linha);
        });
    },

    alternarCampo: function(index) {
        if (this.jogoPausado) return;
        
        if (typeof AudioSys !== 'undefined') AudioSys.tocar('click');
        const campo = this.estadoCampos[index];
        campo.censurado = !campo.censurado; 
        
        const linha = document.getElementById(`linha-${index}`);
        const badge = document.getElementById(`badge-${index}`);
        linha.classList.remove('erro-destaque');

        if (campo.censurado) {
            linha.classList.add('censurado');
            badge.innerHTML = "⬛ Removido";
        } else {
            linha.classList.remove('censurado');
            badge.innerHTML = "👁️ Mantido";
        }
    },

    exportarTabela: function() {
        if (this.jogoPausado || this.situacaoAtualIndice >= this.situacoes.length) return;

        // PADRÃO OURO: Limpa o alerta instantaneamente na nova tentativa
        const toast = document.getElementById('toast-feedback');
        if (toast) toast.classList.remove('show');
        this.tempoToastRestante = 0;
        this.ultimoToastStatus = null;

        let teveVazamento = false;
        let teveExcesso = false;
        let errosNestaTentativa = 0;

        this.estadoCampos.forEach((campo, index) => {
            const linha = document.getElementById(`linha-${index}`);
            linha.classList.remove('erro-destaque');

            if (campo.identifica && !campo.censurado) {
                teveVazamento = true; errosNestaTentativa++; linha.classList.add('erro-destaque'); 
            } else if (!campo.identifica && campo.censurado) {
                teveExcesso = true; errosNestaTentativa++; linha.classList.add('erro-destaque'); 
            }
        });

        const painel = document.getElementById('painel-tabela');

        if (errosNestaTentativa === 0) {
            this.comboAcertos++;
            let isCombo = this.comboAcertos > 1;
            let pts = isCombo ? DADOS_JOGO.pontosComboTabela : DADOS_JOGO.pontosPorTabela; 
            
            this.adicionarPontos(pts, isCombo);
            if (typeof AudioSys !== 'undefined') AudioSys.tocar(isCombo ? 'combo' : 'sucesso');
            this.totalTabelasExportadas++;
            
            this.jogoPausado = true;
            painel.style.opacity = 0.5; painel.style.transform = "scale(0.95)";
            
            setTimeout(() => {
                this.situacaoAtualIndice++;
                this.carregarTabela();
                painel.style.opacity = 1; painel.style.transform = "scale(1)";
                this.jogoPausado = false;
            }, 500);

        } else {
            this.comboAcertos = 0;
            let pontosPerdidos = errosNestaTentativa * DADOS_JOGO.penalidadePorErro;
            
            this.acertosTotais = Math.max(0, this.acertosTotais - errosNestaTentativa);
            this.adicionarPontos(pontosPerdidos, false, teveVazamento);
            if (typeof AudioSys !== 'undefined') AudioSys.tocar('erro');
            
            painel.classList.add('tremor');
            setTimeout(() => painel.classList.remove('tremor'), 400);

            if (teveVazamento) this.mostrarToast('erro_vazamento');
            else if (teveExcesso) this.mostrarToast('erro_estatistica');
        }

        this.atualizarHUD(true);
    },

    // =========================================================
    // POLIMORFISMO: Toast Dinâmico da Tabela (Vazamento/Excesso)
    // =========================================================
    mostrarToast: function(status) {
        if (this.ultimoToastStatus === status) return;
        this.ultimoToastStatus = status;

        const toast = document.getElementById('toast-feedback');
        const titulo = document.getElementById('toast-titulo');
        const texto = document.getElementById('toast-texto');
        if (!toast) return;

        toast.className = '';
        // toast.className = 'erro'; // Usa a classe base de erro do CSS global para a cor/sombra

        if (status === 'erro_vazamento') {
            toast.classList.add('erro-vazamento');
            titulo.innerText = "Risco de Identificação 🛑";
            texto.innerText = DADOS_JOGO.interface.txtErroVazamento;
        } else if (status === 'erro_estatistica') {
            toast.classList.add('erro-estatistica');
            titulo.innerText = "Perda de Dados Úteis ⚠️";
            texto.innerText = DADOS_JOGO.interface.txtErroEstatistica;
        }

        toast.classList.add('show');

        // if(this.toastTimer) clearTimeout(this.toastTimer);

        // // Tempo padrão de 10 segundos (10000ms)
        // this.toastTimer = setTimeout(() => { 
        //     toast.classList.remove('show'); 
        //     this.ultimoToastStatus = null; 
        // }, 10000);

        // PADRÃO OURO: Abastece 10 segundos no relógio interno do jogo
        this.tempoToastRestante = 10;

        // Evento para fechar ao clicar
        toast.onclick = () => {
            if (this.jogoPausado) return; // Impede fechar se estiver pausado

            toast.classList.remove('show');
            this.ultimoToastStatus = null; // Libera para o mesmo erro aparecer de novo
            // clearTimeout(this.toastTimer);
            this.tempoToastRestante = 0;
        };
    }
};
