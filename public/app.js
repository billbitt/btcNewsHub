$(document).on("click", "#scrape-btn", function(){
    // run a new scrape
    $.ajax({
        method: "GET",
        url: "api/scrape",
    }).done(function(data){
        console.log(data);
    })
})