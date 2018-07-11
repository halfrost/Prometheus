var isDebug = false;

$.fn.extend({

    isOnScreenVisible: function() {
        if (!$('body').hasClass('post-template')) {
            return false;
        }
        var win = $(window);
        var viewport = {
            top: win.scrollTop(),
            left: win.scrollLeft()
        };
        viewport.right = viewport.left + win.width();
        viewport.bottom = viewport.top + win.height();

        var bounds = this.offset();
        bounds.right = bounds.left + this.outerWidth();
        bounds.bottom = bounds.top + this.outerHeight();

        return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));
    },

});

function loadJS(url, callback, el) {
    var isIE = !!window.ActiveXObject,
        isIE6 = isIE && !window.XMLHttpRequest,
        script = document.createElement("script"),
        head = isIE6 ? document.documentElement : document.getElementsByTagName("head")[0];
    script.type = "text/javascript";
    script.async = true;
    if (script.readyState) {
        script.onreadystatechange = function() {
            if (script.readyState == "loaded" || script.readyState == "complete") {
                script.onreadystatechange = null;
                if (callback) {
                    callback();
                }
            }
        };
    } else {
        script.onload = function() {
            if (callback) {
                callback();
            }
        };
    }
    script.src = url;
    if (el) {
        document.getElementById(el).appendChild(script);
    } else {
        head.insertBefore(script, head.firstChild);
    }
}

/**
 * Yasuko 配置文件
 * 多说评论调用等
 */

