/*
	@ 메뉴바 호출
	var submenuStyle="<?php echo $SubMenuContorl; ?>"; 
	var exceptIdx = new Array(1,2,3,4); //제외할 메뉴 인덱스번호 (0부터 시작:type integer)
	-->는 외부에서 불러온다.

	- css class 설명
	.a-menu-back : hover시 a 태그 백그라운드
	.s-menu-back : hover시 strong 태그 백그라운드 -> 백그라운드 이미지가 있는 a , strong 태그가 있는 곳에 같이 선언
	.a-hover	 : hover시 메인 메뉴 a 태그 색상 ($MenuOveColor 불러들이는 곳에 선언)
	.a-sub-hover : hover시 서브 메뉴 a 태그 색상 ($SubOveColor 불러들이는 곳에 선언)

	- 스크립트 변수
	menuIndex	: 선택된 메인메뉴 번호 (차례로 0부터시작)
	submenuIndex: 선택된 서브메뉴 번호 (차례로 0부터시작)
	submenuStyle	: 서브메뉴 펼침 스타일 (horizon : 가로로, vertical : 세로 슬라이딩)
	하기 싫음 null로 설정함
*/ 
(function($){
	if(!$ || $=="undefined") return;
	var sessStg = window.sessionStorage || false;

	$(function(){		
		var menuIndex=0, submenuIndex=null; //submenuStyle="<?php echo $SubMenuContorl; ?>";

		//menu 선택시 default 선택되게
		if(location.pathname.length>2){ //index로 들어오지 않을때...
			if(sessStg!=false){
				menuIndex	 = sessStg.getItem("menuIndex")||menuIndex;
				submenuIndex = sessStg.getItem("subMenuIndex")||submenuIndex;
			}
		}else{							//index로 들어올때
			if(sessStg!=false){
				sessStg.setItem("menuIndex", 0);
				sessStg.setItem("subMenuIndex", null);
			}
		}

		//가로형일때, 길이가 너무 긴 서브메뉴 위치 다시 잡음
		//rule : 롤오버객체의 left - (사이트전체넓이-롤오버객체의left+서브메뉴넓이(표면상모두960으로 style에 넣어놔서 텍스트(12px),여백20*칸수px 하여계산)-'최종편집'의 넓이)
		//만약 모두 계산후 left가 - 일 경우 0
		function calculLeft(obj){
			var _left = $(obj).position().left;
			var _txt = (parseInt($("li", obj).text().replace(/ /g,"").length, 10) * 13)+(parseInt($("li", obj).length,10)*12);
			var _calculate = ($("#mega-menu").width() - (_left+_txt) - ($("#mega-gap").width()||0));
			var _oLeft = _calculate<=0 ? (_left + _calculate) : _left;
				_oLeft = _oLeft<=0 ? 0 : _oLeft;

			return parseInt(_oLeft,10);
		}

		// url 만으로 해당 메뉴 위치 찾기
		// *** 메뉴 링크를 http://~~~ 절대경로로 할것;
		(function(v){

			//index()로 안찾아지네;;
			$("ul#mega-menu > li > a").each(
				function(idx, ele){
					//if($(ele).attr("href").indexOf(v)>=0){
					if($(ele).attr("href")==v){
						menuIndex=idx;
						if(sessStg!=false) sessStg.setItem("menuIndex", idx);
						return;
					}
				});
			
			$("ul#mega-menu > li > ul").each(
				function(idx, ele){
					$(ele).find("a").each(
						function(idx2, ele2){
							if($(ele2).attr("href")==v){
								menuIndex = $(ele2).parent().parent().parent().index();
								submenuIndex=idx2;

								if(sessStg!=false){
									sessStg.setItem("menuIndex", menuIndex);
									sessStg.setItem("subMenuIndex", idx2);
								}
								return;
							}
						});
				});
			
			//location.pathname+location.search

		})(location.href);

		
		$("#mega-menu > li").each(function(idx, ele){
			if(menuIndex != null){
				if(idx == menuIndex){
					var mIdx = parseInt(menuIndex,10);
					var obj = $("#mega-menu > li:eq("+mIdx+")");

					if(submenuStyle=="horizon"){
						$("ul", obj).css({"paddingLeft":calculLeft(obj)+"px"}).prev("a").addClass("a-hover a-menu-back");

						$("strong", obj).addClass("s-menu-back");
						$("span", obj).addClass("p-menu-back");

						//서브메뉴	
						if(submenuIndex != null){
							$("ul > li > a", obj).each(
								function(sIdx){
									if(sIdx == submenuIndex) $(this).addClass("a-sub-hover");
								});
						}					 
					
					//세로형 서브메뉴
					}else $("ul", obj).prev("a").addClass("a-hover a-menu-back").children("strong").addClass("s-menu-back").children("span").addClass("p-menu-back");
				}
			}

			$(ele).hover(function(){
				$(".user-nav-overlay").removeClass("active");
				$("#mega-menu li ul").hide();
				$("#mega-menu > li > a").removeClass("a-hover a-menu-back").children("strong").removeClass("s-menu-back").children("span").removeClass("p-menu-back");
				$(ele).children("a").addClass("a-hover a-menu-back").children("strong").addClass("s-menu-back").children("span").addClass("p-menu-back");
				
				if($.inArray(idx, exceptIdx)>=0) return; //나오지 않았으면 하는 서브메뉴

				if(submenuStyle=="horizon") {
					$(".user-nav-overlay").addClass("active");
					$("ul",this).css({"paddingLeft":calculLeft(ele)+"px"}).show();
				}else{ //세로형 서브메뉴
					if($("ul>li",this).length<=0) return;

					var _mw = $(this).width(), //메인메뉴 넓이
					_ew = $("ul",ele).width(), //서브메뉴 넓이
					_l = $(this).position().left-((_ew/2)-(_mw/2)); //상단메뉴와 비교 가운데 띄우기
					//_l = _l<=0 ? $(this).position().left : _l;// 왼쪽에 딱 붙었을때는 넘어가지 않기
					
					$(".user-nav-overlay").addClass("active");
					$(".user-search-form").hide();
					$(".search-btns").removeClass("active").find(".s7-close").removeClass("s7-close").addClass("s7-search");
					$("ul",this).css({"position":"absolute","left":_l+"px"}).addClass("sub-menu-vertical").show();
				}

				//서브메뉴
				$("ul>li>a",this).hover(function(){	
					$(this).parent().parent().find("a").removeClass("a-sub-hover");
					$(this).addClass("a-sub-hover");
				});
			},
			function(){
				if(submenuStyle=="vertical") {
					$(".user-nav-overlay").removeClass("active");
					$("ul",this).hide();
				} else {
					$(".user-nav-overlay").removeClass("active");
					$("ul",this).hide();
				}
			});
		});
	

		var navWrap = $("#user-nav")
			, schWrap = navWrap.find(".user-search")
			, schBtns = schWrap.find(".search-btns")
			, schForms = schWrap.find(".user-search-form");

		// 검색
		schBtns.on({
			click: function() {
				if(schForms.css("display") == "block") {
					schForms.slideUp("fast");
					schBtns.removeClass("active").find(".s7-close").removeClass("s7-close").addClass("s7-search");
				} else {
					schForms.slideDown("fast").find("#search").focus();
					schBtns.addClass("active").find(".s7-search").removeClass("s7-search").addClass("s7-close");
				}
			}
		});

		// back to the top		
		$(".brand-madal").scroll(function(){
			if($(".brand-madal").scrollTop() > 0){	
				$('#modal-top').fadeIn();
			}else{
				$('#modal-top').fadeOut();
			}
		});

		$('#modal-top').click(function(){
			$(".brand-madal").animate( {scrollTop:0}, 100);
		});
	});
})(jQuery);