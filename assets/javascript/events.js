function keyboard(game){
  window.addEventListener('keydown', event => {
    setTimeout(() => {
      if ((event.key == 'ArrowLeft' || event.key.toLowerCase() == 'a') && game.snake.rotateX != 1) {
          game.snake.rotateX = -1;
          game.snake.rotateY = 0;
      } else if ((event.key == 'ArrowUp' || event.key.toLowerCase() == 'w') && game.snake.rotateY != 1) {
          game.snake.rotateX = 0;
          game.snake.rotateY = -1;
      } else if ((event.key == 'ArrowRight' || event.key.toLowerCase() == 'd') && game.snake.rotateX != -1) {
          game.snake.rotateX = 1;
          game.snake.rotateY = 0;
      } else if ((event.key == 'ArrowDown' || event.key.toLowerCase() == 's') && game.snake.rotateY != -1) {
          game.snake.rotateX = 0;
          game.snake.rotateY = 1;
      }
    }, 1)
  });
}

function toggleTheme(){
  document.getElementById('dark-theme').addEventListener('change', (e) => {
    if(e.target.checked){
      document.body.classList.add('dark');
    }else{
      document.body.classList.remove('dark'); 
    }
  });
}

function toggleDiesWhenHittingTheWall(game){
  document.querySelector('input#diesWhenHittingTheWall').addEventListener('change', (e) => {
    game.diesWhenHittingTheWall = e.target.checked;
  });
}
function toggleDiesByHittingHisOwnBody(game){
  document.querySelector('input#diesByHittingHisOwnBody').addEventListener('change', (e) => {
    game.diesByHittingHisOwnBody = e.target.checked;
  });
}

function toggleAI(game){
  document.querySelector('input#AI').addEventListener('change', (e) => {
    game.ai.active = e.target.checked;
  });
}

function loadEvents(game){
  keyboard(game);
  toggleDiesWhenHittingTheWall(game);
  toggleDiesByHittingHisOwnBody(game);
  toggleAI(game);
  toggleTheme();
}


