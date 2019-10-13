$(document).ready(function() {
   var stored = localStorage.getItem("user");
   let addr = document.URL, id = addr[addr.length - 1];
   //ajax call to load article and comments
   $.ajax({
      url: "http://127.0.0.1:3000/post/"+id,
      method: "GET",
      error: function(err) {
         console.log("Error: Could not load blog content");
      },
      success: function(data_article){
         $(".card-title").html(`${data_article.title}`);
         $(".card-text").html(`<p class="text-justify">${data_article.body}</p>`);
         $.ajax({
            url: "http://127.0.0.1:3000/comments?postId="+id,
            method: "GET",
            error: function(err) {
               console.log("Error: Could not load comments");
            },
            success: function(data){
               stored ? data.forEach(comment => {
                  const feedback = `<p class="mb-2">${comment.body} - ${stored}</p>`;
                  $("#comment_area").prepend(feedback);
               }) : data.forEach(comment => {
                  const feedback = `<p class="mb-2">${comment.body} - Anonymous</p>`;
                  $("#comment_area").prepend(feedback);
               });
               // data.forEach(comment => {
               //    const feedback = `<p class="mb-2">${comment.body}</p>`;
               //    $("#comment_area").prepend(feedback);
               // });
            }
         });
      }
   });
   $("#add_comment").click(function() {
      $("#textarea").toggle();
   });
   //code that handles posting and retrieving comments
   $('#comment').click(function() {
      let comment_body = $("#comment_text").val();
      var data = {body: comment_body, postId: id};
      $.ajax({
         url: "http://127.0.0.1:3000/comments",
         method: "POST",
         contentType: "application/json",
         data: JSON.stringify(data),
         dataType: "json",
         error: function(err) {
            console.log("Cannot post comments at the moment");
         },
         success: function(data){
            $("#textarea").hide();
            $("#comment_text").val("")
            $.ajax({
               url: "http://127.0.0.1:3000/comments?postId="+id,
               method: "GET",
               error: function(err) {
                  console.log("Cannot retrieve comments from the database. Try again");
               },
               success: function(data){
                  stored ? data.forEach(comment => {
                     const feedback = `<p class="mb-2">${comment.body} - ${stored}</p>`;
                     $("#comment_area").prepend(feedback);
                  }) : data.forEach(comment => {
                     const feedback = `<p class="mb-2">${comment.body} - Anonymous</p>`;
                     $("#comment_area").prepend(feedback);
                  });
               }
            });
         }
      })
   });
});