'use strict';

$(document).ready(init);

function init(){
  paintCheckers();
  whichPlayerStartsFirst();
  activePlayerToggle(false);
}

function paintCheckers() {
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

function activePlayerToggle(togglePlayer) {
  if(togglePlayer) {
    $('.player').toggleClass('activeplayer');
  }
  if($('#p1').hasClass('activeplayer')) {
    $('.p1').on('click', clickInSpace);
    $('.p2').off('click');
  }
  else {
    $('.p2').on('click', clickInSpace);
    $('.p1').off('click');
  }
}

function clickInSpace() {
  if($('.hightlightedspace')) {
    $(this).addClass('highlightedspace');
  }
  else {

  }
}
