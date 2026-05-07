/* ==================== UTILITÁRIOS ==================== */
const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

/* ==================== NAVBAR SCROLL ==================== */
const navbar = $('#navbar');
let lastScroll = 0;

let rafPending = false;
const handleScroll = () => {
  if (rafPending) return;
  rafPending = true;

  requestAnimationFrame(() => {
    const currentScroll = window.scrollY;
    if (currentScroll > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
    rafPending = false;
  });
};

window.addEventListener('scroll', handleScroll, { passive: true });

/* ==================== DRAWER MENU (PREMIUM MOBILE) ==================== */
const navToggle = $('#navToggle');
const drawerMenu = $('#drawerMenu');
const drawerOverlay = $('#drawerOverlay');
const drawerClose = $('#drawerClose');
const drawerLinks = $$('.drawer-link');

const openDrawer = () => {
  if (!drawerMenu || !drawerOverlay) return;
  drawerMenu.classList.add('active');
  drawerOverlay.classList.add('active');
  document.body.classList.add('drawer-open');
  navToggle.setAttribute('aria-expanded', 'true');
};

const closeDrawer = () => {
  if (!drawerMenu || !drawerOverlay) return;
  drawerMenu.classList.remove('active');
  drawerOverlay.classList.remove('active');
  document.body.classList.remove('drawer-open');
  navToggle.setAttribute('aria-expanded', 'false');
};

if (navToggle && drawerMenu) {
  navToggle.addEventListener('click', (e) => {
    e.preventDefault();
    openDrawer();
  });

  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* ==================== INTERSECTION OBSERVER — ANIMAÇÕES SCROLL ==================== */
const observerConfig = {
  threshold: 0.2,
  rootMargin: '0px 0px -40px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      scrollObserver.unobserve(entry.target);
    }
  });
}, observerConfig);

// Eixos Premium: Cards com delay incremental
$$('.eixo-card-premium').forEach((el, i) => {
  el.style.transitionDelay = `${i * 150}ms`;
  scrollObserver.observe(el);
});

// Eixos Premium Header
const eixosHeader = $('.eixos-header-premium');
if (eixosHeader) {
  eixosHeader.classList.add('fade-up');
  scrollObserver.observe(eixosHeader);
}

// Dor cards stagger
const dorGrid = $('.dor-grid');
if (dorGrid) {
  dorGrid.classList.add('stagger-children');
  scrollObserver.observe(dorGrid);
}

// Sobre texto
const sobreTexto = $('.sobre-texto');
if (sobreTexto) {
  sobreTexto.classList.add('fade-up');
  scrollObserver.observe(sobreTexto);
}

// Counters
const countersGrid = $('.sobre-counters-premium') || $('.counters-grid');
if (countersGrid) {
  countersGrid.classList.add('fade-up');
  scrollObserver.observe(countersGrid);
}

// Depoimentos Premium
const depoimentosWrapper = $('.depoimentos-main-content-centered');
if (depoimentosWrapper) {
  depoimentosWrapper.classList.add('fade-up');
  scrollObserver.observe(depoimentosWrapper);
}

// Galeria
$$('.galeria-item').forEach((el, i) => {
  el.style.transitionDelay = `${i * 100}ms`;
  el.classList.add('fade-up');
  scrollObserver.observe(el);
});

// Seção encantamento video
const videoEmbed = $('.video-embed-section');
if (videoEmbed) {
  videoEmbed.classList.add('fade-up');
  scrollObserver.observe(videoEmbed);
}

// FAQ items
$$('.faq-item').forEach((el, i) => {
  el.style.transitionDelay = `${i * 50}ms`;
  el.classList.add('fade-up');
  scrollObserver.observe(el);
});

// Localização
const localizacaoGrid = $('.localizacao-grid');
if (localizacaoGrid) {
  localizacaoGrid.classList.add('fade-up');
  scrollObserver.observe(localizacaoGrid);
}

// CTA
const ctaContainer = $('.cta-container');
if (ctaContainer) {
  ctaContainer.classList.add('fade-up');
  scrollObserver.observe(ctaContainer);
}

/* ==================== COUNTERS ANIMADOS ==================== */
const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

