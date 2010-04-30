var reader = function() {
    //private data/functions
    var border_colors1 = ["#FFFF66","#FFCC00","#FF9900","#FF0000"];
    var border_colors2 = ["#CE0000","#F7D708","#FF9E00","#009ECE"];
    var border_colors3 = ["#FF9E00","#80FF00","#00FF00","#00FF80","#00FFFF","#0080FF","#0000FF","#8000FF"];

    function init() {
        /* setup #userfeedlist settings, toggles */

        //colors
        // $.map($("#userfeedlist ul li"), function (el, index) {
        //     return $(el).css("border-color", border_colors3[index % border_colors3.length]);
        // });

        this.update_feed_count();
        this.setup_drag();
    }
    function add_new_feed(old_feed) {
        var new_feed = $(old_feed).clone();
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
            $("#newfeedlist").height($("#userfeedlist ul").height() +20);
        } else {
            $("#userfeedlist").height($("#newfeedlist ul").height() +20);

            //set the div height to match the ul for the drag hover
            //background
            $("#newfeedlist").height($("#newfeedlist ul").height() + 50);
        }
    }
    function update_feed_count() {
        //extra check to not count the transparent "dragging" li
        $('#num_user_feeds').text($('#userfeedlist ul li:not([class$=ui-draggable-dragging])').length);
        $('#num_new_feeds').text($('#newfeedlist ul li').length);
    }
    function alpha_sort_feeds() {
        //setup useful data
        var userlist = $('#userfeedlist ul');
        var feeds = userlist.children('li').get();

        //first, remove any H2 category headers leftover from category sort
        $('#userfeedlist ul h2').remove();

        //remove dups leftover from category sort using unique index
        var uniq_feeds = [];
        for(feed_index in feeds) {
            //match off url
            var url = feeds[feed_index].childNodes[3].innerHTML;
            //if first time found, add it to unique index
            if($.inArray(url, uniq_feeds) === -1) {
                uniq_feeds.push(url);
            //otherwise remove it
            } else {
                $(feeds[feed_index]).remove();
            }
        }


        //refresh feed list that has changed
        var feeds = userlist.children('li').get();

        //sort feeds alphabetically
        feeds.sort(function(a, b) {
            var compA = $(a).text().toUpperCase();
            var compB = $(b).text().toUpperCase();
            return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
        });
        $.each(feeds, function(idx, itm) { userlist.append(itm); });

        this.update_feed_count();
        this.balance_heights();
    }
    function category_sort_feeds() {
        var userlist = $('#userfeedlist ul');
        //remove current alpha-sorted feed elements
        userlist.children().remove();

        //loop through unique categories
        for(cat_index in reader.categories) {
            //add category header
            var cat_header = $('<h2></h2>');
            var category_label = reader.categories[cat_index];
            cat_header.text(category_label);
            $(userlist).append(cat_header);

            //for all feeds, if the categories match, add the feed to the
            //category
            for(data_index in reader.data) {
                var feed_cats = reader.data[data_index]["categories"];
                for(feed_index in feed_cats) {
                    if(category_label === feed_cats[feed_index]) {
                        //append feed
                        $(userlist).append(
                            this.build_feed_item(
                                reader.data[data_index]["title"],
                                reader.data[data_index]["url"])
                        );
                    }
                }
            }
        }

        this.setup_drag();
        this.update_feed_count();
        this.balance_heights();
    }
    function build_feed_item(title, url) {
        var li = $('<li class="borders ui-draggable"></li>');
        var title_el = $('<span class="feed-title">'+title+'</span>');
        var rss_el = $('<img class="rssicon" src="/media/img/rssfavicon.gif"/><br/>');
        var url_el = $('<span class="alt">'+url+'</span>');
        var input_el = $('<input type="hidden" />');
        $(input_el).attr('name', title).attr('url', url);

        $(li).append(title_el).append(rss_el).append(url_el).append(input_el);
        return li;
    }

    function setup_drag_handlers() {
        $("#userfeedlist ul li").draggable({
            cursorAt: { left: 80, top: 25 },
            helper: 'clone',
            opacity: 0.50,
            revert: "invalid"
        });
    }

    //public data/functions
	return {
        init: init,
        add_new_feed: add_new_feed,
        balance_heights: balance_heights,
        build_feed_item: build_feed_item,
        update_feed_count: update_feed_count,
        alpha_sort_feeds: alpha_sort_feeds,
        cat_sort: category_sort_feeds,
        setup_drag: setup_drag_handlers
	}
}();

//DOMReady events
//Setup drag/drops and load elements
$(function() {
    reader.init();

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

    $("#category_toggle").bind('click', function() {
            reader.cat_sort();
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
