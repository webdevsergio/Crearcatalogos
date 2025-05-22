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
