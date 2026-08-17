(() => {
  const doors = {
    1: document.querySelector('[data-door="art"]'),
    2: document.querySelector('[data-door="photo"]'),
    3: document.querySelector('[data-door="software"]'),
    c: document.querySelector('[data-door="cal"]'),
  };

  const trackMeeting = () => {
    if (typeof window.ghostpane === 'function') {
      window.ghostpane('Meeting');
    }
  };

  const openDoor = (el) => {
    if (!el?.href) return;
    if (el === doors.c) trackMeeting();
    const target = el.getAttribute('target') || '_self';
    if (target === '_blank') {
      window.open(el.href, '_blank', 'noopener,noreferrer');
    } else {
      window.location.assign(el.href);
    }
  };

  document.addEventListener('keydown', (event) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const tag = event.target?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || event.target?.isContentEditable) return;

    const key = event.key.toLowerCase();
    const el = doors[key];
    if (!el) return;

    event.preventDefault();
    openDoor(el);
  });
})();
