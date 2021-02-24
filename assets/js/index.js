/*====================================================
  TABLE OF CONTENT
  1. global var
  2. function declearetion
  3. Initialization
====================================================*/
(function ($) {
    /*===========================
    1. function declearetion
    ===========================*/
    var toc, tocPath, tocItems, pathLength, lastPathStart, lastPathEnd;
    // Factor of screen size that the element must cross
    // before it's considered visible
    var TOP_MARGIN = 0.1, BOTTOM_MARGIN = 0.2;
    /*===========================
    2. function declearetion
    ===========================*/
    var ImageSmartLoader = {
        isWebPSupported: false,
        isImageCompressed: false,
        viewWidth: $(window).width(),
        init: function() {
            ImageSmartLoader.webPCheck();
        },
        isCompressedCheck: function() {
    
        },
        webPCheck: function(feature, callback) {
            var TestImages = {
                demo: "UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAsAAAABBxAREYiI/gcAAABWUDggGAAAADABAJ0BKgEAAQABABwlpAADcAD+/gbQAA=="
            };
              console.log('支持Webp哦');
            var img = new Image();
            img.onload = function() {
                var result = (img.width > 0) && (img.height > 0);
                  console.log('支持Webp');
                // alert('支持')
                ImageSmartLoader.isWebPSupported = true;
                ImageSmartLoader.webPLoader();
            };
            img.onerror = function() {
                  console.log('不支持Webp');
                ImageSmartLoader.isWebPSupported = false;
                ImageSmartLoader.webPLoader();
            };
            img.src = "data:image/webp;base64," + TestImages.demo;
    
        },
        imgLoader: function() {
              console.log('加载默认图片');
        },
        webPLoader: function() {
              console.log('加载webP');
            // alert(ImageSmartLoader.isWebPSupported);
            if (ImageSmartLoader.isWebPSupported === true) {
                  console.log('宽度是' + ImageSmartLoader.viewWidth);
                if (ImageSmartLoader.viewWidth == 768) {
                    $(".lazy").lazyload({
                        advanced_load: true,
                        data_attribute: 'url',
                        webP_load: true,
                        is_scale: true
                    },true);
                    return false;
                }
                if (ImageSmartLoader.viewWidth < 768) {
                    $(".lazy").lazyload({
                        advanced_load: true,
                        data_attribute: 'url',
                        webP_load: true,
                        is_scale: true
                    },true);
                } else {
                    // alert('普通支持')
                    $(".lazy").lazyload({
                        advanced_load: true,
                        data_attribute: 'url',
                        webP_load: true,
                        is_scale: true
                    },true);
                }
            } else {
                if (ImageSmartLoader.viewWidth == 768) {
                    $(".lazy").lazyload({
                        advanced_load: true,
                        data_attribute: 'url',
                        webP_load: false,
                        is_scale: true
                    },true);
                    return false;
                }
                if (ImageSmartLoader.viewWidth < 768) {
                    $(".lazy").lazyload({
                        advanced_load: true,
                        data_attribute: 'url',
                        webP_load: false,
                        is_scale: true
                    },true);
                } else {
                    // alert('普通支持')
                    $(".lazy").lazyload({
                        advanced_load: true,
                        data_attribute: 'url',
                        webP_load: false,
                        is_scale: true
                    },true);
                }
            }
        },
    };
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
                    if (title !== undefined) {
                        posts[i].getElementsByClassName('watermark')[0].innerHTML = title.firstChild.innerHTML[0];
                    }
                }
            }
        },

        responsiveIframe: function () {
            $('.post-single').fitVids();
        },

        highlighter: function () {
            
            // $('pre code').each(function (i, block) {
            //     Prism.highlightAll(true,block)
            // });
            // $('pre code').each(function (i, block) {
            //     hljs.highlightBlock(block);
            //     var language = block.result.language;
            //     console.log(language);
            // });
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

        searchProcess: function () {
            var list = [];
            var top = window.scrollY;
            $('.js-search-button').on('click', function (e) {
                e.preventDefault();
                top = window.scrollY;
                stopBodyScroll(true,top);
                if (list.length == 0 && typeof searchApi !== undefined) {
                    $.get(searchApi)
                        .done(function (data) {
                            list = data.posts;
                            search();
                        })
                        .fail(function (err) {
                            $('.l-search__content').css("display","");
                        });
                }
                $('.js-search-popup').addClass('visible');
                $('.js-search-input').css('visibility', 'visible').focus();
            });
            $('.close-button').on('click', function (e) {
                e.preventDefault();
                stopBodyScroll(false,top);
                $('.search-popup').removeClass('visible');
                $('#search-input').val("");
                $("#search-results").empty();
                $('.l-search__content').css("display","");
            });

            function stopBodyScroll (isFixed,top) {
                if (isFixed) {
                    $('body').css("position","fixed");
                    $('body').css("top", -top+'px');
                    $('body').css("width", "100%");
                } else {
                    $('body').css("position","");
                    $('body').css("top","");
                    $('body').css("width", "");
                    window.scrollTo(0, top); // 回到原先的top
                }
            }

            function search() {
                console.log("**********list = ",list);
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
                    };
                    fuse = new Fuse(list, options);
                    console.log("**********开始搜索了么？");
                    $('#search-input').on("keyup", function () {
                        keyWord = this.value;
                        console.log("1 **********result 有结果了么？ =", result);
                        var result = fuse.search(keyWord);
                        var output = '';
                        var language = $('html').attr('lang');
                        console.log("2 **********result 有结果了么？ =", result);
                        if (result.length == 0) {

                        } else {
                            console.log("**********result =", result);
                            $.each(result, function (key, val) {
                                var pubDate = new Date(val.published_at).toLocaleDateString(language, {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                });
                                output += '<div id="' + val.id + '" class="result-item">';
                                output += '<a href="' + val.url + '"><div class="title">' + val.title + '</div>';
                                output += '<div class="date">' + pubDate + '</div></a>';
                                output += '</div>';
                            });
                            $("#search-results").html(output);
                            $('.l-search__content').css("display","none");
                        }
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
                });
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
                        console.log('data = ',data);
                        loadMoreButton.blur();
                        var posts = $(data).find('.post');
                        console.log('posts = ',posts);
                        loadMoreButton.removeClass('loading');
                        $('.post-list').append(posts);
                        $(window).scroll();
                        if (ImageSmartLoader.isWebPSupported === true) {
                            $(".lazy").lazyload({
                                advanced_load: true,
                                data_attribute: 'url',
                                webP_load: true,
                                is_scale: true
                            },false);
                        } else {
                            $(".lazy").lazyload({
                                advanced_load: true,
                                data_attribute: 'url',
                                webP_load: false,
                                is_scale: true
                            },false);
                        }
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
                });
            });
        },

        scrollTop: function() {
            if ($(this).scrollTop() >= 50) {
                $('#return-top').fadeIn(200);
            } else {
                $('#return-top').fadeOut(200);
            }

            $(window).scroll(function () {
                if ($(this).scrollTop() >= 50) {
                    $('#return-top').fadeIn(200);
                } else {
                    $('#return-top').fadeOut(200);
                }
            });
        
            $('#return-top').on('click', function (e) {
                e.preventDefault();
                $('body,html').animate({
                    scrollTop: 0
                }, 500);
            });
        },

        scrollDown: function() {
            var scrollHint = document.getElementById('slider-down');
            if (scrollHint !== null) {
                // Scroll to content
                $('.slider-down').on('click', function(e) {
                    $('html, body').animate({
                        scrollTop: $('.header-wrap').position().top + $('.header-wrap').height()
                    }, 400 );
                    e.preventDefault();
                });
    
                window.addEventListener('load', sliderDownVisible);
                window.addEventListener('scroll', sliderDownVisible);
            }
            
            function sliderDownVisible() {
                var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                if (scrollTop <= 0 && $(window).width() >= 992) {
                    $('.slider-down').css("visibility","visible");
                } else {
                    $('.slider-down').css("visibility","hidden");
                }
            }
        },

        tocScroll: function() {
            console.log("调用了 tocScroll");
            toc = document.querySelector( '#toc' );
            tocPath = document.querySelector( '.toc-marker path' );
            if (toc != null) {
                window.addEventListener( 'resize', themeApp.drawPath, false );
                window.addEventListener( 'scroll', themeApp.syncTOC, false );
                themeApp.drawPath();
            }      
        },

        fixedTOC: function(){
            console.log("调用了 fixedTOC");
            if ( $('.post-header').outerHeight(true) + 80 > $(window).scrollTop()) {
                $('#toc').css('top',$('.post-header').outerHeight(true));
                $('#toc').css('position','absolute');
                $('#toc').css('left','20px');
                // $('#toc').css('right','20px');
                //console.log("top absolute | toc offset = ", $('#toc').offset().top, "scrollTop = ",$(window).scrollTop());
            } else {
                // 把下面三行注释掉，让目录不固定。有些目录很长的文章，需要这样
                $('#toc').css('top',0);
                $('#toc').css('position','fixed');
                $('#toc').css('left','35px');
                // $('#toc').css('right','30px');
                // console.log("top fixed | toc offset = ", $('#toc').offset().top, "scrollTop = ",$(window).scrollTop());
            }

            if ($(window).scrollTop() + $(window).height() > $('.post-footer').offset().top) {
                $('#toc').css("visibility","hidden");
                $('.toc-marker').css("visibility","hidden");
            } else {
                $('#toc').css("visibility","visible");
                $('.toc-marker').css("visibility","visible");
            }
        },

        drawPath: function(){
            console.log("调用了 drawPath");
            tocItems = [].slice.call( toc.querySelectorAll( 'li' ) );
        
            // Cache element references and measurements
            tocItems = tocItems.map( function( item ) {
                var anchor = item.querySelector( 'a' );
                var target = document.getElementById( anchor.getAttribute( 'href' ).slice( 1 ) );
    
                return {
                    listItem: item,
                    anchor: anchor,
                    target: target
                };
            } );
    
            // Remove missing targets
            tocItems = tocItems.filter( function( item ) {
                return !!item.target;
            } );
    
            var path = [];
            var pathIndent;
            
            tocItems.forEach( function( item, i ) {
    
                var x = item.anchor.offsetLeft - 5,
                    y = item.anchor.offsetTop,
                    height = item.anchor.offsetHeight;
    
                if( i === 0 ) {
                    path.push( 'M', x, y, 'L', x, y + height );
                    item.pathStart = 0;
                }
                else {
                    // Draw an additional line when there's a change in
                    // indent levels
                    if( pathIndent !== x ) path.push( 'L', pathIndent, y );
    
                    path.push( 'L', x, y );
    
                    // Set the current path so that we can measure it
                    tocPath.setAttribute( 'd', path.join( ' ' ) );
                    item.pathStart = tocPath.getTotalLength() || 0;
    
                    path.push( 'L', x, y + height );
                }
    
                pathIndent = x;
    
                tocPath.setAttribute( 'd', path.join( ' ' ) );
                item.pathEnd = tocPath.getTotalLength();
    
            } );
    
            pathLength = tocPath.getTotalLength();
            themeApp.syncTOC();
        },

        syncTOC: function () {
            console.log("调用了 syncTOC");
            if (tocItems == null) {
                return;
            }
            themeApp.fixedTOC();
            var windowHeight = window.innerHeight;
            var pathStart = pathLength,
                pathEnd = 0;
            var visibleItems = 0;
            console.log('tocItems = ', tocItems);
            tocItems.forEach( function( item ) {
                var targetBounds = item.target.getBoundingClientRect();
                if( targetBounds.bottom > windowHeight * TOP_MARGIN && targetBounds.top < windowHeight * ( 1 - BOTTOM_MARGIN ) ) {
                    pathStart = Math.min( item.pathStart, pathStart );
                    pathEnd = Math.max( item.pathEnd, pathEnd );
                    visibleItems += 1;
                    item.listItem.classList.add( 'visible' );
                }
                else {
                    item.listItem.classList.remove( 'visible' );
                }
            } );
            // Specify the visible path or hide the path altogether
            // if there are no visible items
            if( visibleItems > 0 && pathStart < pathEnd ) {
                if( pathStart !== lastPathStart || pathEnd !== lastPathEnd ) {
                    tocPath.setAttribute( 'stroke-dashoffset', '1' );
                    tocPath.setAttribute( 'stroke-dasharray', '1, '+ pathStart +', '+ ( pathEnd - pathStart ) +', ' + pathLength );
                    //tocPath.setAttribute( 'opacity', 1 );
                }
            }
            else {
                //tocPath.setAttribute( 'opacity', 0 );
            }
    
            lastPathStart = pathStart;
            lastPathEnd = pathEnd;
        },

        initTOC: function() {
            //初始化 toc 插件
            $('#toc').initTOC({
                selector: "h2, h3, h4, h5, h6",
                scope: "article",
                overwrite: true,
                prefix: "toc"
            });
        },

        init: function () {
            themeApp.themeSwitch();
            themeApp.watermarkLetter();
            themeApp.responsiveIframe();
            themeApp.highlighter();
            themeApp.mobileMenu();
            themeApp.searchProcess();
            themeApp.copyLink();
            themeApp.gallery();
            themeApp.loadMore();
            themeApp.commentLazyLoad();
            themeApp.notification();
            themeApp.scrollTop();
            themeApp.scrollDown();
            themeApp.initTOC();
            themeApp.tocScroll();
        }
    };
    /*===========================
    3. Initialization
    ===========================*/
    $(document).ready(function () {
        themeApp.init();
        ImageSmartLoader.init();

        // 懒加载
        var $window = $(window);
        $.fn.lazyload = function(options,needOneAppear) {
            var elements = this;
            var $container;
            var settings = {
                threshold: 0,
                failure_limit: 0,
                event: "scroll",
                effect: "show",
                container: window,
                data_attribute: "original",
                skip_invisible: false,
                appear: null,
                load: null,
                placeholder: "",
                advanced_load: false,
                webP_load: false,
                is_scale: false
            };

            function update() {
                var counter = 0;

                elements.each(function() {
                    var $this = $(this);

                    if (settings.skip_invisible && !$this.is(":visible")) {
                        return;
                    }
                    if ($.abovethetop(this, settings) ||
                        $.leftofbegin(this, settings)) {
                        /* Nothing. */
                    } else if (!$.belowthefold(this, settings) &&
                        !$.rightoffold(this, settings)) {
                        $this.trigger("appear");
                        /* if we found an image we'll load, reset the counter */
                        counter = 0;
                    } else {
                        if (++counter > settings.failure_limit) {
                            return false;
                        }
                    }
                });

            }

            if (options) {
                /* Maintain BC for a couple of versions. */
                if (undefined !== options.failurelimit) {
                    options.failure_limit = options.failurelimit;
                    delete options.failurelimit;
                }
                if (undefined !== options.effectspeed) {
                    options.effect_speed = options.effectspeed;
                    delete options.effectspeed;
                }

                $.extend(settings, options);
            }

            /* Cache container as jQuery as object. */
            $container = (settings.container === undefined ||
                settings.container === window) ? $window : $(settings.container);

            /* Fire one scroll event per scroll. Not one scroll event per image. */
            if (0 === settings.event.indexOf("scroll")) {
                $container.bind(settings.event, function() {
                    // console.log('滚动了111');
                    // console.log('滚动');
                    return update();
                });
            }

            console.log("needOneAppear = ",needOneAppear);
            this.each(function() {
                var self = this;
                var $self = $(self);

                self.loaded = false;

                /* If no src attribute given use data:uri. */
                if ($self.attr("src") === undefined || $self.attr("src") === false) {
                    if ($self.is("img")) {
                        $self.attr("src", settings.placeholder);
                        $self.addClass("loading");
                    }
                }
                
                console.log("这里的对象是 = ",$self);
                if (needOneAppear === true) {
                    /* When appear is triggered load original image. */
                    $self.one("appear", function() {
                        needAppear();
                    });
                } else {
                    needAppear();
                }

                function needAppear() {
                    console.log('进入 needAppear = ',$self);
                    if (!this.loaded) {
                        if (settings.appear) {
                            var elements_left = elements.length;
                            settings.appear.call(self, elements_left, settings);
                        }
                        console.log('1.self.attr = ',$self);
                        var updatedUrl = $self.attr("data-" + settings.data_attribute);
                        // var updatedUrl = $self.attr("data-original");

                        if (updatedUrl === undefined) {
                            console.log('进来了 = ',$self.attr("src"));
                            console.log('进来了 = ',$self["0"].width);
                            updatedUrl = $self.attr("src");
                        }
                        if (updatedUrl === undefined) {
                            console.log('测试 = ',$self.style);
                            updatedUrl = $self.style.backgroundImage;
                        }
                        if (updatedUrl !== undefined) {
                            console.log('updatedUrl = ',updatedUrl);
                            console.log('图片地址' +updatedUrl.indexOf('img.halfrost.com'));
                            console.log('***配置是 = ',settings);
                            console.log('***$self是 = ',$self);
                            var width = Math.ceil($('.post-thumbnail-wrap').width());
                            console.log('width 是 = ',width);
                            console.log('是否是 svg = ',updatedUrl,updatedUrl.indexOf('.ffy'));
                            // exclude svg & gif
                            if (updatedUrl.indexOf('img.halfrost.com') > -1 && updatedUrl.indexOf('.svg') == -1 && updatedUrl.indexOf('.gif') == -1) {
                                // alert(1)
                                if (settings.advanced_load === true) {
                                    updatedUrl += '?imageView2';
                                }
                                if (settings.is_scale === true) {
                                    updatedUrl += '/0/w/' + width;
                                }
                                if (settings.webP_load === true && settings.is_scale === false) {
                                    updatedUrl += '/0/format/webp';
                                }
                                if (settings.webP_load === true && settings.is_scale === true) {
                                    updatedUrl += '/format/webp';
                                }
                                // support Safari and iOS
                                if (settings.webP_load === false && updatedUrl.indexOf('https://img.halfrost.com/Blog/ArticleTitleImage/quantum_4.png') > -1 ) {
                                updatedUrl = 'https://img.halfrost.com/Blog/ArticleTitleImage/quantum_4.png';
                                }
                                if (updatedUrl.indexOf('https://img.halfrost.com/Blog/ArticleTitleImage/quantum_4.png') > -1 && settings.webP_load === true) {
                                updatedUrl = 'https://img.halfrost.com/Blog/ArticleTitleImage/quantum_4.png?imageView2/0/format/webp';
                                }
                            }
                        }

                            console.log('中间打印updatedUrl',updatedUrl);
                            console.log('*********中间打印 img.src = ',$self.attr("src"));
                            console.log('*********中间打印 img = ',$("<img />"));
                            console.log('$$$配置是 = ',settings);

                        $("<img />").bind("load", function(){
                                $self.hide();
                                if ($self.is("img")) {
                                    console.log('$self = ',$self,$self.attr("src"));
                                    $self.attr("src", updatedUrl);
                                    console.log('*********img.src = ',$self.attr("src"));
                                } else {
                                    $self.css("background-image", "url('" + updatedUrl + "')");
                                    console.log('*********background-image = ',$self.css("background-image"));
                                }
                                $self[settings.effect](settings.effect_speed);

                                self.loaded = true;

                                /* Remove image from array so it is not looped next time. */
                                var temp = $.grep(elements, function(element) {
                                    return !element.loaded;
                                });
                                elements = $(temp);

                                if (settings.load) {
                                    var elements_left = elements.length;
                                    settings.load.call(self, elements_left, settings);
                                }
                                $self.removeClass("loading");
                        }).attr("src", updatedUrl);
                    }
                }

                /* When wanted event is triggered load original image */
                /* by triggering appear.                              */
                if (0 !== settings.event.indexOf("scroll")) {
                    console.log("触发 scroll");
                    $self.bind(settings.event, function() {
                        if (!self.loaded) {
                            $self.trigger("appear");
                        }
                    });
                }
            });

            /* Check if something appears when window is resized. */
            $window.bind("resize", function() {
                update();
            });

            console.log("运行到这里了么？");
            /* With IOS5 force loading images when navigating with back button. */
            /* Non optimal workaround. */
            if ((/(?:iphone|ipod|ipad).*os 5/gi).test(navigator.appVersion)) {
                $window.bind("pageshow", function(event) {
                    if (event.originalEvent && event.originalEvent.persisted) {
                        elements.each(function() {
                            $(this).trigger("appear");
                        });
                    }
                });
            }

            /* Force initial check if images should appear. */
            $(document).ready(function() {
                console.log("document ready 了么？");
                update();
                if (toc != null) {
                    console.log("document ready 中调用了 syncTOC");
                    themeApp.syncTOC();
                }
            });

            return this;
        };

        /* Convenience methods in jQuery namespace.           */
        /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */
        $.belowthefold = function(element, settings) {
            var fold;
            if (settings.container === undefined || settings.container === window) {
                fold = (window.innerHeight ? window.innerHeight : $window.height()) + $window.scrollTop();
            } else {
                fold = $(settings.container).offset().top + $(settings.container).height();
            }
            return fold <= $(element).offset().top - settings.threshold;
        };

        $.rightoffold = function(element, settings) {
            var fold;
            if (settings.container === undefined || settings.container === window) {
                fold = $window.width() + $window.scrollLeft();
            } else {
                fold = $(settings.container).offset().left + $(settings.container).width();
            }
            return fold <= $(element).offset().left - settings.threshold;
        };

        $.abovethetop = function(element, settings) {
            var fold;
            if (settings.container === undefined || settings.container === window) {
                fold = $window.scrollTop();
            } else {
                fold = $(settings.container).offset().top;
            }
            return fold >= $(element).offset().top + settings.threshold + $(element).height();
        };

        $.leftofbegin = function(element, settings) {
            var fold;
            if (settings.container === undefined || settings.container === window) {
                fold = $window.scrollLeft();
            } else {
                fold = $(settings.container).offset().left;
            }
            return fold >= $(element).offset().left + settings.threshold + $(element).width();
        };
        $.inviewport = function(element, settings) {
            return !$.rightoffold(element, settings) && !$.leftofbegin(element, settings) &&
            !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
        };

        /* Custom selectors for your convenience.   */
        /* Use as $("img:below-the-fold").something() or */
        /* $("img").filter(":below-the-fold").something() which is faster */

        $.extend($.expr[":"], {
            "below-the-fold": function(a) {
                return $.belowthefold(a, {
                    threshold: 0
                });
            },
            "above-the-top": function(a) {
                return !$.belowthefold(a, {
                    threshold: 0
                });
            },
            "right-of-screen": function(a) {
                return $.rightoffold(a, {
                    threshold: 0
                });
            },
            "left-of-screen": function(a) {
                return !$.rightoffold(a, {
                    threshold: 0
                });
            },
            "in-viewport": function(a) {
                return $.inviewport(a, {
                    threshold: 0
                });
            },
            /* Maintain BC for couple of versions. */
            "above-the-fold": function(a) {
                return !$.belowthefold(a, {
                    threshold: 0
                });
            },
            "right-of-fold": function(a) {
                return $.rightoffold(a, {
                    threshold: 0
                });
            },
            "left-of-fold": function(a) {
                return !$.rightoffold(a, {
                    threshold: 0
                });
            }
        });
    });
}(jQuery));