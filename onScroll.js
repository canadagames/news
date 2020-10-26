var	top_last_scroll		= 0;
var	diff_scroll			= 0;

function	onScrollDirection()
{
	var	function_direction	= function()
	{
		var	top_scroll	= jQuery(document).scrollTop();
		window.diff_scroll		= top_scroll - window.top_last_scroll;
		window.top_last_scroll	= top_scroll;
		
		jQuery(window).trigger("onScrollAdjustEndLine");
	};
	
	jQuery(window).scroll(function_direction);
	jQuery(window).resize(function_direction);
	
	setTimeout(function(){window.diff_scroll=-1;jQuery(window).trigger("onScrollAdjustEndLine");}, 200);
};

function	onScrollAdjustEndLine(query_start, query_end, query_in)
{
	jQuery(window).on
	(
		"onScrollAdjustEndLine",
		function()
		{
			var	obj_start	= jQuery(query_start);
			var	obj_end		= jQuery(query_end);
			var	obj_in		= jQuery(query_in);
			
			if ( obj_start && obj_end && obj_in )
			{
				var	top_in		= obj_in.offset().top;
				var	top_win		= jQuery(document).scrollTop();
				var	top_start	= obj_start.offset().top;
				var	top_end		= obj_end.offset().top;
				var	left_start	= obj_start.offset().left;
				var	width_start	= obj_start.width();
				var	height_win	= jQuery(window).height();
				var	height_end	= obj_end.height();
				var	height_in	= obj_in.height();
				var	bot_win		= top_win + height_win;
				var	bot_end		= top_end + height_end;
				var	bot_in		= top_in + height_in;
				
				var	gap_max		= top_end + height_end - top_start - height_in;
				
				obj_start.css({"height":height_in+"px"});
				
				if ( window.diff_scroll == 0 )
				{
					if ( obj_in.css("position") == "fixed" )
					{
						obj_in.css({"left":left_start+"px"});
					}
				}
				
				if ( height_in >= bot_end - top_start )
				{
					//	움직일 필요가 없음
					obj_in.css({"position":"relative","top":"0px","left":"0px","width":""});
				}
				else if ( height_win > top_end + height_end - top_start )
				{
					obj_in.css({"position":"relative","top":"0px","left":"0px","width":""});
				}					
				else if ( height_win > height_in )
				{
					if ( top_start >= top_win )
					{
						obj_in.css({"position":"relative","top":"0px","left":"0px","width":""});
					}
					else if ( top_start + gap_max <= top_win )
					{
						obj_in.css({"position":"relative","top":gap_max+"px","left":"0px","width":""});
					}						
					else
					{
						obj_in.css({"position":"fixed","top":"0px","left":left_start+"px","width":width_start+"px"});
					}
				}
				else
				{
					if ( window.diff_scroll < 0 )
					{
						if ( top_start >= top_win )
						{
							obj_in.css({"position":"relative","top":"0px","left":"0px","width":""});
						}
						else if ( top_in >= top_win )
						{
							obj_in.css({"position":"fixed","top":"0px","left":left_start+"px","width":width_start+"px"});
						}
						else if ( obj_in.attr("data-direction") == "down" && obj_in.css("position") == "fixed" )
						{
							obj_in.css({"position":"relative","top":(top_in-top_start-diff_scroll)+"px","left":"0px","width":""});
						}
						obj_in.attr("data-direction", "up");
					}
					
					if ( window.diff_scroll > 0 )
					{
						if ( bot_end <= bot_win )
						{
							obj_in.css({"position":"relative","top":gap_max+"px","left":"0px","width":""});
						}
						else if ( bot_in <= bot_win )
						{
							obj_in.css({"position":"fixed","top":(height_win-height_in)+"px","left":left_start+"px","width":width_start+"px"});
						}
						else if ( obj_in.attr("data-direction") == "up" && obj_in.css("position") == "fixed" )
						{
							obj_in.css({"position":"relative","top":(top_in-top_start-diff_scroll)+"px","left":"0px","width":""});
						}
						obj_in.attr("data-direction", "down");
					}
				}
			}
		}
	);
};