const animateCounter = (el, target, duration = 1800, isPlus = false) => {
  const startTime = performance.now();
  const startValue = 0;

  const tick = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutQuart(progress);
    const current = Math.round(startValue + (target - startValue) * eased);

    el.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = target;
    }
  };

  requestAnimationFrame(tick);
};

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counters = $$('.counter-number', entry.target);
      counters.forEach(counter => {
        const target = parseInt(counter.dataset.target, 10);
        if (!isNaN(target)) {
          animateCounter(counter, target, 1800);
        }
      });
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

if (countersGrid) {
  counterObserver.observe(countersGrid);
}

// Suporte para o novo seletor de counters premium se o anterior falhar
const premiumCounters = $('.sobre-counters-premium');
if (premiumCounters && premiumCounters !== countersGrid) {
  counterObserver.observe(premiumCounters);
}

/* ==================== CARROSSEL DEPOIMENTOS (REFINADO) ==================== */
const carouselTrack = $('#carouselTrack');
const prevBtn = $('#carouselPrev');
const nextBtn = $('#carouselNext');
const dotsContainer = $('#carouselDots');

let currentSlide = 0;
let autoplayInterval;
const autoplayDelay = 5000; // Um pouco mais lento para leitura premium

const initCarousel = () => {
  if (!carouselTrack) return;

  const slides = $$('.depoimento-card-premium', carouselTrack);
  if (slides.length === 0) return;

  // Limpar dots existentes (prevenção contra duplicados)
  dotsContainer.innerHTML = '';

  // Criar dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot-premium';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Depoimento ${i + 1}`);
    dot.setAttribute('aria-selected', 'false');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  const dots = $$('.carousel-dot-premium', dotsContainer);

  const updateSlides = () => {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentSlide);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
      dot.setAttribute('aria-selected', i === currentSlide ? 'true' : 'false');
    });
  };

  const goToSlide = (index) => {
    currentSlide = index;
    if (currentSlide < 0) currentSlide = slides.length - 1;
    if (currentSlide >= slides.length) currentSlide = 0;
    updateSlides();
    resetAutoplay();
  };

  const nextSlide = () => goToSlide(currentSlide + 1);
  const prevSlide = () => goToSlide(currentSlide - 1);

  const startAutoplay = () => {
    autoplayInterval = setInterval(nextSlide, autoplayDelay);
  };

  const resetAutoplay = () => {
    clearInterval(autoplayInterval);
    startAutoplay();
  };

  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);

  // Keyboard navigation
  carouselTrack.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });

  updateSlides();
  startAutoplay();
};

initCarousel();


/* ==================== FAQ ACCORDION ==================== */
$$('.faq-item').forEach(item => {
  const question = $('.faq-question', item);

  question.addEventListener('click', (e) => {
    e.preventDefault(); // Previne conflito com o comportamento nativo do <details>
    const isOpen = item.hasAttribute('open');

    // Fechar todos os outros (comportamento accordion)
    $$('.faq-item[open]').forEach(openItem => {
      if (openItem !== item) {
        openItem.removeAttribute('open');
      }
    });

    // Toggle atual
    if (isOpen) {
      item.removeAttribute('open');
    } else {
      item.setAttribute('open', '');
    }
  });
});

/* ==================== FORMULÁRIO — VALIDAÇÃO ==================== */
const form = $('#formContato');

