/*
 * Reader data loading and GUI manipulation functions.
 *
 */
$(function() {
    $(".draggable").draggable({
        cursorAt: { left: 100, top: 20 },
        helper: function() {
            return $(this).clone().css({
                background: "blue",
            });
        }
    });
    $("#newfeedlist").droppable();

    $('#userfeedlist, #newfeedlist').css({'opacity':0});
    setTimeout(function() {
        $(".spinner").hide();
        $('#userfeedlist, #newfeedlist').css({'opacity':100});
        $('div#userfeedlist ul').fadeIn(2000);
        },1000);
});
