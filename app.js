/* =========================
   Estado de la aplicación
   ========================= */
const appState = {
  currentSection: 'inicio',
  isLoggedIn: false,
  currentUser: {
    username: '@todotobi',
    name: 'Tobias Vera',
    followers: 127,
    following: 53,
    likes: 0
  },
  // autores que "seguís" para la sección Siguiendo:
  followingAuthors: new Set(['@usuario1', '@usuario3']),
  // feed demo
  videos: [
    {
      id: 1,
      type: 'video',
      author: '@usuario1',
      name: 'Usuario Uno',
      description: 'Mirá este increíble video! 🔥 #viral #trending',
      music: 'Música Original - Usuario1',
      likes: 15420, comments: 342, shares: 89, favorites: 156,
      liked: false, favorited: false,
      videoUrl: './Videos/animals1.mp4',
      thumb: '',
      commentsList: [
        { user: '@maria_23', comment: '¡Increíble! 😍', time: 'Hace 2h' },
        { user: '@juan_video', comment: 'Me encantó este video', time: 'Hace 5h' }
      ]
    },
    {
      id: 2,
      type: 'video',
      author: '@usuario2',
      name: 'Usuario Dos',
      description: 'Contenido creativo para vos ✨ #paraTi #creativo',
      music: 'Sonido Popular - Trending',
      likes: 8930, comments: 156, shares: 45, favorites: 89,
      liked: false, favorited: false,
      videoUrl: './Videos/animals2.mp4',
      thumb: '',
      commentsList: [
        { user: '@pedro_creator', comment: 'Muy bueno! 🔥', time: 'Hace 1h' },
        { user: '@ana_lopez', comment: '¿Cómo lo hiciste?', time: 'Hace 3h' }
      ]
    },
    {
      id: 3,
      type: 'video',
      author: '@usuario3',
      name: 'Usuario Tres',
      description: 'Nuevo desafío! Participá 🎯 #challenge #viral',
      music: 'Trending Sound - Popular',
      likes: 23500, comments: 890, shares: 234, favorites: 456,
      liked: false, favorited: false,
      videoUrl: './Videos/animals3.mp4',
      thumb: '',
      commentsList: [
        { user: '@carlos_99', comment: 'Acepto el desafío! 💪', time: 'Hace 30min' },
        { user: '@laura_dance', comment: 'Esto está increíble', time: 'Hace 2h' }
      ]
    }
  ],
  // tus subidas (vacías hasta que logueás y subís algo)
  uploads: [],
  notifications: [
    { user: '@maria_23', action: 'le gustó tu video', time: 'Hace 5 min', type: 'like' },
    { user: '@juan_video', action: 'comenzó a seguirte', time: 'Hace 1h', type: 'follow' },
    { user: '@pedro_creator', action: 'comentó tu video', time: 'Hace 3h', type: 'comment' },
    { user: '@ana_lopez', action: 'compartió tu video', time: 'Hace 5h', type: 'share' }
  ],
  messages: [
    { user: '@ana_lopez', message: 'Hola! Me encantó tu video', time: 'Hace 10 min', unread: true },
    { user: '@carlos_99', message: '¿Cómo hiciste ese efecto?', time: 'Hace 2h', unread: true },
    { user: '@laura_dance', message: 'Gracias por seguirme!', time: 'Hace 1 día', unread: false }
  ],
  searchResults: []
};

/* =========================
   Inicialización
   ========================= */
document.addEventListener('DOMContentLoaded', () => {
  setupSidebarListeners();
  setupTopbarSearch();
  showSection('inicio');
});

/* =========================
   Listeners de sidebar/topbar
   ========================= */
function setupSidebarListeners() {
  document.querySelectorAll('.sidebar-item').forEach(item => {
    item.addEventListener('click', function () {
      const section = this.getAttribute('data-section');
      const modal = this.getAttribute('data-modal');

      if (section) {
        showSection(section);
        updateActiveSidebar(this);
      } else if (modal) {
        showModal(modal);
      }
    });
  });
}

function setupTopbarSearch() {
  const input = document.getElementById('searchInput');
  const icon = document.querySelector('.search-icon');
  icon?.addEventListener('click', buscar);
  input?.addEventListener('keydown', handleSearch);
}

