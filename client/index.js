'use strict';

$(document).ready(init);

var moveStaged = false;

function init(){
  paintCheckers();
  whichPlayerStartsFirst();
  findLegalMoves();
}

function paintCheckers(){
  for(var i = 0; i < 3; i++) {
    for(var j = (i === 1) ? 1 : 0; j < 8; j += 2){
      var $loc = $('[data-x=' + j + '][data-y=' + i + ']');
      $loc.addClass('p1').addClass('p1-pawn');
    }
  }
  for(var k = 5; k < 8; k++) {
    for(var l = (k === 6) ? 0 : 1; l < 8; l += 2){
      var $loc2 = $('[data-x=' + l + '][data-y=' + k + ']');
      $loc2.addClass('p2').addClass('p2-pawn');
    }
  }
}

function whichPlayerStartsFirst(){
  var firstPlayer = Math.floor(Math.random() * 2) + 1;
  $('#p' + firstPlayer).addClass('activeplayer');
}

function activePlayerToggle(){
  $('.player').toggleClass('activeplayer');
}

function clickToPick(){
  if(moveStaged){
    if($(this).hasClass('highlightedspace')){
      $(this).removeClass('highlightedspace');
      moveStaged = false;
    }
    else{
      movePiece(this);
      activePlayerToggle();
      moveStaged = false;
      findLegalMoves();
    }
  }
  else{
    $(this).addClass('highlightedspace');
    var x = $(this).data('x');
    var y = $(this).data('y');
    moveStaged = true;
    findLegalMoves(x, y);
  }
}

function findLegalMoves(x, y){
  $('td').off('click');
  setLegalSpace(x, y); // set current space
  var activePlayer = $('.activeplayer').attr('id');
  if(moveStaged){
    var arrayOfSpaces = createArrayOfPlayerSpaces(activePlayer);
    arrayOfSpaces.forEach(function(array) {
      var x = array[0];
      var y = array[1];
      var yDirection = (activePlayer === 'p1') ? 1 : -1;
      [1, -1].forEach(function(i) {
        if(isPositionOnBoard(x + i, y + yDirection)){
          setLegalSpace(x + 1, y + yDirection);
          console.log(x + 1, y + yDirection);
        }
      });
    });
  }
  else{
    var arrayOfSpaces = createArrayOfPlayerSpaces(activePlayer);
    arrayOfSpaces.forEach(function(array){
      var x = array[0];
      var y = array[1];
      setLegalSpace(x, y);
    });
  }
}

function isPositionOnBoard(x, y){
  var xIsGood = false, yIsGood = false;
  if((x > -1) || (x < 8)){
    xIsGood = true;
  }
  if((y > -1) || (y < 8)){
    yIsGood = true;
  }
  return xIsGood && yIsGood;
}

function setLegalSpace(x, y){
    var $loc = $('[data-x=' + x + '][data-y=' + y + ']');
    $loc.on('click', clickToPick);
}

function movePiece(space){
  var activePlayer = $('.activeplayer').attr('id');
  $('.highlightedspace').removeClass('activeplayer').removeClass(activePlayer + '-pawn').removeClass('highlightedspace');
  $(space).addClass(activePlayer).addClass(activePlayer + '-pawn');
}

function createArrayOfPlayerSpaces(player) {
  var array = [];
  $('.' + player).each(function() {
    var x = $(this).data('x');
    var y = $(this).data('y');
    array.push([x, y]);
  });
  return array;
}
