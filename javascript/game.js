exports = typeof window !== "undefined" && window !== null ? window : global;

exports.Game = function() {
  var players = [];
  var questionTypes = ['pop', 'science', 'sports', 'rock'];
  var questions = {
	pop: [],
	science: [],
	sports: [],
	rock: []
  };
  var categories = ['Pop', 'Science', 'Sports', 'Rock'];
  
  var currentPlayer = 0;
  var isGettingOutOfPenaltyBox = false;

  var didPlayerWin = function(){
    return (players[currentPlayer].purse !== 6);
  };
  
  var currentCategory = function(){
	return categories[players[currentPlayer].place % 4];
  };
  
  // Build dummy questions
  for (var i = 0; i < 50; i++) {
	for (var j = 0; j < 4; j++) {
	  questions[questionTypes[j]].push(categories[j] + ' Question ' + i);
	};
  };

  this.isPlayable = function(){
    return players.length >= 2;
  };

  this.add = function(playerName){
	var player = {
	  name: playerName,
	  place: 0,
	  purse: 0,
	  inPenaltyBox: false
	};
    players.push(player);
    
    console.log(playerName + " was added");
    console.log("They are player number " + players.length);

    return true;
  };

  var askQuestion = function(){
	var questionIndex = categories.indexOf(currentCategory());
	if (questionIndex === -1) return false;
	
    console.log(questions[questionTypes[questionIndex]].shift());
  };

  this.roll = function(roll){
    console.log(players[currentPlayer].name + " is the current player");
    console.log("They have rolled a " + roll);

    if(players[currentPlayer].inPenaltyBox){
      if(roll % 2 !== 0){
        isGettingOutOfPenaltyBox = true;

        console.log(players[currentPlayer].name + " is getting out of the penalty box");
        players[currentPlayer].place = (players[currentPlayer].place + roll) % 12;

        console.log(players[currentPlayer].name + "'s new location is " + players[currentPlayer].place);
        console.log("The category is " + currentCategory());
        askQuestion();
      }else{
        console.log(players[currentPlayer].name + " is not getting out of the penalty box");
        isGettingOutOfPenaltyBox = false;
      }
    }else{
      players[currentPlayer].place = (players[currentPlayer].place + roll) % 12;
      
      console.log(players[currentPlayer].name + "'s new location is " + players[currentPlayer].place);
      console.log("The category is " + currentCategory());
      askQuestion();
    }
  };
  
  this.wasCorrectlyAnswered = function(){
	var winner = true;
    if(players[currentPlayer].inPenaltyBox){
      if(isGettingOutOfPenaltyBox){
        console.log('Answer was correct!!!!');
        players[currentPlayer].purse += 1;
        console.log(players[currentPlayer].name + " now has " +
                    players[currentPlayer].purse  + " Gold Coins.");

        winner = didPlayerWin();
      }
    }else{
      console.log("Answer was correct!!!!");

      players[currentPlayer].purse += 1;
      console.log(players[currentPlayer].name + " now has " +
                  players[currentPlayer].purse  + " Gold Coins.");

      winner = didPlayerWin();
    }
	
	currentPlayer = (currentPlayer + 1) % players.length;
	return winner;
  };

  this.wrongAnswer = function(){
	console.log('Question was incorrectly answered');
	console.log(players[currentPlayer].name + " was sent to the penalty box");
	players[currentPlayer].inPenaltyBox = true;

    currentPlayer = (currentPlayer + 1) % players.length;
	return true;
  };
};

var notAWinner = false;

var game = new Game();

game.add('Chet');
game.add('Pat');
game.add('Sue');

do{

  game.roll(Math.floor(Math.random()*6) + 1);

  if(Math.floor(Math.random()*10) == 7){
    notAWinner = game.wrongAnswer();
  }else{
    notAWinner = game.wasCorrectlyAnswered();
  }

}while(notAWinner);