function updateActiveSidebar(activeItem) {
  document.querySelectorAll('.sidebar-item').forEach(item => item.classList.remove('active'));
  if (activeItem) activeItem.classList.add('active');
}

/* =========================
   Router de secciones
   ========================= */
function showSection(section) {
  appState.currentSection = section;
  const main = document.getElementById('mainContent');

  switch (section) {
    case 'inicio':
    case 'para-ti':
      renderVideoFeed(main, appState.videos);
      break;
    case 'explorar':
      renderExplore(main);
      break;
    case 'siguiendo':
      renderFollowing(main);
      break;
    case 'perfil':
      renderProfile(main);
      break;
    case 'me-gusta':
      renderLikedVideos(main);
      break;
    case 'publicados':
      renderPublishedVideos(main);
      break;
    case 'configuracion':
      renderSettings(main);
      break;
    default:
      renderVideoFeed(main, appState.videos);
  }
}

/* =========================
   Render: Feed de videos
   ========================= */
function renderVideoFeed(container, list) {
  container.innerHTML = '<div class="video-feed" id="videoFeed"></div>';
  const feed = document.getElementById('videoFeed');

  list.forEach(video => {
    const videoEl = document.createElement('div');
    videoEl.className = 'video-container';

    const media = video.videoUrl
      ? `<video class="video-player" src="${video.videoUrl}" loop muted playsinline preload="metadata"></video>`
      : `<div class="video-placeholder">📹</div>`;

    videoEl.innerHTML = `
      ${media}
      <div class="video-info">
        <div class="video-author">${video.author}</div>
        <div class="video-description">${escapeHtml(video.description)}</div>
        <div class="video-music">🎵 ${escapeHtml(video.music)}</div>
      </div>
      <div class="video-actions">
        <div class="action-btn ${video.liked ? 'liked' : ''}" data-action="like" data-id="${video.id}">
          <div class="action-icon">❤️</div>
          <div class="action-count">${formatNumber(video.likes)}</div>
        </div>
        <div class="action-btn" data-action="comment" data-id="${video.id}">
          <div class="action-icon">💬</div>
          <div class="action-count">${formatNumber(video.comments)}</div>
        </div>
        <div class="action-btn" data-action="share" data-id="${video.id}">
          <div class="action-icon">📤</div>
          <div class="action-count">${formatNumber(video.shares)}</div>
        </div>
        <div class="action-btn ${video.favorited ? 'liked' : ''}" data-action="fav" data-id="${video.id}">
          <div class="action-icon">⭐</div>
          <div class="action-count">${formatNumber(video.favorites)}</div>
        </div>
      </div>
    `;
    feed.appendChild(videoEl);
  });

  attachFeedActions(feed);
  enableAutoplay(feed);
}

function attachFeedActions(root) {
  root.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');
      const id = Number(btn.getAttribute('data-id'));
      if (action === 'like') toggleLike(id, btn);
      if (action === 'fav') toggleFavorite(id, btn);
      if (action === 'comment') showComments(id);
      if (action === 'share') shareVideo(id);
    });
  });
}

/* =========================
   Explorar
   ========================= */
function renderExplore(container) {
  container.innerHTML = `
    <div class="video-feed">
      <h2 style="margin-bottom: 20px;">Explorar Tendencias</h2>
      <div class="tabs">
        <div class="tab active" onclick="switchTab(this, 'trending')">Trending</div>
        <div class="tab" onclick="switchTab(this, 'musica')">Música</div>
        <div class="tab" onclick="switchTab(this, 'desafios')">Desafíos</div>
        <div class="tab" onclick="switchTab(this, 'efectos')">Efectos</div>
      </div>
      <div class="explore-grid" id="exploreContent">
        ${generateExploreGrid()}
      </div>
    </div>
  `;
}

function generateExploreGrid() {
  let html = '';
  const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a'];
  for (let i = 0; i < 12; i++) {
    const c1 = colors[i % colors.length];
    const c2 = colors[(i + 1) % colors.length];
    html += `
      <div class="explore-item" style="background: linear-gradient(135deg, ${c1} 0%, ${c2} 100%);" onclick="alert('Video ${i + 1} (demo)')">
        🎬
      </div>
    `;
  }
  return html;
}

