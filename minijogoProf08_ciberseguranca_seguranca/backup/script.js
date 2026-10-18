// ============================================================================
// REGRAS ESPECÍFICAS - FASE 8 (SEGURANÇA OPERACIONAL)
// ============================================================================



// ============================================================================
// 0. SPRITE GENERATOR (Deve ser a PRIMEIRA coisa do script!)
// ============================================================================
const SpriteHacker = (function() {
    const c = document.createElement('canvas');
    c.width = 40; c.height = 40;
    const ctx = c.getContext('2d');

    // 1. Contorno Claro (Formato de "Tecido" com Curvas Bezier)
    ctx.fillStyle = '#cfd8dc';
    ctx.beginPath();
    ctx.moveTo(2, 40); // Base esquerda
    ctx.quadraticCurveTo(10, 25, 10, 18); // Curva do ombro esquerdo
    ctx.bezierCurveTo(10, 0, 30, 0, 30, 18); // Dobra do topo do capuz
    ctx.quadraticCurveTo(30, 25, 38, 40); // Curva do ombro direito
    ctx.fill();

    // 2. Capuz Principal (Cinza-azulado)
    ctx.fillStyle = '#546e7a';
    ctx.beginPath();
    ctx.moveTo(4, 40);
    ctx.quadraticCurveTo(12, 28, 12, 18);
    ctx.bezierCurveTo(12, 3, 28, 3, 28, 18);
    ctx.quadraticCurveTo(28, 28, 36, 40);
    ctx.fill();

    // 3. Sombra interna (Gola do moletom para dar profundidade)
    ctx.fillStyle = '#37474f';
    ctx.beginPath();
    ctx.moveTo(10, 40);
    ctx.quadraticCurveTo(20, 22, 30, 40);
    ctx.fill();

    // 4. Rosto (Fundo escuro escondido no capuz)
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.arc(20, 20, 9, 0, Math.PI*2);
    ctx.fill();

    // // 5. Olhos Cyberpunk (Sua modificação com proporções ajustadas!)
    // ctx.fillStyle = '#ff1744';
    // ctx.shadowBlur = 10;
    // ctx.shadowColor = '#ff1744';
    // ctx.fillRect(13, 17, 4, 3); // Olho esquerdo
    // ctx.fillRect(23, 17, 4, 3); // Olho direito
    
    // // 6. Reflexo nos olhos
    // ctx.fillStyle = '#ffffff';
    // ctx.shadowBlur = 0; // Importante zerar o brilho para o reflexo ficar nítido
    // ctx.fillRect(14, 18, 1, 1);
    // ctx.fillRect(24, 18, 1, 1);

    // 5. Visor Cyberpunk (Brilho Neon Vermelho)
    ctx.fillStyle = '#ff1744';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ff1744';
    ctx.fillRect(10, 16, 20, 6); 
    
    // 6. Reflexo no visor (Detalhe branco)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(12, 18, 6, 2);
    ctx.fillRect(22, 18, 6, 2);
    ctx.shadowBlur = 0; // Limpa o brilho

    // Converte para Imagem Usável
    const url = c.toDataURL(); 
    const img = new Image();
    img.src = url;             
    
    return { url: url, img: img };
})();

document.getElementById('img-tut-hacker').src = SpriteHacker.url;

// SPRITE DO DEFENSOR (Escudo)
const SpritePlayer = (function() {
    const c = document.createElement('canvas');
    c.width = 40; c.height = 40;
    const ctx = c.getContext('2d');
    
    // Base metálica do escudo
    ctx.fillStyle = '#90a4ae';
    ctx.beginPath();
    ctx.moveTo(20, 2); ctx.lineTo(36, 8); ctx.lineTo(36, 20);
    ctx.bezierCurveTo(36, 32, 20, 38, 20, 38);
    ctx.bezierCurveTo(20, 38, 4, 32, 4, 20);
    ctx.lineTo(4, 8); ctx.fill();
    
    // Miolo azul brilhante
    ctx.fillStyle = '#4fc3f7';
    ctx.beginPath();
    ctx.moveTo(20, 6); ctx.lineTo(32, 11); ctx.lineTo(32, 20);
    ctx.bezierCurveTo(32, 29, 20, 34, 20, 34);
    ctx.bezierCurveTo(20, 34, 8, 29, 8, 20);
    ctx.lineTo(8, 11); ctx.fill();

    const url = c.toDataURL();
    const img = new Image();
    img.src = url;

    return { url: url, img: img }; // Retorna ambos perfeitamente
})();

// SPRITE DO BANCO DE DADOS (Rack de Servidor)
const SpriteBase = (function() {
    const c = document.createElement('canvas');
    c.width = 60; c.height = 80;
    const ctx = c.getContext('2d');
    
    // Estrutura do Servidor
    ctx.fillStyle = '#37474f'; ctx.fillRect(10, 10, 40, 60);
    ctx.fillStyle = '#263238'; ctx.fillRect(15, 15, 30, 15); ctx.fillRect(15, 35, 30, 15); ctx.fillRect(15, 55, 30, 10);
    
    // Luzes piscando
    ctx.fillStyle = '#4caf50'; ctx.fillRect(20, 20, 4, 4); ctx.fillRect(20, 40, 4, 4);
    ctx.fillStyle = '#ffeb3b'; ctx.fillRect(28, 20, 4, 4);
    ctx.fillStyle = '#f44336'; ctx.fillRect(36, 40, 4, 4);

    const url = c.toDataURL();
    const img = new Image();
    img.src = url;

    return { url: url, img: img };
})();

// Sincroniza os ícones do tutorial com o novo visual do jogo
window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.t1-player, .t2-player, .t3-player').forEach(el => {
        el.innerText = ''; // Remove o emoji antigo 🛡️
        el.style.backgroundImage = `url(${SpritePlayer.url})`;
        el.style.width = '40px';
        el.style.height = '40px';
        el.style.backgroundSize = 'contain';
        el.style.backgroundRepeat = 'no-repeat';
        el.style.backgroundPosition = 'center';
    });
});



