// Selecionar todos os botões de navegação
const navButtons = document.querySelectorAll(".nav-btn");
const sections = document.querySelectorAll(".section");

// Adicionar evento de clique para cada botão
navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Obter a seção alvo
    const targetSection = button.getAttribute("data-section");

    // Remover classe 'active' de todos os botões
    navButtons.forEach((btn) => btn.classList.remove("active"));

    // Remover classe 'active' de todas as seções
    sections.forEach((section) => section.classList.remove("active"));

    // Adicionar classe 'active' ao botão clicado
    button.classList.add("active");

    // Adicionar classe 'active' à seção alvo
    const activeSection = document.getElementById(targetSection);
    if (activeSection) {
      activeSection.classList.add("active");
    }
  });
});

// Função auxiliar para trocar seção por id
function showSection(id) {
  // remover active de botões e seções
  navButtons.forEach((btn) => btn.classList.remove("active"));
  sections.forEach((section) => section.classList.remove("active"));

  const sec = document.getElementById(id);
  if (sec) sec.classList.add("active");
}

// Ligar cards clicáveis para abrir a seção de vídeo
const cardLinks = document.querySelectorAll(".card-link");
const videoPlayer = document.getElementById("video-player");
const breadcrumbCategoryLink = document.getElementById(
  "breadcrumb-category-link"
);
const breadcrumbTitle = document.getElementById("breadcrumb-title");
const videoTitle = document.getElementById("video-title");
const backBtn = document.getElementById("back-btn");

let currentCategory = null;

// Função para extrair ID do YouTube de diferentes formatos de URL
function getYouTubeEmbedUrl(url) {
  let videoId = null;

  // Formato: youtu.be/videoId
  if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1].split("?")[0].split("&")[0];
  }
  // Formato: youtube.com/watch?v=videoId
  else if (url.includes("youtube.com/watch")) {
    const params = new URL(url).searchParams;
    videoId = params.get("v");
  }
  // Formato: youtube.com/embed/videoId
  else if (url.includes("youtube.com/embed/")) {
    videoId = url.split("youtube.com/embed/")[1].split("?")[0];
  }

  if (videoId) {
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    console.log("URL original:", url);
    console.log("ID extraído:", videoId);
    console.log("URL final:", embedUrl);
    return embedUrl;
  }
  console.log("URL não reconhecida:", url);
  return url; // Retorna URL original se não conseguir extrair ID
}

cardLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const src = link.dataset.video;
    const title = link.dataset.title || "Assistir Ensaio";
    const category = link.dataset.category || null;
    currentCategory = category;

    // atualizar player e breadcrumb
    if (videoPlayer) {
      const embedUrl = getYouTubeEmbedUrl(src);
      videoPlayer.src = embedUrl;
    }
    if (breadcrumbTitle) breadcrumbTitle.textContent = title;
    if (breadcrumbCategoryLink) {
      breadcrumbCategoryLink.textContent = category
        ? category.charAt(0).toUpperCase() + category.slice(1)
        : "Categoria";
      breadcrumbCategoryLink.setAttribute("href", "#");
    }

    // ativar vídeo
    showSection("video");
  });
});

// Breadcrumb link volta para a categoria
if (breadcrumbCategoryLink) {
  breadcrumbCategoryLink.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentCategory) {
      // ativar botão do menu correspondente
      const catBtn = document.querySelector(
        `.nav-btn[data-section="${currentCategory}"]`
      );
      navButtons.forEach((btn) => btn.classList.remove("active"));
      if (catBtn) catBtn.classList.add("active");
      showSection(currentCategory);
    }
  });
}

// Voltar para categoria (se existir) ou home
if (backBtn) {
  backBtn.addEventListener("click", () => {
    if (videoPlayer) videoPlayer.src = "";
    if (currentCategory) {
      const catBtn = document.querySelector(
        `.nav-btn[data-section="${currentCategory}"]`
      );
      navButtons.forEach((btn) => btn.classList.remove("active"));
      if (catBtn) catBtn.classList.add("active");
      showSection(currentCategory);
    } else {
      const homeBtn = document.querySelector('.nav-btn[data-section="home"]');
      navButtons.forEach((btn) => btn.classList.remove("active"));
      if (homeBtn) homeBtn.classList.add("active");
      showSection("home");
    }
  });
}