function switchTab(tab, category) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  const content = document.getElementById('exploreContent');
  content.innerHTML = generateExploreGrid(); // demo
}

/* =========================
   Siguiendo (filtra autores)
   ========================= */
function renderFollowing(container) {
  const list = appState.videos.filter(v => appState.followingAuthors.has(v.author));
  if (!list.length) {
    container.innerHTML = `
      <div class="video-feed">
        <div class="video-upload-note">
          <h3>No seguís a nadie todavía</h3>
          <p>Explorá creadores y hacé clic en “Seguir” (demo) para llenar este feed.</p>
        </div>
      </div>
    `;
    return;
  }
  renderVideoFeed(container, list);
}

/* =========================
   Perfil / Publicados / Me gusta
   ========================= */
function renderProfile(container) {
  const pubs = appState.uploads; // solo lo que subiste
  const liked = appState.videos.filter(v => v.liked || v.favorited);

  container.innerHTML = `
    <div class="video-feed">
      <div class="profile-header">
        <div class="profile-avatar">👤</div>
        <h2>${escapeHtml(appState.currentUser.name)}</h2>
        <div class="video-author" style="opacity:.8">${escapeHtml(appState.currentUser.username)}</div>
        <div class="video-music" style="margin-top:8px">
          <span>${formatNumber(appState.currentUser.followers)} Seguidores · ${formatNumber(appState.currentUser.following)} Siguiendo</span>
        </div>
      </div>
      <div class="tabs">
        <div class="tab active" onclick="showSection('publicados')">Publicados (${pubs.length})</div>
        <div class="tab" onclick="showSection('me-gusta')">Me gusta (${liked.length})</div>
        <div class="tab" onclick="showSection('configuracion')">Configuración</div>
      </div>
      ${pubs.length
        ? `<div class="profile-grid">${pubs.map(v => gridThumb(v)).join('')}</div>`
        : `<div class="video-upload-note"><h3>Sin publicaciones</h3><p>Subí tu primer video desde “＋ Subir”.</p></div>`}
    </div>
  `;

  // generar thumbs en perfil
  hydrateGridThumbs();
}

function renderPublishedVideos(container) {
  const pubs = appState.uploads;
  container.innerHTML = `
    <div class="video-feed">
      <div class="tabs">
        <div class="tab active" onclick="showSection('publicados')">Publicados (${pubs.length})</div>
        <div class="tab" onclick="showSection('me-gusta')">Me gusta</div>
        <div class="tab" onclick="showSection('configuracion')">Configuración</div>
      </div>
      ${pubs.length
        ? `<div class="profile-grid">${pubs.map(v => gridThumb(v)).join('')}</div>`
        : `<div class="video-upload-note"><h3>No hay videos publicados</h3></div>`}
    </div>
  `;
  hydrateGridThumbs();
}

function renderLikedVideos(container) {
  const liked = appState.videos.filter(v => v.liked || v.favorited);
  container.innerHTML = `
    <div class="video-feed">
      <div class="tabs">
        <div class="tab" onclick="showSection('publicados')">Publicados</div>
        <div class="tab active" onclick="showSection('me-gusta')">Me gusta (${liked.length})</div>
        <div class="tab" onclick="showSection('configuracion')">Configuración</div>
      </div>
      ${liked.length ? `<div class="profile-grid">${liked.map(v => gridThumb(v)).join('')}</div>` :
      `<div class="video-upload-note">
        <h3>Aún no marcaste videos ❤️</h3>
        <p>Dale Me gusta ⭐ o Favoritos a un video para que aparezca aquí.</p>
      </div>`}
    </div>
  `;
  hydrateGridThumbs();
}

function gridThumb(v) {
  const img = v.thumb ? `<img src="${v.thumb}" alt="Video ${v.id}">` : '';
  return `
    <div class="profile-video" data-id="${v.id}" onclick="openSingle(${v.id})">
      ${img}
      <div class="counter">❤ ${formatNumber(v.likes || 0)}</div>
    </div>
  `;
}