// ============================================================================
// 1. DICIONÁRIO DE TEXTOS E DADOS (Padrão Ouro)
// ============================================================================
const DADOS_JOGO = {
    tema: {
        corPrincipal: "#512da8", // Roxo
        corEscura: "#311b92", 
        corClara: "#ede7f6",
        corFundo: "#0d1117" // Fundo Dark Mode
    },

    tempoMaximo: 120, // Segundos
    metaAprovacao: 75, // Integrado para funcionar com o GlobalEngine!
    limiteDanoBase: 25, // % Máximo que o DB pode perder
    custoSlot: 10, // Tokens para ativar/upgrade
    margemCamera: 0.35, // 35% de deadzone da câmera
    
    alcanceTiroPlayer: 350, // Distância em pixels
    alcanceTiroInimigo: 300, // Distância em pixels

    recuperacaoVidaPlayer: 30, // % de vida recuperada ao pegar o coração
    killsParaVida: 10, // Hackers necessários para dropar o coração

    interface: {
        introTitulo: "Fase 8: Segurança Operacional",
        // introDesc: "Hackers 💀🥷👾🕷️ estão atacando o Banco de Dados 💾. Tenha cuidado com os ataques enquanto tenta derrotar os inimigos.",
        // introDesc: "Hackers <span class='hacker-icon-ui'></span> estão atacando o Banco de Dados 🗄️. Tenha cuidado com os ataques enquanto tenta derrotar os inimigos.",
        // introDesc: "Hackers 💀 estão atacando o Banco de Dados 🗄️. Tenha cuidado com os ataques enquanto tenta derrotar os inimigos.",
        // introDesc: `Hackers <img src='${SpriteHacker.url}' style='width: 18px; vertical-align: middle; margin: 0 4px;'> estão atacando o Banco de Dados 🗄️. Tenha cuidado com os ataques enquanto tenta derrotar os inimigos.`,
        introDesc: `Hackers estão atacando o Banco de Dados. Tenha cuidado com os ataques enquanto tenta derrotar os inimigos.`,
        introDefinCurta: "<strong>Como jogar:</strong> Clique aqui para ler as instruções detalhadas.",
        // introDefin: "<strong>🕹️ Movimentação:</strong> Clique ou toque em <em>qualquer lugar</em> da tela e arraste para criar um joystick. O Defensor 🛡️ se moverá na direção do seu dedo/mouse e atirará automaticamente ao se aproximar de um inimigo. Solte para parar. Um novo clique ou toque pode ser realizado novamente em <em>qualquer lugar</em> da tela. <br><br><strong>🎯 Missão:</strong> Proteja o Banco de Dados 🗄️! Derrote hackers <span class='hacker-icon-ui'></span> para soltar moedas 💠. Colete-as e encoste nos Slots ⭕ para depositá-las. Ao encher um slot, responda corretamente ao quiz de segurança para instalar ou melhorar suas defesas (até Lv 3)!",
        // introDefin: "<strong>🕹️ Movimentação:</strong> Clique ou toque em <em>qualquer lugar</em> da tela e arraste para criar um joystick. O Defensor 🛡️ se moverá na direção do seu dedo/mouse e atirará automaticamente ao se aproximar de um inimigo. Solte para parar. Um novo clique ou toque pode ser realizado novamente em <em>qualquer lugar</em> da tela. <br><br><strong>🎯 Missão:</strong> Proteja o Banco de Dados 🗄️! Derrote hackers 💀 para soltar moedas 💠. Colete-as e encoste nos Slots ⭕ para depositá-las. Ao encher um slot, responda corretamente ao quiz de segurança para instalar ou melhorar suas defesas (até Lv 3)!",
        introDefin: `<strong>🕹️ Movimentação:</strong> Clique ou toque em <em>qualquer lugar</em> da tela e arraste para criar um joystick. O Defensor 🛡️ se moverá na direção do seu dedo/mouse e atirará automaticamente ao se aproximar de um inimigo. Solte para parar. Um novo clique ou toque pode ser realizado novamente em <em>qualquer lugar</em> da tela. <br><br><strong>🎯 Missão:</strong> Proteja o Banco de Dados 🗄️! Derrote hackers <img src='${SpriteHacker.url}' style='width: 18px; vertical-align: middle; margin: 0 4px;'> para soltar moedas 💠. Colete-as e encoste nos Blocos ⭕ para depositá-las. Ao completar um bloco, responda corretamente ao quiz de segurança para instalar ou melhorar suas defesas (até Lv 3)!`,
        // introDica: "Controle a direção de movimento do Defensor 🛡️, colete Tokens 💠 e deposite-os nos Slots ⭕ para instalar ou melhorar Firewalls (até Lv 3).",
        introDica: "", // Deixado vazio pois a explicação acima já cobre tudo
        introMeta: "Meta: Sobreviver ao tempo (ou ativar o nível máximo de todos os blocos) mantendo o Banco com mais de 75% de integridade.",

        quizTitulo: "Auditoria de Segurança",
        // quizDesc: "Identifique a <strong>Conduta Correta de Segurança</strong> para realizar a Instalação/Upgrade do Firewall. Errar causará um downgrade ou ativará um Vírus!",
        quizDesc: "Você precisa escolher a atitude mais segura para proteger as informações dos pacientes.<BR>⚠️ Atenção: escolher uma atitude insegura pode causar problemas no sistema, perda de dados ou invasão por vírus.",

        fimVitoriaTitulo: "Sistema Protegido! ✅",
        fimVitoriaMsg: "Excelente trabalho! Você neutralizou os acessos indevidos e implementou políticas sólidas de segurança.",
        fimDerrotaDBTitulo: "Vazamento em Massa! ❌",
        fimDerrotaDBMsg: "As defesas caíram. Os hackers ultrapassaram a tolerância e vazaram dados sensíveis.",
        fimDerrotaPlayerTitulo: "Defensor Neutralizado! ❌",
        fimDerrotaPlayerMsg: "Você sofreu muitos ataques e foi desativado. A rede ficou totalmente desprotegida.",
        
        baseLegal: "<strong>⚖️ Art. 46 e 50 da LGPD:</strong> A proteção de dados exige a implementação de medidas de segurança técnicas e administrativas, bem como governança da informação."
    },
    
    praticasBoas: [
        "Criptografar o banco de dados",
        "Exigir senhas fortes e exclusivas",
        "Treinar a equipe sobre proteção de dados",
        "Restringir acesso a dados sensíveis",
        "Fazer backups regulares criptografados",
        "Atualizar sistemas e antivírus constantemente",
        "Criar política de resposta a incidentes",
        "Descartar documentos físicos com segurança",
        "Registrar logs de acesso aos sistemas"
    ],
    praticasMas: [
        "Compartilhar senhas de acesso",
        "Desativar antivírus para ganhar velocidade",
        "Enviar dados de pacientes por mensagens",
        "Anotar senhas em papéis ou post-its",
        "Permitir acesso total a qualquer funcionário",
        "Salvar backups na mesma máquina",
        "Usar senhas fáceis de adivinhar",
        // "Descartar exames no lixo comum",
        "Deixar o computador desbloqueado ao sair"
    ]
};

