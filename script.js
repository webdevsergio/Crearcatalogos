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

let cssContent = `/* Estilos CSS exportados desde editor */\\nbody { font-family: Arial, sans-serif; }`;
let jsContent = `// JS exportado desde editor\\n`;

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

function createPage(name = null) {
  let pageName = name;
  if (!pageName) {
    let i = 1;
    while (pages.some(p => p.name === `pagina${i}.html`)) i++;
    pageName = `pagina${i}.html`;
  }
  const page = { name: pageName, content: [] };
  pages.push(page);
  setCurrentPage(pageName);
  renderPagesList();
}

function renderPagesList() {
  pagesList.innerHTML = '';
  pages.forEach(p => {
    const li = document.createElement('li');
    li.textContent = p.name;
    li.classList.toggle('active', p.name === currentPage);
    li.onclick = () => setCurrentPage(p.name);
    pagesList.appendChild(li);
  });
}

function setCurrentPage(name) {
  currentPage = name;
  renderPagesList();
  renderPageContent();
  closeEditPanel();
}

function renderPageContent() {
  const page = pages.find(p => p.name === currentPage);
  if (!page) return;
  editorArea.innerHTML = '';
  page.content.forEach(el => {
    const domEl = createElementFromData(el);
    editorArea.appendChild(domEl);
  });
}

function createElementFromData(data) {
  const div = document.createElement('div');
  div.classList.add('editable-element');
  div.setAttribute('data-id', data.id);
  if(data.type === 'text') {
    div.innerHTML = data.content;
  } else if(data.type === 'image') {
    const img = document.createElement('img');
    img.src = data.src || '';
    div.appendChild(img);
    if(data.caption) {
      const caption = document.createElement('div');
      caption.textContent = data.caption;
      div.appendChild(caption);
    }
  }
  div.onclick = e => {
    e.stopPropagation();
    selectElement(div);
  };
  return div;
}

function selectElement(domEl) {
  if(selectedElement) {
    selectedElement.classList.remove('selected');
  }
  selectedElement = domEl;
  selectedElement.classList.add('selected');
  openEditPanel(selectedElement);
}

function openEditPanel(domEl) {
  editPanel.hidden = false;
  const id = domEl.getAttribute('data-id');
  const page = pages.find(p => p.name === currentPage);
  if(!page) return;
  const elData = page.content.find(c => c.id === id);
  if(!elData) return;

  if(elData.type === 'text') {
    editContent.value = elData.content;
    editImageUrl.value = '';
  } else if(elData.type === 'image') {
    editContent.value = elData.caption || '';
    editImageUrl.value = elData.src || '';
  }
}

function closeEditPanel() {
  editPanel.hidden = true;
  if(selectedElement) {
    selectedElement.classList.remove('selected');
    selectedElement = null;
  }
}

function addTextElement() {
  if(!currentPage) return;
  const page = pages.find(p => p.name === currentPage);
  if(!page) return;
  const id = `id_${Date.now()}`;
  const newEl = { id, type: 'text', content: 'Nuevo texto' };
  page.content.push(newEl);
  renderPageContent();
}

function addImageElement() {
  if(!currentPage) return;
  const page = pages.find(p => p.name === currentPage);
  if(!page) return;
  const id = `id_${Date.now()}`;
  const newEl = { id, type: 'image', src: '', caption: 'Descripción' };
  page.content.push(newEl);
  renderPageContent();
}

btnAddPage.onclick = () => {
  const name = prompt('Nombre de la página (ej: productos.html):');
  if(name) {
    if(pages.some(p => p.name === name)) {
      alert('Ya existe una página con ese nombre');
      return;
    }
    createPage(name);
  }
};

btnAddText.onclick = addTextElement;
btnAddImage.onclick = addImageElement;

btnToggleView.onclick = () => {
  isMobileView = !isMobileView;
  editorArea.classList.toggle('mobileView', isMobileView);
  btnToggleView.textContent = isMobileView ? 'Modo PC' : 'Modo Móvil';
};

btnSaveEdit.onclick = () => {
  if(!selectedElement) return;
  const id = selectedElement.getAttribute('data-id');
  const page = pages.find(p => p.name === currentPage);
  if(!page) return;
  const elData = page.content.find(c => c.id === id);
  if(!elData) return;

  if(elData.type === 'text') {
    elData.content = editContent.value;
  } else if(elData.type === 'image') {
    elData.caption = editContent.value;
    elData.src = editImageUrl.value;
  }
  renderPageContent();
  closeEditPanel();
};

btnDeleteElement.onclick = () => {
  if(!selectedElement) return;
  const id = selectedElement.getAttribute('data-id');
  const page = pages.find(p => p.name === currentPage);
  if(!page) return;
  page.content = page.content.filter(c => c.id !== id);
  renderPageContent();
  closeEditPanel();
};

editorArea.onclick = () => {
  closeEditPanel();
};

// Exportar ZIP con todos los archivos
btnExportZip.onclick = async () => {
  if(pages.length === 0) {
    alert('No hay páginas para exportar.');
    return;
  }
  const zip = new JSZip();

  // Agregar index.html que enlace a la primera página
  const firstPage = pages[0].name || 'pagina1.html';
  const indexHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Catálogo Exportado</title>
  <link rel="stylesheet" href="style.css"/>
</head>
<body>
  <iframe src="${firstPage}" style="width:100%;height:100vh;border:none;"></iframe>
</body>
</html>`;
  zip.file('index.html', indexHtml);
  zip.file('style.css', cssContent);
  zip.file('script.js', jsContent);

  // Agregar cada página html con contenido de los elementos en divs simples
  for(const page of pages) {
    let bodyContent = '';
    for(const el of page.content) {
      if(el.type === 'text') {
        bodyContent += `<div>${el.content}</div>\n`;
      } else if(el.type === 'image') {
        bodyContent += `<div><img src="${el.src}" alt="Imagen"/><p>${el.caption || ''}</p></div>\n`;
      }
    }
    const pageHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset
