/*
floating_banner_body(id) -> position:relative
nd_floating_banner(class) -> position:absolute(여러개 가능)

<div id="floating_banner_body"> 
	// 
	<div id="floating_banner_left" class="nd_floating_banner" data-parent-target="ND_Warp" data-top-margin="5" data-duration="300" data-scroll='y'>
		<ul>
			<li>좌측배너</li>
		</ul>
	</div>
	<div id="floating_banner_right" class="nd_floating_banner" data-scroll='y' data-top-margin="5" data-duration="300">
		<ul>
			<li>우측배너</li>
		</ul>
	</div>
</div>
*/
(function($) {
	$(function(){
		if($(".nd_floating_banner").is(".nd_floating_banner") === true) {  // 대상이 있으면 작동

			var $NDFloatingBanner = {
				target:$(".nd_floating_banner"),	// 배너
				parentTarget:null,                  // 부모
				parentTargetHeight:0,               // 부모높이
				targetTopMargin:[],                 // 스크롤이 배너보다 밑으로 내려가면 상단으로 붙는데 이때 여백
				targetTopPosi:[],                   // 문서시작 부분과 배너 상단사이 여백
				targetHeight:[],                    // 배너높이
				execMaxPosi:[],                     // 배너가 스크롤되어 내려오는 한계점
				duration:[],                        // 지속시간
				tops:[],                            // 시작 top 값
				scrolls:[],                         // 스크롤 여부
				stop:false,                         // 스크롤 정지여부
				getOptions:function() {             // 옵션값 지정
					var $this = this;
					var scrollStopCheck = true;
					this.parentTarget = $("#"+this.target.attr("data-parent-target"));
					this.parentTargetHeight = this.parentTarget.height() || 0;
					this.target.each(function(index,ele) {
						$this.targetTopMargin[index] = Number($(ele).attr("data-top-margin")) || 5;
						$this.scrolls[index] = $(ele).attr("data-scroll") || "n";
						if($this.scrolls[index] == 'y') scrollStopCheck = false;
						$this.tops[index] = parseInt($(ele).css("top")) || 0;
						$this.targetTopPosi[index] = $(ele).offset().top - $this.targetTopMargin[index] || 0;
						$this.targetHeight[index] = $(ele).height() || 0;
						$this.execMaxPosi[index] = $this.parentTargetHeight - $this.targetHeight[index] || 0;
						$this.duration[index] = $(ele).attr("data-duration") || 300;
					});
					// 스크롤 범위가 작다면 정지
					this.stop = (this.parentTargetHeight < this.targetHeight) ? true : false; 
					// data-scroll 이 모두 n이라면 정지
					if(scrollStopCheck === true) this.stop = true;
				}
			};
			$NDFloatingBanner.getOptions();

			if($NDFloatingBanner.scrolls.length > 0 && $NDFloatingBanner.stop === false) {
				$(window).scroll(function() {
					var position = 0;
					// 스크롤 위치계산
					if (window.innerWidth) position = window.pageYOffset;
					else if (document.documentElement && document.documentElement.clientWidth) position = document.documentElement.scrollTop;
					else if (document.body.clientWidth) position = document.body.scrollTop;

					// 여러개 배너중 스크롤을 하는 것만 
					for(scrollData in $NDFloatingBanner.scrolls) {
						if($NDFloatingBanner.scrolls[scrollData] == 'y') {
							var top = 0;

							if($NDFloatingBanner.execMaxPosi[scrollData] < position) {    // 한계점에 가면 최대치로 지정
								top = $NDFloatingBanner.execMaxPosi[scrollData] + $NDFloatingBanner.tops[scrollData] - $NDFloatingBanner.targetTopPosi[scrollData];

								//2016. 11. 15 성재원 추가 - ND_Warp 높이가 짧은건 비정상적으로 위로 올라가거나 밑으로 내려가는 현상 방지 수정.
								if(top < $NDFloatingBanner.tops[scrollData] - $NDFloatingBanner.execMaxPosi[scrollData]){
									if($NDFloatingBanner.targetTopPosi[scrollData] < position) top = position + $NDFloatingBanner.tops[scrollData] - $NDFloatingBanner.targetTopPosi[scrollData];
									else top = $NDFloatingBanner.tops[scrollData];
								}else{ 
									if(top < 0){
										if($NDFloatingBanner.targetTopPosi[scrollData] < position) top = position + $NDFloatingBanner.tops[scrollData] - $NDFloatingBanner.targetTopPosi[scrollData];
										else top = $NDFloatingBanner.tops[scrollData];
									}else{
										if(top < $NDFloatingBanner.tops[scrollData]) top = $NDFloatingBanner.tops[scrollData];
									}
								}
							
							} else {   // 배너 상단의 여백이상 지나가면 상단에 붙도록
								if($NDFloatingBanner.targetTopPosi[scrollData] < position) top = position + $NDFloatingBanner.tops[scrollData] - $NDFloatingBanner.targetTopPosi[scrollData];
								else top = $NDFloatingBanner.tops[scrollData];
							}

							$NDFloatingBanner.target.eq(scrollData).stop().animate({"top":top+"px"},{duration:$NDFloatingBanner.duration[scrollData], specialEasing: {width: "linear",height: "easeOutBounce"}, queue:false}); 
						}
					}
				});
			}
		}
	});
})(jQuery);