var General = {
    isMobile: false,
    isWechat: false,
    viewWidth: $(window).width(),
    absUrl: location.protocol + '//' + location.host,
    init: function() {
        var win = window;
        var doc = win.document;
        var UA = navigator.userAgent.toLowerCase();
        var isAndroid = win.navigator.appVersion.match(/android/gi);
        var isIPhone = win.navigator.appVersion.match(/iphone/gi);
        if (UA.match(/MicroMessenger/i) == "micromessenger") {
            General.isWechat = true;
            $('body').addClass('wechat-webview');
        }
        if (!!isAndroid) {
            General.isMobile = true;
        }
        if ($('body').hasClass('post-template')) {
            General.updateImageWidth();
            General.rewardLoader();
        }

        General.webFontLoader();
        General.scrollToPos();
    },
    updateImageWidth: function() {
        var $postContent = $(".post-content");
        // $postContent.fitVids();

        function updateImageWidth() {
            var $this = $(this),
                contentWidth = $postContent.outerWidth(), // Width of the content
                imageWidth = this.naturalWidth; // Original image resolution

            if (imageWidth >= contentWidth) {
                $this.addClass('full-img');
            } else {
                $this.removeClass('full-img');
            }
        }

        var $img = $(".single-post-inner img").on('load', updateImageWidth);

        function casperFullImg() {
            $img.each(updateImageWidth);
        }

        casperFullImg();
    },

    // General.absUrl + '/assets/css/font.min.css' // 这个是 Exo 字体，考虑不加载它,提高时间
    webFontLoader: function() {
        WebFontConfig = {
            loading: function() {
              if (isDebug) {
                console.log('loading font');
              }
            },
            custom: {
                families: ['Open Sans', 'iconfont', 'fontawesome'],
                urls: [General.absUrl + '/assets/css/font.min.css',
                       'https://ob6mci30g.qnssl.com/fontss/iconfont.css',
                       General.absUrl + '/assets/css/font-awesome.min.css'
                      ]
            }
        };
        loadJS(General.absUrl + '/assets/js/webfont.js', function() {
            if (isDebug) {
              console.log('加载字体JS');
            }
            WebFont.load({
                custom: {
                    families: ['Open Sans', 'iconfont', 'fontawesome']
                }
            });
        });
    },

    //平滑滚动到顶部
    scrollToPos: function(position) {
        var STR_TO_TOP = '我要飞到最高',
            coverHeight = position || $(window).height(); //获得图片高度
        var button = $('<a href="#" id="to-top" title="' + STR_TO_TOP + '"> <div class="to-top-wrap"></div></a>').appendTo('body');
        $(window).scroll(function() {
            if ($(window).scrollTop() > $(window).height()) {
                button.fadeIn(500);
            } else {
                button.fadeOut(500);
            }
        });

        button.click(function(e) {
            e.preventDefault();
            $('html,body').animate({
                scrollTop: 0
            }, 666, function() {
                window.location.hash = '#';
            });
            if (isDebug) {
              console.log('我跳');
            }
        });
    },
    /*给文章中的url添加iconfont方便识别*/
    urlIconlize: function(url) {
        var domain,
            _output;
        var iconFontTag = 'iconfont';
        var iconMap = { /*索引 可在这里添加匹配规则*/
            'twitter': 'iconfont-twitter icon-iconfonttwitter',
            'qzone': 'iconfont-qzone icon-qzone',
            'weibo': 'iconfont-weibo icon-iconfontweibo',
            'facebook': 'iconfont-facebook icon-iconfontfacebook',
            'github': 'iconfont-github icon-github',
            'douban': 'iconfont-douban icon-iconfontdouban',
            'google': 'iconfont-google icon-iconfontgoogle',
            'luolei': 'iconfont-luolei icon-luolei',
            'dribble': 'iconfont-dribble icon-dribbblecircled',
            'v2ex': 'iconfont-v2ex icon-iconfontv2ex',
            'zhihu': 'iconfont-zhihu icon-iconfontzhihu',
            'wikipedia': 'iconfont-wikipedia icon-iconfontwikipedia',
            'jianshu': 'iconfont-jianshu icon-jianshu',
            'youku': 'iconfont-youku icon-iconfontyouku',
            'youtube': 'iconfont-youtube icon-youtube',
            'juejin':'iconfont-juejin icon-juejin',
            'weixin':'iconfont-weixin icon-iconfontwechat',
            'segmentfault':'iconfont-sf icon-iconsf-copy'
        };

        for (var name in iconMap) {
            if (typeof iconMap[name] !== 'function') {
                var MapKey = name;
                if (url.indexOf(MapKey) >= 0) {
                    domain = MapKey;
                    _output = iconMap[MapKey];
                }
            }
        }

        return _output;
    },
    addIcons: function() {
        /*给博客文章地址url添加ico识别*/
        $('.single-post-inner  a:not(:has(img))').each(function(i) {
            var _src = $(this).attr('href');
            var tmp = document.createElement('a');
            tmp.href = _src;
            _selfDomain = tmp.hostname;
            General.urlIconlize(_selfDomain);
            if (isDebug) {
              console.log(_selfDomain);
            }
            $(this).prepend('<i class="iconfont ' + General.urlIconlize(_selfDomain) + '"></i>');
            var _selfColor = $(this).find('i').css('color'),
                _originalColor = $(this).css('color');

            /*鼠标悬浮时*/
            $(this).hover(function() {
                $(this).css('color', _selfColor);
                $(this).addClass('animated pulse');
            }, function() {
                $(this).css('color', _originalColor);
                $(this).removeClass('animated pulse');
            });

        });
    },
    //打赏
    rewardLoader: function() {

        var loadQR = {
            alipay: '/assets/images/qr-alipay-255.png',
            wechat: '/assets/images/qr-wechat-255.png'
        };
        var loadQRUrl;
        if (!!General.isWechat) {
            $('.wechat-code b').html('长按上方二维码打赏作者');
            // $('.qr-code').fadeOut();
        }

        $('.money-like .reward-button').hover(function() {
            if (isDebug) {
              console.log('悬浮');
            }
            $('img.wechat-img').attr('src', loadQR.wechat);
            $('img.alipay-img').attr('src', loadQR.alipay);
            $('.money-code').fadeIn();
            $(this).addClass('active');
        }, function() {
            $('.money-code').fadeOut();
            $(this).removeClass('active');
        }, 800);

        $('.money-like .reward-button').click(function() {
            if ($(this).hasClass('active')) {
                $(this).find('img.wechat-img').attr('src', loadQR.wechat);
                $(this).find('img.alipay-img').attr('src', loadQR.alipay);
                $('.money-code').fadeOut();
                $(this).removeClass('active');

            } else {
                $('.money-code').fadeIn();
                $(this).addClass('active');
            }
        });
    }
};

