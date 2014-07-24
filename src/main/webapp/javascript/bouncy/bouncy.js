$(document).ready(function() {
    $.bouncy = {};
    $.bouncy.colors = [ 'red', 'green', 'blue', 'orange', 'purple' ];
    $.bouncy.speed = 2000;
    $.bouncy.length = 100;
    $.bouncy.moves = 0;
    $.bouncy.moveDataMap = {
    	0 : {
    		speed : 2000,
    		length : 100
    	},
    	10 : {
    		speed : 1750,
    		length : 150
    	},
    	30 : {
    		speed : 1500,
    		length : 200
    	},
    	70 : {
    		speed : 1250,
    		length : 250
    	},
    	125 : {
    		speed : 875,
    		length : 325
    	},
    	200 : {
    		speed : 550,
    		length : 400
    	},
    	300 : {
    		speed : 200,
    		length : 500
    	}
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
    
    $.fn.doBounce = function() {
        var position = $(this).position();
        var pageWidth = $(document).width();
        
        var random = Math.round((Math.random() * $.bouncy.length) - ($.bouncy.length / 2));
        
        if(position.left + random + 25 > pageWidth || position.left + random < 0) {
             random = -random;   
        }
        
        var horizontal = '+='+random;
        
        random = Math.round((Math.random() * $.bouncy.length) - ($.bouncy.length / 2));
        
        var pageHeight = $(document).height();
        
        if(position.top + random + 25 > pageHeight || position.top + random < 0) {
             random = -random;   
        }
        
        var vertical = '+='+random;
        
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
            } else {
                $(this).stop(true, false).data('stopped', true);
            }
        }).prepareDrop().doBounce();
        
        return $(this);
    };
    
    var pageWidth = $(document).width();
    var pageHeight = $(document).height();
    
    $('.ball').each(function(index) {
        $(this).css({
            top: (pageHeight/2-25),
            left: (pageWidth/2-35*(index-2)-25) 
        });
    }).bounce();
    
    $(document).on('mousedown', function() {
        $('.ball').stop(true, false);
        console.log($('.ball').length);
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
				$('.dropped').remove();
			}
		}
		
		$('.dropped').removeClass('dropped').each(function() {
			if($(this).data('stopped')) {
				$(this).doBounce();
			}
		});
	});
    
    $.drop({ multi: true });
});

//http://threedubmedia.com/code/event/drop/demo/selection