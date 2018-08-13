/*
		@EdenNimni
		
		GAME: Snake

		DESC: Simple snake game using HTML5 canvas and JavaScript.
			  Using Singletonic style classes for game, board, snake and food.
		HOW TO PLAY:
			  Press the 'Start!' button and control the green square(s) using 'UP, DOWN, LEFT, RIGHT'
			  Keys on your keyboard.

*/

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var square_size = 100;
var num_of_squares = 10;


var game = {
	_gameloop: undefined,

	StartGame: function() {
		if(this._gameloop != undefined) {
			this.StopGame();
		}


		board.init();
		snake.init();
		food.init();

		this._gameloop = setInterval(this.GameLoop.bind(this), 125);
	},
	StopGame: function() {
		clearInterval(this._gameloop);
		this._gameloop = undefined;
	},

	GameLoop: function() {
		next_pos = snake.GetNext(snake._direction);
		head_of_snake_X = next_pos.x, head_of_snake_Y = next_pos.y;

		if (head_of_snake_X == -1 || head_of_snake_Y == -1 || head_of_snake_X > num_of_squares - 1 || head_of_snake_Y > num_of_squares - 1 || board.array[head_of_snake_X][head_of_snake_Y]) {
			this.StopGame();
			return;
		}
		snake.MoveSnake(head_of_snake_X, head_of_snake_Y);

		if(snake._snake_pos[0].x == food._pos.X && snake._snake_pos[0].y == food._pos.Y){
			snake._snake_grow += snake._num_grow;
			food.ApplyNextFood();
		}
	},

}

var board = { array : {},
			
			init: function() {
				this.PopulateArray();
				this.DrawBoard();
			},

			PopulateArray : function() {
				this.array = new Array(num_of_squares);
				for(i = 0; i < num_of_squares; i++){
						this.array[i] = new Array(num_of_squares);
				}
			},

			DrawBoard : function() {
				ctx.clearRect(0, 0, num_of_squares * square_size, num_of_squares * square_size);
				for(i = 0; i < num_of_squares; i++) {
					for(j = 0; j < num_of_squares; j++) {
						ctx.rect(i * square_size, j * square_size, square_size, square_size);
						ctx.stroke();
					}
				}
			},
}

var snake = { _snake_pos: [],
			  _num_grow: 5,
			  _snake_grow: 0,
			  _direction: 'down',

			  init: function () {
			  		this._snake_pos = [];
			  		this._snake_grow = 0;
			  		this._direction = 'down';

			  		this.MoveSnake(0, 0);
			  		this.DrawSnake(0, 0);

			  },

			  MoveSnake: function(next_X, next_Y) {

			  		if (this._snake_grow > 0) {
			  			return this.GrowSnake(next_X, next_Y);
			  		}

			  		tail = this._snake_pos.pop(); // take the tail of the snake, and reposition it in next_X, next_Y 
			  		if (tail != undefined) {
				  		board.array[tail.x][tail.y] = 0; // remove the snake part from board

						ctx.fillStyle = 'white';
						ctx.fillRect(tail.x * square_size, tail.y * square_size, square_size, square_size);
						ctx.strokeRect(tail.x * square_size, tail.y * square_size, square_size, square_size);

						board.array[next_X][next_Y] = 1; // add new snake part to board
			  		}

					this._snake_pos.unshift({x: next_X, y: next_Y});
					this.DrawSnake(next_X, next_Y);
			  },

			  GetNext: function(next_direction) {
			  		head_of_snake_X = this._snake_pos[0].x;
					head_of_snake_Y = this._snake_pos[0].y;

					if(next_direction == 'down'){
						head_of_snake_Y++;
					} else if (next_direction == 'up') {
						head_of_snake_Y--;
					} else if (next_direction == 'right') {
						head_of_snake_X++;
					} else if (next_direction == 'left') {
						head_of_snake_X--;
					}

					return {x: head_of_snake_X, y: head_of_snake_Y};
			  },

			  CanMove: function(next_direction) {
			  		if (this._snake_pos.length == 1) {
						return true;
					}
					next_pos = this.GetNext(next_direction);

					head_snake_pos_x = next_pos.x, head_snake_pos_y = next_pos.y;
					previous_head_snake_pos = this._snake_pos[1];

					if(head_snake_pos_x == previous_head_snake_pos.x && head_snake_pos_y == previous_head_snake_pos.y) {
						return false;
					}
					return true;
			  },

			  GrowSnake: function(next_X, next_Y) {
			  		if (this._snake_grow == 0){
			  			return;
			  		}
			  		this._snake_pos.unshift(
			  								{x: next_X,
			  								 y: next_Y}
			  							   );
			  		this.DrawSnake(next_X, next_Y);

			  		board.array[next_X][next_Y] = 1;
			  		this._snake_grow -= 1;
			  },

			  DrawSnake: function(x, y) {
			  	ctx.fillStyle = 'green';
				ctx.fillRect(x * square_size, y * square_size, square_size, square_size);
			  },

			};
var food = { 
			 _pos : {
			 	X: -1, Y: -1
			 },

			 init: function() {
			 	_pos = {X: -1, Y: -1};
			 	this.ApplyNextFood();
			 },

			 CalcNextAvailableLocation: function() {
		 		nextX = -1, nextY = -1;
				while (nextX == -1 || nextY == -1 || board.array[nextX][nextY] == 1) {
					nextX = Math.floor(((Math.random() * 10) + 1) % num_of_squares);
					nextY = Math.floor(((Math.random() * 10) + 1) % num_of_squares);
				}
				return {X : nextX, Y : nextY}
			 },

			 DrawFood: function(x, y) {
			 	ctx.fillStyle = 'yellow';
				ctx.fillRect(x * square_size, y * square_size, square_size, square_size);

				/*ctx.strokeStyle = 'darkgreen';
				ctx.strokeRect(x * square_size, y * square_size, square_size, square_size);*/
			 },

			 ApplyNextFood: function() {
			 	this._pos = this.CalcNextAvailableLocation();
			 	this.DrawFood(this._pos.X, this._pos.Y);
			 },
		};


var btn = document.getElementById('start-game-button');
btn.addEventListener("click", function(){ game.StartGame();});


document.onkeydown = function(event) {
	keyCode = window.event.keyCode;
	keyCode = event.keyCode;

	switch(keyCode) {
		case 37:
			if (snake.CanMove('left')) {
				snake._direction = 'left';
			}
			break;
		case 39:
			if (snake.CanMove('right')) {
				snake._direction = 'right';
			}
			break;
		case 38:
			if (snake.CanMove('up')) {
				snake._direction = 'up';
			}
			break;
		case 40:
			if (snake.CanMove('down')) {
				snake._direction = 'down';
			}
			break;
	}
}