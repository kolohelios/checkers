'use strict';

(function(){
  $(document).ready(init);

  var disableChangeHighlight = false;

  function init(){
    paintCheckers();
    whichPlayerStartsFirst();
    setSpacesForTurn();
    getAndUpdatePieceCounts();
  }

  function paintCheckers(){
    for(var i = 0; i < 3; i++){
      for(var j = (i === 1) ? 1 : 0; j < 8; j += 2){
        var $loc = $('[data-x=' + j + '][data-y=' + i + ']');
        $loc.addClass('p1').addClass('p1-pawn');
      }
    }
    for(var k = 5; k < 8; k++){
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
    if($('.highlightedspace').length > 0){
      if($(this).hasClass('highlightedspace')){
        if(disableChangeHighlight === false){
          $(this).removeClass('highlightedspace');
          setSpacesForTurn();
        }
      }else{
        if(movePiece(this) === 'jumpagain'){
          disableChangeHighlight = true;
        }else{
          activePlayerToggle();
          setSpacesForTurn();
          disableChangeHighlight = false;
        }
      }
    }else{
      $(this).addClass('highlightedspace');
      var x = $(this).data('x');
      var y = $(this).data('y');
      findLegalMoves(x, y, true);
    }
    getAndUpdatePieceCounts();
    isThereAWinner();
  }

  function findLegalMoves(x, y, firstMove){
    clearClickableSpacesAndDebugHighlighting();
     // set current space
    setLegalSpace(x, y);
    $('.highlightedspace').removeClass('debughighlight');
    var activePlayer = $('.activeplayer').attr('id');
    var isKing = false;
    if($('.highlightedspace').hasClass(activePlayer + '-king')){
      isKing = true;
    }
    console.log(isKing);
    var loc = $('.highlightedspace');
    x = loc.data('x');
    y = loc.data('y');
    var yArray = (isKing) ? [1, -1] : [1];
    var yDirection = (activePlayer === 'p1') ? 1 : -1;
    [1, -1].forEach(function(i){
      yArray.forEach(function(j){
        if(isPositionOnBoard(x + i, y + (j * yDirection))){
          var nextPositionState = positionState(x + i, y + (j * yDirection), activePlayer);
          if(nextPositionState === 'clear'){
            if(firstMove === true){
              setLegalSpace(x + i, y + (j * yDirection));
            }
          }else if(nextPositionState === 'competitor'){
            var jumpPositionState = positionState(x + i * 2, y + (j * yDirection * 2), activePlayer);
            if(jumpPositionState === 'clear'){
              console.log('jumpPositionState is clear');
              setLegalSpace(x + i * 2, y + (j * yDirection * 2));
            }
          }
        }
      });
    });
    var legalMovesAvailable = $('.debughighlight').length;
    console.log('legal moves available', legalMovesAvailable);
    return legalMovesAvailable;
  }

  function setSpacesForTurn(){
    clearClickableSpacesAndDebugHighlighting();
    $('.highlightedspace').removeClass('highlightedspace');
    var activePlayer = $('.activeplayer').attr('id');
    var arrayOfSpaces = createArrayOfPlayerSpaces(activePlayer);
    arrayOfSpaces.forEach(function(array){
      var x = array[0];
      var y = array[1];
      setLegalSpace(x, y);
    });
  }

  function clearClickableSpacesAndDebugHighlighting(){
    $('td').off('click');
    $('.debughighlight').removeClass('debughighlight');
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

  function positionState(x, y, player){
    var competitor = (player === 'p1') ? 'p2' : 'p1';
    var loc = $('[data-x=' + x + '][data-y=' + y + ']');
    if($(loc).hasClass(player)){
      return 'player';
    }else if($(loc).hasClass(competitor)){
      return 'competitor';
    }
    return 'clear';
  }

  function setLegalSpace(x, y){
    var $loc = $('[data-x=' + x + '][data-y=' + y + ']');
    $loc.on('click', clickToPick);
    $loc.addClass('debughighlight');
  }

  function movePiece(space){
    var activePlayer = $('.activeplayer').attr('id');
    var $originSpace = $('.highlightedspace');
    var competitor = (activePlayer === 'p1') ? 'p2' : 'p1';
    var subsequentJumpAvailable = false;
    var pieceRemoved;
    if(Math.abs(($(space).data('x') - $originSpace.data('x'))) === 2){
      removeCompetitorPiece(space, $originSpace, competitor);
      pieceRemoved = true;
    }
    var originClasses = $originSpace.attr('class');
    var spaceClasses = $(space).attr('class');
    $(space).attr('class', originClasses);
    $originSpace.attr('class', spaceClasses);
    if(pieceRemoved){
      $(space).addClass('highlightedspace');
      subsequentJumpAvailable = findLegalMoves($(space).data('x'), $(space).data('y'), false) > 0 ? true : false;
      console.log('subsequent jump available', subsequentJumpAvailable);
    }
    checkForCrowning(activePlayer, space);
    if(subsequentJumpAvailable){
      return 'jumpagain';
    }
    return 'endofturn';
  }

  function removeCompetitorPiece(space, $originSpace, competitor){
    var deltaX = ($(space).data('x') - $originSpace.data('x'));
    var deltaY = ($(space).data('y') - $originSpace.data('y'));
    var middleX, middleY;
    middleX = (deltaX < 0) ? $(space).data('x') + 1 : middleX = $(space).data('x') - 1;
    middleY = (deltaY < 0) ? $(space).data('y') + 1 : middleY = $(space).data('y') - 1;
    var $middleSpace = $('[data-x=' + middleX + '][data-y=' + middleY + ']');
    $middleSpace.removeClass(competitor + ' ' + competitor + '-pawn' + ' ' + competitor + '-king');
  }

  function createArrayOfPlayerSpaces(player){
    var array = [];
    $('.' + player).each(function(){
      var x = $(this).data('x');
      var y = $(this).data('y');
      array.push([x, y]);
    });
    return array;
  }

  function checkForCrowning(player, space){
    var yValue = $(space).data('y');
    if(player === 'p1' && yValue === 7 && $(space).hasClass('p1-pawn')){
      $(space).removeClass('p1-pawn').addClass('p1-king');
    }else if(player === 'p2' && yValue === 0 && $(space).hasClass('p2-pawn')){
      $(space).removeClass('p2-pawn').addClass('p2-king');
    }
  }

  function getAndUpdatePieceCounts(){
    var p1Pieces = $('.p1').length;
    var p2Pieces = $('.p2').length;
    $('#p1count').text(p1Pieces);
    $('#p2count').text(p2Pieces);
    return [p1Pieces, p2Pieces];
  }

  function isThereAWinner(){
    var pieceCounts = getAndUpdatePieceCounts();
    // player 2
    if(pieceCounts[0] === 0){
      displayWinMessage(2);
    // player 1
    }else if(pieceCounts[1] === 0){
      displayWinMessage(1);
    }
  }

  function displayWinMessage(winningPlayer){
    $('#controls').hide();
    var winMessage = 'Player ' + winningPlayer + ' Wins!';
    $('#winmessage').text(winMessage);
    $('#winmessage').show();
  }
})($);