// Aplica o Tema CSS
// document.documentElement.style.setProperty('--cor-tema', DADOS_JOGO.tema.corPrincipal);
// document.documentElement.style.setProperty('--cor-tema-escuro', DADOS_JOGO.tema.corEscura);
// document.documentElement.style.setProperty('--cor-tema-claro', DADOS_JOGO.tema.corClara);
// document.documentElement.style.setProperty('--cor-fundo', DADOS_JOGO.tema.corFundo);

// ============================================================================
// CARREGAMENTO DO HTML (Textos)
// ============================================================================
// Aplica Textos na UI
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('txt-intro-titulo').innerText = DADOS_JOGO.interface.introTitulo;
    document.getElementById('txt-intro-desc').innerHTML = DADOS_JOGO.interface.introDesc;
    document.getElementById('render-defin-curta').innerHTML = DADOS_JOGO.interface.introDefinCurta;
    document.getElementById('render-defin-longa').innerHTML = DADOS_JOGO.interface.introDefin;
    document.getElementById('render-defin-longa').innerHTML += "<br><br>"; // Espaço extra para evitar que o texto longo interfira visualmente com o "Retrair texto"
    document.getElementById('txt-intro-dica').innerText = DADOS_JOGO.interface.introDica;
    document.getElementById('txt-intro-meta').innerText = DADOS_JOGO.interface.introMeta;
    document.getElementById('txt-quiz-titulo').innerText = DADOS_JOGO.interface.quizTitulo;
    document.getElementById('txt-quiz-desc').innerHTML = DADOS_JOGO.interface.quizDesc;
    document.getElementById('txt-fim-lei').innerHTML = DADOS_JOGO.interface.baseLegal;
});



// ============================================================================
// 2. SISTEMA DO CANVAS (Variáveis Globais do Motor Físico)
// ============================================================================
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
let width, height;

const WORLD_SIZE = 2500; 
const CAMERA = { x: 0, y: 0 };
const INPUT = { isDragging: false, startX: 0, startY: 0, currentX: 0, currentY: 0 };
const JOYSTICK_MAX_RADIUS = 40;

function resize() {
    width = window.innerWidth; height = window.innerHeight;
    canvas.width = width; canvas.height = height;
}
window.addEventListener('resize', resize); resize();

function handlePointerDown(e) {
    INPUT.isDragging = true;
    let cx = e.touches ? e.touches[0].clientX : e.clientX;
    let cy = e.touches ? e.touches[0].clientY : e.clientY;
    INPUT.startX = cx; INPUT.startY = cy;
    INPUT.currentX = cx; INPUT.currentY = cy;
}
function handlePointerMove(e) {
    if(!INPUT.isDragging) return;
    INPUT.currentX = e.touches ? e.touches[0].clientX : e.clientX;
    INPUT.currentY = e.touches ? e.touches[0].clientY : e.clientY;
}
function handlePointerUp() { INPUT.isDragging = false; }

canvas.addEventListener('mousedown', handlePointerDown);
canvas.addEventListener('mousemove', handlePointerMove);
window.addEventListener('mouseup', handlePointerUp);
canvas.addEventListener('touchstart', (e) => { e.preventDefault(); handlePointerDown(e); }, {passive:false});
canvas.addEventListener('touchmove', (e) => { e.preventDefault(); handlePointerMove(e); }, {passive:false});
window.addEventListener('touchend', handlePointerUp);

const dist = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1);
const getAngle = (x1, y1, x2, y2) => Math.atan2(y2 - y1, x2 - x1);



// ============================================================================
// 3. CLASSES DAS ENTIDADES
// ============================================================================
class Base {
    constructor() {
        this.x = WORLD_SIZE / 2; this.y = WORLD_SIZE / 2;
        this.maxHp = 1000; this.hp = 1000; this.radius = 70;
    }
    // draw() {
    //     ctx.save(); ctx.translate(this.x, this.y);
    //     // ctx.font = "80px Arial"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    //     // Força o navegador a calcular o centro usando a fonte de emoji específica do sistema
    //     ctx.font = "80px 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', Arial"; 
    //     ctx.textAlign = "center"; ctx.textBaseline = "middle";
    //     // ctx.fillText("💾", 0, 0);
    //     ctx.fillText("🗄️", 0, 0);
        
    //     ctx.beginPath(); ctx.arc(0, 0, this.radius + 20 + Math.sin(Date.now()/200)*10, 0, Math.PI*2);
    //     ctx.fillStyle = `rgba(81, 45, 168, ${this.hp/this.maxHp * 0.2})`; ctx.fill();
        
    //     ctx.fillStyle = "white"; ctx.font="bold 14px Arial"; ctx.fillText("Banco de Dados", 0, -60);
        
    //     ctx.fillStyle = "red"; ctx.fillRect(-35, 60, 70, 6);
    //     ctx.fillStyle = "#4caf50"; ctx.fillRect(-35, 60, 70 * (this.hp/this.maxHp), 6);
    //     ctx.strokeStyle = "white"; ctx.lineWidth = 1; ctx.strokeRect(-35, 60, 70, 6);
    //     ctx.restore();
    // }
    draw() {
        ctx.save(); ctx.translate(this.x, this.y);
        
        // Desenha a imagem perfeitamente centralizada
        ctx.drawImage(SpriteBase.img, -30, -40, 60, 80);
        
        ctx.beginPath(); ctx.arc(0, 0, this.radius + 20 + Math.sin(Date.now()/200)*10, 0, Math.PI*2);
        ctx.fillStyle = `rgba(81, 45, 168, ${this.hp/this.maxHp * 0.2})`; ctx.fill();
        
        ctx.fillStyle = "white"; ctx.font="bold 14px Arial"; ctx.textAlign = "center"; ctx.fillText("Banco de Dados", 0, -50);
        
        ctx.fillStyle = "red"; ctx.fillRect(-35, 60, 70, 6);
        ctx.fillStyle = "#4caf50"; ctx.fillRect(-35, 60, 70 * (this.hp/this.maxHp), 6);
        ctx.strokeStyle = "white"; ctx.lineWidth = 1; ctx.strokeRect(-35, 60, 70, 6);
        ctx.restore();
    }
}

