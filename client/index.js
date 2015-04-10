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
    setLegalSpaces([0,2],[2,2],[4,2],[6,2]);
  }
  else {
    setLegalSpaces([1,6],[3,6],[5,6],[7,6]);
  }
}

function clickToPick(){
  if($(this).hasClass('highlightedspace')){
    $(this).toggleClass('highlightedspace');
    var x = $(this).data('x');
    var y = $(this).data('y');
    showLegalMoves(x, y);

  }
  else {
    $(this).addClass('highlightedspace');
  }
}

function showLegalMoves(x, y){
  //p1 pawn moves +y
  //p2 pawn moves -y
  var activePlayer = $('.activeplayer').attr('id');
  if(activePlayer === 'p1'){
    //if()
    for(var i = 0; i < 3; i += 2){
      console.log(x - i, y + 1);
    }
  }
}

function setLegalSpaces(arrayOfArrays){
  $('td').off('click');
  arrayOfArrays.forEach(function(array) {
    var x = array[0];
    var y = array[1];
    var $loc = $('[data-x=' + x + '][data-y=' + y + ']');
    $loc.on('click', clickToPick);
  });
}
