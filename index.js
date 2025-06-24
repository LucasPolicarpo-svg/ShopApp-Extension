(function() {
  // Função que aplica as bordas
  function applyBorders() {
    const cmsHelpertargetImages = document.querySelectorAll('div.widgets-preview-h-full-horizontal img[title]');
    const cmsHelperExpiredDivs = document.querySelectorAll('div.widget-card-expired');

    const expiredSpanTexts = Array.from(cmsHelperExpiredDivs)
      .flatMap(div => Array.from(div.querySelectorAll('span')).map(span => span.innerText.trim()));

    cmsHelpertargetImages.forEach((img) => {
      const titleText = img.getAttribute('title').trim();
      const hasMatch = expiredSpanTexts.includes(titleText);

      if (hasMatch) {
        img.parentNode.style.border = '4px solid red';
      }
    });
  }

  function addTitles() {
    if (!cmsHelpertargetImages) {
        var cmsHelpertargetImages = null;
        }
        cmsHelpertargetImages = document.querySelectorAll('div.widgets-preview-h-full-horizontal img[title]');

        // Agora, só um loop pelas imagens
        cmsHelpertargetImages.forEach((img) => {
        const titleText = img.getAttribute('title').trimEnd();

        // Adiciona o span com o título, se ainda não tiver
        if (titleText && !img.nextSibling?.classList?.contains('cms-helper-title')) {
            const span = document.createElement('span');
            span.className = 'cms-helper-title';
            span.style.background = "#cdcdcd"
            span.style.border = "solid 1px"
            span.style.display = "block";
            span.style.fontSize = "15px";
            span.style.fontWeight = "bold";
            span.style.textWrap = "wrap";
            span.innerText = titleText;
            img.parentNode.appendChild(span);
        }
        });

  }

//   function clearBorders() {
//     document.querySelectorAll('div.widgets-preview-h-full-horizontal img[title]').forEach((img) => {
//       img.parentNode.style.border = '';
//     });
//   }

  // Verifica o estado salvo (se deve aplicar ou não)
  function checkAndApply() {
    const active = localStorage.getItem('cmsHelperActive');
    if (active === 'true') {
      addTitles();
      applyBorders();
    }
  }

  // Observar mudanças na DOM (para reaplicar caso recarregue via Ajax)
  const observer = new MutationObserver(() => {
    checkAndApply();
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Ativa o recurso assim que o script rodar
  localStorage.setItem('cmsHelperActive', 'true');
  checkAndApply();

  // Expõe a função de limpar (o seu CTA pode chamar isso depois)
  window.cmsHelperStop = function() {
    localStorage.setItem('cmsHelperActive', 'false');
    clearBorders();
  };

})();




