// ============================================================================
// PADRÃO OURO JS - Motor Base Global (Áudio e Ferramentas Comuns)
// ============================================================================

const AudioSys = {
    ctx: null, mutado: false,
    
    init: function() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
        if (this.ctx.state === 'suspended') this.ctx.resume();
    },

    // toggleMute: function() {
    //     this.mutado = !this.mutado;
    //     const btn = document.getElementById('btn-mute');
    //     if (btn) btn.innerText = this.mutado ? "🔇" : "🔊";
    // },
    toggleMute: function() {
        this.mutado = !this.mutado;

        const btnMute = document.getElementById('btn-mute');
        if (btnMute) {
            btnMute.innerText = this.mutado ? "🔇" : "🔊";

            // Se ficou mutado, pode adicionar um estilo visual (opcional)
            if (this.mutado) {
                // btnMute.classList.add('desativado');
            } else {
                // btnMute.classList.remove('desativado');

                // O GRANDE TRUQUE: Tocar o som LOGO APÓS desmutar
                this.tocar('som_on');
            }
        }
    },

    tocar: function(tipo) {
        if (this.mutado || !this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain); gain.connect(this.ctx.destination);
        const now = this.ctx.currentTime;

        // ========================================================
        // DICIONÁRIO UNIFICADO DE EFEITOS SONOROS DA UBS
        // ========================================================
        if (tipo === 'click') {
            osc.type = 'triangle'; osc.frequency.setValueAtTime(600, now); osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
            gain.gain.setValueAtTime(0.05, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
            osc.start(now); osc.stop(now + 0.05);
        } else if (tipo === 'sucesso' || tipo === 'alvo') {
            osc.type = 'sine'; osc.frequency.setValueAtTime(440, now); osc.frequency.setValueAtTime(659, now + 0.1); osc.frequency.setValueAtTime(880, now + 0.2);
            gain.gain.setValueAtTime(0.05, now); gain.gain.linearRampToValueAtTime(0, now + 0.4);
            osc.start(now); osc.stop(now + 0.4);
        } else if (tipo === 'erro') {
            osc.type = 'sawtooth'; osc.frequency.setValueAtTime(200, now); osc.frequency.exponentialRampToValueAtTime(50, now + 0.4);
            gain.gain.setValueAtTime(0.1, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
            osc.start(now); osc.stop(now + 0.4);
        } else if (tipo === 'combo') {
            osc.type = 'sine'; osc.frequency.setValueAtTime(554, now); osc.frequency.setValueAtTime(659, now + 0.1); osc.frequency.setValueAtTime(880, now + 0.2); osc.frequency.setValueAtTime(1108, now + 0.3);
            gain.gain.setValueAtTime(0.05, now); gain.gain.linearRampToValueAtTime(0, now + 0.4);
            osc.start(now); osc.stop(now + 0.4);

        // Acho que não estão sendo usados
        } else if (tipo === 'tiro') { // Exclusivo Fase 8
            osc.type = 'square'; osc.frequency.setValueAtTime(800, now); osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
            gain.gain.setValueAtTime(0.05, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.start(now); osc.stop(now + 0.1);
        } else if (tipo === 'explosao') { // Exclusivo Fase 8
            osc.type = 'sawtooth'; osc.frequency.setValueAtTime(100, now); osc.frequency.exponentialRampToValueAtTime(10, now + 0.3);
            gain.gain.setValueAtTime(0.1, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            osc.start(now); osc.stop(now + 0.3);
        } else if (tipo === 'construir') { // Exclusivo Fase 8
            osc.type = 'square'; osc.frequency.setValueAtTime(300, now); osc.frequency.setValueAtTime(400, now + 0.1);
            gain.gain.setValueAtTime(0.05, now); gain.gain.linearRampToValueAtTime(0, now + 0.2);
            osc.start(now); osc.stop(now + 0.2);

        // ========================================================
        // EFEITOS DE INTERFACE E MENUS (NOVO)
        // ========================================================
        } else if (tipo === 'pausa_in') {
            // CONGELAMENTO: Som descendente
            osc.type = 'sine'; osc.frequency.setValueAtTime(400, now); osc.frequency.exponentialRampToValueAtTime(100, now + 0.25);
            gain.gain.setValueAtTime(0.08, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
            osc.start(now); osc.stop(now + 0.25);
        } else if (tipo === 'pausa_out') {
            // DESTRAVAR: Som ascendente e brilhante
            osc.type = 'sine'; osc.frequency.setValueAtTime(300, now); osc.frequency.exponentialRampToValueAtTime(800, now + 0.2);
            gain.gain.setValueAtTime(0, now); gain.gain.linearRampToValueAtTime(0.08, now + 0.05); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            osc.start(now); osc.stop(now + 0.2);
        } else if (tipo === 'ui_ocultar') {
            // DESLIZE: Passa um square wave grave por um filtro de abafamento
            const filtro = this.ctx.createBiquadFilter();
            filtro.type = 'lowpass'; filtro.frequency.setValueAtTime(800, now); filtro.frequency.linearRampToValueAtTime(100, now + 0.15);
            osc.type = 'square'; osc.frequency.setValueAtTime(150, now); osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);
            osc.disconnect(); osc.connect(filtro); filtro.connect(gain);
            gain.gain.setValueAtTime(0.05, now); gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
            osc.start(now); osc.stop(now + 0.15);
        } else if (tipo === 'ui_mostrar') {
            // POP: Bolha a aparecer ultra-rápida
            osc.type = 'sine'; osc.frequency.setValueAtTime(200, now); osc.frequency.exponentialRampToValueAtTime(700, now + 0.1);
            gain.gain.setValueAtTime(0, now); gain.gain.linearRampToValueAtTime(0.06, now + 0.02); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.start(now); osc.stop(now + 0.1);
        } else if (tipo === 'som_on') {
            // MARIMBA SUAVE: Duas notas graves e macias (E4 e A4)
            osc.type = 'sine';
            osc.frequency.setValueAtTime(329.63, now); // E4
            osc.frequency.setValueAtTime(440.00, now + 0.1); // Muda para A4
            // Envelope do primeiro toque
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.06, now + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
            // Envelope do segundo toque
            gain.gain.setValueAtTime(0, now + 0.1);
            gain.gain.linearRampToValueAtTime(0.06, now + 0.12);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            osc.start(now); osc.stop(now + 0.3);
        } else if (tipo === 'reiniciar') {
            // REWIND: Som de fita a rebobinar / varredura rápida
            osc.type = 'sawtooth'; 
            osc.frequency.setValueAtTime(200, now); 
            osc.frequency.exponentialRampToValueAtTime(800, now + 0.1); // Sobe rápido
            osc.frequency.exponentialRampToValueAtTime(100, now + 0.25); // Cai rápido
            gain.gain.setValueAtTime(0, now); 
            gain.gain.linearRampToValueAtTime(0.05, now + 0.05); 
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
            osc.start(now); osc.stop(now + 0.25);
        } else if (tipo === 'intro') {
            // UI BACK: Som suave de retrocesso (descendente)
            osc.type = 'triangle'; 
            osc.frequency.setValueAtTime(450, now); 
            osc.frequency.exponentialRampToValueAtTime(250, now + 0.2);
            gain.gain.setValueAtTime(0, now); 
            gain.gain.linearRampToValueAtTime(0.05, now + 0.02); 
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
            osc.start(now); osc.stop(now + 0.2);
        } else if (tipo === 'iniciar_jogo') {
            // START: Som de arranque enérgico (Power Up)
            osc.type = 'square'; 
            osc.frequency.setValueAtTime(150, now); 
            osc.frequency.exponentialRampToValueAtTime(600, now + 0.4); // Sobe de tom
            gain.gain.setValueAtTime(0, now); 
            gain.gain.linearRampToValueAtTime(0.05, now + 0.1); 
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
            osc.start(now); osc.stop(now + 0.4);
        } else if (tipo === 'sair') {
            // POWER DOWN: Som descendente para desligar/sair
            osc.type = 'sawtooth'; 
            osc.frequency.setValueAtTime(300, now); 
            osc.frequency.exponentialRampToValueAtTime(50, now + 0.3); // Cai de tom
            gain.gain.setValueAtTime(0, now); 
            gain.gain.linearRampToValueAtTime(0.05, now + 0.05); 
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            osc.start(now); osc.stop(now + 0.3);
        } else if (tipo === 'segredo') {
            // MÚSICA DE SEGREDO REVELADO: Jingle longo e mágico (1.5 segundos)
            osc.type = 'sine';
            const osc2 = this.ctx.createOscillator();
            const gain2 = this.ctx.createGain();
            osc2.type = 'triangle'; // Segunda voz mais brilhante
            osc2.connect(gain2); gain2.connect(this.ctx.destination);
            // Melodia subindo rapidamente em notas misteriosas
            osc.frequency.setValueAtTime(440.00, now);        // Nota A4
            osc.frequency.setValueAtTime(523.25, now + 0.15); // Nota C5
            osc.frequency.setValueAtTime(659.25, now + 0.3);  // Nota E5
            osc.frequency.setValueAtTime(783.99, now + 0.45); // Nota G5
            osc.frequency.setValueAtTime(1046.50, now + 0.6); // Nota C6 (Grito de triunfo)
            // A segunda voz entra no final para formar um acorde de glória
            osc2.frequency.setValueAtTime(523.25, now + 0.6); // C5
            osc2.frequency.setValueAtTime(659.25, now + 0.8); // E5
            // Envelope principal
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.06, now + 0.1);
            gain.gain.setValueAtTime(0.06, now + 0.6); // Segura o volume
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5); // Desvanece
            // Envelope da segunda voz
            gain2.gain.setValueAtTime(0, now);
            gain2.gain.linearRampToValueAtTime(0, now + 0.6); // Fica muda até ao fim
            gain2.gain.linearRampToValueAtTime(0.04, now + 0.7); // Entra de repente
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.5); // Desvanece
            osc.start(now); osc.stop(now + 1.5);
            osc2.start(now); osc2.stop(now + 1.5);
        } else if (tipo === 'fim_vitoria') {
            // FANFARRA DE VITÓRIA: Acorde maior arpejado (C5, E5, G5, C6)
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(523.25, now);        // C5
            osc.frequency.setValueAtTime(659.25, now + 0.15); // E5
            osc.frequency.setValueAtTime(783.99, now + 0.3);  // G5
            osc.frequency.setValueAtTime(1046.50, now + 0.45);// C6 (Triunfo)
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.08, now + 0.05);
            gain.gain.setValueAtTime(0.08, now + 0.6); // Mantém o volume em cima
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2); // Desvanece devagar
            osc.start(now); osc.stop(now + 1.2);
        } else if (tipo === 'fim_derrota') {
            // SUSPIRO TRISTE (Mais alto)
            osc.type = 'sine'; 
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(150, now + 0.6); 
            gain.gain.setValueAtTime(0, now);
            // AUMENTAMOS O VOLUME AQUI (de 0.1 para 0.5) PARA DAR MAIS IMPACTO AO SUSPIRO
            gain.gain.linearRampToValueAtTime(0.1, now + 0.1); 
            gain.gain.linearRampToValueAtTime(0.5, now + 0.6); // Mantém o volume alto durante o suspiro
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2); // Desvanece devagar
            osc.start(now); osc.stop(now + 1.2);
        } else if (tipo === 'fim_derrota_2') {
            // TROMBONE TRISTE: 3 notas graves descendo
            osc.type = 'sawtooth';
            // Nota 1
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.exponentialRampToValueAtTime(280, now + 0.3);
            // Nota 2
            osc.frequency.setValueAtTime(250, now + 0.3);
            osc.frequency.exponentialRampToValueAtTime(230, now + 0.6);
            // Nota 3 (Mais longa)
            osc.frequency.setValueAtTime(200, now + 0.6);
            osc.frequency.exponentialRampToValueAtTime(150, now + 1.2);
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.08, now + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);
            osc.start(now); osc.stop(now + 1.3);
        } else if (tipo === 'continuar') {
            // AVANÇAR/LEVEL UP: Ping brilhante de confirmação (Sobe uma Oitava)
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, now); // Nota A5
            osc.frequency.exponentialRampToValueAtTime(1760, now + 0.15); // Sobe rápido para A6
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.06, now + 0.02); // Ataque imediato
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25); // Desvanece rápido
            osc.start(now); osc.stop(now + 0.25);

        // Exclusivo Fase 8 - Sons mais específicos para o tema de cibersegurança,
        // que acho que não estavam sendo tratados aqui no script geral
        } else if (tipo === 'tiro_player') {
            osc.type = 'square'; osc.frequency.setValueAtTime(800, now); osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
            gain.gain.setValueAtTime(0.015, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
            osc.start(now); osc.stop(now + 0.1);
        } else if (tipo === 'tiro_inimigo') {
            osc.type = 'sawtooth'; osc.frequency.setValueAtTime(300, now); osc.frequency.exponentialRampToValueAtTime(100, now + 0.15);
            gain.gain.setValueAtTime(0.02, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
            osc.start(now); osc.stop(now + 0.15);
        } else if (tipo === 'moeda') {
            osc.type = 'sine'; osc.frequency.setValueAtTime(1200, now); osc.frequency.setValueAtTime(1600, now + 0.1);
            gain.gain.setValueAtTime(0.05, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
            osc.start(now); osc.stop(now + 0.2);
        } else if (tipo === 'deposito') {
            osc.type = 'triangle'; osc.frequency.setValueAtTime(400, now);
            gain.gain.setValueAtTime(0.05, now); gain.gain.linearRampToValueAtTime(0, now + 0.05);
            osc.start(now); osc.stop(now + 0.05);
        } else if (tipo === 'vazamento') {
            osc.type = 'sawtooth'; osc.frequency.setValueAtTime(150, now); osc.frequency.exponentialRampToValueAtTime(40, now + 0.3);
            gain.gain.setValueAtTime(0.08, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            osc.start(now); osc.stop(now + 0.3);
        } else if (tipo === 'sucesso') {
            osc.type = 'sine'; osc.frequency.setValueAtTime(440, now); osc.frequency.setValueAtTime(659, now + 0.1); osc.frequency.setValueAtTime(880, now + 0.2);
            gain.gain.setValueAtTime(0.05, now); gain.gain.linearRampToValueAtTime(0, now + 0.4);
            osc.start(now); osc.stop(now + 0.4);
        } else if (tipo === 'erro') {
            osc.type = 'square'; osc.frequency.setValueAtTime(200, now); osc.frequency.setValueAtTime(150, now + 0.2);
            gain.gain.setValueAtTime(0.08, now); gain.gain.linearRampToValueAtTime(0, now + 0.4);
            osc.start(now); osc.stop(now + 0.4);
        } else if (tipo === 'upgrade') {
            osc.type = 'sine'; osc.frequency.setValueAtTime(300, now); osc.frequency.linearRampToValueAtTime(800, now + 0.3);
            gain.gain.setValueAtTime(0.05, now); gain.gain.linearRampToValueAtTime(0, now + 0.4);
            osc.start(now); osc.stop(now + 0.4);
        }
    }
};

// ====================================================================================
// DESBLOQUEADOR GLOBAL DE ÁUDIO (Bypass de Autoplay) (PADRÃO OURO PARA ITCH.IO / MAC)
// Este código força o navegador a acordar o som no primeiro clique na tela
// ====================================================================================

const destravarAudio = () => {
    // Se o motor de áudio existir e estiver dormindo, acorda ele à força!
    if (AudioSys.ctx && AudioSys.ctx.state === 'suspended') {
        AudioSys.ctx.resume();
        // AudioSys.ctx.resume().then(() => {
        //     console.log("Áudio destravado com sucesso pelo clique!");
        // });
    }
};
// Captura o clique em QUALQUER lugar da página, antes mesmo de processar botões
window.addEventListener('click', destravarAudio, { capture: true, once: true });
window.addEventListener('touchstart', destravarAudio, { capture: true, once: true });

// ====================================================================================
// APLICAÇÃO GLOBAL DE TEMA (fallback para intro antes do clique em "iniciar")
// ====================================================================================
function aplicarTemaDoJogo() {
    if (typeof DADOS_JOGO !== 'undefined' && DADOS_JOGO.tema) {
        document.documentElement.style.setProperty('--cor-tema', DADOS_JOGO.tema.corPrincipal);
        document.documentElement.style.setProperty('--cor-tema-escuro', DADOS_JOGO.tema.corEscura);
        document.documentElement.style.setProperty('--cor-tema-claro', DADOS_JOGO.tema.corClara);

        // Verifica se o minijogo tem corFundo (como a Fase 8) antes de aplicar
        if (DADOS_JOGO.tema.corFundo) {
            document.documentElement.style.setProperty('--cor-fundo', DADOS_JOGO.tema.corFundo);
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', aplicarTemaDoJogo);
} else {
    aplicarTemaDoJogo();
}



// ============================================================================
// MOTOR GLOBAL (Funções comuns a todos os minijogos)
// ============================================================================
const GlobalEngine = {
    // =========================================================
    // INICIALIZAÇÃO BASE (Comum a todos os jogos) (O "Super()")
    // =========================================================
    iniciar: function(displayType = 'flex') {
        // 1. Áudio
        if (typeof AudioSys !== 'undefined') AudioSys.init();

        // Reforça o tema também no início do jogo (garante consistência em reinícios).
        aplicarTemaDoJogo();

        // 2. Limpeza de Interface Genérica
        const telaIntro = document.getElementById('tela-intro');
        const telaFim = document.getElementById('tela-fim');
        const telaPausa = document.getElementById('tela-pausa');
        const areaJogo = document.getElementById('area-jogo');
        const btnPausa = document.getElementById('btn-pausa');
        const toast = document.getElementById('toast-feedback');
        const alerta = document.getElementById('alerta-combo');

        // DETEÇÃO INTELIGENTE DE REINÍCIO OU INÍCIO
        if (telaIntro && telaIntro.classList.contains('oculto')) {
            // Oculto = Já estava a jogar, então é um RESTART
            if (typeof AudioSys !== 'undefined') AudioSys.tocar('reiniciar');
        } else {
            // Visível = Está na introdução, então é um START de verdade
            if (typeof AudioSys !== 'undefined') AudioSys.tocar('iniciar_jogo');
        }

        if (telaIntro) telaIntro.classList.add('oculto');
        if (telaFim) telaFim.classList.add('oculto');
        if (telaPausa) telaPausa.classList.add('oculto');
        if (toast) toast.classList.remove('show');
        if (alerta) alerta.classList.remove('show');
        
        if (btnPausa) btnPausa.innerText = "⏸️";
        if (areaJogo) {
            areaJogo.style.display = displayType; 
            areaJogo.classList.remove('pausado');
        }

        // Limpa os números flutuantes de pontuação (+10, -15) que ficaram na tela
        document.querySelectorAll('.floating-score').forEach(el => el.remove());

        // 3. Resets de Variáveis Universais
        this.pontuacao = 0;
        this.precisao = 0; // Zera a precisão para a Unity, que é calculada no final do jogo
        this.tempoToastRestante = 0;
        this.tempoAlertaRestante = 0;
        
        // 4. Modo Assistência e Tempo Restante
        const checkTempo = document.getElementById('check-tempo-extra');
        this.registroInvalido = checkTempo ? checkTempo.checked : false;

        if (typeof DADOS_JOGO !== 'undefined') {
            if (this.registroInvalido) {
                this.tempoRestante = Math.floor(DADOS_JOGO.tempoMaximo * 1.5);
            } else {
                this.tempoRestante = DADOS_JOGO.tempoMaximo;
            }
        }

        // 5. HUD Inicial
        if (this.atualizarHUD) this.atualizarHUD();

        // 6. Motor do Relógio
        this.jogoPausado = false;
        clearInterval(this.intervaloTempo);
        this.intervaloTempo = setInterval(() => this.tickTempo(), 1000);
    },

    // =========================================================
    // RELÓGIO BASE (Você pode apagar o tickTempo dos minijogos!)
    // =========================================================
    tickTempo: function() {
        if (this.jogoPausado) return;
        this.tempoRestante--;
        
        const hudTempo = document.getElementById('hud-tempo');
        if (hudTempo) hudTempo.innerText = `⏳ ${this.tempoRestante}s`;
        
        if (this.tempoToastRestante > 0) {
            this.tempoToastRestante--;
            if (this.tempoToastRestante <= 0) {
                const toast = document.getElementById('toast-feedback');
                if (toast) toast.classList.remove('show');
            }
        }
        
        if (this.tempoAlertaRestante > 0) {
            this.tempoAlertaRestante--;
            if (this.tempoAlertaRestante <= 0) {
                const alerta = document.getElementById('alerta-combo');
                if (alerta) alerta.classList.remove('show');
            }
        }

        // Se uma fase específica precisar de um relógio customizado (ex: nascer inimigos), ela cria um "tickLocal"
        if (this.tickLocal) this.tickLocal();

        if (this.tempoRestante <= 0) {
            this.tempoEsgotado(); // DELEGAÇÃO: O pai chama uma função para lidar com isto!
        }
    },

    // O PADRÃO GLOBAL: chamada para o encerrar do minijogo 9, por exemplo, que tem 2 parâmetros (passou: true/false, motivo: {...})
    // O encerrar do minijogo 1, por exemplo, tem apenas um parâmetro booleano com um significado diferente (fimTempo: true/false)
    // Portanto, cada minijogo implementa a função "tempoEsgotado" do seu jeito, e o tickTempo só chama esta função genérica aqui
    tempoEsgotado: function() {
        if (this.encerrar) this.encerrar(false, 'tempo');
    },

    // ------------------------------------------------------------------------
    // SISTEMA DE FIM DE JOGO UNIFICADO
    // ------------------------------------------------------------------------
    calcularPrecisao: function() {
        // Fórmula Padrão usada por quase todas as fases (Acertos / Jogados)
        if (this.totalJogados !== undefined && this.acertos !== undefined) {
            return Math.round((this.acertos / Math.max(1, this.totalJogados)) * 100);
        }
        return 100; // Fallback
    },

    encerrar: function(passou, motivo = null) {
        clearInterval(this.intervaloTempo);
        this.jogoPausado = true;

        let precisao = this.calcularPrecisao();
        this.precisao = precisao; // Armazena a precisão final para exibir no progresso da fase, no hub2d.html

        // Validação Universal de Meta de Aprovação
        if (passou && typeof DADOS_JOGO.metaAprovacao !== 'undefined' && precisao < DADOS_JOGO.metaAprovacao) {
            passou = false;
            motivo = 'meta';
        }

        let tituloText = "";
        let msgHtml = "";

        if (passou) {
            // Toca a fanfarra de vitória
            if (typeof AudioSys !== 'undefined') AudioSys.tocar('fim_vitoria');

            tituloText = DADOS_JOGO.interface.fimVitoriaTitulo;
            msgHtml = DADOS_JOGO.interface.fimVitoriaMsg;
        } else {
            // Toca o trombone triste
            if (typeof AudioSys !== 'undefined') AudioSys.tocar('fim_derrota');

            // Mapeamento automático dos motivos para os textos de DADOS_JOGO
            if (motivo === 'tempo') {
                tituloText = DADOS_JOGO.interface.fimDerrotaTempoTitulo;
                msgHtml = DADOS_JOGO.interface.fimDerrotaTempoMsg;
            } else if (motivo === 'meta' || motivo === 'precisao') {
                tituloText = DADOS_JOGO.interface.fimDerrotaMetaTitulo || "Precisão Baixa ❌";
                let baseMsg = DADOS_JOGO.interface.fimDerrotaMetaMsg || "Sua precisão foi insuficiente.";
                msgHtml = `${baseMsg} <br>Sua precisão foi de <strong>${precisao}%</strong> (Mínimo exigido: ${DADOS_JOGO.metaAprovacao}%).`;
            } else if (motivo === 'limite_erros') {
                tituloText = "Limite de Erros ❌";
                msgHtml = `O vazamento fugiu do controle após demasiadas ações incorretas.`; // A sua precisão caiu para <strong>${precisao}%</strong>.`;
                if (DADOS_JOGO.maxErros !== undefined) {
                    msgHtml = `Você cometeu <strong>${DADOS_JOGO.maxErros} erros</strong> e o vazamento fugiu do controle.`; // A sua precisão caiu para ${precisao}%.`;
                }
            } else if (motivo === 'player') {
                tituloText = DADOS_JOGO.interface.fimDerrotaPlayerTitulo;
                msgHtml = DADOS_JOGO.interface.fimDerrotaPlayerMsg;
            } else if (motivo === 'db') {
                tituloText = DADOS_JOGO.interface.fimDerrotaDBTitulo;
                msgHtml = DADOS_JOGO.interface.fimDerrotaDBMsg;
            } else {
                tituloText = "Falha ❌";
                msgHtml = "Você não atingiu os objetivos da fase.";
            }
        }

        this.renderizarTelaFim(passou, precisao, tituloText, msgHtml);
    },

    renderizarTelaFim: function(passou, precisao, tituloText, msgHtml) {
        // 1. Preenche Estatísticas
        const elTempo = document.getElementById('final-tempo');
        if (elTempo) elTempo.innerText = `${Math.max(0, this.tempoRestante)}s`;
        
        const elPontos = document.getElementById('final-pontos');
        if (elPontos) elPontos.innerText = this.pontuacao;
        
        const spanTaxa = document.getElementById('final-taxa');
        if (spanTaxa) {
            spanTaxa.innerText = `${precisao}%`;
            spanTaxa.style.color = passou ? "#2e7d32" : "#c62828";
        }

        // Hook para injetar dados específicos da fase (ex: 3/3 na Fase 9)
        if (this.atualizarEstatisticasFinais) this.atualizarEstatisticasFinais();

        // 2. Preenche Textos
        const titulo = document.getElementById('txt-fim-titulo');
        const msg = document.getElementById('txt-fim-msg');
        
        if (titulo) {
            titulo.innerText = tituloText;
            titulo.style.color = passou ? "var(--cor-tema-escuro)" : "#c62828";
        }
        
        if (msg) {
            msg.innerHTML = msgHtml;
            // AVISO GLOBAL DO TEMPO EXTRA
            if (passou && this.registroInvalido) {
                msg.innerHTML += "<br><span style='color: #d32f2f; font-size: 12px; font-weight: bold;'>⚠️ Tempo Extra Ativado: Este resultado não será registrado como recorde!</span>";
            }
        }

        // 3. Monta Botões
        const botoesFim = document.getElementById('botoes-fim');
        if (botoesFim) {
            if (passou) {
                botoesFim.innerHTML = `<button class="btn-acao" onclick="Engine.finalizarFase()">Continuar</button>`;
            } else {
                // botoesFim.innerHTML = `
                //     <button class="btn-acao" onclick="Engine.voltarAoMenu()">Tentar Novamente</button>
                //     <button class="btn-acao btn-secundario" onclick="Engine.cancelar()">Sair</button>
                // `;
                botoesFim.innerHTML = `
                    <button class="btn-acao" onclick="Engine.voltarAoMenu()">Tentar Novamente</button>
                    <button class="btn-acao btn-texto-discreto" onclick="Engine.cancelar()">Sair</button>
                `;
            }
        }

        // 4. Exibe Tela
        const areaJogo = document.getElementById('area-jogo');
        if (areaJogo) areaJogo.style.display = 'none';

        const toastFeedback = document.getElementById('toast-feedback');
        if (toastFeedback) toastFeedback.classList.remove('show');
        const alertaCombo = document.getElementById('alerta-combo');
        if (alertaCombo) alertaCombo.classList.remove('show');

        const telaFim = document.getElementById('tela-fim');
        if (telaFim) telaFim.classList.remove('oculto');
    },

    // ------------------------------------------------------------------------
    // FUNÇÕES DE UTILIDADE E HUD
    // ------------------------------------------------------------------------
    adicionarPontos: function(valor, isCombo, isGrave = false) {
        this.pontuacao = Math.max(0, this.pontuacao + valor);
        const hudPtsContainer = document.getElementById('hud-pontos-container');
        if (hudPtsContainer) {
            const floatEl = document.createElement('div');
            floatEl.className = 'floating-score' + (isCombo ? ' combo' : '') + (isGrave ? ' grave' : '') + (valor < 0 ? ' negativo' : '');
            floatEl.innerText = (valor > 0 ? '+' : '') + valor;
            hudPtsContainer.appendChild(floatEl);
            setTimeout(() => { floatEl.remove(); }, 1200);
        }
        this.atualizarHUD(true);
    },

    mostrarToast: function(tipo, mensagem) {
        const toast = document.getElementById('toast-feedback');
        if (!toast) return;
        toast.className = '';
        toast.classList.add(tipo === 'sucesso' ? 'sucesso' : 'erro');
        document.getElementById('toast-titulo').innerText = tipo === 'sucesso' ? "Correto ✅" : "Atenção 🛑";
        document.getElementById('toast-texto').innerText = mensagem;
        toast.classList.add('show');
        this.tempoToastRestante = 10;
        
        // NOVO: Evento para fechar imediatamente ao clicar
        toast.onclick = () => {
            if (this.jogoPausado) return; // PADRÃO OURO: Impede fechar se estiver pausado
            toast.classList.remove('show');
            this.tempoToastRestante = 0;
            
            // Se o alerta extra estiver na tela, some com ele também
            const alertaCombo = document.getElementById('alerta-combo');
            if (alertaCombo) alertaCombo.classList.remove('show');
            // if(this.alertaTimer) clearTimeout(this.alertaTimer);
            this.tempoAlertaRestante = 0;
        };
    },

    atualizarHUD: function(destacar = false) {
        const hudPtsContainer = document.getElementById('hud-pontos-container');
        const hudTempo = document.getElementById('hud-tempo');
        const hudPontos = document.getElementById('hud-pontos');
        
        if (hudTempo) hudTempo.innerText = `⏳ ${this.tempoRestante}s`;
        if (hudPontos) hudPontos.innerText = this.pontuacao; 
        
        if (destacar && hudPtsContainer) {
            hudPtsContainer.classList.remove('destaque');
            void hudPtsContainer.offsetWidth; 
            hudPtsContainer.classList.add('destaque');
        }
    },

    togglePausa: function() {
        // const areaJogo = document.getElementById('area-jogo');
        // if (this.tempoRestante <= 0 || !areaJogo || areaJogo.style.display === 'none') return;

        if (this.tempoRestante <= 0) return;

        const areaJogo = document.getElementById('area-jogo');
        // Trava apenas se a div existir E estiver invisível
        if (areaJogo && areaJogo.style.display === 'none') return;

        const btnPausa = document.getElementById('btn-pausa');
        const telaPausa = document.getElementById('tela-pausa');

        if (!this.jogoPausado) {
            this.jogoPausado = true;
            if (areaJogo) areaJogo.classList.add('pausado'); // Trava cliques no CSS
            clearInterval(this.intervaloTempo);

            if (btnPausa) btnPausa.innerText = "▶️";
            if (telaPausa) telaPausa.classList.remove('oculto');

            // Se estiver arrastando uma carta no momento da pausa, cancela o movimento
            if (this.abortarArraste) this.abortarArraste();

            if (typeof AudioSys !== 'undefined') AudioSys.tocar('pausa_in');
        } else {
            // =========================================================
            // NOVO: BARREIRA DO "OLHO" (Menu Oculto)
            // =========================================================
            if (btnPausa && btnPausa.classList.contains('destaque-pausa')) {
                // Remove o efeito de piscar/olho
                if (btnPausa) btnPausa.classList.remove('destaque-pausa');
                // Traz o menu de pausa de volta para a tela
                if (telaPausa) telaPausa.classList.remove('oculto');

                if (typeof AudioSys !== 'undefined') AudioSys.tocar('ui_mostrar');

                // return; // ABORTA A FUNÇÃO AQUI! O jogo continua pausado.
            } else { // usar o else fica melhor para o caso de aparecer mais codigo depois deste escopo, para não correr o risco de esquecer de tirar o return e travar o jogo no futuro.
                // =========================================================
                // DESPAUSAR NORMALMENTE (Se o menu já estava visível)
                // =========================================================
                this.jogoPausado = false;
                if (areaJogo) areaJogo.classList.remove('pausado');
                this.intervaloTempo = setInterval(() => this.tickTempo(), 1000); 

                if (btnPausa) {
                    btnPausa.innerText = "⏸️";
                    btnPausa.classList.remove('destaque-pausa'); // NOVO: Desliga a animação
                }
                if (telaPausa) telaPausa.classList.add('oculto');

                if (typeof AudioSys !== 'undefined') AudioSys.tocar('pausa_out');
            }
        }
    },
    
    esconderOverlayPausa: function() { 
        const telaPausa = document.getElementById('tela-pausa');
        if (telaPausa) telaPausa.classList.add('oculto');

        // NOVO: Destaca o botão play do HUD (faz ele "gritar")!
        const btnPausa = document.getElementById('btn-pausa');
        if (btnPausa) btnPausa.classList.add('destaque-pausa');

        // NOVO: Som de deslize suave
        if (typeof AudioSys !== 'undefined') AudioSys.tocar('ui_ocultar');
    },

    // cancelar: function() {
    //     if (window.parent && window.parent.AvisarCancelamento) window.parent.AvisarCancelamento(); 
    // },
    cancelar: function() {
        // Toca o som de desligar
        if (typeof AudioSys !== 'undefined') AudioSys.init();
        if (typeof AudioSys !== 'undefined') AudioSys.tocar('sair');

        // Aguarda o som tocar (300ms) antes de avisar o sistema pai para fechar
        setTimeout(() => {
            if (window.parent && window.parent.AvisarCancelamento) {
                window.parent.AvisarCancelamento(); 
            } else {
                // Fallback de segurança caso esteja testando fora do sistema pai
                window.location.href = '../index.html';
            }
        }, 300);
    },

    voltarAoMenu: function() { 
        const telaFim = document.getElementById('tela-fim');
        const telaPausa = document.getElementById('tela-pausa');
        const telaIntro = document.getElementById('tela-intro');
        const btnPausa = document.getElementById('btn-pausa');
        
        if (telaFim) telaFim.classList.add('oculto'); 
        if (telaPausa) telaPausa.classList.add('oculto'); 
        if (btnPausa) btnPausa.innerText = "⏸️";
        if (telaIntro) telaIntro.classList.remove('oculto');

        // Remove listener de resize se existir na fase (ex: Fase 9)
        if (this.handleResize) window.removeEventListener('resize', this.handleResize);

        if (typeof AudioSys !== 'undefined') AudioSys.tocar('intro');
    },

    finalizarFase: function() { 
        // TRATAMENTO INVISÍVEL DO MODO ASSISTÊNCIA
        if (this.registroInvalido) {
            console.log("Assistência ativa! Zerando envio de dados para o Banco/Unity.");
            this.pontuacao = 0;
            this.precisao = 0;
            this.tempoRestante = 0;
        }

        // Envia para a Unity
        // if (window.parent && window.parent.AvisarVitoria) window.parent.AvisarVitoria(this); 

        // Toca o som de continuar/avançar
        if (typeof AudioSys !== 'undefined') AudioSys.tocar('continuar');

        // Aguarda o som tocar (300ms) antes de avisar o sistema pai para fechar
        setTimeout(() => {
            if (window.parent && window.parent.AvisarVitoria) {
                window.parent.AvisarVitoria(this);
            } else {
                // Fallback de segurança caso esteja testando fora do sistema pai
                window.location.href = '../index.html';
            }
        }, 300);
    }
};