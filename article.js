$(document).ready(function() {
   var stored = localStorage.getItem("user");
   var boss = localStorage.getItem("Owner");
   let addr = document.URL, id = addr[addr.length - 1];
   //ajax call to load article and comments on page load
   $.ajax({
      url: "http://127.0.0.1:3000/post/"+id,
      method: "GET",
      error: function(err) {
         alert("Error: Could not load blog content");
      },
      success: function(data_article){
         $(".card-title").html(`${data_article.title}`);
         $(".card-text").html(`<p class="text-justify">${data_article.body}</p>`);
         $.ajax({
            url: "http://127.0.0.1:3000/comments?postId="+id,
            method: "GET",
            error: function(err) {
               alert("Error: Could not load comments");
            },
            success: function(data){
               stored || boss ? data.forEach(comment => {
                  const feedback = `<p class="mb-2">${comment.body} - ${stored || boss}</p>`;
                  $("#comment_area").prepend(feedback);
               }) : data.forEach(comment => {
                  const feedback = `<p class="mb-2">${comment.body} - Anonymous</p>`;
                  $("#comment_area").prepend(feedback);
               });
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
            alert("Cannot post comments at the moment");
         },
         success: function(data){
            $("#textarea").hide();
            $("#comment_text").val("");
            $.ajax({
               url: "http://127.0.0.1:3000/comments?postId="+id,
               method: "GET",
               error: function(err) {
                  alert("Cannot retrieve comments from the database. Try again");
               },
               success: function(data){
                  stored || boss ? data.forEach(comment => {
                     const feedback = `<p class="mb-2">${comment.body} - ${stored || boss}</p>`;
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