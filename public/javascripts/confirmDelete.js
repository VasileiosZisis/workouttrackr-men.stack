const delLog = document.querySelector('#deleteLog');
const delExercise = document.querySelector('#deleteExercise');
const delSession = document.querySelector('#deleteSession');
if (delLog) {
  delLog.addEventListener('click', function (evt) {
    if (
      !confirm(
        'This action will also delete all the Exercises and Sessions that are associated with this Log. Are you sure you want to continue?'
      )
    ) {
      evt.preventDefault();
    }
  });
}

if (delExercise) {
  delExercise.addEventListener('click', function (evt) {
    if (
      !confirm(
        'This action will also delete all the Sessions that are associated with this Exercise. Are you sure you want to continue?'
      )
    ) {
      evt.preventDefault();
    }
  });
}

if (delSession) {
  delSession.addEventListener('click', function (evt) {
    if (!confirm('Are you sure you want to delete this Session?')) {
      evt.preventDefault();
    }
  });
}
