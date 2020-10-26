$(document).ready(function(){
	var $wrapBody = $("#user-wrap") 
		, $fontsOption = $wrapBody.find(".fonts-option")
		, $fontsBtn = $fontsOption.find(".fonts-btn")
		, $fontsPanel = $fontsOption.find(".fonts-option-panel");
	
	
	// 폰트크기
	$fontsBtn.on({
		click: function(){
			if($fontsPanel.css("display") == "block") {
				$fontsPanel.hide();
				$fontsBtn.removeClass("active");
			} else {
				$fontsPanel.show();
				$fontsBtn.addClass("active");
			}
		}
	});

	/* 기사본문 폰트사이트 이벤트 */
	$('.article-view-header, #article-header-title').on('click', '.fontsize-radio', function(e){
		setCookie("article-view-page-fontsize", $(this).val(), 30);
		get_article_fontsize();
	});

	/* 폰트클래스 변경 */
	function change_article_fontsize(className) {
		$('.view-page').removeClass('font-size15 font-size16 font-size17 font-size18 font-size19 font-size20').addClass(className);
	}

	/* 쿠키가져오기 */
	function get_article_fontsize() {
		var className = getCookie("article-view-page-fontsize");
		if(className == "") className = "font-size17";

		$("#"+className+"_1").prop("checked", true);
		$("#"+className+"_2").prop("checked", true);

		change_article_fontsize(className);
	}

	/* 초기 실행 */ 
	get_article_fontsize();
});