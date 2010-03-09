var reader = function() {
    //private data/functions
    //
    //public data/functions
	return {
        init : function() {
            //setup #userfeedlist settings, toggles
            //ordering
        },
        add_new_feed : function(new_feed) {
            //move DOM element
            new_feed.appendTo("#newfeedlist ul");
            //remove drag
            new_feed.draggable('disable');
            //change styles
            new_feed.removeClass('ui-draggable');
            new_feed.addClass('ui-droppeditem');
        },
        balance_heights : function() {
            //balance the height of both columns
            if($("#userfeedlist").height() >= $("#newfeedlist").height()) {
                $("#newfeedlist").height($("#userfeedlist").height());
            } else {
                $("#userfeedlist").height($("#newfeedlist").height());
            }
        }
	};
}();

//DOMReady events
//Setup drag/drops and load elements
$(function() {
    $("#userfeedlist ul li").draggable({
        cursorAt: { left: 80, top: 25 },
        helper: function() {
            return $(this).clone().css({
                'background':'#AAAAAA',
            });
        },
        opacity: 0.50,
        revert: "invalid"
    });
    $("#newfeedlist").droppable({
        drop: function(event, ui) {
            reader.add_new_feed(ui.draggable);
            reader.balance_heights();
        },
        hoverClass: 'ui-drophover'
    });

    $("#userfeedlist").hide();
    setTimeout(function() {
        $(".spinner").hide();
        $("#userfeedlist").slideDown(200);
        },500);
});
