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
    span.style.background = "#e3e3e3"
    span.style.display = "block";
    span.style.fontSize = "15px";
    span.style.fontWeight = "bold";
    span.style.textWrap = "wrap";
    span.style.fontFamily = "Poppins";
    span.style.color = "#454545";
    span.innerText = titleText;
    img.parentNode.appendChild(span);
  } else {
    const spans = document.querySelectorAll('.cms-helper-title');
    spans.forEach((span) => {
      span.style.display = "block";
    })
  }
});

