var reader = function() {
    //private data/functions
    var border_colors1 = ["#FFFF66","#FFCC00","#FF9900","#FF0000"];
    var border_colors2 = ["#CE0000","#F7D708","#FF9E00","#009ECE"];
    var border_colors3 = ["#FF9E00","#80FF00","#00FF00","#00FF80","#00FFFF","#0080FF","#0000FF","#8000FF"];

    function init() {
        /* setup #userfeedlist settings, toggles */
        
        $.map($("#userfeedlist ul li"), function (el, index) {
            return $(el).css("border-color", border_colors3[index % border_colors3.length]);
        });

        this.update_feed_count();
    }
    function add_new_feed(new_feed) {
        //move DOM element
        new_feed.appendTo("#newfeedlist ul");
        //remove drag
        new_feed.draggable('disable');
        //change styles
        new_feed.removeClass('ui-draggable');
        new_feed.addClass('ui-droppeditem');
    }
    function balance_heights() {
        //balance the height of both columns,
        //for css effects and proper DOM div heights
        if($("#userfeedlist ul").height() >= $("#newfeedlist ul").height()) {
            $("#newfeedlist").height($("#userfeedlist ul").height());
        } else {
            $("#userfeedlist").height($("#newfeedlist ul").height());

            //set the div height to match the ul for the drag hover
            //background
            $("#newfeedlist").height($("#newfeedlist ul").height() + 50);
        }
    }
    function build_feed_item(title, url, categories) {
    }
    function update_feed_count() {
        $('#num_user_feeds').text($('#userfeedlist ul li').length);
        $('#num_new_feeds').text($('#newfeedlist ul li').length);
    }
    function alpha_sort_feeds() {
        var userlist = $('#userfeedlist ul');
        var feeds = userlist.children('li').get();
        feeds.sort(function(a, b) {
            var compA = $(a).text().toUpperCase();
            var compB = $(b).text().toUpperCase();
            return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
        });
        $.each(feeds, function(idx, itm) { userlist.append(itm); });
    }

    //public data/functions
	return {
        init: init,
        add_new_feed: add_new_feed,
        balance_heights: balance_heights,
        build_feed_item: build_feed_item,
        update_feed_count: update_feed_count,
        alpha_sort_feeds: alpha_sort_feeds
	}
}();

//DOMReady events
//Setup drag/drops and load elements
$(function() {
    reader.init();

    $("#userfeedlist ul li").draggable({
        cursorAt: { left: 80, top: 25 },
        start: function(event, el) {
            reader.update_feed_count();
        },
        helper: 'clone',
        opacity: 0.50,
        revert: "invalid"
    });
    $("#newfeedlist").droppable({
        drop: function(event, ui) {
            reader.add_new_feed(ui.draggable);
            reader.balance_heights();
            reader.update_feed_count();
        },
        activeClass: 'ui-drophover'
    });

    //Remove the collection name input field text on click
    $("#newfeedtext").bind('click', function() {
            this.value = '';
    });

    //setup sorting of feeds
    $("#alpha_toggle").bind('click', function() {
            reader.alpha_sort_feeds();
            return false;
    });

    //slide the feeds in, in a flashy way!
    $("#userfeedlist").hide();
    setTimeout(function() {
        $(".spinner").hide();
        $("#userfeedlist").slideDown(200, function () {
            reader.balance_heights();
            });
        },500);
});