function hydrateGridThumbs(){
  const cells = Array.from(document.querySelectorAll('.profile-video'));
  cells.forEach(cell=>{
    const id = Number(cell.getAttribute('data-id'));
    const v = appState.uploads.find(x=>x.id===id) || appState.videos.find(x=>x.id===id);
    if (!v) return;
    ensureThumb(v).then(url=>{
      if (!url) return;
      const img = cell.querySelector('img');
      if (img) img.src = url;
      else {
        const el = document.createElement('img');
        el.src = url; el.alt = `Video ${id}`;
        cell.prepend(el);
      }
    });
  });
}

function openSingle(id) {
  const main = document.getElementById('mainContent');
  const v = appState.uploads.find(x=>x.id===id) || appState.videos.find(x => x.id === id);
  renderVideoFeed(main, v ? [v] : []);
}

/* =========================
   Configuración
   ========================= */
function renderSettings(container) {
  container.innerHTML = `
    <div class="video-feed">
      <h2 style="margin-bottom:16px">Configuración</h2>
      <div class="setting-item">
        <span>Gestionar Cuenta</span>
        <button class="btn-primary" onclick="showModal('account')">Abrir</button>
      </div>
      <div class="setting-item">
        <span>Borrar datos locales (likes/favs)</span>
        <button class="btn-primary" onclick="clearLocal()">Borrar</button>
      </div>
      <div class="setting-item">
        <span>Iniciar sesión</span>
        <button class="btn-primary" onclick="showModal('login')">${appState.isLoggedIn?'Cambiar':'Login'}</button>
      </div>
    </div>
  `;
}
function clearLocal() {
  appState.videos.forEach(v => { v.liked = false; v.favorited = false; });
  alert('Datos locales limpiados (demo)');
  showSection(appState.currentSection);
}

/* =========================
   Búsqueda
   ========================= */
function buscar() {
  const q = document.getElementById('searchInput')?.value.trim().toLowerCase() || '';
  if (!q) return;
  appState.searchResults = [...appState.uploads, ...appState.videos].filter(v =>
    (v.author||'').toLowerCase().includes(q) ||
    (v.description||'').toLowerCase().includes(q) ||
    (v.music||'').toLowerCase().includes(q)
  );
  const main = document.getElementById('mainContent');
  main.innerHTML = `
    <div class="video-feed">
      <h2>Resultados para “${escapeHtml(q)}”</h2>
      ${appState.searchResults.length
        ? `<div class="profile-grid">${appState.searchResults.map(v => gridThumb(v)).join('')}</div>`
        : `<div class="video-upload-note"><p>Sin resultados</p></div>`}
    </div>`;
  hydrateGridThumbs();
}
function handleSearch(e) { if (e.key === 'Enter') buscar(); }

/* =========================
   Modales (upload, notif, inbox, login, comments, account)
   ========================= */
