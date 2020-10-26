var getComu = {
	getEvt:function(contType, position){
		var temp_url = "https://c.motorgraph.com/api/getDocuments.php?type="+contType;
		$(function(){
			$.ajax({
				url:temp_url,
				/*url: "/getComunity/getComunity.php?url=c.motorgraph.com/api/getDocuments.php?type="+contType, 원본내용 */
				dataType: "json",
				success: function(data){
					var str = '';
					var i=0;

					$.each(data, function(index, value){
						var thumbnail = value.thumbnail;
						var title = value.title;
						var board_title = value.board_title;
						var nickname = value.nickname;
						var comment_count = value.comment_count;
						var readed_count = value.readed_count;
						var link = value.link;
						var CC_check;
						console.log(link);
						if(position == "arcBtm"){ //pc기사면 하단 커뮤니티

								if(!thumbnail) thumbnail = "/getComunity/default.png";
								
								if(i==0) divStyle ="margin-left:0;";
								else divStyle ="margin-left:5px;";
								

								var textLength = 20;

								if(textLength < title.length){
									title = title.substr( 0, textLength );
									title += "...";
								}

								if(comment_count != '0') CC_check = true;
								else CC_check = false;


								if(i < 4){


									
									str += "<div class='contWrap' style='"+divStyle+"'>";
									str += "<div class='imgWrap'>"
									str += "<a href='"+link+"' target='_top'><img src='"+thumbnail+"' class='imgWidt imgHeight hnobr' border='0' style='margin-left:0px;'></a>";
									str += "</div>";
									str += "<div class='titleWrap imgWidth'>";
									str += "<p class='title'><a href='"+link+"' target='_top' class='FtColor_typeA OnLoad'>"+title;
									if(CC_check == true) str +=" <b style='color:#e72916;'> "+comment_count+"</b>";
									str += "</a></p>";
									//str += "<p class='byline'><a href='"+link+"' target='_top' class='FtColor_typeA OnLoad'>"+board_title+" | "+nickname+"</a></p>";
									str += "</div>";
									str += "</div>";
									str += "";								
								}
								 i++;
								$("div.newArcWrap").html(str);
						}


						if(position == "tab1"){ //pc 메인, 리스트 탭박스 인기글
								
							var textLength = 23;
							var CC_check;

							if(textLength < title.length){
								title = title.substr( 0, textLength );
								title += "...";
							}
							if(comment_count != '0') CC_check = true;
							else CC_check = false;
							if(i == 0){
							str += "<div class='auto-article'>";
							str += "<div id='roll_hot' class='auto-container'>";
							}
							if(i < 5){
							str += "<div id='list_12' class='dis-none text-left clearfix'><a href="+link+" target='_top' class='size-14 line-height-3-x auto-fontB onload'>"
							str += title;
							str += "</a></div>";
							}
							

							i++;
							if(i == 5){
							str += "</div></div>";

							str += "<script type='text/javascript'>";

							str += "$(document).ready(function(){";
		
	str += "$('#roll_hot').slick({";
	str += "	arrows: false,";
	str += "	infinite: true,";
	str += "	autoplay: true,";
	str += "	vertical: true,";
	str += "	verticalSwiping: true,";
	str += "	rows: 1,";
	str += "	speed: 300,";
	str += "	slidesToShow: 1";
	str += "});";

str += "});";

str += "</script>";


							}



							$("div.hot").html(str);
						}


						if(position == "tab2"){ //pc 메인, 리스트 탭박스 최근글
								
							var textLength = 23;
							var CC_check;

							if(textLength < title.length){
								title = title.substr( 0, textLength );
								title += "...";
							}

							if(comment_count != '0') CC_check = true;
							else CC_check = false;
							
							if(i == 0){
							str += "<div class='auto-article'>";
							str += "<div id='roll_new' class='auto-container'>";
							}
							if(i < 5){
							str += "<div id='list_12' class='dis-none text-left clearfix'><a href="+link+" target='_top' class='size-14 line-height-3-x auto-fontB onload'>"
							str += title;
							str += "</a></div>";
							}
							

							i++;
							if(i == 5){
							str += "</div></div>";

							str += "<script type='text/javascript'>";

							str += "$(document).ready(function(){";
		
	str += "$('#roll_new').slick({";
	str += "	arrows: false,";
	str += "	infinite: true,";
	str += "	autoplay: true,";
	str += "	vertical: true,";
	str += "	verticalSwiping: true,";
	str += "	rows: 1,";
	str += "	speed: 300,";
	str += "	slidesToShow: 1";
	str += "});";

str += "});";

str += "</script>";


							}

							$("div.new").html(str);
						}
						
					});

				}
			})
		})
	}
}