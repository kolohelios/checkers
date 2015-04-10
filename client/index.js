'use strict';

$(document).ready(init);

function init(){
  paintCheckers();
  whichPlayerStartsFirst();
}

function paintCheckers() {
  for(var i = 0; i < 3; i++) {
    for(var j = (i === 1) ? 1 : 0; j < 8; j += 2){
      var $loc = $('[data-x=' + j + '][data-y=' + i + ']');
      $loc.addClass('marmot-black');
    }
  }
  for(var i = 5; i < 8; i++) {
    for(var j = (i === 6) ? 1 : 0; j < 8; j += 2){
      var $loc = $('[data-x=' + j + '][data-y=' + i + ']');
      $loc.addClass('marmot-red');
    }
  }
}

function whichPlayerStartsFirst(){
  var randNumber = Math.floor(Math.random * 2);
  console.log(randNumber);
  $('#p' + randNumber).addClass('activeplayer');
}