class Player {
    constructor() {
        this.x = WORLD_SIZE / 2; this.y = WORLD_SIZE / 2 + 150;
        this.radius = 20; this.speed = 280; 
        this.maxHp = 100; this.hp = 100;
        this.tokens = 0; this.fireRate = 0.35; this.lastFire = 0; 
        this.range = DADOS_JOGO.alcanceTiroPlayer;
    }
    update(dt) {
        if (INPUT.isDragging) {
            let dx = INPUT.currentX - INPUT.startX;
            let dy = INPUT.currentY - INPUT.startY;
            let d = Math.hypot(dx, dy);
            
            if (d > 5) {
                let force = Math.min(d, JOYSTICK_MAX_RADIUS) / JOYSTICK_MAX_RADIUS; // Analógico
                let angle = Math.atan2(dy, dx);
                this.x += Math.cos(angle) * this.speed * force * dt;
                this.y += Math.sin(angle) * this.speed * force * dt;
            }
        }

        if(this.x < 0) this.x = 0; if(this.x > WORLD_SIZE) this.x = WORLD_SIZE;
        if(this.y < 0) this.y = 0; if(this.y > WORLD_SIZE) this.y = WORLD_SIZE;

        this.lastFire -= dt;
        if (this.lastFire <= 0) {
            let target = null; let minDist = this.range;
            Engine.inimigos.forEach(e => {
                let ed = dist(this.x, this.y, e.x, e.y);
                if(ed < minDist) { minDist = ed; target = e; }
            });
            if (target) {
                let angle = getAngle(this.x, this.y, target.x, target.y);
                Engine.projeteis.push(new Projectile(this.x, this.y, angle, true, 20));
                this.lastFire = this.fireRate;
                AudioSys.tocar('tiro_player');
            }
        }
    }
    // draw() {
    //     ctx.save(); ctx.translate(this.x, this.y);
    //     // ctx.font = "40px Arial"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    //     // Força o navegador a calcular o centro usando a fonte de emoji específica do sistema
    //     ctx.font = "40px 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', Arial"; 
    //     ctx.textAlign = "center"; ctx.textBaseline = "middle";
    //     ctx.fillText("🛡️", 0, 0);
        
    //     ctx.fillStyle = "red"; ctx.fillRect(-25, 30, 50, 5);
    //     ctx.fillStyle = "#4fc3f7"; ctx.fillRect(-25, 30, 50 * (this.hp/this.maxHp), 5);
    //     ctx.strokeStyle = "black"; ctx.lineWidth = 1; ctx.strokeRect(-25, 30, 50, 5);

    //     for(let i=0; i<Math.min(this.tokens, 15); i++) {
    //         ctx.fillStyle = "#81d4fa"; ctx.fillRect(25, 10 - (i*4), 10, 4);
    //         ctx.strokeStyle = "#0288d1"; ctx.strokeRect(25, 10 - (i*4), 10, 4);
    //     }
    //     ctx.restore();
    // }
    draw() {
        ctx.save(); ctx.translate(this.x, this.y);
        
        // Desenha o escudo
        ctx.drawImage(SpritePlayer.img, -20, -20, 40, 40);
        
        ctx.fillStyle = "red"; ctx.fillRect(-25, 30, 50, 5);
        ctx.fillStyle = "#4fc3f7"; ctx.fillRect(-25, 30, 50 * (this.hp/this.maxHp), 5);
        ctx.strokeStyle = "black"; ctx.lineWidth = 1; ctx.strokeRect(-25, 30, 50, 5);

        for(let i=0; i<Math.min(this.tokens, 15); i++) {
            ctx.fillStyle = "#81d4fa"; ctx.fillRect(25, 10 - (i*4), 10, 4);
            ctx.strokeStyle = "#0288d1"; ctx.strokeRect(25, 10 - (i*4), 10, 4);
        }
        ctx.restore();
    }
}

class Enemy {
    constructor(x, y) {
        this.x = x; this.y = y; this.radius = 20;
        this.hp = 30; this.speed = 100 + Math.random()*50;
        this.fireRate = 2.0 + Math.random()*2; this.lastFire = this.fireRate;
        this.meleeCooldown = 0;
    }
    update(dt) {
        let dBase = dist(this.x, this.y, Engine.base.x, Engine.base.y);
        let angle = getAngle(this.x, this.y, Engine.base.x, Engine.base.y);
        
        if (dBase > Engine.base.radius + 15) {
            this.x += Math.cos(angle) * this.speed * dt;
            this.y += Math.sin(angle) * this.speed * dt;
        } else {
            this.meleeCooldown -= dt;
            if (this.meleeCooldown <= 0) {
                Engine.base.hp -= 15; 
                Engine.adicionarPontos(-5, false, true); 
                Engine.createLeakEffect(this.x, this.y); 
                this.meleeCooldown = 2.0; 
            }
        }

        this.lastFire -= dt;
        if (this.lastFire <= 0) {
            let dPlayer = dist(this.x, this.y, Engine.player.x, Engine.player.y);
            if (dPlayer < DADOS_JOGO.alcanceTiroInimigo) { 
                let aPlayer = getAngle(this.x, this.y, Engine.player.x, Engine.player.y);
                Engine.projeteis.push(new Projectile(this.x, this.y, aPlayer, false, 10));
                this.lastFire = this.fireRate;
                AudioSys.tocar('tiro_inimigo');
            }
        }
    }
    // draw() {
    //     ctx.save(); ctx.translate(this.x, this.y);
    //     ctx.font = "30px Arial"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    //     // ctx.fillText("💀🥷👾🕷️", 0, 0);
    //     ctx.fillText("💀", 0, 0);
    //     ctx.fillStyle = "#555"; ctx.fillRect(-15, -25, 30, 4);
    //     ctx.fillStyle = "#ff5252"; ctx.fillRect(-15, -25, 30 * (this.hp/30), 4);
    //     ctx.restore();
    // }
    draw() {
        ctx.save(); 
        ctx.translate(this.x, this.y);
        
        // Carimba a imagem exata gerada no início (tamanho 40x40 centralizado)
        ctx.drawImage(SpriteHacker.img, -20, -20, 40, 40);

        // Desenha a Barra de Vida em cima
        ctx.fillStyle = "#555"; ctx.fillRect(-15, -25, 30, 4);
        ctx.fillStyle = "#ff5252"; ctx.fillRect(-15, -25, 30 * (this.hp/30), 4);
        
        ctx.restore();
    }
    // draw() {
    //     ctx.save(); 
    //     ctx.translate(this.x, this.y);
        