function showModal(kind, payload = {}) {
  const modal = document.getElementById('modal');
  const box = document.getElementById('modalContent');

  const header = (title) => `
    <div class="modal-header">
      <div class="modal-title">${title}</div>
      <div class="close-modal" onclick="hideModal()">×</div>
    </div>`;

  let html = '';
  switch (kind) {
    case 'upload':
      if (!appState.isLoggedIn) {
        html = header('Necesitás iniciar sesión') + `
          <div class="modal-section">
            <p class="notification-time">Para subir videos primero iniciá sesión.</p>
            <button class="btn-primary" onclick="showModal('login')">Iniciar sesión</button>
          </div>`;
        break;
      }
      html = header('Subir video') + `
        <div class="modal-section">
          <div class="form-group">
            <label>Archivo</label>
            <input id="uploadFile" type="file" accept="video/*">
          </div>
          <div class="form-group">
            <label>Descripción</label>
            <textarea id="uploadDesc" placeholder="Contá de qué va tu clip..."></textarea>
          </div>
          <button class="btn-primary" onclick="doUpload()">Publicar</button>
        </div>`;
      break;

    case 'notifications':
      html = header('Notificaciones') + `
        ${appState.notifications.map(n => `
          <div class="notification">
            <div class="notification-avatar">🔔</div>
            <div class="notification-content">
              <div class="notification-text"><strong>${n.user}</strong> ${n.action}</div>
              <div class="notification-time">${n.time}</div>
            </div>
          </div>
        `).join('')}`;
      break;

    case 'messages':
      html = header('Bandeja de entrada') + `
        ${appState.messages.map(m => `
          <div class="message-item" onclick="alert('Abrir chat con ${m.user} (demo)')">
            <div class="notification-avatar">💬</div>
            <div>
              <div><strong>${m.user}</strong></div>
              <div class="notification-time">${m.message} · ${m.time}</div>
            </div>
          </div>
        `).join('')}`;
      break;

    case 'login':
      html = header('Iniciar sesión') + `
        <div class="form-group">
          <label>Usuario</label>
          <input id="loginUser" placeholder="@usuario">
        </div>
        <div class="form-group">
          <label>Contraseña</label>
          <input type="password" id="loginPass" placeholder="*****">
        </div>
        <button class="btn-primary" onclick="doLogin()">Entrar</button>`;
      break;

    case 'comments':
      html = header('Comentarios') + `
        ${(payload.list || []).map(c => `
          <div class="comment-item">
            <div class="comment-avatar">👤</div>
            <div>
              <div><strong>${c.user}</strong></div>
              <div>${escapeHtml(c.comment)}</div>
              <div class="notification-time">${c.time}</div>
            </div>
          </div>
        `).join('')}
        <div class="form-group" style="margin-top:12px">
          <input id="newComment" placeholder="Agregá un comentario...">
        </div>
        <button class="btn-primary" onclick="addComment(${payload.videoId})">Comentar</button>
      `;
      break;

    case 'account':
      html = header('Gestionar cuenta') + `
        <div class="form-group">
          <label>Nombre</label>
          <input id="accName" value="${escapeHtml(appState.currentUser.name)}">
        </div>
        <div class="form-group">
          <label>Usuario</label>
          <input id="accUser" value="${escapeHtml(appState.currentUser.username)}">
        </div>
        <button class="btn-primary" onclick="saveAccount()">Guardar</button>
      `;
      break;
  }

  box.innerHTML = html;
  modal.classList.add('active');
}
function hideModal() { document.getElementById('modal').classList.remove('active'); }

function doLogin() {
  const u = document.getElementById('loginUser').value.trim();
  const p = document.getElementById('loginPass').value.trim();
  if (!u || !p) return alert('Completá usuario y contraseña (demo)');
  appState.isLoggedIn = true;
  appState.currentUser.username = u.startsWith('@') ? u : '@' + u;
  hideModal();
}

async function doUpload(){
  const file = document.getElementById('uploadFile').files[0];
  const desc = document.getElementById('uploadDesc').value.trim();
  if (!file) return alert('Elegí un video');
  if (!file.type.startsWith('video/')) return alert('Solo se permiten videos');

  const url = URL.createObjectURL(file);
  const id = Date.now();
  const obj = {
    id, type:'video',
    author: appState.currentUser.username,
    name: appState.currentUser.name,
    description: desc || 'Nuevo video',
    music: 'Original Sound',
    likes: 0, comments: 0, shares: 0, favorites: 0,
    liked:false, favorited:false,
    videoUrl: url, thumb:''
  };
  // genera thumb antes de cerrar
  await ensureThumb(obj).catch(()=>{});
  appState.uploads.unshift(obj);
  hideModal();
  showSection('publicados');
}

function saveAccount() {
  appState.currentUser.name = document.getElementById('accName').value.trim() || appState.currentUser.name;
  let h = document.getElementById('accUser').value.trim();
  if (h && !h.startsWith('@')) h = '@' + h;
  appState.currentUser.username = h || appState.currentUser.username;
  hideModal();
  showSection('perfil');
}

/* =========================
   Acciones sobre videos
   ========================= */
function toggleLike(id, btnEl) {
  const v = appState.uploads.find(x=>x.id===id) || appState.videos.find(x => x.id === id);
  if (!v) return;
  v.liked = !v.liked;
  v.likes += v.liked ? 1 : -1;

  // UI
  btnEl.classList.toggle('liked', v.liked);
  btnEl.querySelector('.action-count').textContent = formatNumber(v.likes);

  // si no tenía thumb y lo vas a ver en "Me gusta", generarlo ahora
  if (v.liked && !v.thumb) {
    ensureThumb(v).then(()=>{
      if (appState.currentSection === 'me-gusta') {
        const main = document.getElementById('mainContent');
        renderLikedVideos(main);
      }
    });
  }
}

