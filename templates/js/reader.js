/*
 * Reader data loading and GUI manipulation functions.
 * 
 */
$(function() {

    //setup data
    var testdata = ["data1", "data2", "data3"];
    $.get("/echo/", { echo: "echo data4"}, function(data) {
        testdata.push(data);
        testdata.push("data5");
        });
    var feedlist = $('div#userfeedlist ul');
    feedlist.hide();

    //load data
    var testdata_length = testdata.length;
    for(i=0; i<testdata_length; i++) {
        feedlist.append("<li>" + testdata[i] + "</li>");
        };

    //display data
    setTimeout(function() {
        feedlist.fadeIn(2000);        
        
        },2000);


});
