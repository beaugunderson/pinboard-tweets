// ==UserScript==
// @name         Pinboard Tweet links to embedded Tweets
// @namespace    https://beaugunderson.com/
// @version      1.2
// @description  Change Twitter links to Tweet embeds on Pinboard.
// @author       Beau Gunderson
// @copyright    2016, Beau Gunderson (https://beaugunderson.com/)
// @license      MIT
// @homepageURL  https://github.com/beaugunderson.com/pinboard-tweets/
// @match        http://pinboard.in/*
// @match        https://pinboard.in/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @updateURL    https://openuserjs.org/meta/beaugunderson/Pinboard_Tweet_links_to_embedded_Tweets.meta.js
// @supportURL   https://github.com/beaugunderson/pinboard-tweets/issues
// ==/UserScript==

// ==OpenUserJS==
// @author beaugunderson
// ==/OpenUserJS==

/* globals $:true */

(function() {
  'use strict';

  var RE_STATUS = /status\/([0-9]+)/;

  // from https://dev.twitter.com/web/javascript/loading
  window.twttr = (function(d, s, id) {
    var js;
    var fjs = d.getElementsByTagName(s)[0];
    var t = window.twttr || {};
    if (d.getElementById(id)) return t;
    js = d.createElement(s);
    js.id = id;
    js.src = 'https://platform.twitter.com/widgets.js';
    fjs.parentNode.insertBefore(js, fjs);

    t._e = [];
    t.ready = function(f) {
      t._e.push(f);
    };

    return t;
  })(document, 'script', 'twitter-wjs');

  window.twttr.ready(function () {
    for (let domain of ['twitter.com', 'mobile.twitter.com']) {
      var $tweets = $('a.bookmark_title[href*="/' + domain + '/"]');
      var count = 0;

      $tweets.each(function () {
        var $tweet = $(this);
        var href = $tweet.attr('href');

        var matches = RE_STATUS.exec(href);

        if (!matches) {
          return;
        }

        var tweetId = matches[1];

        $tweet.parent().append('<div id="tweet-' + (++count) + '"></div>');

        window.twttr.widgets.createTweet(
          tweetId,
          document.getElementById('tweet-' + count),
          {align: 'left', linkColor: '#a51'});
      });
    }
  });
})();
