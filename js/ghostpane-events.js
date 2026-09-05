(() => {
  const track = (name, payload) => {
    if (typeof window.ghostpane === 'function') {
      window.ghostpane(name, payload);
    }
  };

  document.addEventListener('click', (event) => {
    const link = event.target.closest?.('a[href*="cal.com/adam-simms"]');
    if (link) track('Meeting');
  });
})();
