/*
tumblrFeed v 1.0.0 2012-08-03
http://www.websketcher.co.uk

Copyright (c) 2012,
*/
(function ($) {
    $.fn.tumblrFeed = function (customOptions) { //add the function
        var options = $.extend({}, $.fn.tumblrFeed.defaultOptions, customOptions);
        return this.each(function () {
            var $this = $(this);
            //Call back function which is called after the Ajax request. A call back is needed because we are using jsonp. This is a requirement of the Tumblr API. 
            myJsonpCallback = function (data) {
                //Uncomment the below line if you need to debug if the callback function is been called and also what data is been passed to it from the Ajax request. 
//                                      console.log(data)  

                //Loops through each post in your blog and creates list items for each post.
                $.each(data.response.posts, function (i, post) {

                    //formatting dates in javascript can be a pain. For the time being im just taking off the "GMT" at the end of the string. Will improve this at a later date.  
                    var d = post.date.toString().substr(0, 10);

                    //Checks to see if the post is of type "text" and if so builds a list with the objects retrieved from the jsonp request. The API has different responses depending on the type of post, Photo, Text ect.
                    if (post.type == "text") {
                        $($this).append("<div class='post post_text'><ul><li><h3>" + post.title + "</h3></li><li>" + post.body + "</li><li><span'>" + d + "</span></li></ul></div>");
                    }
                    //Checks to see if the post is of type "photo". There is a function in here to get all the images of the post
                    if (post.type == "photo") {
                        $($this).append("<div class='post post_photo'><ul><li>" + post.caption + "</li><li>" + getImages(post) + "</li><li><span>" + d + "</span></li></ul></div>");
                    }

                    //Checks to see if the post is of type "video"
                    if (post.type == "video") {
                        $($this).append("<div class='post post_video'><ul><li><h3>" + post.caption + "</h3></li><li>" + post.player[2].embed_code + "</li><li><span>" + d + "</span></li></ul></div>");
                    }

                    //Checks to see if the post is of type "audio"
                    if (post.type == "audio") {
                        $($this).append("<div class='post post_audio'><ul><li>" + post.caption + "</li><li>" + post.artist + "</li><li>" + post.album + "</li><li>" + post.player + "</li><li><span>" + d + "</span></li></ul></div>");
                    }
                    
                    //Checks to see if the post is of type "link"
                    if (post.type == "link") {
                        $($this).append("<div class='post post_link'><ul><li><a target='_blank' href=" + post.url + "><h3>" + post.title + "</h3></a></li><li>" + post.description + "</li><li><span>" + d + "</span></li></ul></div>");
                    }

                    //Checks to see if the post is of type "chat"
                    if (post.type == "chat") {
                        $($this).append("<div class='post post_chat'><ul><li><h3>" + post.title + "</h3></li><li>" + getChat(post) + "</li><li><span>" + d + "</span></li></ul></div>");
                    }

                    //Checks to see if the post is of type "quote"
                    if (post.type == "quote") {
                        $($this).append("<div class='post post_quote'><ul><li><h3>" + post.text + "</h3></li><li>" + post.source + "</li><li><span>" + d + "</span></li></ul></div>");
                    }
                });
            };
            //Function to retrieve all the images from the post. This builds an array which is then returned as html list of images.
            function getImages(post) {
                //        console.log(post)
                var html = [];
                html.push("<ul class='tumblr_post_images'>")
                $.each(post.photos, function (i, photo) {
                    html.push('<li><img src=' + photo.alt_sizes[1].url + '></li>')
                })
                html.push("</ul>")
                return html.join("");
            };

            //Function to retrieve all the chat dialogue from the post. This builds an array which is then returned as html list of texts.
            function getChat(post) {
                //        console.log(post)
                var html = [];
                html.push("<ul class='tumblr_post_chat'>")
                $.each(post.dialogue, function (i, chat) {
                    html.push('<li><i>' + chat.name + '</i></li>')
                })
                html.push("</ul>")
                return html.join("");
            };

            //Ajax call to the API. reads posts.
            $.ajax({
                type: "GET",
                url: "http://api.tumblr.com/v2/blog/" + options.tumblrUsername + ".tumblr.com/posts",
                dataType: "jsonp",
                data: {
                    api_key: options.apikey,
                    jsonp: "myJsonpCallback",
                    limit: options.postLimit,
                    type: options.postType
                }
            });
        });
        $.fn.tumblrFeed.defaultOptions = {
            tumblrUsername: "",
            apikey: "",
            postLimit: 20
        };
    };
})(jQuery);