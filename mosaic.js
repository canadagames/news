function mosaic_autobox(data) {
	var $_container		= $(data[0].container);
	var autoplay		= data[0].autoplay;
	var autotime		= data[0].autotime;
	var temp_autoplay	= autoplay;
	var totalcount		= $_container.find('ul.auto-nav > li').length;
	var point			= 0;
	
	$_container.on('mouseenter', '.auto-cursor', function(e){
		mosaic_cmd('current', $(this).index());
	});

	$_container.on('mouseenter', function(e){
		if(autoplay) temp_autoplay = false;
	}).on('mouseleave', function(e){
		if(autoplay) temp_autoplay = true;
	});

	if(autoplay) {
		var rolling = window.setInterval(function () {
			if(temp_autoplay) mosaic_cmd('next', 0);
		}, autotime);
	}

	function mosaic_cmd(mode, current_point) {
		
		if(mode == "prev") {
			point -= 1;
			if(point < 0) point = totalcount - 1;
		}else if(mode == "next") {
			point += 1;
			if(point >= totalcount) point = 0;
		}else if(mode == "current") {
			point = current_point;
		}

		$_container.find('ul.auto-container > li').eq(point).show().siblings().hide();
		$_container.find('ul.auto-nav > li').eq(point).addClass('active').siblings().removeClass('active');

		if(point < 2){
			$_container.find('ul.auto-container').css({"left":"33.333333%","top":"33.333333%"});
		} else if(point < 4 && point >= 2) {
			$_container.find('ul.auto-container').css({"left":"0px","top":"33.333333%"});
		} else if(point < 6 && point >= 4) {
			$_container.find('ul.auto-container').css({"left":"0px","top":"0px"});
		} else if(point >= 6) {
			$_container.find('ul.auto-container').css({"left":"33.333333%","top":"0px"});
		}

		return false;
	}
}