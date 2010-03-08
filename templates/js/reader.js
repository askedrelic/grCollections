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
            //swap DOM element
            $("#newfeedlist ul").append(new_feed);
            //remove drag
            new_feed.draggable('disable');
            //change styles
        },
        check_heights : function() {
            //gaurantees the minimum height of both columns is
            //equal


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
            $(this).removeClass('ui-drophover');
            reader.add_new_feed(ui.draggable);
        },
        over: function(event, ui) {
            $(this).addClass('ui-drophover');
        },
        out: function(event, ui) {
            $(this).removeClass('ui-drophover');
        }
    });

    $(user_feed_list).hide();

    setTimeout(function() {
        $(".spinner").hide();
        $(user_feed_list).fadeIn(50);
        },500);
});
