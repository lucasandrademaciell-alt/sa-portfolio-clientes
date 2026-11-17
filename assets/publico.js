(() => {
  'use strict';
  const views = [...document.querySelectorAll('.view')];
  const switchView = (id, scroll = true, updateHash = true) => {
    if (!views.some(view => view.id === id)) return;
    views.forEach(view => view.classList.toggle('active', view.id === id));
    document.querySelectorAll('[data-view]').forEach(button => {
      const active = button.dataset.view === id;
      button.classList.toggle('active', active);
      if (active) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    if (updateHash) history.replaceState(null, '', '#' + id);
    if (scroll) window.scrollTo({top: 0, behavior: 'smooth'});
  };
  document.querySelectorAll('[data-view],[data-go]').forEach(button => {
    button.addEventListener('click', event => {
      event.preventDefault();
      switchView(button.dataset.view || button.dataset.go);
    });
  });
  if (views.length) {
    const initial = location.hash.slice(1);
    switchView(views.some(view => view.id === initial) ? initial : (views.find(view => view.classList.contains('active')) || views[0]).id, false, false);
    window.addEventListener('hashchange', () => switchView(location.hash.slice(1), false, false));
  }
  const photos = [...document.querySelectorAll('.thumbs img,.comp-photo-grid img,.j-gallery-grid img,.r-gallery img,.j-panel-grid img,.j-panel-wide img,.r-chart')];
  if (!photos.length) return;
  let box = document.getElementById('lightbox');
  if (!box) {
    box = document.createElement('div');
    box.id = 'lightbox'; box.className = 'lightbox';
    box.innerHTML = '<button id="close" type="button" aria-label="Fechar fotografia">×</button><img id="zoom" alt="Fotografia ampliada">';
    document.body.append(box);
  }
  box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', 'Fotografia ampliada'); box.setAttribute('aria-hidden', 'true');
  const zoom = box.querySelector('img'), close = box.querySelector('button');
  let previousFocus = null;
  const hide = () => {
    box.classList.remove('open'); box.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('sa-modal-open');
    previousFocus?.focus();
  };
  const open = photo => {
    previousFocus = document.activeElement;
    zoom.src = photo.currentSrc || photo.src; zoom.alt = photo.alt || 'Fotografia ampliada';
    box.classList.add('open'); box.setAttribute('aria-hidden', 'false');
    document.body.classList.add('sa-modal-open'); close.focus();
  };
  photos.forEach(photo => {
    photo.classList.add('sa-photo-trigger'); photo.tabIndex = 0; photo.setAttribute('role', 'button');
    photo.setAttribute('aria-label', 'Ampliar: ' + (photo.alt || 'fotografia'));
    photo.addEventListener('click', () => open(photo));
    photo.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {event.preventDefault(); open(photo);}
    });
  });
  close.addEventListener('click', hide);
  box.addEventListener('click', event => {if (event.target === box) hide();});
  document.addEventListener('keydown', event => {
    if (!box.classList.contains('open')) return;
    if (event.key === 'Escape') hide();
    if (event.key === 'Tab') {event.preventDefault(); close.focus();}
  });
})();
