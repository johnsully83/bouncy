$(document).ready(function() {
    $.drop({ multi: true });
   
    $.bouncy = {};
    $.bouncy.colors = [ 'red', 'green', 'blue', 'orange', 'purple' ];
    $.bouncy.speed = 2000;
    $.bouncy.length = 100;
    $.bouncy.moves = 0;
    $.bouncy.level = 1;
    $.bouncy.score = 0;
    $.bouncy.moveDataMap = {
    	0 : {
    		level : 1,
    		speed : 2000,
    		length : 100
    	},
    	10 : {
    		level : 2,
    		speed : 1750,
    		length : 150
    	},
    	30 : {
    		level : 3,
    		speed : 1500,
    		length : 200
    	},
    	70 : {
    		level : 4,
    		speed : 1250,
    		length : 250
    	},
    	125 : {
    		level : 5,
    		speed : 875,
    		length : 325
    	},
    	200 : {
    		level : 6,
    		speed : 550,
    		length : 400
    	},
    	300 : {
    		level : 7,
    		speed : 200,
    		length : 500
    	},
    	400 : {
    		level : 8,
    		speed : 180,
    		length : 600
    	},
    	500 : {
    		level : 9,
    		speed : 170,
    		length : 700
    	},
    	1000 : {
    		level : 10,
    		speed : 150,
    		length : 850
    	}
    };
    
    $.bouncy.scoring = {
    	click : 1,
    	selectMultipliers : {
    		"3" : 1,
    		"5" : 2,
    		"10" : 5,
    		"15" : 10,
    		"20" : 20,
    		"10000" : 25
    	},
    	select : function(numberOfBalls, color) {
    		var multiplier = 1;
    		
    		if(numberOfBalls < 3) {
    			multiplier = $.bouncy.scoring.selectMultipliers["3"];
    		} else if(numberOfBalls < 5) {
    			multiplier = $.bouncy.scoring.selectMultipliers["5"];
    		} else if(numberOfBalls < 10) {
    			multiplier = $.bouncy.scoring.selectMultipliers["10"];
    		} else if(numberOfBalls < 15) {
    			multiplier = $.bouncy.scoring.selectMultipliers["15"];
    		} else if(numberOfBalls < 20) {
    			multiplier = $.bouncy.scoring.selectMultipliers["20"];
    		} else {
    			multiplier = $.bouncy.scoring.selectMultipliers["10000"];
    		}
    		
    		if($('.'+color).length == 0) {
    			multiplier = multiplier * 5;
    		}
    		
    		return numberOfBalls * multiplier * $.bouncy.level;
    	}
    };
    
    $.bouncy.updateScoreboard = function() {
    	$('#score').text($.bouncy.score);
    	$('#level').text($.bouncy.level);
    };
    
    $.bouncy.incrementScore = function( value ) {
    	$.bouncy.score += value;
    	
    	$.bouncy.updateScoreboard();
    };
    
    $.bouncy.incrementMoveCount = function() {
    	$.bouncy.moves++;
    	
    	$.bouncy.adjustSpeed();
    };
    
    $.bouncy.adjustSpeed = function() {
    	var moveData = $.bouncy.moveDataMap[$.bouncy.moves];
    	
    	if(moveData) {
    		$.bouncy.speed = moveData.speed;
    		$.bouncy.length = moveData.length;
    		
    		$.bouncy.level = moveData.level;
    		$.bouncy.updateScoreboard();
    	}
    };
    
    $.fn.cloneBall = function() {
    	var classes = $(this).prop('class');
    	
    	var css = {
    		left: $(this).css('left'),
    		top: $(this).css('top')
    	}
    	
    	$('<li />').prop('class', classes).css(css).bounce().appendTo('ul');
    };
    
    $.fn.prepareDrop = function() {
    	$(this).drop('start',function() {
    		$( this ).addClass('active');
    	}).drop(function( ev, dd ){
    		$( this ).addClass('dropped');
    	}).drop('end',function() {
    		$( this ).removeClass('active');
    	});
    	
    	return $(this);
    };
    
    $.fn.randomLeft = function() {
    	var diameter = $(this).width();
        var position = $(this).position();
        var pageWidth = $(document).width();
        
        var randomLeft = Math.round((Math.random() * $.bouncy.length) - ($.bouncy.length / 2));
        
        if(position.left + randomLeft + 25 > pageWidth || position.left + randomLeft < 0) {
        	randomLeft = -randomLeft;
        }
        
        return randomLeft;
    };
    
    $.fn.randomTop = function() {
    	var diameter = $(this).width();
        var position = $(this).position();
        var pageHeight = $(document).height();
        
        var randomTop = Math.round((Math.random() * $.bouncy.length) - ($.bouncy.length / 2));
        
        if(position.top + randomTop + diameter > pageHeight || position.top + randomTop < 0) {
        	randomTop = -randomTop;   
        }
        
        return randomTop;
    };
    
    $.fn.isInScoreboard = function(left, top) {
        var position = $(this).position();
        var diameter = $(this).width();
        
        var scoreboard = $('#scoreboard');
        var scoreboardPosition = {
        	top: scoreboard.position().top,
        	left: scoreboard.position().left,
        	bottom: scoreboard.position().top+scoreboard.height(),
        	right: scoreboard.position().left+scoreboard.width()
        };
        
        if((position.left+left) < scoreboardPosition.right 
        	&& (position.top+top) < scoreboardPosition.bottom
        	&& (position.top+top+diameter) > scoreboardPosition.top
        	&& (position.left+left+diameter) > scoreboardPosition.left) {

        	return true;
        }
        
        return false;
    };
    
    $.fn.doBounce = function() {
    	var randomTop = $(this).randomTop();
    	var randomLeft = $(this).randomLeft();
        
    	if($(this).isInScoreboard(randomLeft, randomTop)) {
    		randomTop = -randomTop;
    		randomLeft = -randomLeft;
    	}
    	
        var horizontal = '+='+randomLeft;
        var vertical = '+='+randomTop;
        
        $(this).animate({
            left: horizontal,
            top: vertical
        }, {
            duration: $.bouncy.speed,
            complete: function() {
            	$(this).doBounce();
            }
        });
        
    	return $(this);
    };
    
    $.fn.bounce = function() {
        $(this).on('mouseup', function() {
            if($(this).data('stopped')) {
                $(this).data('stopped', false);
                $(this).cloneBall();
                
            	$.bouncy.incrementMoveCount();
            	$.bouncy.incrementScore($.bouncy.scoring.click);
            } else {
                $(this).stop(true, false).data('stopped', true);
            }
        }).prepareDrop().doBounce();
        
        return $(this);
    };
    
    var pageWidth = $(document).width();
    var pageHeight = $(document).height();
    
    var largestOffsetFromCenter = Math.round(($('.ball').length-1)/2);
    
    $('.ball').each(function(index) {
    	var diameter = $(this).width();
    	
        $(this).css({
            top: (pageHeight/2-diameter),
            left: (pageWidth/2-(diameter+10)*(index-largestOffsetFromCenter)-diameter) 
        });
    }).bounce();
    
    $(document).on('mousedown', function() {
        $('.ball').stop(true, false);
    }).on('mouseup', function() {
        $('.ball').not(function(index, element) {
        	return $(element).data('stopped');
        }).each(function() {
        	$(this).doBounce();
        });
    }).drag('start',function( event, drag ){
		return $('<div />').addClass('selection').appendTo( document.body );
	}).drag(function( event, drag ){
		$( drag.proxy ).css({
			top: Math.min( event.pageY, drag.startY ),
			left: Math.min( event.pageX, drag.startX ),
			height: Math.abs( event.pageY - drag.startY ),
			width: Math.abs( event.pageX - drag.startX )
		});
	}).drag('end',function( event, drag ){
		var dragSize = $(drag.proxy).width() * $(drag.proxy).height();
		
		$( drag.proxy ).remove();
		
		if(dragSize >= (25 * 25 * 2)) {
			$.bouncy.incrementMoveCount();
			
			var selectedColors = [];
			
			$.each($.bouncy.colors, function(index, color) {
				if(selectedColors.length > 1) {
					return false;
				}
				
				$('.dropped').each(function(index2, ball) {
					if($(ball).hasClass(color)) {
						selectedColors.push(color);
						
						return false;
					}
				});
			});

			if(selectedColors.length > 1) {
				$('.dropped').each(function() {
					$(this).cloneBall();
				});
			} else if(selectedColors.length == 1 && $('.dropped').length > 1) {
				var points = $.bouncy.scoring.select($('.dropped').length, selectedColors[0]);

				$.bouncy.incrementScore(points);
				
				$('.dropped').remove();
			}
		}
		
		$('.dropped').removeClass('dropped').each(function() {
			if($(this).data('stopped')) {
				$(this).doBounce();
			}
		});
	});
});

//http://threedubmedia.com/code/event/drop/demo/selection