function toggleFavorite(id, btnEl) {
  const v = appState.uploads.find(x=>x.id===id) || appState.videos.find(x => x.id === id);
  if (!v) return;
  v.favorited = !v.favorited;
  v.favorites += v.favorited ? 1 : -1;

  btnEl.classList.toggle('liked', v.favorited);
  btnEl.querySelector('.action-count').textContent = formatNumber(v.favorites);

  if (v.favorited && !v.thumb) {
    ensureThumb(v).then(()=>{
      if (appState.currentSection === 'me-gusta') {
        const main = document.getElementById('mainContent');
        renderLikedVideos(main);
      }
    });
  }
}

function shareVideo(id) {
  const url = location.origin + location.pathname + '#video-' + id;
  if (navigator.clipboard) navigator.clipboard.writeText(url).then(() => alert('Enlace copiado'));
  else prompt('Copiá el enlace:', url);
}

function showComments(id) {
  const v = appState.uploads.find(x=>x.id===id) || appState.videos.find(x => x.id === id);
  showModal('comments', { list: v?.commentsList || [], videoId: id });
}

function addComment(videoId) {
  const inp = document.getElementById('newComment');
  const txt = inp.value.trim();
  if (!txt) return;
  const v = appState.uploads.find(x=>x.id===videoId) || appState.videos.find(x => x.id === videoId);
  if (!v.commentsList) v.commentsList = [];
  v.commentsList.push({ user: appState.currentUser.username, comment: txt, time: 'Ahora' });
  v.comments += 1;
  hideModal();
  showComments(videoId);
}

/* =========================
   Utilidades
   ========================= */
function formatNumber(n) {
  if (n < 1000) return String(n);
  if (n < 1e6) return (n / 1e3).toFixed(n % 1000 === 0 ? 0 : 1) + 'K';
  if (n < 1e9) return (n / 1e6).toFixed(n % 1e6 === 0 ? 0 : 1) + 'M';
  return (n / 1e9).toFixed(1) + 'B';
}
function escapeHtml(s='') {
  return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

/* =========================
   Autoplay al estilo TikTok
   ========================= */
function enableAutoplay(root) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const v = e.target.querySelector('video');
      if (!v) return;
      if (e.isIntersecting) v.play().catch(()=>{});
      else v.pause();
    });
  }, { threshold: 0.7 });
  root.querySelectorAll('.video-container').forEach(card => io.observe(card));
}

/* =========================
   Thumbnails
   ========================= */
// Genera y guarda v.thumb. Para imágenes, usa la misma fuente.
// Para videos, captura el primer frame con canvas.
async function ensureThumb(v){
  if (v.thumb) return v.thumb;

  if (v.type === 'image' && v.videoUrl) {
    v.thumb = v.videoUrl;
    return v.thumb;
  }

  if ((v.type === 'video' || !v.type) && v.videoUrl) {
    try {
      v.thumb = await captureVideoFrame(v.videoUrl);
      return v.thumb;
    } catch (e) {
      console.warn('No se pudo generar thumbnail:', e);
      return null;
    }
  }
  return null;
}

// Captura un frame del video (mismo origen) y devuelve dataURL
function captureVideoFrame(src){
  return new Promise((resolve, reject)=>{
    const vid = document.createElement('video');
    vid.muted = true;
    vid.playsInline = true;
    vid.crossOrigin = 'anonymous';
    vid.src = src;
    vid.addEventListener('loadeddata', ()=>{
      try{
        if (vid.duration && vid.currentTime < 0.15) {
          vid.currentTime = Math.min(0.15, vid.duration - 0.01);
        }
      }catch{}
      setTimeout(()=>{
        const w = vid.videoWidth, h = vid.videoHeight;
        if (!w || !h) return reject(new Error('video sin dimensiones'));
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(vid, 0, 0, w, h);
        try{ resolve(canvas.toDataURL('image/jpeg', 0.8)); }
        catch(err){ reject(err); }
      }, 60);
    }, {once:true});
    vid.addEventListener('error', ()=> reject(new Error('error cargando video')), {once:true});
  });
}