if (form) {
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 13;
  };

  const showError = (fieldId, show) => {
    const grupo = $(`#${fieldId}`).closest('.form-grupo');
    if (show) {
      grupo.classList.add('erro');
    } else {
      grupo.classList.remove('erro');
    }
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = $('#nome');
    const email = $('#email');
    const whatsapp = $('#whatsapp');
    const tipo = $('#tipo');
    const mensagem = $('#mensagem');

    let isValid = true;

    // Nome
    if (!nome.value.trim()) {
      showError('nome', true);
      isValid = false;
    } else {
      showError('nome', false);
    }

    // Email
    if (!email.value.trim() || !validateEmail(email.value)) {
      showError('email', true);
      isValid = false;
    } else {
      showError('email', false);
    }

    // WhatsApp
    if (!whatsapp.value.trim() || !validatePhone(whatsapp.value)) {
      showError('whatsapp', true);
      isValid = false;
    } else {
      showError('whatsapp', false);
    }

    // Tipo
    if (!tipo.value) {
      showError('tipo', true);
      isValid = false;
    } else {
      showError('tipo', false);
    }

    if (isValid) {
      const btnSubmit = $('.btn-submit');
      const originalText = btnSubmit.textContent;
      btnSubmit.textContent = 'Redirecionando...';
      btnSubmit.disabled = true;

      // Formatação da mensagem para o WhatsApp (Padrão AG5)
      const whatsappNumber = '5521964394839';
      const servicoSelecionado = tipo.options[tipo.selectedIndex].text;
      
      const textoMensagem = `Olá, me chamo ${nome.value.trim()}, vim através do site e gostaria de uma informação.

- E-mail: ${email.value.trim()}
- Telefone: ${whatsapp.value.trim()}
- Serviço: ${servicoSelecionado}
- Situação: ${mensagem ? mensagem.value.trim() : 'Não informada'}`;

      const encodedMessage = encodeURIComponent(textoMensagem);
      const waUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

      // Simula um pequeno delay para feedback visual antes de redirecionar
      setTimeout(() => {
        window.open(waUrl, '_blank');
        
        btnSubmit.textContent = originalText;
        btnSubmit.disabled = false;
        form.reset();

        const sucesso = $('#formSucesso');
        if (sucesso) {
          sucesso.classList.add('visible');
          setTimeout(() => sucesso.classList.remove('visible'), 5000);
        }
      }, 800);
    }
  });

  // Máscara de Telefone (DDD + 9 dígitos)
  const handlePhoneMask = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length > 10) {
      value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    } else if (value.length > 5) {
      value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    } else if (value.length > 0) {
      value = value.replace(/^(\d*)/, '($1');
    }
    e.target.value = value;
  };

  const whatsappField = $('#whatsapp');
  if (whatsappField) {
    whatsappField.addEventListener('input', handlePhoneMask);
  }

  // Remover erro ao digitar
  ['nome', 'email', 'whatsapp', 'tipo'].forEach(id => {
    const field = $(`#${id}`);
    if (field) {
      field.addEventListener('input', () => showError(id, false));
    }
  });
}

/* ==================== SMOOTH SCROLL ANCORAS ==================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  });
});

/* ==================== HEADER LOAD ANIMATIONS ==================== */
// Botões hero com stagger
const heroCtaGroup = $('.hero-cta-group');
if (heroCtaGroup) {
  const buttons = $$('.btn', heroCtaGroup);
  buttons.forEach((btn, i) => {
    btn.style.animationDelay = `${400 + i * 120}ms`;
  });
}

/* ==================== LAZY LOADING FALLBACK ==================== */
if ('loading' in HTMLImageElement.prototype) {
  $$('img[loading="lazy"]').forEach(img => {
    img.src = img.dataset.src || img.src;
  });
} else {
  // Fallback para browsers sem lazy loading nativo
  const lazyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
        lazyObserver.unobserve(img);
      }
    });
  });

  $$('img[loading="lazy"]').forEach(img => lazyObserver.observe(img));
}

/* ==================== WHATSAPP PREMIUM LOGIC ==================== */
function initWaPremium() {
    const bubble = document.getElementById('wa-message-bubble');
    const typing = document.getElementById('wa-typing');
    const realMessage = document.getElementById('wa-real-message');
    const badge = document.getElementById('wa-notification');
    const closeBtn = document.getElementById('wa-close-btn');
    const mainBtn = document.getElementById('wa-main-btn');

    if (!bubble || !mainBtn) return;

    // 1. Mostrar o balão após 6 segundos
    setTimeout(() => {
        bubble.classList.add('show');
        
        // 2. Simular digitação por 2.5 segundos antes de mostrar a mensagem
        setTimeout(() => {
            if (typing) typing.style.display = 'none';
            if (realMessage) {
                realMessage.style.display = 'block';
                realMessage.classList.add('animate__animated', 'animate__fadeIn');
            }

            // 3. Auto-hide: sumir após 30 segundos de mensagem visível
            setTimeout(() => {
                bubble.classList.remove('show');
                // Mostrar badge de notificação para manter engajamento
                setTimeout(() => {
                    if (badge) badge.classList.add('show');
                }, 800);
            }, 30000);
        }, 2500);

    }, 6000);

    // Fechar balão
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            bubble.classList.remove('show');
            // Mostrar notificação após fechar para manter engajamento
            setTimeout(() => {
                badge.classList.add('show');
            }, 2000);
        });
    }

    // Ao clicar no botão, remove tudo
    mainBtn.addEventListener('click', () => {
        bubble.classList.remove('show');
        badge.classList.remove('show');
    });
}

