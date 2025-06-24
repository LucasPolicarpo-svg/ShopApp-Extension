if (!cmsHelpertargetImages && !cmsHelperExpiredDivs) {
  var cmsHelpertargetImages = null;
  var cmsHelperExpiredDivs = null;
  var expiredSpanTexts = null;
}
cmsHelpertargetImages = document.querySelectorAll('div.widgets-preview-h-full-horizontal img[title]');
cmsHelperExpiredDivs = document.querySelectorAll('div.widget-card-expired');

// Primeiro, cria um array com TODOS os textos de spans dentro das divs expiradas
expiredSpanTexts = Array.from(cmsHelperExpiredDivs)
  .flatMap(div => Array.from(div.querySelectorAll('span')).map(span => span.innerText));

// Agora, só um loop pelas imagens
cmsHelpertargetImages.forEach((img) => {
  const titleText = img.getAttribute('title').trimEnd();

  const hasMatch = expiredSpanTexts.includes(titleText);

  if (hasMatch) {
    img.parentNode.style.border = '4px solid red';
    img.parentNode.style.borderRadius = '5px';
  }
});