    //     // 1. Corpo escuro do Hacker/Vírus (Círculo Nativo)
    //     ctx.beginPath();
    //     ctx.arc(0, 0, 16, 0, Math.PI * 2);
    //     ctx.fillStyle = "#212121"; 
    //     ctx.fill();
    //     ctx.strokeStyle = "#ff5252"; 
    //     ctx.lineWidth = 2;
    //     ctx.stroke();

    //     // 2. "Olho" do Vírus (brilhante)
    //     ctx.beginPath();
    //     ctx.arc(0, 0, 6, 0, Math.PI * 2);
    //     ctx.fillStyle = "#ff5252";
    //     ctx.shadowBlur = 10;
    //     ctx.shadowColor = "#ff5252";
    //     ctx.fill();
    //     ctx.shadowBlur = 0; // Limpa o brilho para não afetar outras coisas

    //     // 3. Barra de Vida do Inimigo
    //     ctx.fillStyle = "#555"; ctx.fillRect(-15, -25, 30, 4);
    //     ctx.fillStyle = "#ff5252"; ctx.fillRect(-15, -25, 30 * (this.hp/30), 4);
        
    //     ctx.restore();
    // }
}

class Projectile {
    constructor(x, y, angle, isPlayer, damage, color="#4fc3f7") {
        this.x = x; this.y = y; this.vx = Math.cos(angle) * 600; this.vy = Math.sin(angle) * 600;
        this.isPlayer = isPlayer; this.damage = damage; this.radius = 5; this.life = 1.5; 
        this.color = isPlayer ? color : "#ff5252";
    }
    update(dt) { this.x += this.vx * dt; this.y += this.vy * dt; this.life -= dt; }
    draw() {
        ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fillStyle = this.color; ctx.shadowBlur = 10; ctx.shadowColor = this.color; 
        ctx.fill(); ctx.shadowBlur = 0;
    }
}

class Drop {
    constructor(x, y) { this.x = x; this.y = y; this.radius = 15; this.life = 15.0; }
    update(dt) {
        this.life -= dt;
        let d = dist(this.x, this.y, Engine.player.x, Engine.player.y);
        if (d < 180) { 
            let pull = 600; 
            let angle = getAngle(this.x, this.y, Engine.player.x, Engine.player.y);
            this.x += Math.cos(angle) * pull * dt;
            this.y += Math.sin(angle) * pull * dt;
        }
        
        d = dist(this.x, this.y, Engine.player.x, Engine.player.y);
        if (d < Engine.player.radius + this.radius) {
            Engine.player.tokens++;
            AudioSys.tocar('moeda');
            this.life = -1; 
        }
    }
    draw() {
        if(this.life < 2 && Math.floor(this.life*10)%2===0) return; 
        ctx.save(); ctx.translate(this.x, this.y);
        ctx.font = "20px Arial"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("💠", 0, Math.sin(Date.now()/150)*5); 
        ctx.restore();
    }
}

class HealthDrop {
    constructor(x, y) { this.x = x; this.y = y; this.radius = 15; this.life = 15.0; }
    update(dt) {
        this.life -= dt;
        let d = dist(this.x, this.y, Engine.player.x, Engine.player.y);
        if (d < 180) { 
            let pull = 600; 
            let angle = getAngle(this.x, this.y, Engine.player.x, Engine.player.y);
            this.x += Math.cos(angle) * pull * dt;
            this.y += Math.sin(angle) * pull * dt;
        }
        
        d = dist(this.x, this.y, Engine.player.x, Engine.player.y);
        if (d < Engine.player.radius + this.radius) {
            Engine.player.hp = Math.min(Engine.player.maxHp, Engine.player.hp + Engine.player.maxHp * (DADOS_JOGO.recuperacaoVidaPlayer / 100));
            AudioSys.tocar('sucesso');
            this.life = -1; 
        }
    }
    draw() {
        if(this.life < 2 && Math.floor(this.life*10)%2===0) return; 
        ctx.save(); ctx.translate(this.x, this.y);
        ctx.font = "20px Arial"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("❤️", 0, Math.sin(Date.now()/150)*5); 
        ctx.restore();
    }
}

class TransferToken {
    constructor(sx, sy, targetSlot) {
        this.x = sx; this.y = sy; this.target = targetSlot; this.speed = 500;
    }
    update(dt) {
        let d = dist(this.x, this.y, this.target.x, this.target.y);
        if (d < 15) { this.target.receiveToken(); return true; } 
        let a = getAngle(this.x, this.y, this.target.x, this.target.y);
        this.x += Math.cos(a) * this.speed * dt; this.y += Math.sin(a) * this.speed * dt;
        return false;
    }
    draw() { ctx.font = "15px Arial"; ctx.fillText("💠", this.x, this.y); }
}

