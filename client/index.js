'use strict';

$(document).ready(init);

function init(){
  paintCheckers();
  whichPlayerStartsFirst();
  activePlayerToggle(false);
  startSpaces();
}

function paintCheckers(){
  for(var i = 0; i < 3; i++) {
    for(var j = (i === 1) ? 1 : 0; j < 8; j += 2){
      var $loc = $('[data-x=' + j + '][data-y=' + i + ']');
      $loc.addClass('p1').addClass('p1-pawn');
    }
  }
  for(var i = 5; i < 8; i++) {
    for(var j = (i === 6) ? 0 : 1; j < 8; j += 2){
      var $loc = $('[data-x=' + j + '][data-y=' + i + ']');
      $loc.addClass('p2').addClass('p2-pawn');
    }
  }
}

function whichPlayerStartsFirst(){
  var firstPlayer = Math.floor(Math.random() * 2) + 1;
  $('#p' + firstPlayer).addClass('activeplayer');
}

function activePlayerToggle(togglePlayer){
  if(togglePlayer) {
    $('.player').toggleClass('activeplayer');
  }
}

function startSpaces(player){
  if($('#p1').hasClass('activeplayer')) {
    setLegalSpaces([[0,2],[2,2],[4,2],[6,2]]);
  }
  else {
    setLegalSpaces([[1,5],[3,5],[5,5],[7,5]]);
  }
}

function clickToPick(){
  if($(this).hasClass('highlightedspace')){
    $(this).toggleClass('highlightedspace');
    var x = $(this).data('x');
    var y = $(this).data('y');
    findLegalMoves(x,y);
  }
  else {
    $(this).addClass('highlightedspace');
  }
}

function findLegalMoves(x, y){
  //p1 pawn moves +y
  //p2 pawn moves -y
  var activePlayer = $('.activeplayer').attr('id');
  if(activePlayer === 'p1'){
    y++;
    for(var i = 0; i < 3; i += 2){
      isPositionOnBoard(i, y);
    }
  }
  if(activePlayer === 'p2'){
    y--;
    for(var i = 0; i < 3; i += 2){
      isPositionOnBoard(i, y);
    }
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

function setLegalSpaces(arrayOfArrays){
  $('td').off('click');
  arrayOfArrays.forEach(function(array) {
    var x = array[0];
    var y = array[1];
    console.log('x', x, 'y', y);
    var $loc = $('[data-x=' + x + '][data-y=' + y + ']');
    $loc.on('click', clickToPick);
  });
}
