const alertEle = document.querySelector('.alert');
const close = document.querySelector('.close');

if (close) {
  close.addEventListener('click', () => {
    alertEle.style.opacity = '0';
    setTimeout(function () {
      alertEle.style.display = 'none';
    }, 300);
  });
}
