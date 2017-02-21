$(document).on("click", "#refresh-btn", function() {
    // run a new scrape
    $.ajax({
        method: "get",
        url: "api/scrape",
    }).done(function(response){
        console.log(response);
    })
});

$(document).on("click", ".toggle-comments", function(){
    //show comments 
    var comments = $(this).parent().children(".comments")
    if (comments.attr("hidden")){
        comments.attr("hidden", false);
        $(this).text("Hide Comments")
    } else {
        comments.attr("hidden", true);
        $(this).text("View Comments")
    };
    
    return false;
});

$(document).on("click", ".delete-comment", function() {
    var queryUrl = "/comment/" + $(this).attr("data-id");
    // delete comment
    $.ajax({
        method: "delete",
        url: queryUrl,
    }).done(function(response){
        console.log(response);
    })
});