var ImageSmartLoader = {
    isWebPSupported: false,
    isImageCompressed: false,
    init: function() {
        ImageSmartLoader.webPCheck();
    },
    isCompressedCheck: function() {

    },
    webPCheck: function(feature, callback) {
        var TestImages = {
            demo: "UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAsAAAABBxAREYiI/gcAAABWUDggGAAAADABAJ0BKgEAAQABABwlpAADcAD+/gbQAA=="
        };
        if (isDebug) {
          console.log('支持Webp哦');
        }
        var img = new Image();
        img.onload = function() {
            var result = (img.width > 0) && (img.height > 0);
            if (isDebug) {
              console.log('支持Webp');
            }
            // alert('支持')
            ImageSmartLoader.isWebPSupported = true;
            ImageSmartLoader.webPLoader();
        };
        img.onerror = function() {
            if (isDebug) {
              console.log('不支持Webp');
            }
            ImageSmartLoader.isWebPSupported = false;
            ImageSmartLoader.webPLoader();
        };
        img.src = "data:image/webp;base64," + TestImages.demo;

    },
    imgLoader: function() {
        if (isDebug) {
          console.log('加载默认图片');
        }
    },
    webPLoader: function() {
        if (isDebug) {
          console.log('加载webP');
        }
        // alert(ImageSmartLoader.isWebPSupported);
        if (ImageSmartLoader.isWebPSupported === true) {
            if (isDebug) {
              console.log('宽度是' + General.viewWidth);
            }
            if (General.viewWidth == 768) {
                $(".lazy").lazyload({
                    advanced_load: true,
                    data_attribute: 'url',
                    webP_load: true,
                    is_scale: false
                });
                return false;
            }
            if (General.viewWidth < 768) {
                $(".lazy").lazyload({
                    advanced_load: true,
                    data_attribute: 'url',
                    webP_load: true,
                    is_scale: true,
                    scale_width: 750
                });
            } else {
                // alert('普通支持')
                $(".lazy").lazyload({
                    advanced_load: true,
                    data_attribute: 'url',
                    webP_load: true,
                    is_scale: false
                });
            }

        } else {
            if (General.viewWidth == 768) {
                $(".lazy").lazyload({
                    advanced_load: true,
                    data_attribute: 'url',
                    webP_load: false,
                    is_scale: true,
                    scale_width: 1500
                });
                return false;
            }
            if (General.viewWidth < 768) {
                $(".lazy").lazyload({
                    advanced_load: true,
                    data_attribute: 'url',
                    webP_load: false,
                    is_scale: true,
                    scale_width: 750
                });
            } else {
                // alert('普通支持')
                $(".lazy").lazyload({
                    advanced_load: true,
                    data_attribute: 'url',
                    webP_load: false,
                    is_scale: false
                });
            }
        }
    },
};

