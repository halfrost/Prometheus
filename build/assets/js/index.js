/*====================================================
  TABLE OF CONTENT
  1. function declearetion
  2. Initialization
====================================================*/
(function ($) {
    /*===========================
    1. function declearetion
    ===========================*/
    var themeApp = {
        
        themeSwitch: function() {
            var checkbox = $('#switch_theme');
			var html = $('html');
            checkbox.on('change', function() {
                if( checkbox.prop('checked')) {
                    html.attr('data-theme', 'light');
                    localStorage.setItem('selected-theme', 'light');
                }
                else {
                    html.attr('data-theme', 'dark');
                    localStorage.setItem('selected-theme', 'dark');
                }
            });
        },

        watermarkLetter: function() {
            var posts = document.querySelectorAll('.post');
            var watermark = document.getElementsByClassName('watermark');
            if (watermark.length > 0) {
                for (i = 0; i < posts.length; i++) {
                    var title = posts[i].getElementsByClassName('post-title')[0];
                    posts[i].getElementsByClassName('watermark')[0].innerHTML = title.firstChild.innerHTML[0];
                }
            }
        },

        responsiveIframe: function () {
            $('.post-single').fitVids();
        },

        highlighter: function () {
            $('pre code').each(function (i, block) {
                hljs.highlightBlock(block);
            });
        },

        mobileMenu: function () {
            var body = $('body');
            var icon = $('.menu-icon');
            $('.js-menu-open').on('click', function () {
                body.toggleClass('js-mobile-menu-opened');
                icon.toggleClass('menu-icon-x');
            });
            $('.js-backdrop').on('click', function () {
                body.toggleClass('js-mobile-menu-opened');
                icon.toggleClass('menu-icon-x');
            });
        },

        SearchProcess: function () {
            var list = [];
            $('.js-search-button').on('click', function (e) {
                e.preventDefault();
                if (list.length == 0 && typeof searchApi !== undefined) {
                    $.get(searchApi)
                        .done(function (data) {
                            list = data.posts;
                            search();
                        })
                        .fail(function (err) {
                        });
                }
                $('.js-search-popup').addClass('visible');
                $('.js-search-input').css('visibility', 'visible').focus();
            });
            $('.close-button').on('click', function (e) {
                e.preventDefault();
                $('.search-popup').removeClass('visible');
                $('#search-input').val("");
                $("#search-results").empty();
            });
            function search() {
                if (list.length > 0) {
                    var options = {
                        shouldSort: true,
                        tokenize: true,
                        matchAllTokens: true,
                        threshold: 0,
                        location: 0,
                        distance: 100,
                        maxPatternLength: 32,
                        minMatchCharLength: 1,
                        keys: [{
                            name: 'title'
                        }, {
                            name: 'plaintext'
                        }]
                    }
                    fuse = new Fuse(list, options);
                    $('#search-input').on("keyup", function () {
                        keyWord = this.value;
                        var result = fuse.search(keyWord);
                        var output = '';
                        var language = $('html').attr('lang');
                        $.each(result, function (key, val) {
                            var pubDate = new Date(val.published_at).toLocaleDateString(language, {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })
                            output += '<div id="' + val.id + '" class="result-item">';
                            output += '<a href="' + val.url + '"><div class="title">' + val.title + '</div>';
                            output += '<div class="date">' + pubDate + '</div></a>';
                            output += '</div>';
                        });
                        $("#search-results").html(output);
                    });
                }
            }
        },

        copyLink: function() {
            new ClipboardJS('.js-copy-link')
            .on('success', function(e) {
                var btn = $(e.trigger);
                btn.addClass('tooltip-visible');
                btn.on('mouseleave', function() {
                    $(this).removeClass('tooltip-visible');
                })
            });
        },

        gallery: function () {
            var images = document.querySelectorAll('.kg-gallery-image img');
            images.forEach(function (image) {
                var container = image.closest('.kg-gallery-image');
                var width = image.attributes.width.value;
                var height = image.attributes.height.value;
                var ratio = width / height;
                container.style.flex = ratio + ' 1 0%';
            });
            mediumZoom('.kg-gallery-image img', {
                margin: 30
            });
        },

        loadMore: function () {
            var nextPageUrl = $('link[rel=next]').attr('href');
            var loadMoreButton = $('.js-load-more');
            var endMessage = $('.js-end-message');
            if( typeof(nextPageUrl) != 'undefined') {
                loadMoreButton.on('click', function (e) {
                    e.preventDefault();
                    var url = nextPageUrl.split(/page/)[0] + 'page/' + nextPage + '/';
                    $.ajax({
                        url: url,
                        beforeSend: function () {
                            loadMoreButton.addClass('loading');
                        }
                    }).done(function (data) {
                        loadMoreButton.blur();
                        var posts = $(data).find('.post');
                        loadMoreButton.removeClass('loading');
                        $('.post-list').append(posts);
                        $(window).scroll();
                        nextPage++;
                        themeApp.watermarkLetter();
                        if (nextPage > totalPages) {
                            loadMoreButton.addClass('d-none');
                            endMessage.removeClass('d-none');
                        }
                    });
                });
            } else {
                endMessage.removeClass('d-none');
            }
        },

        commentLazyLoad: function() {
            if( 'undefined' !== typeof disqus_shortname && 'undefined' !== typeof disqus_options) {
                $.disqusLoader( '#disqusloader', disqus_options );
            }
        },

        notification: function() {
            function getParameterByName(name, url) {
                if (!url) url = window.location.href;
                name = name.replace(/[\[\]]/g, '\\$&');
                var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
                    results = regex.exec(url);
                if (!results) return null;
                if (!results[2]) return '';
                return decodeURIComponent(results[2].replace(/\+/g, ' '));
            }
        
            // Give the parameter a variable name
            var action = getParameterByName('action');
            var stripe = getParameterByName('stripe');
        
            if (action == 'subscribe') {
                document.body.classList.add('subscribe-success');
            }
            if (action == 'signup') {
                window.location = '/signup/?action=checkout';
            }
            if (action == 'checkout') {
                document.body.classList.add('signup-success');
            }
            if (action == 'signin') {
                document.body.classList.add('signin-success');
            }
            if (stripe == 'success') {
                document.body.classList.add('checkout-success');
            }
        
            var notifications = document.querySelectorAll('.notification');
            notifications.forEach(function(item) {
                var closelink = item.querySelector('.notification-close');
                closelink.addEventListener('click', function(e) {
                    e.preventDefault();
                    item.classList.add('closed');
                    var uri = window.location.toString();
                    if (uri.indexOf("?") > 0) {
                        var clean_uri = uri.substring(0, uri.indexOf("?"));
                        window.history.replaceState({}, document.title, clean_uri);
                    }
                })
        
            });
        },

        init: function () {
            themeApp.themeSwitch();
            themeApp.watermarkLetter();
            themeApp.responsiveIframe();
            themeApp.highlighter();
            themeApp.mobileMenu();
            themeApp.SearchProcess();
            themeApp.copyLink();
            themeApp.gallery();
            themeApp.loadMore();
            themeApp.commentLazyLoad();
            themeApp.notification();
        }
    }
    /*===========================
    2. Initialization
    ===========================*/
    $(document).ready(function () {
        themeApp.init();
    });
}(jQuery));