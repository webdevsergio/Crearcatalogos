// script.js

const pages = [];
let currentPage = null;
let selectedElement = null;
let isMobileView = false;

const hotbar = document.getElementById('hotbar');
const btnAddPage = document.getElementById('btnAddPage');
const btnAddText = document.getElementById('btnAddText');
const btnAddImage = document.getElementById('btnAddImage');
const btnToggleView = document.getElementById('btnToggleView');
const btnExportZip = document.getElementById('btnExportZip');
const btnLoadZip = document.getElementById('btnLoadZip');
const uploadZip = document.getElementById('uploadZip');
const pagesList = document.getElementById('pagesList');
const editorArea = document.getElementById('editorArea');
const editPanel = document.getElementById('editPanel');
const editContent = document.getElementById('editContent');
const editImageUrl = document.getElementById('editImageUrl');
const btnSaveEdit = document.getElementById('btnSaveEdit');
const btnDeleteElement = document.getElementById('btnDeleteElement');

let cssContent = `/* Estilos CSS exportados desde editor */\nbody { font-family: Arial, sans-serif; }`;
let jsContent = `// JS exportado desde editor\n`;

// Mover hotbar
(function(){
  let isDragging = false;
  let startX, startY, origX, origY;

  hotbar.addEventListener('mousedown', e => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    const rect = hotbar.getBoundingClientRect();
    origX = rect.left;
    origY = rect.top;
    hotbar.style.transition = 'none';
    e.preventDefault();
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    hotbar.style.transition = '';
  });

  document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    hotbar.style.left = `${origX + dx}px`;
    hotbar.style.top = `${origY + dy}px`;
  });
})();
// Crear nueva página
btnAddPage.addEventListener('click', () => {
  const pageName = prompt("Nombre del archivo HTML (sin .html):");
  if (!pageName) return;
  const page = {
    name: pageName,
    html: '',
    elements: []
  };
  pages.push(page);
  setCurrentPage(page);
  renderPagesList();
});

function setCurrentPage(page) {
  currentPage = page;
  renderEditor();
}

function renderPagesList() {
  pagesList.innerHTML = '';
  pages.forEach((p, i) => {
    const btn = document.createElement('button');
    btn.textContent = p.name;
    btn.onclick = () => setCurrentPage(p);
    pagesList.appendChild(btn);
  });
}

// Añadir elementos
btnAddText.addEventListener('click', () => {
  if (!currentPage) return;
  const text = prompt("Texto:");
  if (!text) return;
  const el = {
    type: 'text',
    content: text,
    x: 50,
    y: 50
  };
  currentPage.elements.push(el);
  renderEditor();
});

btnAddImage.addEventListener('click', () => {
  if (!currentPage) return;
  const url = prompt("URL de la imagen:");
  if (!url) return;
  const el = {
    type: 'image',
    src: url,
    x: 100,
    y: 100
  };
  currentPage.elements.push(el);
  renderEditor();
});
function renderEditor() {
  editorArea.innerHTML = '';
  if (!currentPage) return;

  currentPage.elements.forEach((el, index) => {
    const div = document.createElement('div');
    div.className = 'draggable';
    div.style.left = el.x + 'px';
    div.style.top = el.y + 'px';

    if (el.type === 'text') {
      div.innerHTML = `<p>${el.content}</p>`;
    } else if (el.type === 'image') {
      div.innerHTML = `<img src="${el.src}" style="max-width:100px; max-height:100px;">`;
    }

    div.onclick = (e) => {
      e.stopPropagation();
      selectedElement = el;
      showEditPanel(el);
    };

    makeDraggable(div, el);
    editorArea.appendChild(div);
  });
}

function makeDraggable(elem, data) {
  let isDragging = false;
  let offsetX, offsetY;

  elem.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.offsetX;
    offsetY = e.offsetY;
    e.preventDefault();
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;
    elem.style.left = `${x}px`;
    elem.style.top = `${y}px`;
    data.x = x;
    data.y = y;
  });
}
