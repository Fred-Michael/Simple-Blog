$(document).ready(function() {
   //ajax call to get data from the json-server on document load
   $.ajax({
      url: "http://127.0.0.1:3000/post",
      method: "GET",
      error: function(err) {
         alert("Error: Could not fetch data from database");
      },
      success: function(data){
         data.forEach(article => {
            const content = `<div class="card mb-3"><div class="card-body"><h3 class="card-title">${article.title}</h3><p class="card-text">${shorten(article.body)}</p><a href="article.html?id=${article.id}" class="card-link text-muted small text-italics mr-5">read more</a></div></div>`;
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
            alert("Error: Cannot register. Try again");
         },
         success: function(data){
            alert("Registration successful!");
            $("#reg_modal_pop").modal("hide");
         }
      })
   });
   $("#login").click(function() {
      $.ajax({
         //ajax call for users/Admin login
         url: "http://127.0.0.1:3000/users",
         method: "GET",
         error: function(err) {
            alert("Error: Cannot complete login request");
         },
         success: function(data) {
            let name = $("#user").val(), pass = $("#pwd").val();
            let i=0;
            for(; i<data.length; i++) {
               if(data[i]["username"] === name && data[i]["password"] === pass) {
                  if (name === "Admin" && pass === "admin") {
                     localStorage.setItem("Owner", name);
                     alert("Welcome " + name + "!");
                     window.location.href = "adminindex.html";
                  } else {
                     localStorage.setItem("user", name);
                     alert("Welcome " + name + "!");
                     window.location.href = "userindex.html";
                  }
               }
            }
            $("#login_modal_pop").modal("hide");
            $("#user, #pwd").each(function() {
               $(this).val("");
            });
         }
      });
   });
   $("#user_logout").click(function() {
      //code to log user out from the blog
      localStorage.removeItem("user");
      window.location = "index.html";
   });
   $("#admin_logout").click(function() {
      //code to log Admin out from the blog
      localStorage.removeItem("Owner");
      window.location = "index.html";
   });
   $("#del").click(function() {
      //ajax call to delete a blog article from the server
      var del_article = $("#del_title").val();
      $.ajax({
         url: "http://127.0.0.1:3000/post",
         method: "GET",
         error: function(err) {
            alert("Error: Cannot complete delete request");
         },
         success: function(data) {
            var posts = data;
            for(let i=0; i<posts.length; i++){
               if(del_article === posts[i].title) {
                  var target = `${data[i].id}`
                  $.ajax({
                     url: `http://127.0.0.1:3000/post/`+target,
                     method: "DELETE"
                  });
               }
            }
            $.ajax({
               url: `http://127.0.0.1:3000/comments/?postId=`+target,
               method: "GET",
               error: function(err) {
                  alert("Error: Cannot complete fetch request");
               },
               success: function(data) {
                  for (let j = 0; j < data.length; j++) {
                     $.ajax({
                        url: `http://127.0.0.1:3000/comments/`+data[j].id,
                        method: "DELETE"
                     });
                  }
               }
            });
            alert("Blog post deleted successfully");
            $("#del_modal_pop").modal("hide");
            $.ajax({
               url: "http://127.0.0.1:3000/post",
               method: "GET",
               error: function(err) {
                  alert("Error: There seems to be a trouble refreshing the contents");
               },
               success: function(data){
                  data.forEach(article => {
                     const content = `<div class="card mb-3"><div class="card-body"><h3 class="card-title">${article.title}</h3><p class="card-text">${shorten(article.body)}</p><a href="article.html?id=${article.id}" class="card-link text-muted small text-italics mr-5">read more</a></div></div>`;
                     $('#show_article').prepend(content);
                  });
               }
            });
         }
      });
   });
   $('#post').click(function() {
      // ajax call to post newly created blog article to the server
      let head = $("#title").val(), body = $("#body").val();
      var data = {title: head, body: body};
      $.ajax({
         url: "http://127.0.0.1:3000/post",
         method: "POST",
         contentType: "application/json",
         data: JSON.stringify(data),
         dataType: "json",
         error: function(err) {
            alert("Error: Cannot complete post request");
         },
         success: function(data){
            alert("New Article created");
            $("#new").modal("hide");
            $.ajax({
               url: "http://127.0.0.1:3000/post",
               method: "GET",
               error: function(err) {
                  alert("Error: Cannot get latest content from the browser.");
               },
               success: function(data){
                  data.forEach(article => {
                     const content = `<div class="card mb-3"><div class="card-body"><h3 class="card-title">${article.title}</h3><p class="card-text">${shorten(article.body)}</p><a href="article.html?id=${article.id}" class="card-link text-muted small text-italics mr-5">read more</a></div></div>`;
                     $('#show_article').prepend(content);
                  });
                  $("#title, #body").each(function() {
                     $(this).val("");
                  });
               }
            }); 
         }
      });
   });
   $("#update_article").click(function() {
      //ajax call to update a blog post
      let title = $("#article_title").val(), body = $("#update_body").val();
      let updates = {title: title, body: body};
      $.ajax({
         url: "http://127.0.0.1:3000/post",
         method: "GET",
         error: function(err) {
            alert("Error: Cannot fetch posts. Try again");
         },
         success: function(data){
            for (let i = 0; i < data.length; i++) {
               if (data[i].title === title) {
                  var data_id = data[i].id;
               }
            }
            $.ajax({
               url: "http://127.0.0.1:3000/post/"+data_id,
               method: "PUT",
               contentType: "application/json",
               data: JSON.stringify(updates),
               dataType: "json",
               error: function(err) {
                  alert("Error: Cannot modify blog post. Try again");
               },
               success: function(data){
                  alert("Article has been updated");
                  $("#update_modal_pop").modal("hide");
                  $.ajax({
                     url: "http://127.0.0.1:3000/post",
                     method: "GET",
                     error: function(err) {
                        alert("Error: Cannot get latest content from the browser.");
                     },
                     success: function(data){
                        data.forEach(article => {
                           const content = `<div class="card mb-3"><div class="card-body"><h3 class="card-title">${article.title}</h3><p class="card-text">${shorten(article.body)}</p><a href="article.html?id=${article.id}" class="card-link text-muted small text-italics mr-5">read more</a></div></div>`;
                           $('#show_article').prepend(content);
                        });
                        $("#article_title, #update_body").each(function() {
                           $(this).val("");
                        });
                     }
                  });
               }
            })
         }
      })
   });
});


//functions & codes for use in jQuery


//code to shorten the amount of words to display on retrieving posts from the db
function shorten(body) {
   let words = '';
   for(let i = 0; i <= 200; i++) {
      words += body[i];
   }
   words += "...";
   return words;
}

//code used to create a search on the address bar of the browser pointing to the id provided
//this is so as to load a specific blog onto a page
let urlParams = new URLSearchParams(window.location.search);
let id = urlParams.get("id");