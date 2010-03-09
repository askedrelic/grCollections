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
$(function() {
    var user_feed_list = $("#userfeedlist ul li");
    var new_feed_list = $("#newfeedlist");
    
    user_feed_list.draggable({
        cursorAt: { left: 80, top: 25 },
        helper: function() {
            return $(this).clone().css({
                'background':'#AAAAAA',
            });
        },
        opacity: 0.50,
        revert: "invalid"
    });
    new_feed_list.droppable({
        drop: function(event, ui) {
            reader.add_new_feed(ui.draggable);
            reader.balance_heights();
        },
        hoverClass: 'ui-drophover'
    });

    $(user_feed_list).hide();


    setTimeout(function() {
        $(".spinner").hide();
        $(user_feed_list).fadeIn(50);
        reader.balance_heights();
        },500);
});
