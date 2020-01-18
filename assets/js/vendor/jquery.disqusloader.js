/*
	disqusLoader.js v1.0
	A JavaScript plugin for lazy-loading Disqus comments widget.
	-
	By Osvaldas Valutis, www.osvaldas.info
	Available for use under the MIT License
*/

;( function( $, window, document, undefined )
{
	'use strict';

	var $win			= $( window ),
		throttle		= function(a,b){var c,d;return function(){var e=this,f=arguments,g=+new Date;c&&g<c+a?(clearTimeout(d),d=setTimeout(function(){c=g,b.apply(e,f)},a)):(c=g,b.apply(e,f))}},

		throttleTO		= false,
		laziness		= false,
		disqusConfig	= false,
		scriptUrl		= false,

		scriptStatus	= 'unloaded',
		$instance		= $(),

		init = function()
		{
			if( !$instance.length || $instance.data( 'disqusLoaderStatus' ) == 'loaded' )
				return true;

			var winST = $win.scrollTop();

			// if the element is too far below || too far above
			if( $instance.offset().top - winST > $win.height() * laziness || winST - $instance.offset().top - $instance.outerHeight() - ( $win.height() * laziness ) > 0 )
				return true;

			$( '#disqus_thread' ).removeAttr( 'id' );
			$instance.attr( 'id', 'disqus_thread' ).data( 'disqusLoaderStatus', 'loaded' );

			if( scriptStatus == 'loaded' )
			{
				DISQUS.reset({ reload: true, config: disqusConfig });
			}
			else // unloaded | loading
			{
				window.disqus_config = disqusConfig;
				if( scriptStatus == 'unloaded' )
				{
					scriptStatus = 'loading';
					$.ajax(
					{
						url:		scriptUrl,
						async:		true,
						cache:		true,
						dataType:	'script',
						success:	function()
						{
							scriptStatus = 'loaded';
						}
					});
				}
			}
		};

	$win.on( 'scroll resize', throttle( throttleTO, init ));

	$.disqusLoader = function( element, options )
	{
		options = $.extend({},
		{
			laziness:		1,
			throttle:		250,
			scriptUrl:		false,
			disqusConfig:	false,

		}, options );

		laziness		= options.laziness + 1;
		throttleTO		= options.throttle;
		disqusConfig	= options.disqusConfig;
		scriptUrl		= scriptUrl === false ? options.scriptUrl : scriptUrl; // set it only once
		$instance		= ( typeof element == 'string' ? $( element ) : element ).eq( 0 );

		$instance.data( 'disqusLoaderStatus', 'unloaded' );

		init();
	};

})( jQuery, window, document );
