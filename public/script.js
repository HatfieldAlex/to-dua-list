document.querySelectorAll('.task-button').forEach(button => {
  button.addEventListener('click', function() {
      const taskId = this.getAttribute('data-task-id');
      fetch('/execute-query', { 
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ taskId: taskId })
      })
      .then(response => response.json())
      .then(data => {
          console.log(data);
      })
      .catch(error => {
          console.error('Error executing query:', error);
      });
    location.reload();
    });
});


document.addEventListener("DOMContentLoaded", function() {
    const clearCompletedButton = document.getElementById("clearCompleted");

    clearCompletedButton.addEventListener("click", function() {
        fetch(
            //"https://to-dua-list-517c33b58d48.herokuapp.com/"
            //'http://localhost:4000'
            // + 
             '/clear-completed', {
            method: "DELETE"
        }).then(response => response.json())
          .then(data => {
            location.reload();  
          });
    });
});