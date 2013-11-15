// Docs for the Tumblr API v1 are here: http://www.tumblr.com/docs/en/api/v1#api_read
// Requires jQuery
 
// Create a function that will fetch n latest Tumblr posts and format them for placement into a page
var fetchLatestTumblrPost = function() {
 
  // Fetch the feed with Tumblr API v1
  $.getJSON("http://blog.brandonevans.ca/api/read/json?num=1&callback=?", function(data) {
 
    // For each post in the returned data
    $.each(data.posts, function(i, posts) {
      var post = "", postElement;
 
      // The post variable holds the HTML that will be placed into the page
      // Use the relevant post variables for each type from the docs
      switch (this.type) {
        case "regular":
        // Be sure to check for the variables existence before appending it to the HTML
          if (this["regular-title"]) {
            post += "<h3>" + this["regular-title"] + "</h3>";
          }
          post += "<p>" + this["regular-body"] + "</p>";
          break;
        case "link":
          post = "<h3><a href='" + this["link-url"] + "'>" + this["link-text"] + "</a></h3>";
          break;
        case "quote":
          post = this["quote-text"];
          break;
        case "photo":
          post = "<a href='" + this["url-with-slug"] + "'><img src='" + this["photo-url-1280"] + "'></a>";
          if (this["photo-caption"]) {
            post += "<p>" + this["photo-caption"] + "</p>";
          }
          break;
        case "video":
          post = this["video-player"] + "<p>" + this["video-caption"] + "</p>";
          break;
        case "audio":
          post = this["audio-player"];
          if (this["id3-artist"] && this["id3-title"]) {
            post += "<p class='ap-info'><span class='artist'>" + this["id3-artist"] + "</span> – <span class='track'>" + this["id3-title"] + "</span></p>";
          } else {
            if (this["id3-title"]) {
              post += "<p class='ap-info'><span class='track'>" + this["id3-title"] + "</span></p>";
            }
          }
          if (this["audio-caption"]) {
            post += this["audio-caption"];
          }
          break;
        case "conversation":
        case "answer":
          break;
      }
 
      // Append this post HTML to the container, can be any jQuery selector
      $("#weblog").append(post);
 
      // Here I'm substituting the tumblr audio player with audiojs
      // This section of code might(?) be able to be removed because of the new HTML5 audio player
      postElement = document.getElementById("tumblr-audio");
      if (postElement) {
        return audiojs.create(postElement, {
          imageLocation: "images/player-graphics.gif",
          retinaImageLocation: "images/player-graphics@2x.gif",
          swfLocation: "swf/audiojs.swf"
        });
      }
    });
  });
};
 
// If the container exists on this page then fetch the lastest posts
// If this JS is only included on the required page then the function can be run without the if statement
$(document).ready(function() {
  if ($("#weblog").length > 0) {
    fetchLatestTumblrPost();
  }
});