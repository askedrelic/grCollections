var reader = function() {
    //private data/functions
    var border_colors1 = ["#FFFF66","#FFCC00","#FF9900","#FF0000"]; 
    var border_colors2 = ["#CE0000","#F7D708","#FF9E00","#009ECE"]; 
    var border_colors3 = ["#FF9E00","#80FF00","#00FF00","#00FF80","#00FFFF","#0080FF","#0000FF","#8000FF"]; 
    //public data/functions
	return {
        init: function() {
            //setup #userfeedlist settings, toggles
            $.map($("#userfeedlist ul li"), function (el, index) {
                return $(el).css("border-color", border_colors3[index % border_colors3.length]);
            });
        },
        add_new_feed: function(new_feed) {
            //move DOM element
            new_feed.appendTo("#newfeedlist ul");
            //remove drag
            new_feed.draggable('disable');
            //change styles
            new_feed.removeClass('ui-draggable');
            new_feed.addClass('ui-droppeditem');
        },
        balance_heights: function() {
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
    reader.init();

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
        $("#userfeedlist").slideDown(200, function () {
            reader.balance_heights();
            });
        },500);
});
