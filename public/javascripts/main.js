const buttonSVG = document.querySelector('.button-svg');
const h1Contents = document.querySelector('.h1-contents');

if (buttonSVG) {
  buttonSVG.addEventListener('click', (event) => {
    const h1ContentsDisplay = getComputedStyle(h1Contents);
    if (
      h1ContentsDisplay.display === 'none' ||
      h1Contents.style.display === 'none'
    ) {
      h1Contents.style.display = 'block';
      setTimeout(() => {
        h1Contents.style.display = 'none';
      }, 4000);
    } else {
      h1Contents.style.display = 'none';
    }
  });
}

(function () {
  const current = location.pathname.split('/')[1];
  const home = document.querySelector('#home');
  if (current === '') return;

  const menuItems = document.querySelectorAll('.nav-link');
  for (let i = 0, len = menuItems.length; i < len; i++) {
    if (menuItems[i].getAttribute('href').indexOf(current) !== -1) {
      menuItems[i].className += ' current-page';
      home.classList.remove('current-page');
    }
  }
  // const footerItems = document.querySelectorAll('.footerSection a');
  // for (let i = 0, len = footerItems.length; i < len; i++) {
  //   if (footerItems[i].getAttribute('href').indexOf(current) !== -1) {
  //     footerItems[i].className += ' current';
  //     home.classList.remove('current');
  //   }
  // }
})();
