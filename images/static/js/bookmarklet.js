(function(){
  var jquery_version = '3.4.1';
  var site_url = 'https://127.0.0.1:8000/';
  var static_url = site_url + 'static/';
  var min_width = 100;
  var min_height = 100;

  function bookmarklet(msg) {
    // load CSS
    var css = jQuery('<link>');
    css.attr({
      rel: 'stylesheet',
      type: 'text/css',
      href: static_url + 'css/bookmarklet.css?r=' + Math.floor(Math.random()*99999999999999999999)
    });
    // jQuery('head').append(css); - you can replace 'jQuery' word with '$' sign
    $('head').append(css);

    // load HTML. Add custom html to the document body element of the current website.
    // this consists of a div element that will contain the images found on the current website
    box_html = '<div id="bookmarklet"><a href="#" id="close">&times;</a><h1>Select an image to bookmark:</h1><div class="images"></div></div>';
    $('body').append(box_html);

    // close event
    // removes your html from the document when the user clicks on the close link
    // use #bookmarklet #close selector to find the html element with an id name close which has a parent element with an id named bookmarklet
    jQuery('#bookmarklet #close').click(function(){
       jQuery('#bookmarklet').remove();
    });
    // find images and display them
    // use the img[src$="jpg"] selector to find all <img> html elements whose 'src' attribute finishes with a 'jpg' string.
    // you iterate over the results using the 'each()' method of jQuery
    jQuery.each(jQuery('img[src$="jpg"]'), function(index, image) {
      if (jQuery(image).width() >= min_width && jQuery(image).height()
      >= min_height)
      {
        image_url = jQuery(image).attr('src');
        // you add images with a correct size to your <div class='images'> html container
        jQuery('#bookmarklet .images').append('<a href="#"><img src="'+image_url +'" /></a>');
      }
    });

    // when an image is selected open URL with it
    // you attach a 'click()' event to each image's link element
    jQuery('#bookmarklet .images a').click(function(e){
      // when user clicks on an image, you set a new variable called 'selected_image' that contains the URL of the selected image.
      selected_image = jQuery(this).children('img').attr('src');
      // hide bookmarklet
      // you hide the bookmarklet and open a new browser window with the URL for bookmarking a new image on your site.
      jQuery('#bookmarklet').hide();
      // open new window to submit the image
      // you pass the content of the <title> element of the website and the selected image URL as GET parameters
      window.open(site_url +'images/create/?url='
                  + encodeURIComponent(selected_image)
                  + '&title='
                  + encodeURIComponent(jQuery('title').text()),
                  '_blank');
    });

  };

  // Check if jQuery is loaded
  if(typeof window.jQuery != 'undefined') {
    bookmarklet();
  } else {
    // Check for conflicts
    var conflict = typeof window.$ != 'undefined';
    // Create the script and point to Google API
    var script = document.createElement('script');
    script.src = '//ajax.googleapis.com/ajax/libs/jquery/' +
      jquery_version + '/jquery.min.js';
    // Add the script to the 'head' for processing
    document.head.appendChild(script);
    // Create a way to wait until script loading
    var attempts = 15;
    (function(){
      // Check again if jQuery is undefined
      if(typeof window.jQuery == 'undefined') {
        if(--attempts > 0) {
          // Calls himself in a few milliseconds
          window.setTimeout(arguments.callee, 250)
        } else {
          // Too much attempts to load, send error
          alert('An error occurred while loading jQuery')
        }
      } else {
          bookmarklet();
      }
    })();
  }
})()