/* ==================== CUSTOM VIDEO LOGIC ==================== */
const initVideoControls = () => {
  const videoCards = $$('.video-card-v-item');
  const modal = $('#videoModal');
  const modalVideo = $('#modalVideo');
  const modalClose = $('.v-modal-close', modal);
  const modalContent = $('.v-modal-content', modal);
  const modalTitle = $('#modalTitle');
  const modalTag = $('#modalTag');
  const modalLoader = $('.v-modal-loading', modal);

  if (!modal || !modalVideo) return;

  const closeModal = () => {
    modal.classList.remove('open');
    setTimeout(() => {
      modalVideo.pause();
      modalVideo.src = "";
      modalLoader.style.opacity = '1';
    }, 400);
    document.body.classList.remove('drawer-open');
  };

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
    $('.v-modal-overlay', modal).addEventListener('click', closeModal);
  }

  // Esconder loader quando o vídeo carregar
  modalVideo.oncanplay = () => {
    modalLoader.style.opacity = '0';
    setTimeout(() => { modalLoader.style.zIndex = '-1'; }, 500);
  };

  // Play/Pause ao clicar no vídeo do modal
  modalVideo.addEventListener('click', () => {
    if (modalVideo.paused) modalVideo.play();
    else modalVideo.pause();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  videoCards.forEach(card => {
    const video = $('video', card);
    const muteBtn = $('.v-mute-btn', card);
    const expandBtn = $('.v-expand-btn', card);
    const wrapper = $('.v-card-wrapper', card);
    const infoTitle = $('h3', card).textContent;
    const infoTag = $('.v-tag', card).textContent;

    if (!video) return;

    wrapper.addEventListener('click', (e) => {
      if (e.target.closest('.v-control-btn')) return;
      if (video.paused) {
        // Reiniciar e pausar outros vídeos da galeria
        $$('.v-video').forEach(v => { 
          if (v !== video) {
            v.pause();
            v.currentTime = 0; // Volta ao começo
            v.closest('.v-card-wrapper').classList.remove('playing');
          }
        });
        video.play();
        wrapper.classList.add('playing');
      } else {
        video.pause();
        wrapper.classList.remove('playing');
      }
    });

    // Sincronizar se o vídeo pausar por outros motivos
    video.onpause = () => wrapper.classList.remove('playing');
    video.onplay = () => wrapper.classList.add('playing');

    if (muteBtn) {
      muteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        video.muted = !video.muted;
      });
    }

    if (expandBtn) {
      expandBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        video.pause();
        
        const videoSource = $('source', video).src;
        modalVideo.src = videoSource;
        modalVideo.controls = false; // Máximo premium: sem controles poluindo
        
        // Preencher info
        modalTitle.textContent = infoTitle;
        modalTag.textContent = infoTag;
        
        modalLoader.style.opacity = '1';
        modalLoader.style.zIndex = '5';
        modalContent.classList.add('vertical');

        modal.classList.add('open');
        document.body.classList.add('drawer-open');
        
        modalVideo.load();
        modalVideo.play().catch(err => console.log(err));
      });
    }
    
    video.addEventListener('volumechange', () => {
      if (!muteBtn) return;
      const icon = muteBtn.querySelector('i');
      icon.className = video.muted || video.volume === 0 ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high';
    });
  });
};

document.addEventListener('DOMContentLoaded', () => {
  initWaPremium();
  initVideoControls();
});