class Slot {
    constructor(x, y) {
        this.x = x; this.y = y; this.radius = 50;
        this.state = 'empty'; 
        this.level = 1;
        this.tokens = 0; this.maxTokens = DADOS_JOGO.custoSlot;
        this.fireRate = 0.8; this.lastFire = 0; this.damage = 15;
        this.spawnRate = 4.0; this.lastSpawn = 0;
        this.depositCooldown = 0;
    }
    update(dt) {
        let d = dist(this.x, this.y, Engine.player.x, Engine.player.y);
        if (d < this.radius + Engine.player.radius && Engine.player.tokens > 0 && !(this.state === 'tower' && this.level >= 3)) {
            this.depositCooldown -= dt; 
            if (this.depositCooldown <= 0) {
                Engine.player.tokens--;
                Engine.transferTokens.push(new TransferToken(Engine.player.x, Engine.player.y, this));
                this.depositCooldown = 0.1; 
            }
        }

        if (this.state === 'tower') {
            this.lastFire -= dt;
            if (this.lastFire <= 0) {
                let target = Engine.inimigos.find(e => dist(this.x, this.y, e.x, e.y) < 450);
                if (target) {
                    let color = this.level === 1 ? "#81c784" : (this.level === 2 ? "#4caf50" : "#ffeb3b");
                    Engine.projeteis.push(new Projectile(this.x, this.y, getAngle(this.x, this.y, target.x, target.y), true, this.damage, color));
                    this.lastFire = this.fireRate;
                    AudioSys.tocar('tiro_player');
                }
            }
        } else if (this.state === 'spawner') {
            this.lastSpawn -= dt;
            if (this.lastSpawn <= 0) {
                Engine.inimigos.push(new Enemy(this.x + (Math.random()-0.5)*20, this.y + (Math.random()-0.5)*20));
                this.lastSpawn = this.spawnRate;
            }
        }
    }
    receiveToken() {
        this.tokens++;
        AudioSys.tocar('deposito');
        if (this.tokens >= this.maxTokens) {
            Engine.abrirQuiz(this);
        }
    }
    draw() {
        ctx.save(); ctx.translate(this.x, this.y);
        if (this.state === 'empty') {
            ctx.beginPath(); ctx.arc(0, 0, this.radius, 0, Math.PI*2);
            ctx.strokeStyle = "rgba(255,255,255,0.2)"; ctx.setLineDash([5, 5]); ctx.lineWidth = 2; ctx.stroke();
            ctx.fillStyle = "white"; ctx.font = "bold 14px Arial"; ctx.textAlign="center";
            ctx.fillText(`⭕ BLOCO`, 0, -10);
            ctx.fillStyle = "#81d4fa"; ctx.fillText(`${this.tokens}/${this.maxTokens} 💠`, 0, 15);
        } else if (this.state === 'tower') {
            ctx.font = "50px Arial"; ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.fillText("📡", 0, 0);
            for(let i=1; i<=this.level; i++) {
                ctx.beginPath(); ctx.arc(0, 0, 30 + (i*10), 0, Math.PI*2);
                ctx.strokeStyle = i===3 ? "#ffeb3b" : "#4caf50"; ctx.setLineDash([]); ctx.lineWidth = 2; ctx.stroke();
            }
            ctx.fillStyle = "#4caf50"; ctx.beginPath(); ctx.arc(0, 45, 15, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = "white"; ctx.font="bold 10px Arial"; ctx.fillText(`LVL ${this.level}`, 0, 45);
            if (this.level < 3 && this.tokens > 0) {
                ctx.fillStyle = "#81d4fa"; ctx.fillText(`${this.tokens}/${this.maxTokens}💠`, 0, 65);
            }
        } else if (this.state === 'spawner') {
            ctx.font = "50px Arial"; ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.fillText("⚠️", 0, 0);
            ctx.fillStyle = "#d32f2f"; ctx.beginPath(); ctx.arc(0, 40, 15, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = "white"; ctx.font="bold 10px Arial"; ctx.fillText("VÍRUS", 0, 40);
            if (this.tokens > 0) {
                ctx.fillStyle = "#81d4fa"; ctx.fillText(`${this.tokens}/${this.maxTokens}💠`, 0, 60);
            }
        }
        ctx.restore();
    }
}



// ============================================================================
// 4. CONTROLADOR CENTRAL (Engine)
// ============================================================================
const Engine = {
    ...GlobalEngine, // HERANÇA DO MOTOR GLOBAL

    base: null, player: null, slots: [], inimigos: [], projeteis: [], drops: [], particles: [], transferTokens: [], healthDrops: [],
    tempoRestante: 0, estado: 'menu', lastTime: 0, spawnTimer: 0, slotFocado: null,
    pontuacao: 0, comboAcertos: 0, inimigosDerrotados: 0, inimigosDerrotadosDesdeVida: 0,
    boasDisponiveis: [], masDisponiveis: [],

    // 1. Adicione a variável aqui:
    modoFrenetico: false,

    iniciar: function() {
        resize(); // <-- ADICIONE ESTA LINHA: Força o canvas a pegar o tamanho certo ao clicar no botão

        // O Pai faz a limpeza e usa 'block' pois a Fase 8 usa canvas tela cheia
        GlobalEngine.iniciar.call(this, 'block');

        document.getElementById('tela-quiz').classList.add('oculto');

        this.boasDisponiveis = [...DADOS_JOGO.praticasBoas];
        this.masDisponiveis = [...DADOS_JOGO.praticasMas];

        // 2. Capture o valor do slider aqui:
        this.modoFrenetico = document.getElementById('toggle-dificuldade').checked;

        this.pontuacao = 0; this.comboAcertos = 0; this.inimigosDerrotados = 0; this.inimigosDerrotadosDesdeVida = 0;
        this.base = new Base();
        this.player = new Player();
        this.inimigos = []; this.projeteis = []; this.drops = []; this.particles = []; this.transferTokens = []; this.healthDrops = [];
        
        const cx = WORLD_SIZE/2, cy = WORLD_SIZE/2, d = 250;
        this.slots = [
            new Slot(cx, cy - d), new Slot(cx + d, cy),
            new Slot(cx, cy + d), new Slot(cx - d, cy)
        ];
        
        CAMERA.x = this.player.x - width/2; CAMERA.y = this.player.y - height/2;

        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.loop(t));
    },

    // =========================================================
    // POLIMORFISMO: Cálculo de Precisão com a Vida da Base
    // =========================================================
    calcularPrecisao: function() {
        if (!this.base) return 0;
        const percPerdida = 100 - (this.base.hp / this.base.maxHp) * 100;
        return Math.max(0, 100 - Math.round(percPerdida));
    },

    // =========================================================
    // HOOK DO PAI: Atualiza a info na tela de fim
    // =========================================================
    atualizarEstatisticasFinais: function() {
        const elQtde = document.getElementById('final-qtde');
        if (elQtde) elQtde.innerText = this.inimigosDerrotados;
    },

    // =========================================================
    // POLIMORFISMO: Sobreviver ao tempo é Vitória
    // =========================================================
    tempoEsgotado: function() {
        this.encerrar(true); 
    },

    // =========================================================
    // O QUIZ
    // =========================================================
    abrirQuiz: function(slotRef) {
        this.jogoPausado = true; // Para o tempo e os inimigos

        this.slotFocado = slotRef;
        document.getElementById('tela-quiz').classList.remove('oculto');
        
        if(this.boasDisponiveis.length < 1) this.boasDisponiveis = [...DADOS_JOGO.praticasBoas];
        if(this.masDisponiveis.length < 2) this.masDisponiveis = [...DADOS_JOGO.praticasMas];

        let idxB = Math.floor(Math.random() * this.boasDisponiveis.length);
        let certa = this.boasDisponiveis.splice(idxB, 1)[0];
        
        let idxM1 = Math.floor(Math.random() * this.masDisponiveis.length);
        let ma1 = this.masDisponiveis.splice(idxM1, 1)[0];

        let idxM2 = Math.floor(Math.random() * this.masDisponiveis.length);
        let ma2 = this.masDisponiveis.splice(idxM2, 1)[0];

        let opcoes = [
            { t: certa, correta: true }, { t: ma1, correta: false }, { t: ma2, correta: false }
        ].sort(()=>Math.random() - 0.5); 

        let html = "";
        opcoes.forEach(op => { 
            html += `<button class="btn-quiz" onclick="Engine.responderQuiz(${op.correta})">${op.t}</button>`; 
        });
        document.getElementById('quiz-container').innerHTML = html;
    },

    responderQuiz: function(acertou) {
        document.getElementById('tela-quiz').classList.add('oculto');
        if (acertou) {
            if (this.slotFocado.state === 'spawner') {
                this.slotFocado.state = 'empty'; this.slotFocado.level = 1;
            } else if (this.slotFocado.state === 'empty') {
                this.slotFocado.state = 'tower'; this.slotFocado.level = 1;
                this.slotFocado.damage = 15; this.slotFocado.fireRate = 0.8;
            } else if (this.slotFocado.state === 'tower') {
                this.slotFocado.level++;
                if (this.slotFocado.level === 2) { this.slotFocado.damage = 25; this.slotFocado.fireRate = 0.5; }
                if (this.slotFocado.level === 3) { this.slotFocado.damage = 40; this.slotFocado.fireRate = 0.3; }
            }
            if(typeof AudioSys !== 'undefined') AudioSys.tocar('upgrade');
            this.adicionarPontos(50, true); 
        } else {
            if (this.slotFocado.state === 'tower') {
                this.slotFocado.level--;
                if (this.slotFocado.level === 2) { this.slotFocado.damage = 25; this.slotFocado.fireRate = 0.5; }
                if (this.slotFocado.level === 1) { this.slotFocado.damage = 15; this.slotFocado.fireRate = 0.8; }
                if (this.slotFocado.level === 0) { this.slotFocado.state = 'empty'; this.slotFocado.level = 1; }
            } else if (this.slotFocado.state === 'empty') {
                this.slotFocado.state = 'spawner';
            }
            if(typeof AudioSys !== 'undefined') AudioSys.tocar('erro');
            this.adicionarPontos(-50, false, true); 
        }
        
        this.slotFocado.tokens = 0; 
        this.slotFocado = null;
        INPUT.isDragging = false; 
        this.jogoPausado = false; // Retoma o jogo

        // this.lastTime = performance.now(); 
        // requestAnimationFrame((t) => this.loop(t));
    },

    createLeakEffect: function(x, y) {
        let baseAngle = Math.atan2(y - this.base.y, x - this.base.x);
        let qtd = 3 + Math.floor(Math.random() * 3); 
        
        for(let i=0; i<qtd; i++) {
            let spread = (Math.random() - 0.5) * (Math.PI / 2);
            let angle = baseAngle + spread;
            let speed = 80 + Math.random() * 100;
            let bin = "";
            let len = 3 + Math.floor(Math.random() * 4); 
            for(let b=0; b<len; b++) bin += Math.random() > 0.5 ? "1" : "0";
            
            this.particles.push({
                x: x, y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1.0 + Math.random() * 0.5,
                maxLife: 1.5,
                text: bin
            });
        }
        if(typeof AudioSys !== 'undefined') AudioSys.tocar('vazamento');
    },

    abrirTutorial: function() { 
        document.getElementById('tela-tutorial').classList.remove('oculto'); 
        this.mudarSlideTutorial(1);
    },
    fecharTutorial: function() { 
        document.getElementById('tela-tutorial').classList.add('oculto'); 
    },
    mudarSlideTutorial: function(slideNum) {
        document.getElementById('tut-slide-1').classList.add('oculto');
        document.getElementById('tut-slide-2').classList.add('oculto');
        document.getElementById('tut-slide-3').classList.add('oculto');
        document.getElementById('tut-slide-' + slideNum).classList.remove('oculto');
    },

    // =========================================================
    // MOTOR GRÁFICO (Canvas 60fps)
    // =========================================================
    loop: function(timestamp) {
        // Se pausado (Menu de Pausa ou Quiz), congela o motor e ignora o dt
        if (this.jogoPausado) {
            this.lastTime = timestamp;
            requestAnimationFrame((t) => this.loop(t));
            return;
        }

        let dt = (timestamp - this.lastTime) / 1000;
        if (dt > 0.1) dt = 0.1; // Limita o salto de tempo (Lag spike)
        this.lastTime = timestamp;

        if (this.base.hp <= 0) { this.encerrar(false, 'db'); return; }
        if (this.player.hp <= 0) { this.encerrar(false, 'player'); return; }

        let torresMaximas = this.slots.filter(s => s.state === 'tower' && s.level === 3).length;
        let percPerdida = 100 - (this.base.hp / this.base.maxHp) * 100;
        if (torresMaximas === 4) {
            if (percPerdida <= DADOS_JOGO.limiteDanoBase) {
                this.encerrar(true, 'max_upgrade'); return;
            }
        }

        this.player.update(dt);
        this.slots.forEach(s => s.update(dt));
        
        // Spawn Inimigos
        // this.spawnTimer -= dt;
        // if (this.spawnTimer <= 0) {
        //     let angle = Math.random() * Math.PI * 2;
        //     let r = 1000 + Math.random()*200; 
        //     this.inimigos.push(new Enemy(WORLD_SIZE/2 + Math.cos(angle)*r, WORLD_SIZE/2 + Math.sin(angle)*r));
        //     this.spawnTimer = 0.5 + (this.tempoRestante/DADOS_JOGO.tempoMaximo)*2.0; 
        // }
        // Spawn Inimigos
        this.spawnTimer -= dt;
        if (this.spawnTimer <= 0) {
            let angle = Math.random() * Math.PI * 2;
            let r = 1000 + Math.random()*200; 
            
            let novoInimigo = new Enemy(WORLD_SIZE/2 + Math.cos(angle)*r, WORLD_SIZE/2 + Math.sin(angle)*r);
            
            // APLICA O MODO FRENÉTICO NO INIMIGO
            if (this.modoFrenetico) {
                novoInimigo.speed *= 1.5; // 50% mais rápido
                novoInimigo.fireRate *= 0.6; // Atira mais rápido (tempo menor entre tiros)
            }
            this.inimigos.push(novoInimigo);

            // APLICA O MODO FRENÉTICO NO SPAWN (Nascem mais rápido)
            let taxaBase = this.modoFrenetico ? 1.0 : 2.0;
            this.spawnTimer = 0.5 + (this.tempoRestante/DADOS_JOGO.tempoMaximo) * taxaBase; 
        }

        for (let i = this.inimigos.length - 1; i >= 0; i--) {
            let e = this.inimigos[i]; e.update(dt);
            if (e.hp <= 0) {
                this.inimigosDerrotados++;
                this.inimigosDerrotadosDesdeVida++;
                this.comboAcertos++;
                let isCombo = this.comboAcertos > 3;
                this.adicionarPontos(isCombo ? 15 : 10, isCombo);
                
                for(let k=0; k<3; k++) {
                    this.drops.push(new Drop(e.x + (Math.random()-0.5)*40, e.y + (Math.random()-0.5)*40)); 
                }

                if (this.inimigosDerrotadosDesdeVida >= DADOS_JOGO.killsParaVida) {
                    this.healthDrops.push(new HealthDrop(e.x, e.y));
                    this.inimigosDerrotadosDesdeVida = 0;
                }

                this.inimigos.splice(i, 1);
            }
        }

        for (let i = this.projeteis.length - 1; i >= 0; i--) {
            let p = this.projeteis[i]; p.update(dt);
            if (p.life <= 0) { this.projeteis.splice(i, 1); continue; }

            let hit = false;
            if (p.isPlayer) {
                let target = this.inimigos.find(e => dist(p.x, p.y, e.x, e.y) < e.radius + p.radius);
                if (target) { target.hp -= p.damage; hit = true; }
            } else {
                if (dist(p.x, p.y, this.player.x, this.player.y) < this.player.radius + p.radius) {
                    this.player.hp -= p.damage; hit = true; this.comboAcertos = 0;
                    this.adicionarPontos(-5, false, true); 
                } else if (dist(p.x, p.y, this.base.x, this.base.y) < this.base.radius + p.radius) {
                    this.base.hp -= p.damage; hit = true;
                    this.adicionarPontos(-10, false, true); 
                    if (Math.random()<0.3) this.createLeakEffect(p.x, p.y);
                }
            }
            if (hit) this.projeteis.splice(i, 1);
        }

        for (let i = this.transferTokens.length - 1; i >= 0; i--) {
            if(this.transferTokens[i].update(dt)) this.transferTokens.splice(i, 1);
        }
        for (let i = this.drops.length - 1; i >= 0; i--) {
            let d = this.drops[i]; d.update(dt);
            if (d.life <= 0) this.drops.splice(i, 1);
        }
        for (let i = this.healthDrops.length - 1; i >= 0; i--) {
            let h = this.healthDrops[i]; h.update(dt);
            if (h.life <= 0) this.healthDrops.splice(i, 1);
        }
        for (let i = this.particles.length - 1; i >= 0; i--) {
            let p = this.particles[i];
            p.life -= dt; p.x += p.vx * dt; p.y += p.vy * dt; 
            if (p.life <= 0) this.particles.splice(i, 1);
        }

        this.renderizar(dt);
        
        // document.getElementById('hud-tempo').innerText = `⏳ ${Math.ceil(this.tempoRestante)}s`;
        // document.getElementById('hud-pontos').innerText = this.pontuacao;
        // document.getElementById('hp-db').style.width = `${Math.max(0, (this.base.hp/this.base.maxHp)*100)}%`;
        // document.getElementById('hp-player').style.width = `${Math.max(0, (this.player.hp/this.player.maxHp)*100)}%`;

        requestAnimationFrame((t) => this.loop(t));
    },

    renderizar: function(dt) {
        ctx.fillStyle = DADOS_JOGO.tema.corFundo; ctx.fillRect(0, 0, width, height);

        let marginX = width * DADOS_JOGO.margemCamera;  
        let marginY = height * DADOS_JOGO.margemCamera; 

        let targetX = CAMERA.x; let targetY = CAMERA.y;
        if (this.player.x - CAMERA.x < marginX) targetX = this.player.x - marginX;
        else if (this.player.x - CAMERA.x > width - marginX) targetX = this.player.x - (width - marginX);

        if (this.player.y - CAMERA.y < marginY) targetY = this.player.y - marginY;
        else if (this.player.y - CAMERA.y > height - marginY) targetY = this.player.y - (height - marginY);

        if (targetX < 0) targetX = 0; if (targetY < 0) targetY = 0;
        if (targetX > WORLD_SIZE - width) targetX = WORLD_SIZE - width;
        if (targetY > WORLD_SIZE - height) targetY = WORLD_SIZE - height;

        CAMERA.x += (targetX - CAMERA.x) * (10 * dt);
        CAMERA.y += (targetY - CAMERA.y) * (10 * dt);

        ctx.save(); ctx.translate(-CAMERA.x, -CAMERA.y);

        ctx.strokeStyle = "rgba(2, 136, 209, 0.15)"; ctx.lineWidth = 1;
        for(let x=0; x<=WORLD_SIZE; x+=100) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,WORLD_SIZE); ctx.stroke(); }
        for(let y=0; y<=WORLD_SIZE; y+=100) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(WORLD_SIZE,y); ctx.stroke(); }

        this.slots.forEach(s => s.draw());
        this.base.draw();
        this.drops.forEach(d => d.draw());
        this.healthDrops.forEach(h => h.draw());
        this.transferTokens.forEach(t => t.draw());
        this.projeteis.forEach(p => p.draw());
        this.inimigos.forEach(e => e.draw());
        this.player.draw();

        // ctx.save();
        ctx.fillStyle = "#ff5252"; ctx.font = "bold 14px Courier New";
        this.particles.forEach(p => {
            let alpha = p.maxLife ? p.life / p.maxLife : p.life;
            ctx.globalAlpha = Math.max(0, alpha); 
            ctx.fillText(p.text, p.x, p.y);
        });
        ctx.restore();

        if(INPUT.isDragging) {
            ctx.beginPath(); ctx.arc(INPUT.startX, INPUT.startY, JOYSTICK_MAX_RADIUS, 0, Math.PI*2);
            ctx.strokeStyle = "rgba(255,255,255,0.2)"; ctx.lineWidth=2; ctx.stroke();
            let limitD = Math.min(Math.hypot(INPUT.currentX-INPUT.startX, INPUT.currentY-INPUT.startY), JOYSTICK_MAX_RADIUS);
            let a = Math.atan2(INPUT.currentY-INPUT.startY, INPUT.currentX-INPUT.startX);
            ctx.beginPath(); ctx.arc(INPUT.startX + Math.cos(a)*limitD, INPUT.startY + Math.sin(a)*limitD, 20, 0, Math.PI*2);
            ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.fill();
        }
        
        // ctx.restore();
    }
};
