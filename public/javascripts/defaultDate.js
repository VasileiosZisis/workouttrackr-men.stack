// HTML DEFAULT DATE VALUE

const cD = document.querySelector('#createdDate');

if (cD) {
  cD.value = new Date().toISOString().slice(0, 10);
}
