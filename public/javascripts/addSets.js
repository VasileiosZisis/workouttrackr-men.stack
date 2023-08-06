const form = document.querySelector('#div-set');
const addBtn = document.querySelector('#add-set');
const delBtn = document.querySelector('#delete-set');

addBtn.classList.add('link');

delBtn.disabled = true;

let setNumber = 1;
let arrayNumber = 0;

function addField() {
  setNumber++;
  arrayNumber++;

  const repslabel = document.createElement('LABEL');
  const kgslabel = document.createElement('LABEL');

  const field = document.createElement('div');

  const fieldTwo = document.createElement('div');
  fieldTwo.classList.add('form-contents', 'margin-1');

  const fieldReps = document.createElement('div');
  const fieldKgs = document.createElement('div');

  const title = document.createElement('h3');
  title.classList.add('margin-1', 'h3-trsessions-form');
  title.innerHTML = `Set ${setNumber}`;

  const repsInput = document.createElement('input');
  repslabel.setAttribute('for', 'repetitions');
  repslabel.classList.add('label-trsessions-form');
  repslabel.innerHTML = 'Repetitions';
  repsInput.type = 'number';
  repsInput.step = '0.01';
  repsInput.min = '0';
  repsInput.id = 'repetitions';
  repsInput.name = `weights[${arrayNumber}][repetitions]`;

  const kgsInput = document.createElement('input');
  kgslabel.setAttribute('for', 'kilograms');
  kgslabel.classList.add('label-trsessions-form');
  kgslabel.innerHTML = 'Kilograms';
  kgsInput.type = 'number';
  kgsInput.step = '0.01';
  kgsInput.min = '0';
  kgsInput.id = 'kilograms';
  kgsInput.name = `weights[${arrayNumber}][kilograms]`;

  form.append(field);
  field.append(title, fieldTwo);
  fieldTwo.append(fieldReps, fieldKgs);
  fieldReps.append(repslabel, repsInput);
  fieldKgs.append(kgslabel, kgsInput);

  toggleDelBtn();
}

function removeField() {
  form.removeChild(form.lastChild);
  setNumber--;
  arrayNumber--;

  toggleDelBtn();
}

function toggleDelBtn() {
  if (arrayNumber >= 1) {
    delBtn.disabled = false;
  } else {
    delBtn.disabled = true;
  }
}

addBtn.addEventListener('click', addField);

delBtn.addEventListener('click', removeField);
