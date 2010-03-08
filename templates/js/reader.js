/*
 * Reader data loading and GUI manipulation functions.
 *
 */
$(function() {
    $(".draggable").draggable({
        cursorAt: { left: 80, top: 25 },
        helper: function() {
            return $(this).clone().css({
                background: "blue",
            });
        }
    });
    $("#newfeedlist").droppable({
        drop: function() {
            $(this).html("Dropped!").css({
                background: "yellow",
                color: "black"
            });
        }
    });

    $('#userfeedlist, #newfeedlist').css({'opacity':0});
    setTimeout(function() {
        $(".spinner").hide();
        $('#userfeedlist, #newfeedlist').css({'opacity':100});
        $('div#userfeedlist ul').fadeIn(2000);
        },500);
});
