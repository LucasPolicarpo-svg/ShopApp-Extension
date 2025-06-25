if (!cmsHelpertargetImages) {
  var cmsHelpertargetImages = null;
}
cmsHelpertargetImages = document.querySelectorAll('div.widgets-preview-h-full-horizontal img[title]');

// Agora, só um loop pelas imagens
cmsHelpertargetImages.forEach((img) => {
  const titleText = img.getAttribute('title').trimEnd();

  const spans = document.querySelectorAll('.cms-helper-title');
    spans.forEach((span) => {
      span.style.display = "block";
    });
});

