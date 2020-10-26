/*
2017. 05 04 SJW

기존 리사이즈 하는 소스를 다 삭제하고..
간단히 컨테이너 가로값보다 이미지 원래 가로값이 클경우 버튼클래스 추가하고 클릭이벤트 주기
*/

function resizePhoto() {	

	var $_container = $('#article-view-content-div');
	var articleViewDivWidth = $_container.width();
	
	$_container.find('img').each(function(e){
		if($(this).closest('figure').length) {
			var ViewimageObj = new Image();
			var $_thisImgObj = $(this);
			ViewimageObj.src = $(this).attr("src");
			ViewimageObj.onload = function() {
				imageWidth = this.width;
				if(articleViewDivWidth <= imageWidth) {
					$_thisImgObj.closest('figure').addClass('bigsize');
				}
			};

		}
	});	

	$_container.on('click', 'figure.bigsize', function(e){
		$('<form action="/news/userArticlePhoto.html" method="POST"><input type="hidden" name="src" value="'+$(this).find('img').attr('src')+'"></form>').appendTo('body').submit();

		//var src = $(this).find('img').attr('src');
		//top.location.href = src;
	});
}