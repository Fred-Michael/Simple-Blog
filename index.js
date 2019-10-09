$(document).ready(function() {
   //ajax call to get data from the json-server on document load
   $.ajax({
      url: "http://127.0.0.1:3000/post",
      method: "GET",
      error: function(err) {
         alert("Could not fetch data from database");
      },
      success: function(data){
         data.forEach(article => {
            const content = `<div class="card mb-3"><div class="card-body"><h3 class="card-title">${article.title}</h3><p class="card-text">${shorten(article.body)}</p><a href="blog1.html?id=${article.id}" class="card-link text-muted small text-italics mr-5">read more</a></div></div>`;
            $('#show_article').prepend(content);
         });
      }
   });
   $("#reg").click(function() {
      //ajax call to register users and store their details on the server
      let name = $("#name").val(), uname = $("#username").val(), password = $("#new_pwd").val(), mail = $("#new_email").val();
      var data = {name: name, username: uname, password: password, email: mail};
      $.ajax({
         url: "http://127.0.0.1:3000/users",
         method: "POST",
         contentType: "application/json",
         data: JSON.stringify(data),
         dataType: "json",
         error: function(err) {
            alert("Error registering. Try again");
         },
         success: function(data){
            alert("Registration successful!");
            $("#reg_modal_pop").modal("hide");
         }
      })
   });
});