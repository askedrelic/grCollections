/*
 * Project editing javascript functions.
 * 
 */
$(document).ready(function() {
    $("#id_description")
        .keypress( function (e) {
        $("#desc-size-counter").html("Characters left:"+(5000-this.textLength));
        });
});