$(document).ready(function() {
    var $window = $(window);

    // Scroll to content
		// $('.scroll-down').on('click', function(e) {
		// 	var $cover = $(this).closest('.cover');
		// 	$('html, body').animate({
		// 		scrollTop: $cover.position().top + $cover.height()
		// 	}, 800 );
		// 	e.preventDefault();
		// });

    // adjustCover();
    // var lazyResize = debounce(adjustCover, 200, false);
    // $(window).resize(lazyResize);

    // Scroll to content
    var scrollHint = document.getElementById('scroll-hint');
    if (scrollHint !== null) {
      //   scrollHint.addEventListener('click', function() {
      //     if (!scrollHint.classList.contains('visible'))
      //         return;
      //       window.scrollBy({
      //         top: window.innerHeight,
      //         left: 0,
      //         behavior: 'smooth'
      //     });
      // });

      // Scroll to content
		$('.header-scroll-hint').on('click', function(e) {
			var $cover = $(this).closest('.cover');
			$('html, body').animate({
				scrollTop: $cover.position().top + $cover.height()
			}, 400 );
			e.preventDefault();
		});

      // $('.cover .arrow-down').on('click', function(e) {
      //   $('html, body').animate({'scrollTop': $('.cover').height()}, 800);
      //   e.preventDefault();
      // });

      window.addEventListener('load', function() {
          var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          if (scrollTop > 0) {
              scrollHint.classList.remove('visible');
          } else {
              scrollHint.classList.add('visible');
          }
      });

      window.addEventListener('scroll', function() {
          var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          if (scrollTop > 0) {
              scrollHint.classList.remove('visible');
          } else {
              scrollHint.classList.add('visible');
          }
      });
    }

    function adjustCover() {
		    setElementHeight('.post-header.cover');
	  }

    //初始化 toc 插件
    $('#toc').initTOC({
        selector: "h1, h2, h3, h4, h5, h6",
        scope: "article",
        overwrite: false,
        prefix: "toc"
    });

    //动态设置样式,例如:滚动到一定程度之后隐藏目录
    // var mar_left = $(".post").width() / 2 + 20;
    //var top = $("#toc").css("top");  这只能获取类似152px的字符串,下面才能获取值
    //var top = $("#toc").position().top;
    // var top = $(window).height();
    // $("#toc").css("top",top / 2- (top / 4)+"px");
    // $("#toc ol").html(function(i,origText){
    //     return origText + "<li><a id='scrollTop' href='#'>返回顶部</a></li>";
    // });
    // $("#toc").css({"margin-left":mar_left+"px"});

    // $(window).scroll(function(){
    //     var window_offset = $(window).scrollTop();
    //     var main_header_height = $(".main-header").height();
    //     var content_height = $(".content").height();
    //     if(window_offset < main_header_height - 100) {
    //         $("#toc").hide();
    //         //下面的条件不能用 a>x>c这种形式,只能用&&.身为一个前端小白表示伤不起...
    //     }else if(window_offset > main_header_height&&main_header_height+content_height - 500 > window_offset) {
    //         $("#toc").show();
    //     }else{
    //         $("#toc").hide();
    //     }
    // });

	  // Set the new height of an element
	  function setElementHeight(element){
		    var windowHeight = ( true===isiPod() && true===isSafari() ) ? window.screen.availHeight : $(window).height();
		      var offsetHeight = $('.site-header').outerHeight();
		        var newHeight = windowHeight;
		          if ( $(element).find('.scroll-down').is(':hidden') ) {
			             $(element).removeAttr('style');
			                $(element).find('.cover-bg').css('top','');
		          }
		          else {
			             $(element).outerHeight(newHeight);
			                $(element).find('.cover-bg').css('top',offsetHeight);
		          }
	  }

	  // Throttles an action.
	  // Taken from Underscore.js.
	  function debounce (func, wait, immediate) {
		    var timeout, args, context, timestamp, result;
		      return function() {
			         context = this;
			         args = arguments;
			         timestamp = new Date();
			         var later = function() {
				            var last = (new Date()) - timestamp;
				            if (last < wait) {
					             timeout = setTimeout(later, wait - last);
				            } else {
					              timeout = null;
					              if (!immediate) {
						                result = func.apply(context, args);
					              }
				            }
			         };
			         var callNow = immediate && !timeout;
			            if (!timeout) {
				                timeout = setTimeout(later, wait);
			            }
			            if (callNow) {
				                result = func.apply(context, args);
			            }
			    return result;
		      };
	  }

	  // Check if device is an iPhone or iPod
	  function isiPod(){
		    return(/(iPhone|iPod)/g).test(navigator.userAgent);
	  }

	  // Check if browser is Safari
	  function isSafari(){
		    return(-1!==navigator.userAgent.indexOf('Safari')&&-1===navigator.userAgent.indexOf('Chrome'));
	  }

		// Hidden sections
		$('.sidebar-toggle').on('click', function(e){
			// $('body').toggleClass('sidebar-opened'); 切换类别可以直接用 toggleClass
      if ( $('body').hasClass('sidebar-opened') ) {
				$('body').removeClass('sidebar-opened');
        $('body').css('overflow','scroll'); // 恢复 body，允许下层滑动
			} else {
				$('body').addClass('sidebar-opened');
        $('body').css('overflow','hidden'); // 锁定 body，禁止下层滑动
			}
			e.preventDefault();
		});

		$('.search-toggle').on('click', function(e){
			if ( $('body').hasClass('search-opened') ) {
				$('body').removeClass('search-opened');
        $('body').css('overflow','scroll'); // 恢复 body，允许下层滑动
				searchField.clear();
			} else {
				$('body').addClass('search-opened');
        $('body').css('overflow','hidden'); // 锁定 body，禁止下层滑动
				setTimeout(function() {
					$('#search-field').focus();
				}, 300);
			}
			e.preventDefault();
		});
		$('.overlay').on('click', function(e){
			$('body').removeClass('sidebar-opened search-opened');
      $('body').css('overflow','scroll'); // 恢复 body，允许下层滑动
			searchField.clear();
			e.preventDefault();
		});

    // Show comments
		if ( typeof disqus_shortname !== 'undefined' ) {
			var disqus_loaded = false;
			$('.comments-title').on('click', function() {
				var _this = $(this);
				if ( ! disqus_loaded ) {
					$.ajax({
						type: "GET",
						url: "//" + disqus_shortname + ".disqus.com/embed.js",
						dataType: "script",
						cache: true
					});
					_this.addClass('toggled-on');
					disqus_loaded = true;
				} else {
					$('#disqus_thread').slideToggle();
					if ( _this.hasClass('toggled-on') ) {
						_this.removeClass('toggled-on');
					} else {
						_this.addClass('toggled-on');
					}
				}
			});
		}

    $.fn.lazyload = function(options) {
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
            is_scale: false,
            scale_width: 750
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

            /* When appear is triggered load original image. */
            $self.one("appear", function() {
                if (!this.loaded) {
                    if (settings.appear) {
                        var elements_left = elements.length;
                        settings.appear.call(self, elements_left, settings);
                    }
                    if (isDebug) {
                      console.log('1.self.attr = ',$self);
                    }
                    var updatedUrl = $self.attr("data-" + settings.data_attribute);
                    // var updatedUrl = $self.attr("data-original");

                    if (updatedUrl === undefined) {
                      updatedUrl = $self.attr("src");
                    }
                    if (updatedUrl === undefined) {
                      console.log('测试 = ',$self.style);
                      updatedUrl = $self.style.backgroundImage;
                    }
                    if (updatedUrl !== undefined) {
                      if (isDebug) {
                        console.log('updatedUrl = ',updatedUrl);
                        console.log('图片地址' +updatedUrl.indexOf('ob6mci30g.qnssl.com'));
                        console.log('CDN地址' +updatedUrl.indexOf('file.is26.com'));
                      }
                      if (updatedUrl.indexOf('ob6mci30g.qnssl.com') > -1) {
                          // alert(1)
                          if (settings.advanced_load === true) {
                              updatedUrl += '?imageView2';
                          }
                          if (settings.is_scale === true) {
                              updatedUrl += '/0/w/' + settings.scale_width;
                          }
                          if (settings.webP_load === true && settings.is_scale === false) {
                              updatedUrl += '/0/format/webp';
                          }
                          if (settings.webP_load === true && settings.is_scale === true) {
                              updatedUrl += '/format/webp';
                          }
                      }
                    }

                    if (isDebug) {
                      console.log('中间打印updatedUrl',updatedUrl);
                      console.log('*********中间打印 img.src = ',$self.attr("src"));
                      console.log('*********中间打印 img = ',$("<img />"));
                    }

                    $("<img />").bind("load", function() {

                            $self.hide();

                            if ($self.is("img")) {
                                $self.attr("src", updatedUrl);
                                if (isDebug) {
                                  console.log('*********img.src = ',$self.attr("src"));
                                }
                            } else {
                                $self.css("background-image", "url('" + updatedUrl + "')");
                                if (isDebug) {
                                  console.log('*********background-image = ',$self.css("background-image"));
                                }
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
                        })
                        .attr("src", updatedUrl);
                }
            });

            /* When wanted event is triggered load original image */
            /* by triggering appear.                              */
            if (0 !== settings.event.indexOf("scroll")) {
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
            update();
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

    General.init();
    ImageSmartLoader.init();
    if ($('body').hasClass('post-template')) {
        General.addIcons();
    }

    // Site search
    // var searchField = $('#search-field').ghostHunter({
    //   results : "#search-results",
    //   onKeyUp : true,
    //   onPageLoad : true,
    //   includepages : true,
    //   info_template : '<div class="results-info">Posts found: {{amount}}</div>',
    //   result_template : '<div class="result-item"><a href="{{link}}"><div class="result-title">{{title}}</div><div class="result-date">{{pubDate}}</div></a></div>'
    // });
});
