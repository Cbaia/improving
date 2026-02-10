/* ============================================
   CURSOR CUSTOMIZADO E HOLOFOTE
   ============================================ */

// Seleciona os elementos do DOM
const cursor = document.getElementById('cursor');  // Cursor pequeno que segue o mouse
const spotlight = document.getElementById('spotlight');  // Holofote grande que segue o mouse
const interactiveElements = document.querySelectorAll('a, button, .btn');  // Todos os elementos clicáveis

// Variáveis para armazenar a posição do mouse
let mouseX = 0;
let mouseY = 0;

/* --------------------------------------------
   ATUALIZAR POSIÇÃO DO CURSOR E HOLOFOTE
   -------------------------------------------- */
// Evento disparado sempre que o mouse se move
document.addEventListener('mousemove', (e) => {
    // Captura as coordenadas X e Y do mouse
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // CURSOR PEQUENO
    // Posiciona o cursor na posição exata do mouse
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
    cursor.classList.add('active');  // Torna o cursor visível
    
    // HOLOFOTE
    // Posiciona o holofote centralizado no cursor
    // (o CSS já tem transform: translate(-50%, -50%) para centralizar)
    spotlight.style.left = mouseX + 'px';
    spotlight.style.top = mouseY + 'px';
    spotlight.classList.add('active');  // Torna o holofote visível
});

/* --------------------------------------------
   ESCONDER CURSOR E HOLOFOTE QUANDO O MOUSE SAI DA PÁGINA
   -------------------------------------------- */
document.addEventListener('mouseleave', () => {
    cursor.classList.remove('active');  // Esconde o cursor
    spotlight.classList.remove('active');  // Esconde o holofote
});

/* --------------------------------------------
   MOSTRAR CURSOR E HOLOFOTE QUANDO O MOUSE VOLTA PARA A PÁGINA
   -------------------------------------------- */
document.addEventListener('mouseenter', () => {
    cursor.classList.add('active');  // Mostra o cursor
    spotlight.classList.add('active');  // Mostra o holofote
});

/* --------------------------------------------
   EFEITOS DE HOVER NOS ELEMENTOS INTERATIVOS
   -------------------------------------------- */
// Para cada elemento clicável (links, botões, etc.)
interactiveElements.forEach(el => {
    // Quando o mouse entra no elemento
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');  // Aumenta o cursor
    });
    
    // Quando o mouse sai do elemento
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');  // Volta ao tamanho normal
    });
});

/* ============================================
   SCROLL SUAVE
   ============================================ */
// Seleciona todos os links que começam com # (links de navegação interna)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();  // Previne o comportamento padrão do link
        
        // Pega o elemento alvo baseado no href do link
        const target = document.querySelector(this.getAttribute('href'));
        
        // Se o elemento existe, faz scroll suave até ele
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',  // Animação suave
                block: 'start'       // Alinha o elemento no topo da tela
            });
        }
    });
});

/* ============================================
   ANIMAÇÃO AO SCROLL - Intersection Observer
   ============================================ */
/* 
   Intersection Observer detecta quando elementos entram na tela
   e dispara animações. É mais performático que eventos de scroll.
*/

// Configurações do observer
const observerOptions = {
    threshold: 0.1,  // Dispara quando 10% do elemento está visível
    rootMargin: '0px 0px -100px 0px'  // Dispara 100px antes do elemento entrar na tela
};

// Cria o observer
const observer = new IntersectionObserver((entries) => {
    // Para cada elemento observado
    entries.forEach(entry => {
        // Se o elemento está entrando na tela (está visível)
        if (entry.isIntersecting) {
            // Aplica a animação fadeInUp definida no CSS
            entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
        }
    });
}, observerOptions);

// Observa todos os cards de skills e itens de projeto
document.querySelectorAll('.skill-card, .project-item').forEach(el => {
    observer.observe(el);  // Adiciona o elemento à lista de observação
});

/* ============================================
   EFEITO DE BRILHO AO PASSAR O MOUSE SOBRE CARDS
   ============================================ */
/*
   Este efeito pode ser expandido futuramente para criar
   um brilho que segue o cursor dentro do card
*/
document.querySelectorAll('.skill-card, .project-item').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        // Pega as dimensões e posição do card
        const rect = card.getBoundingClientRect();
        
        // Calcula a posição do mouse relativa ao card
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Define variáveis CSS customizadas com a posição do mouse
        // (podem ser usadas no CSS para criar efeitos de brilho)
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

/* ============================================
   NOTAS PARA EXPANSÃO FUTURA
   ============================================ */
/*
   IDEIAS PARA ADICIONAR:
   
   1. SCROLL PROGRESS BAR
      - Adicionar uma barra no topo que mostra o progresso do scroll
   
   2. ANIMAÇÃO DE DIGITAÇÃO NO TÍTULO
      - Fazer o título aparecer como se estivesse sendo digitado
   
   3. PARTICLES.JS
      - Adicionar partículas interativas no fundo
   
   4. MODO ESCURO/CLARO
      - Adicionar toggle para alternar entre temas
   
   5. LAZY LOADING DE IMAGENS
      - Se adicionar imagens, fazer elas carregarem só quando visíveis
   
   6. CONTADOR ANIMADO
      - Se adicionar estatísticas (projetos, clientes, etc), animar números
   
   7. FILTRO DE PROJETOS
      - Adicionar botões para filtrar projetos por tecnologia
   
   8. VALIDAÇÃO DE FORMULÁRIO
      - Se adicionar formulário de contato, validar campos
*/
