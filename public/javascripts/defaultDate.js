// HTML DEFAULT DATE VALUE

const cD = document.querySelector('#createdDate');
// const lD = document.querySelector('#logDate');

if (cD) {
  cD.value = new Date().toISOString().slice(0, 10);
}
// else if (lD) {
//   lD.value = new Date().toISOString().slice(0, 10);
// }
