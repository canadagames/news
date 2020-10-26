var adWrite={
	// php 전달 변수
	vars:{
		separator : "|"
		,editId : null												// 수정할 id
		,box : '<div class="ad-map" />'					// 생성된 박스
		,buttons : '<div class="ad-map-btns"><div class="btn-group-vertical"><button type="button" class="btn_com btn_com_0_699 adcmb_button adcmb_modify button secondary tiny" title="수정"><i class="fa fa-link fa-fw" aria-hidden="true"></i></button><button type="button" class="btn_com btn_com_35_699 adcmb_button adcmb_delete button tiny nd-gray" title="삭제"><i class="fa fa-trash-o fa-fw" aria-hidden="true"></i></button></div></div>'		//생선된 박스의 버튼들
		,$textBox : null
		,act : ""												// 사진 업로드하고 이러저하게 자주 act값이 바뀌는데, 그것의 원래 값
		,iframe : '<iframe src="about:blank" name="adc_up_frame" id="adc_up_frame" width="0" height="0" frameborder="0"></iframe>'	// upload용 iframe
		,loadData : {}	
	}

	// 이미지 로딩되면 크기 재어오기
	// IE만 이미지 로딩된후 이벤트가 먹어져서 크기를 제대로 재어오지 못해서 inline으로 스크립트 작성함
	,getSizeLoadImage:function(_this)
	{
		var _w = _this.width
			,_h = _this.height;
		
		_this.setAttribute("data-display-width", _w);
		_this.setAttribute("data-display-height", _h);

		// 이미지맵 이벤트
		adWrite.map($(_this));
	}

	// 등록시 이벤트들
	,evtCrtForm:function()
	{	
		var parents = this
			,$type = $("#adc_crt_type_html, #adc_crt_type_file")
			,$htmlBox = $("#adc_crt_html_box")
			,$fileBox = $("#adc_crt_attach_file_box")
			
			,$popupType = $("#adc_crt_popup_type_layer, #adc_crt_popup_type_window")
			,$layer = $("#adc_crt_popup_layer_opt_box")
			,$window = $("#adc_crt_popup_window_opt_box")
			
			,$closeIcon = $("#adc_crt_popup_layer_icon")
			,$iconBox = $("#adc_crt_popup_layer_icon_box")

			,$closeExpire = $("#bottom_close_expire_label")
			,$closeExpireBox = $("#bottom_close_expire_box")

			,$attachFile = $("#adc_crt_attach_file")
			,$previewFile = $("#adc_crt_file_image")
			,$previewBox = $("#adc_crt_image_preview_box")
			
			,$max_file_size = $("#file_upload_max_size").val();
		
		// 입력부분 담아두기
		this.vars.$textBox = $("#adc_crt_image_link_box");

		// html, file 입력
		$type.click(function(){
			var isChecked = $(this).attr("value");

			$htmlBox[isChecked==="HTML"?"removeClass":"addClass"]("is-hidden");
			$fileBox[isChecked==="FILE"?"removeClass":"addClass"]("is-hidden");
		});

		// 미리보기 호출 //
		$attachFile.change(function(){
			var form = document.adc_form;

			if (typeof (FileReader) != "undefined") {

				var file = $(this)[0].files[0]
					,regex = ['jpg', 'jpeg', 'png', 'gif', 'swf']
					,filesize = file.size
					,extension = file.name.split('.').pop().toLowerCase();

				if(filesize > $max_file_size){
					alert('업로드 용량이 초과되었습니다.');
					$attachFile.val("");
					return false;
				}
				
				if((regex.indexOf(extension) > -1) === false){
					alert('jpg, png, gif, swf 확장자만 선택하여 주세요.');
					$attachFile.val("");

					//입력시만 함정발동 예정
					$previewBox.addClass("is-hidden");
					return false;
				}

				if(extension == "swf"){
					$previewBox.addClass("is-hidden");
					return false;
				}
			
				var reader = new FileReader();
				reader.onload = function (e) {
					var img = new Image();
					img.src = e.target.result;

					img.onload = function(){
						$previewFile.attr({"src":e.target.result,"data-display-width":this.width, "data-display-height":this.height, "data-width":this.width, "data-height":this.height, "alt":(form.title.value)?form.title.value:form.idxno.value});
						$previewBox.removeClass("is-hidden");
		
						$('#size_width').val(this.width);
						$('#size_height').val(this.height);
		
						$('#popup_width').val(this.width);
						$('#popup_height').val(this.height);

						// 이미지맵 이벤트
						parents.map($previewFile);
					}
				}

				reader.readAsDataURL(file);
				parents.mapDeleteAll();
			}
		});

		var $mapRadio = $("#adc_crt_image_link_total, #adc_crt_image_link_part, #adc_crt_image_link_not")
			,$imgLinkSelect = $(".adcil_btns")
			,$imgLink = $("#adc_crt_image_link")
			,$imgLinkFile = $("#adc_crt_image_link_file")
			,$selectPopup = $("#adc_crt_image_link_popup")		
			,$btnMapRegist = $("#adc_crt_img_link_btn_regist")
			,$linkAction = '';

		// 전체 또는 이미지 맵 선택시
		$mapRadio.click(function(){
			var $this = $(this)		
				,type = $this.attr("data-type");

			if(type == 'total' || type == 'map'){

				$("#adc_crt_image_link_box").removeClass('is-hidden');

				$btnMapRegist[type==="map"?"removeClass":"addClass"]("is-hidden");
				
				if(type==="total") parents.mapDeleteAll();									// 전체선택일때, 이전 데이타 모두 지움
				
			}else{
				$("#adc_crt_image_link_box").addClass('is-hidden');
			}
		});

		// layer or window 선택
		$popupType.click(function(){
			var isChecked = $(this).attr("data-type");

			$layer[isChecked==="layer"?"removeClass":"addClass"]("is-hidden");
			$window[isChecked==="window"?"removeClass":"addClass"]("is-hidden");
		});
		
		// 닫기 아이콘 클릭시 아이콘 형태 선택 박스 열게
		$closeIcon.click(function(){
			var $label_attr_for = $(this).attr('for')
				,isChecked = $('#'+$label_attr_for).is(":checked");

			$iconBox[isChecked===false?"removeClass":"addClass"]("is-hidden");
		});
		
		// 몇일 동안 열지 않기 입력박스 열기
		$closeExpire.click(function(){
			var $label_attr_for = $(this).attr('for')
				,isChecked = $('#'+$label_attr_for).is(":checked");

			$closeExpireBox[isChecked===false?"removeClass":"addClass"]("is-hidden");
		});

		// 어떤형태의 링크인지 확인
		// link, popup, file, close, day_close
		$imgLinkSelect.click(function(){
			var $this = $(this)
				,type = $this.attr("data-type");
			
			if(type==="popup" || type==="close" || type==="day_close"){
				$imgLink.add($imgLinkFile).addClass("is-hidden");
				$selectPopup[type==="popup"?"removeClass":"addClass"]("is-hidden");
			}else{
				$imgLink[type==="link"?"removeClass":"addClass"]("is-hidden");
				$imgLinkFile[type==="link"?"addClass":"removeClass"]("is-hidden");
				$selectPopup.addClass("is-hidden");
			}
		});

		$btnMapRegist.click(function(){

			// 맵 등록 수정
			var $popupSelect = $("#adc_crt_image_link_popup_select")
				,$linkText = $("#adcil_link_text")
				,$etcFile = $("#adcilf_attach")
				,$linkTarget = $(".adcil_btns_link option:selected");

			if(!parents.vars.editId){
				alert('이미지에서 수정할 맵데이타를 선택하여주세요.');
				return false;
			}

			// close, day_close 모두 등록 눌러야 저장되게...안그럼 radio클릭만으로 이전 정보 자체를 날려버림
			var type = $(".adcil_btns:checked").attr('data-type')
				,url = ""
				,target = "";
			
			if(!type) return false;
			if(type==="link"){
				url = $linkText.val();
				if(!url){
					alert('링크를 입력하여 주세요.');
					$linkText.focus();
					return false;
				}
				
				target = $linkTarget.val();
			}else if(type==="popup"){
				url = $popupSelect.val();
				if(!url){
					alert('팝업을 선택하여 주세요.')
					$popupSelect.focus();
					return false;
				}
			}else if(type==="file"){
				if(!$etcFile.val()){
					alert('파일을 선택하여 주세요.');
					$etcFile.focus();
					return false;
				}
				
				parents.uploadAttachTmpFile();
				
				return false;
			}
			
			parents.insertData({
									type:type
									,url:url
									,target:target
								})
			return false;
		});
	}
	
	// 이미지맵의 파일일때 저장 
	,uploadAttachTmpFile:function()
	{
		var parents = this
			,iframe = this.vars.iframe
			,form = document.adc_form;
		
		$(document.body).append(iframe);
		
		form.action = "/bannerpop/upload_act.php";
		form.target = "adc_up_frame";
		form.submit();
	}
	
	// 이미지맵의 임시파일저장후 리턴 값
	,afterUploadAttachTmpFile:function(result)
	{
		// 성공이던 아니던 폼은 일단 초기화함
		this.releaseForm();
		$("#adc_up_frame").remove();

		var json = $.parseJSON(adWrite.rawurldecode(result))
			,filename = json[0].filename;

		if(!filename){
			alert('업로드시 에러가 발생했습니다. 다시 업로드하여 주세요.');
			return false;
		}

		this.insertData({type:"file",url:filename,target:"self",json_obj:result});
	}

	//rawurldecode
	,rawurldecode:function(str) {
		return decodeURIComponent((str + '')
			.replace(/%(?![\da-f]{2})/gi, function() {
				return '%25';
			}));
	}

	// 이미지맵 입력폼 초기화
	,initInsertForm:function(data)
	{
		var parents = this
			,type = data.type||"link"
			,$btns = $(".adcil_btns")
			,$imgLink = $("#adc_crt_image_link")
			,$imgLinkFile = $("#adc_crt_image_link_file")
			,$selectPopup = $("#adc_crt_image_link_popup")
			,$filebox = $("#adcilf_uploaded_file");
		
		//$btns.filter("[data-type='"+type+"']").prop("checked", true);
		$btns.filter("[data-type='"+type+"']").click(); // 커스텀 radio box 라서 이렇게 처리 
		$filebox.hide();
		
		if(type==="popup" || type==="close" || type==="day_close"){
			$imgLink.add($imgLinkFile).addClass("is-hidden");
			$selectPopup[type==="popup"?"removeClass":"addClass"]("is-hidden");
			
			if(type==="popup") $("#adc_crt_image_link_popup_select").val(data.url);
			
		}else{			
			$imgLink[type==="link"?"removeClass":"addClass"]("is-hidden");
			$imgLinkFile[type==="link"?"addClass":"removeClass"]("is-hidden");
			$selectPopup.addClass("is-hidden");
			
			if(type==="link"){
				$(".adcil_btns_link option[value="+(data.target||"blank")+"]").prop("selected", true);
				$("#adcil_link_text").val(data.url)
			}else if(type==="file"){
				var $attach = $("#adcilf_attach")
					,$delBtn = $("#adcilfuf_btn")
					,$filename = $("#adcilfuf_file")
					,$fmode = $filename.attr('data-type');
				
				$attach.replaceWith($attach.clone());
				
				if(data.url){
					// 파일삭제
					$filebox.show();
					$filename.html(data.url);
					$delBtn.unbind("click").on("click", function(){
						if(confirm("서버에서 파일이 바로 제거됩니다.\n그래도 삭제하시겠습니까?")) {
						var file = data.url
							,extension = file.split('.').pop().toLowerCase()
							,filename = file.replace('.'+extension,'');

						$.post(SITE_DOMAIN + "/bannerpop/upload_act.php"
								,{mode:'dlt', fmode:$fmode, idxno:document.adc_form.idxno.value||"", filename:file}
								,function(data,rst){
									if(rst==="success"){
										if(data.result==="success"){
											$filename.empty();
											$filebox.hide();
											parents.insertData({type:"file", url:"", target:"", json_obj:""}, "no");
											//alert(decodeURIComponent(data.msg));
										}else alert(decodeURIComponent(data.msg));
									}else alert('생성할 수 있는 탭 제한수를 초과하였습니다.');
								},"json");
						}
					});
				}
			}
		}
	}
	
	// 상위폼 초기화
	,releaseForm:function(form)
	{
		if(!form) form = document.adc_form;
	
		// 해제
		form.action = this.vars.act;
		form.target = "";
	}
	
	// 데이타 얻어오기
	,getHiddenData:function()
	{
		var $id = $("#input_"+this.vars.editId)
			,val = $id.val().split(this.vars.separator);
		
		return {id:$id, val:val};
	}
		
	// input type 에 넣음
	,insertData:function(data, isInit)
	{
		if(!data) data={};
		if(!this.vars.editId) return false;
		if(!isInit) isInit = "ok";
		
		var $data = this.getHiddenData()
			,$id = $data.id
			,val = $data.val;
		
		if(val.length<=0) return false;

		val.splice(4, 4, data.type, data.url, data.target, (data.type == 'file' && data.url) ? data.json_obj : '')
		var value = val.join(this.vars.separator);
		
		$id.val(value);
		
		if(isInit==="ok") this.initInsertForm({type:"link", url:"", target:"self"});
		this.vars.editId = null;
		
		alert('적용되었습니다.');
	}
	
	// 수정폼
	,modifyForm:function(id)
	{
		if(!id) return false;
		this.vars.editId = id;
		
		var $data = this.getHiddenData()
			,val = $data.val
			,type = val[4]||"link"
			,url = val[5]||""
			,target = val[6]||"self";

		//이미지맵의 파일인지, 전체링크의 파일인지 구분짓기 위함
		$("#adcilfuf_file").attr('data-type', 'M' + (Number(this.vars.editId.replace(/[^0-9]/g,'')) + 1));

		this.initInsertForm({type:type, url:url, target:target});
		this.mapBlinkArea();
	}
	
	// 이미지 맵 잡기 위해 임시 저장
	,afterUploadTmpFile:function(json)
	{
		var form = document.adc_form
			,result = json.result||"error"
			,data = json.data||""
			,width = json.width||""
			,height = json.height||""
			,mime = json.mime||"";
		
		// 해제
		this.releaseForm(form);
		
		if(result === "error"){
			alert(data);
			return false;
		}
		
		// 나중에 폼 name으로 바꿀것!!!
		//$("#adc_crt_popup_size_width").val(width);
		//$("#adc_crt_popup_size_height").val(height);
		if(form.popup_width) form.popup_width.value = width;
		if(form.popup_height) form.popup_height.value = height;
		
		// 창 보이고, 이미지 미리보기 - 표시되는 사이즈 재오기
		$("#adc_crt_image_preview_box").show();
		$("#adc_crt_file_image").attr({"src":"data:"+mime+";base64,"+data, "data-width":width, "data-height":height});
		
		// 새로 올린것이니, 로딩된후 모든 이전에 저장된 맵 정보 날림
		// 이전 데이타 삭제
		this.mapDeleteAll();
	}
	

	// 비율대로 좌표 계산하기
	,mapCalcPositionRatio:function(val, ratio)
	{
		if(ratio === 1) return val;
		
		return Math.round(val * ratio);
	}
	
	// 비율대로 좌표 계산하기-축소
	,mapScalePositionRatio:function(val, ratio)
	{
		if(ratio === 1) return val;
		
		return Math.round(val / ratio);
	}
	
	/**
	 * input type="hidden" 생성
	 * id : string
	 * pos : object - 실제 위치
	 * kind : string -  링크,파일 등
	 * url : string - 링크, javascript function
	 * target : string - 현재창,새창,부모창
	 */
	,mapHidden:function($form, id, pos, kind, url, target)
	{
		var inputId = "input_"+id
			,val = [pos.x1, pos.y1, pos.x2, pos.y2, kind, url, target].join(this.vars.separator)
			,input = '<input type="hidden" name="link_url[]" id="'+inputId+'" class="adc_crt_image_map_data" value="'+val+'" />';
		
		$form.append(input);
	}
	
	// 생성된 맵 삭제
	,mapDelete:function(id)
	{
		var bId = "btn_"+id
			,inputId = "input_"+id;
		
		$("#"+id+",#"+bId+",#"+inputId).remove();
		this.initInsertForm({type:"link", url:"", target:"self"});
		alert('삭제되었습니다.');
	}
	
	// 생성된 맴 전체 삭제
	,mapDeleteAll:function()
	{
		$(".adc_crt_image_map_data, .ad-map, .ad-map-btns").remove();
	}
	
	// 입력부분 깜빡임
	,mapBlinkArea:function()
	{
		var parents = this;
		parents.vars.$textBox.addClass("ad-map-bg");
		setTimeout(function(){
			parents.vars.$textBox.removeClass("ad-map-bg")
		},500);
	}

	// 이미지 맵 잡기
	,map:function(target)
	{		
		var parents = this
			,$img = !!target.jquery ? target : $(target)
			,width = Number($img.attr("data-width"))||0							// 실제 사이즈
			,height = Number($img.attr("data-height"))||0
			,dWidth = Number($img.attr("data-display-width"))||0				// 표시 사이즈
			,dHeight = Number($img.attr("data-display-height"))||0
			,ratio = width>dWidth ? Number((width/dWidth).toFixed(1)) : 1		// 실제 사이즈가 표시된 사이즈보다 클경우 비율 맞추기 위해
			,box = parents.vars.box
			,buttons = parents.vars.buttons
			,$imgmapRadio = $("#adc_crt_image_link_part")
			,$imgmapBtnRegist = $("#adc_crt_img_link_btn_regist")
			,$form = $("#adc_form");

					
		return {
			exe:function()
			{
				this.canvas().loadData().addEvent();
			}
		
			// 덧붙이기
			,canvas:function()
			{
				$img.next("#adc_crt_edit_canvas").remove().end().after('<div id="adc_crt_edit_canvas" class="ad-canvas" style="left:'+$img.position().left+'px;width:'+dWidth+'px;height:'+dHeight+'px"></div>');
				return this;
			}
			
			// 로드된 맵 데이타에 따라 그리기
			,loadData:function()
			{
				var _parent = this
					,$input = $(".adc_crt_image_map_data")
					,$canvas = $("#adc_crt_edit_canvas");
				
				// 전체선택이라면
				if($input.length<=0){
					parents.initInsertForm(parents.vars.loadData);					
					return this;
				}

				// 이미지 맵 설정으로 수정
				$imgmapRadio.not(":checked").prop("checked", true);
				$imgmapBtnRegist.show();
				
				$.each($input, function(i,ele){
					var $ele = $(ele)
						,id = ele.id.replace("input_","")
						,val = $ele.val().split(parents.vars.separator)||[]
						,x1 = val[0]||0
						,y1 = val[1]||0
						,x2 = val[2]||0
						,y2 = val[3]||0
						,type = val[4]||"link"
						,url = val[5]||""
						,target = val[6]||"self";
					
					_parent.display($canvas, id, {x1:x1, y1:y1, x2:x2, y2:y2});					
				});
				
				return this;
			}
			
			// 영역 그림
			,display:function($canvas, id, data)
			{
				if(!data) data={};
				
				var $box = $(parents.vars.box)
					,$buttons = $(parents.vars.buttons)
					,offsetGap = $canvas.position().left||0			// 절대 좌표이기에 캔바스보다 작은 이미지일경우 gap만큼 더해서 표시해줌
					,bId = "btn_"+id
					,x1 = (Number(parents.mapScalePositionRatio(data.x1, ratio))+offsetGap)||0
					,y1 = parents.mapScalePositionRatio(data.y1, ratio)||0
					,x2 = (Number(parents.mapScalePositionRatio(data.x2, ratio))+offsetGap)||0
					,y2 = parents.mapScalePositionRatio(data.y2, ratio)||0
					,width = Math.abs(x1-x2)
					,height = Math.abs(y1-y2);
			
				// 버튼 만들기
				$buttons.css({"top":y1+"px", "left":x2+"px"}).attr({"id":bId})
				.find(".adcmb_button").click(function(){
					var $this = $(this)
						,isModify = $this.is(".adcmb_modify");
					
					if(isModify===true){
						parents.modifyForm(id);
					}else{
						parents.mapDelete(id);
					}
				});
				
				// box 만들기
				$box.css({"top":y1+"px", "left":x1+"px", "width":width, "height":height}).attr({"id":id});
				
				$canvas.after($box);
				$box.after($buttons);
								
				return this;
			}
						
			// event
			,addEvent:function()
			{
				var _this = this
					,position = {x:0, y:0}
					,$box = null
					,start = false;
				
				$(document.body).off("mousedown mousemove mouseup touchstart touchmove touchend","#adc_crt_edit_canvas")
				.on({
						"mousedown touchstart":function(event)
						{
							start = true;
							
							var $this = $(this)
								,evt = parents.getEventObject(window.event || event)
								,$evtTarget = $(evt.target||evt.srcElement)
								,offsetGap = $evtTarget.position().left									// 상대위치기 때문에 값 left 값을 더해줘야 함
								,x = Math.round(evt.offsetX||(evt.pageX-$evtTarget.offset().left))
								,y = Math.round(evt.offsetY||(evt.pageY-$evtTarget.offset().top))
								,id = "acem_"+new Date().getTime();
							
							position.x = x;
							position.y = y;
							
							$box = $(box).css({"top":y, "left":x+offsetGap}).attr({"id":id})
							$this.after($box);
							
							//evt.cancelBubble = true;
							//evt.stopPropagation();
							//evt.preventDefault();
						}
					
						,"mousemove touchmove":function(event)
						{							
							if(start === true){
								var evt = parents.getEventObject(window.event || event)
									,$evtTarget = $(evt.target||evt.srcElement)
									,offsetGap = $evtTarget.position().left									// 상대위치기 때문에 값 left 값을 더해줘야 함
									,x = Math.round(evt.offsetX||(evt.pageX-$evtTarget.offset().left))
									,y = Math.round(evt.offsetY||(evt.pageY-$evtTarget.offset().top))
									//,width = Math.abs(x-position.x)-5
									//,height = Math.abs(y-position.y)-5
									,width = Math.abs(x-position.x)
									,height = Math.abs(y-position.y)
									,css = {};
								
								css = {"width":width, "height":height};
								
								if(position.x>x && position.y>y){				// 좌상
									css.left = position.x-width+offsetGap;
									css.top = position.y-height;
								}else if(position.x>x && position.y<y){			// 좌하
									css.left = position.x-width+offsetGap;						
								}else if(position.x<x && position.y>y){			// 우상	
									css.top = position.y-height;
								}
								
								$box.css(css);
							}
						}
						
						,"mouseup touchend":function(event)
						{							
							start = false;
							
							// $box기준으로 x1,y1,x2,y2 가져옴
							var width = $box.width()
								,height = $box.height();
							
							if(width<20 && height<20){
								$box.remove();
								return false;
							}
							
							var	$buttons = $(buttons)
								,evt = parents.getEventObject(window.event || event)
								,$evtTarget = $(evt.target||evt.srcElement)
								,offsetGap = $evtTarget.position().left									// 상대위치기 때문에 값 left 값을 빼줘야지 진짜 맵이 됨
								,pos = $box.css(["top","left"])
								,x1 = parents.castIntFromCss(pos.left)
								,y1 = parents.castIntFromCss(pos.top)
								,id = $box.attr("id")
								,bId = "btn_"+id
								,inputId = "input_"+id
								,info = { x1 : x1, y1 : y1, x2 : x1 + width, y2 : y1 + height }
								,real = { x1 : parents.mapCalcPositionRatio(info.x1, ratio)-offsetGap, y1 : parents.mapCalcPositionRatio(info.y1, ratio), x2 : parents.mapCalcPositionRatio(info.x2, ratio)-offsetGap, y2 : parents.mapCalcPositionRatio(info.y2, ratio)};
							
							// 수정 삭제 이벤트
							$buttons.css({"top":info.y1, "left":info.x2}).attr({"id":bId})
							.find(".adcmb_button").click(function(){
								var $this = $(this)
									,isModify = $this.is(".adcmb_modify");

								if(isModify===true){
									parents.modifyForm(id);
								}else{
									parents.mapDelete(id);
								}
							});
							
							$box.after($buttons);
							parents.mapHidden($form, id, real, "", "", "");
							parents.initInsertForm({type:"link", url:"", target:"self"});									// 폼 초기화
							parents.vars.editId = id;
							
							// 이미지맵으로 체크
							$imgmapRadio.not(":checked").click().prop("checked", true);
							$imgmapBtnRegist.show();
							
							parents.mapBlinkArea();																			// 글쓰기 폼 이펙트
							
							//util.toast(lang.adcRequireLink);
						}
					},"#adc_crt_edit_canvas");
				
				return this;
			}
			
		}.exe();
	}

	// jquery 이벤트 등록 사용시, 이벤트 알아내기
	,getEventObject:function(e)
	{
		var evt = window.event||e;
			evt = evt.targetTouches?evt.targetTouches[0]:evt;  	// jquery touch event
		return evt;
	}
	
	// css px제거후 숫자형으로
	,castIntFromCss:function(v)
	{
		return Number(v.replace("px",""));
	}
	
	// list에서 버튼 이벤트
	,evtClickedButtons:function()
	{	
		// edit
		var edit_info = $('#admin-ad-list')
		,edit_section = edit_info.attr("data-edit-section")	
		,edit_area = edit_info.attr("data-edit-area")	
		,edit_step = edit_info.attr("data-edit-step")	
		,edit_idxno = edit_info.attr("data-edit-idxno")
		,edit_mode = edit_info.attr("data-edit-mode")
		,org_banner_kind = edit_info.attr("data-edit-org-banner-kind")
		,banner_kind = edit_info.attr("data-edit-banner-kind")
		,page = edit_info.attr("data-page")
		//,tmp_banner_idxno = edit_info.attr("data-edit-tmp-banner-idxno")
		,sc_area = edit_info.attr("data-search-scarea")
		,sc_word = encodeURIComponent(edit_info.attr("data-search-scword"))

		$(".ad-tile-toolkit, .content-inert").on("click", "button"
		, function(){
			var $this = $(this)
				,type = $this.attr("data-btn-type")
				,$parent = $this.closest(".adccfg_list_items")
				,bannerIdxno = $parent.attr("data-banner-idxno")
				,banner_type = $parent.attr("data-banner-type")
				,linkInfo = $parent.attr("data-link-info")
				,title = $.trim($parent.find(".acli_title").text())
				,state = $.trim($parent.find(".ad-tile-state").text())
				,Imgbp_Tag = $.trim($parent.find(".Imgbp_Tag").html());

			switch(type){
				case "add":
					if(banner_type == 'popup') {
						var data = {'mode':edit_mode,'section':edit_section,'popup_title':encodeURIComponent(title),'popup_idxno':bannerIdxno}
						adWrite.addEditPopupContents(data);
					}else{
						var data = {mode:edit_mode,'idxno':edit_idxno,'area':edit_area,'section':edit_section,'step':edit_step,'banner_title':encodeURIComponent(title),'banner_idxno':bannerIdxno,'kind':banner_kind,'edit_msg':'선택한 배너로 교체하시겠습니까?'};
						adWrite.addEditContents(data);
					}
					break;
				case "down":
					location.href = '/bannerpop/attach_down.php?idxno='+bannerIdxno+'&mode=O';
					break;
				case "linkInfo":					// 업로드된 파일 링크 복사					
					var source = SITE_DOMAIN + '/bannerpop/uploads/image/'+linkInfo;
					adWrite.copyExe(source);
					break;
				case "sourceCopy":					// 소스복사
				/*if(state == '무제한') {
					if(!Imgbp_Tag) return false;
					var _html = '<!--'+title+'-->'
							  + Imgbp_Tag
							  + '<!--//'+title+'-->';	
				}else{*/
					var _time = new Date().getTime()
						,_html = '<!--'+title+'-->'
							   + '<script type="text/javascript">var ___BANNER = "ban_'+_time+'";</script>'
							   + '<script type="text/javascript" charset="utf-8" src="'+SITE_DOMAIN+'/bannerpop/uploads/js/'+bannerIdxno+'.js?'+_time+'" id="ban_'+_time+'"></script>'
							   + '<!--//'+title+'-->';
				//}
					
					adWrite.copyExe(_html);
				break;
				case "preview":
					if(!window.___popup) return false;
					
					var p = ___popup[bannerIdxno];

					if(!p) return false;
					if(!window.___currentTime) window.___currentTime = Math.floor(new Date().getTime()/1000);// 시간이 설정되지 않았다면 js 시간으로 설정함
					
					// 관리자만...										
					$(".layer_box").remove();				// 다른게 열려있다면 삭제
					bannerpop.vars.popup.view = "manager";
					bannerpop.float(p);
					break;
				case "mdf":
					var $ahref = '/bannerpop/';
					$ahref += edit_section ? 'edit.html' : 'write.html';
					$ahref += '?type='+banner_type+'&mode=modify&idxno='+bannerIdxno+'&page='+page;
					if(edit_section) $ahref += '&edit_section=' + edit_section;
					if(edit_area) $ahref += '&edit_area=' + edit_area;
					if(edit_step) $ahref += '&edit_step=' + edit_step;
					if(edit_idxno) $ahref += '&edit_idxno=' + edit_idxno;
					if(edit_mode) $ahref += '&edit_mode=' + edit_mode;
					//if(tmp_banner_idxno) $ahref += '&tmp_banner_idxno=' + tmp_banner_idxno;
					if(org_banner_kind) $ahref += '&org_banner_kind=' + org_banner_kind;
					if(banner_kind) $ahref += '&banner_kind=' + banner_kind;
					if(sc_area) $ahref += '&sc_area=' + sc_area;
					if(sc_word) $ahref += '&sc_word=' + sc_word;
					location.href = $ahref;
					break;
				case "del":
					if(window.confirm('삭제할까요?')) {	
						var $ahref = '/bannerpop/delete_act.php?type='+banner_type+'&idxno='+bannerIdxno+'&page='+page;
						if(edit_section) $ahref += '&edit_section=' + edit_section;
						if(edit_area) $ahref += '&edit_area=' + edit_area;
						if(edit_step) $ahref += '&edit_step=' + edit_step;
						if(edit_idxno) $ahref += '&edit_idxno=' + edit_idxno;
						if(org_banner_kind) $ahref += '&org_banner_kind=' + org_banner_kind;
						if(banner_kind) $ahref += '&banner_kind=' + banner_kind;
						if(sc_area) $ahref += '&sc_area=' + sc_area;
						if(sc_word) $ahref += '&sc_word=' + sc_word;
						location.href = $ahref;
					}
					break;
				case "mdf_activity":
					var $ahref = '/bannerpop/';
					$ahref += edit_section ? 'edit.html' : 'write_activity.html';
					$ahref += '?type='+banner_type+'&mode=modify&activity_idxno='+bannerIdxno+'&page='+page;
					if(edit_section) $ahref += '&edit_section=' + edit_section;
					if(edit_area) $ahref += '&edit_area=' + edit_area;
					if(edit_step) $ahref += '&edit_step=' + edit_step;
					if(edit_idxno) $ahref += '&edit_idxno=' + edit_idxno;
					if(edit_mode) $ahref += '&edit_mode=' + edit_mode;
					if(org_banner_kind) $ahref += '&org_banner_kind=' + org_banner_kind;
					if(banner_kind) $ahref += '&banner_kind=' + banner_kind;
					//if(tmp_banner_idxno) $ahref += '&tmp_banner_idxno=' + tmp_banner_idxno;
					if(sc_area) $ahref += '&sc_area=' + sc_area;
					if(sc_word) $ahref += '&sc_word=' + sc_word;
					location.href = $ahref;
					break;
				case "del_activity":
					if(window.confirm('삭제할까요?')) {	
						var $ahref = '/bannerpop/delete_activity_act.php?type='+banner_type+'&activity_idxno='+bannerIdxno+'&page='+page;
						if(edit_section) $ahref += '&edit_section=' + edit_section;
						if(edit_area) $ahref += '&edit_area=' + edit_area;
						if(edit_step) $ahref += '&edit_step=' + edit_step;
						if(edit_idxno) $ahref += '&edit_idxno=' + edit_idxno;
						if(org_banner_kind) $ahref += '&org_banner_kind=' + org_banner_kind;
						if(banner_kind) $ahref += '&banner_kind=' + banner_kind;
						if(sc_area) $ahref += '&sc_area=' + sc_area;
						if(sc_word) $ahref += '&sc_word=' + sc_word;
						location.href = $ahref;
					}
					break;				
				case "sourceCopy_activity":					// 소스복사
					var _time = new Date().getTime()
					,_html = '<!--'+title+'-->'
						   + '<script type="text/javascript">var ___BANNER = "ban_'+_time+'";</script>'
						   + '<script type="text/javascript" charset="utf-8" src="'+SITE_DOMAIN+'/bannerpop/uploads/js_activity/'+bannerIdxno+'.js?'+_time+'" id="ban_'+_time+'"></script>'
						   + '<!--//'+title+'-->';
					
					adWrite.copyExe(_html);
				break;
			}

			return false;
		});
	}

	//수정시 섹션판 컨텐츠 삽입
	,addEditContents:function(data)
	{			
		//var flag = false;
		var flag = true;

		/*if(data.mode == 'modify') {
			if(data.tmp_banner_idxno != data.banner_idxno) {
				if(confirm(data.edit_msg)) flag = true;
				else flag = false;
			}else flag = true;
		}else flag = true;*/

		if(flag) { 			
			data = JSON.stringify(data);
			$.ajax({
				url:"/edit/adminReservationBannerWrite.php"
				,type:'post'
				,dataType:'json'
				,contentType:'application/x-www-form-urlencoded; charset=utf-8'
				,data:{post_data:data}
				,success:function(json, result) {
					if(result == 'success') {
						if(json.response == 'ok') { 
							window.parent.location.reload();
						}else{
							alert(json.msg);
							return false;
						}
					}else return false;
				}
			});
		}else{
			return false;
		}
	}

	//수정시 섹션판 컨텐츠 삽입
	,addEditPopupContents:function(data)
	{					
		data = JSON.stringify(data);
		$.ajax({
			url:"/edit/adminReservationPopupWrite.php"
			,type:'post'
			,dataType:'json'
			,contentType:'application/x-www-form-urlencoded; charset=utf-8'
			,data:{post_data:data}
			,success:function(json, result) {
				if(result == 'success') {
					if(json.response == 'ok') {
						//window.parent.location.reload();
						parent.$('#edit-modal').find('.close-buttons').trigger('click');
						adWrite.addPopupContentsList(json);
					}else{
						alert(json.msg);
						return false;
					}
				}else return false;
			}
		});
	}

	,addPopupContentsList:function(json) {
		var html = '';

		console.log(json);
		
		if(json.rows.length>0) {
			for(var i = 0; i < json.rows.length; i++) {
				var index = i+1;
				html += '<!-- 팝업 //-->';
				html += '<div class="option-popup-item">';
				html += '	<input type="radio" name="editPopup" id="editPopup' + index + '" class="popup_element_ckecked" title="' + adWrite.rawurldecode(json.rows[i].popup_title) + '" data-idxno="' + json.rows[i].idxno + '" data-step="' + json.rows[i].step + '" value="' + json.rows[i].popup_idxno + '" />';
				html += '	<label for="editPopup' + index + '">';
				if(json.rows[i].popup_image && json.rows[i].extension != 'swf') {
					html += '<img src="/bannerpop/uploads/image/' + json.rows[i].popup_image + '" alt="' + adWrite.rawurldecode(json.rows[i].popup_title) + '" />';
				}else{
					if(json.rows[i].extension == 'swf') html += 'SWF';
					else html += 'HTML';
				}
				html += '		<div class="option-popup-item-title">' + adWrite.rawurldecode(json.rows[i].popup_title) + '</div>';
				html += '	</label>';
				html += '</div>';
				html += '<!--// 팝업 -->';
			}
		}

		parent.$('.option-popup-group').html(html);
	}

	//전체선택ㆍ해제
	,allChk:function()
	{	
		var $allChk = $('#allCheck');
		$allChk.click(function(){
			if($(this).is(':checked') == true) {
				$('.elembox').prop('checked',true);
			}else{
				$('.elembox').prop('checked',false);
			}
		});
	}

	/**
	 * 클립보드 복사 
	 * source : 복사할 정보
	 */
	,copyExe:function(source)
	{
		if(window.clipboardData){			// ie
			window.clipboardData.setData('Text',source);
			alert("복사되었습니다. 원하는 곳에 붙여넣기하여 주세요.");
		}else{								// etc
			
			var $tmpDiv=$('<div class="blind">'+source.replace(/</g,"&lt;").replace(/>/g,"&gt;")+'</div>').appendTo("body")
				,range=document.createRange()
				,selection=null;

			range.selectNodeContents($tmpDiv.get(0));
			selection=window.getSelection();
			selection.removeAllRanges();
			selection.addRange(range);
			
			if(document.execCommand("copy", false, null)) alert("복사되었습니다. 원하는 곳에 붙여넣기하여 주세요.");
			else window.prompt('키보드의 ctrl+C 또는 마우스 오른쪽의 복사하기를 이용해주세요.', source);

			$tmpDiv.remove();
		}
	}

	/**
	 * 기능성 배너 추가/순서변경/삭제/
	 */
	 ,evtClickActivityAdd:function() {
		//sessionStorage.removeItem("last_idx");
		var activity_idxno=window.parent.$('#all-banner-list').closest('div').attr('data-activity-idxno')||'';
		$('#activity-add-btn').click(function() {
			var $this=$(this);
				//,$viewHref=$('#activity-view-btn').attr('href')
				//,$last_idx=(activity_idxno)?activity_idxno:sessionStorage.getItem('last_idx');
			
			if($('.banner_element_ckecked').is(':checked') == false) {
				alert('배너를 선택해주세요.');
				//if(!$last_idx) $('#activity-view-btn').addClass('is-hidden');
				return false;
			}else{
				var $checked=$(".banner_element_ckecked:checked")
					,arr = new Array();
				if($checked.length>0) {
					$.each($checked, function(idx, v) {
						arr.push(v.value);
					});

					var data = {mode:activity_idxno?'modify':'input', activity_idxno:activity_idxno, banner_idxno:arr};
					data = JSON.stringify(data);
					console.log(data);
					$.ajax({
						url:"/bannerpop/activity_act.php"
						,type:'post'
						,dataType:'json'
						,contentType:'application/x-www-form-urlencoded; charset=utf-8'
						,data:{post_data:data}
						,success:function(json, result) {
							if(result == 'success') {
								if(json.response == 'ok') {
									//alert('추가되었습니다.\n우측에 버튼을 클릭하시면 상세 화면으로 이동합니다.');
									/*if(!activity_idxno) {
										sessionStorage.setItem('last_idx', json.last_insert_id);
										$('#activity-view-btn').attr('href', $viewHref + '&activity_idxno='+json.last_insert_id);
									}
									$('#activity-view-btn').removeClass('is-hidden');*/
									window.parent.location.reload();
								}else{
									//alert(json.msg);
									return false;
								}
							}else return false;
						},
     error:function(request,status,error){
        alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
       }
					});
				}
			}
		});

		$('#banner-activity-box').sortable({
			axis: '',
			update: function() {
				//console.log($(this));
			}
		});

		$('.trash').click(function() {
			if($('.banner-activity-list').length <= 1) {
				alert('마지막 배너는 삭제 할 수 없습니다.');
				return false;
			}

			var $this=$(this)
			,$parent = $this.closest('.banner-activity-list');

			$parent.fadeOut('fast', function(){
				$parent.remove();	
			});
		});

		$('#all-banner-list').on('click', function(e) {

			$this = $(this);
			href = $this.attr('href');

			$("#edit-modal-iframe").attr("src", href);
			$('#edit-modal').foundation('open');

			return false;
		});

		$('#edit-modal').on('open.zf.reveal', function(e){
			$('#for-loading').show();
		});

		$('#edit-modal').on('closed.zf.reveal', function(e){
			$("#edit-modal-iframe").attr("src", "about:blank").height('0px').closest('#activity-modal').css('height', '0px');
		});
	 }

	 ,valid_activity:function() {
		if($('#activity_title').val() == '') {
			alert('제목을 입력하세요.');
			$('#activity_title').focus();
			return false;
		}

		if($('.banner-activity-list').length<=0) {
			alert('배너를 하나 이상 추가하셔야 합니다.');
			return false;
		}

		return true;
	 }

}; // end adWrite 

var bannerpop={
	vars:{
		popup:{
			bodyWidth:0
			,bodyLeft:0
			,screenWidth:0
			,popname:"popup_"
			,width:{ window:[],layer:[] }
			,height:{ window:[],layer:[] }
			,top:{ window:[],layer:[] }
			,left:{ window:[],layer:[] }
			,order:0						// z-index용 순차적
			,view:"normal"					// 일반 : normal or 관리자 : manager
		}
	}

	/**
	 * 배너 효과
	 * 태그 작성 예::: bannerpop.banner(".banner_event_box");
	 <div class="boder_box banner_event_box" data-type="slide" data-idxno="3" data-speed="0.3">		
		<div class="boder_box beb_box">
			<ul class="no_type beb_ul">
				<li class="beb_li" data-delay="1"><a href=""><img src="http://sample.ndsoftnews.com/template_sian/download.php?idxno=856&file_extension=jpg&filename=Untitled-1.jpg" alt="배너 : 제목" /></a></li>
				<li class="beb_li" data-delay="1"><a href=""><img src="http://sample.ndsoftnews.com/template_sian/download.php?idxno=854&file_extension=jpg&filename=250%B0%E6%B3%B2%B5%B5%B9%CE%BD%C5%B9%AE.jpg" alt="배너 : 제목" /></a></li>
				<li class="beb_li" data-delay="1"><a href=""><img src="http://sample.ndsoftnews.com/template_sian/download.php?idxno=846&file_extension=jpg&filename=330%C6%F7%C5%E4.jpg" alt="배너 : 제목" /></a></li>
				<li class="beb_li" data-delay="1"><a href=""><img src="http://sample.ndsoftnews.com/template_sian/download.php?idxno=848&file_extension=jpg&filename=675_weeklyjournal.jpg" alt="배너 : 제목" /></a></li>
				<li class="beb_li" data-delay="5"><iframe width="640" height="360" src="http://www.youtube.com/embed/dykTgBpgbVs?feature=player_detailpage" frameborder="0" allowfullscreen></iframe></li>
			</ul>
		</div>
		<div class="beb_buttons">
			<button type="button" class="beb_btns beb_btn_prev">뒤로</button>
			<button type="button" class="beb_btns beb_btn_stop">멈춤</button>
			<button type="button" class="beb_btns beb_btn_next">앞으로</button>
		</div>
	 </div>
	 */
	,effect:function()
	{
		var savePrefix = "banner_order_";

		// 배너 넓이 
		function setSizeInfo($this){
			var idxno = $this.attr("data-idxno")
				 ,$ul = $this.find(".beb_ul")
				 ,$li = $ul.find(".beb_li")
				 ,boxWidth = $this.innerWidth()||$this.closest("#float_side_box").width()	// 윙 사이드의 배너일경우 재측정
				 ,liCount = $li.length||0;
			
			// 관리자 페이지가 아닐때 실제 노출중인 것만 찾음
			//if(ADM_DOMAIN.indexOf(location.host)<0){
				$.each($li,function(){
					var $this=$(this), len=$this.find(".banner_box").length;
					if(!len) $this.remove();
				});
				$li = $ul.find(".beb_li");
				liCount = $li.length||0;
			//}

			// 부모박스 기준으로 ul 최대 넓이 지정
			$ul.width(boxWidth*liCount);

			// 배너마다 넓이가 다를수 있으니 부모박스 넓이기준으로함
			$li.width(boxWidth);

			return {
						idxno : idxno
						,$ul : $ul
						,$li : $li
						,boxWidth : boxWidth
						,liCount : liCount
					};
		}

		return {
			// 순서대로 하나의 배너만 보임 
			order:function(){
				var _this = this
					,$this = $(_this)
					,$info = setSizeInfo($this)
					,idxno = $info.idxno
					,$li =$info.$li
					,liCount = $info.liCount-1
					,saveKey = savePrefix+idxno
					,order = Number(localStorage.getItem(saveKey))||0;

				// 랜덤 선택된것만 보임, 버튼 없앰
				$li.css("display","list-item").not(":eq("+order+")").css("display","none");

				localStorage.setItem(saveKey, (order>=liCount ? 0 : order+1));
			}

			// random banner
			,random:function(){
				var _this = this
					,$this = $(_this)
					,$info = setSizeInfo($this)
					,$li =$info.$li
					,liCount = $info.liCount
					,random = Math.floor(Math.random()*liCount);

					// 랜덤 선택된것만 보임, 버튼 없앰
				$li.css("display","list-item").not(":eq("+random+")").css("display","none");
			}
			
			// random 배너 선택후 슬라이드
			,randomSlide:function(){
				bannerpop.effect()['slide'].call(this, true);
			}

			// slide banner
			// rand true or false
			,slide:function(rand){
				var _this = this
					,$this = $(_this)
					,$info = setSizeInfo($this)
					,$ul = $info.$ul
					,$li =$info.$li.css("display","list-item")
					,$btnBox = $this.find(".beb_buttons")
					,$btnStop = $btnBox.find(".beb_btn_stop")
					,$btnCurrent = null						// 현재 선택된 버튼 prev,next,play,stop of buttons
					,speed = Number(_this.getAttribute("data-speed"))||.3
					,delayInfo = $li.map(function(){ return Number(this.getAttribute("data-delay"))||5; }).get()
					,boxWidth =$info.boxWidth
					,liCount = $info.liCount
					,count = (rand===true?Math.floor(Math.random()*(liCount)):-1)	// 처음부터 +1 하고 시작하기에 -1초기값-random일때는 배너수중 1개
					,delay = null													// 멈춰잇는 시간(초)
					,left = boxWidth												// 움직이는 간격
					,si = null														// setInterval 변수 : animate complete에서 delay로 해결하려 했는데 뭔가 잘 안풀림
					,tmpDelay = null												// next, prev 시 delay 없이 넘김
					,firstBtnClicked = 0;											// prev,next로 이동하는가 - rotate에서 또한번 +,- 하기에 처음만 실행되어야 함

				/**** function //s ****/
				/*
					다음 배너
					@params
					 loop : 반복될것인가
					 mode : + or -
				*/
				function rotate(loop, mode){
					if(!mode) mode="+";
					if(mode==="+") count++;
					else  count--;

					if(count>=liCount || count<=0) count = 0;					// 지연시간 담은 배열찾기 key
					var front = count+1;													// 지연후 움직여야 하는 거리 미리 담아둠
					if(count>=(liCount-1)) front = 0;
					left = boxWidth*front*-1;
					delay = tmpDelay===null?delayInfo[count]:tmpDelay;

					si = setTimeout(function(){
						$ul.animate({ marginLeft:left }
										,speed*1000,
										function(){
											if(loop===false) $btnCurrent.prop("disabled", false);
											tmpDelay = null;
										});//.delay(delay*1000);	
						if(loop!==false) rotate();
					},delay*1000);								
				}

				// stop
				function stop(){
					firstBtnClicked++;

					//$ul.stop(true, false);
					clearTimeout(si);
					tmpDelay=null;
					$btnStop.addClass("beb_btn_start").text("play");
				}

				// restart
				function start(){
					firstBtnClicked = 0;

					count--;
					if(count<=0) count=0;

					tmpDelay=null;
					rotate();

					$btnStop.removeClass("beb_btn_start").text("멈춤");
				}
				
				// 이전
				function prev(){
					stop();

					if(firstBtnClicked===1) count--;			// 처음만 이미 증가된값을 감소시킴
					if(count<=0) count=liCount;

					tmpDelay=0;
					rotate(false,"-");

					$btnCurrent.prop("disabled", true);
				}

				// 이후
				function next(){
					stop();

					if(firstBtnClicked===1) count--;
					if(count>=liCount) count=0;

					tmpDelay=0;
					rotate(false);

					$btnCurrent.prop("disabled", true);
				}
				/**** function //e ****/

				// 처음 배너를 보이지 않는다는 것은 랜덤 배너의 슬라이드라는 것-처음보일배너 설정
				if(count>=0 && rand===true){
					var _boxWidth = boxWidth*(count>=liCount?liCount-1:count)*-1;
					count--;
					$ul.css("margin-left",_boxWidth+"px");
				}
				
				// 실행
				rotate();						
				
				// 버튼보임
				$btnBox/*.css("display","block")*/.find(".beb_btns").unbind("click")
				.click(function(){
					var $this = $(this);
	
					$btnCurrent = $this;
					if($this.is(".beb_btn_prev")) prev();
					else if($this.is(".beb_btn_next")) next();
					else if($this.is(".beb_btn_stop")){
						if($this.is(".beb_btn_start")) start();
						else stop();
					}
				});

				// mouseover event
				$ul.on({
							mouseenter:stop
							,mouseleave:start
						});
			}
		};
	}

	// 배너호출
	,banner:function(target)
	{	
		var parents = this
			,$target = !!target.jquery?target:$(target);
		
		//console.log($target);
		$.each($target, function(i, ele){
			var type = ele.getAttribute("data-type")||"random";
			parents.effect()[type].call(this);
		});
	}

	,getCookie:function(name)
	{	/*
		var cookie = document.cookie;
		if(cookie.indexOf(name)<0) return "";
		
		var regexp = new RegExp("^(.*)"+name+"=(.*?);(.*)$","g");
		return cookie.replace(regexp,"$2").replace(/^\s+|\s+$/g,"");
		*/
		name+="=";
	    var ca = document.cookie.split(';');
	    for(var i=0; i<ca.length; i++) {
	        var c = ca[i];
	        while (c.charAt(0)==' ') c = c.substring(1);
	        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
	    }
	    return "";
	}
	
	,setCookie:function(name, value, days, domain)
	{
		var expires = "";
		if(days){
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			expires = "; expires="+date.toGMTString();
		}
		
		var dm=SITE_DOMAIN.replace('http://','');
		if(!domain) domain="." + dm;
		
		document.cookie = name+"="+value+expires+"; path=/; " + (domain?"domain="+domain+";":"");
	}

	// url을 array로
	,linkToJson:function(link)
	{
		if(!link) return false;
		
		var json = {}
			,tmp = link.replace(/^\/\?/,"").split("&");
		
		if(tmp.length<=0 || !tmp) return false;
		for(var i in tmp){
			var param = tmp[i].split("=")
				,key = param[0]
				,value = param[1];
			
			json[key] = value;
		}
		return json;
	}

	// 배너 append
	,append:function()
	{
		var id = ___BANNER
			,status = bannerStatus
			,time = ___currentTime
			,sTime = startTime
			,eTime = endTime
			,content = decodeURIComponent(bannerContent)
			,title = typeof bannerTitle == "undefined" ? "":decodeURIComponent(bannerTitle)
			,$target = $("#"+id)
			,explain = '';
			//,explain = "\n<br />"+util.timestampToDatetime(sTime).strDateTime.substring(0,16)+"~"+util.timestampToDatetime(eTime).strDateTime.substring(0,16);


		if(!id || $target.length<=0 || $target.attr("data-append")=="true") return false; // 객체가 없거나 시작전,이미 추가되었다면 중단
		
		// 예정,종료 배너
		else if(sTime > time || time > eTime || status=="0"){	
			if(location.href.indexOf('/edit/adminSection.html')<0) return false;	// 관리자가 아니라면 종료 메시지 안띄우기
			var adcMsg=""
				,adcClass="";
			if(sTime > time && status!="0"){
				adcMsg = '노출예정 배너';
				adcClass = "banner-later";
			}else if(time > eTime || status=="0"){
				adcMsg = '종료된 배너';
				adcClass = "banner-finish";
			}
			
			$target.attr("data-append","true").after('<div class="ad-finished"><span class="'+adcClass+'"><i class="fa fa-clock-o"></i>&nbsp;'+adcMsg+' "'+title+'"</span>'+explain+'</div>');	// 종료 메시지 띄우고 종료
			bannerTitle="";//초기화
			
			return false;
		}
		
		$target.attr("data-append","true").after(content);	// 추가 되었으면 data-append 태그 나김
	}

	/****** 팝업 띄우기 
	var ___popup = [{},...];
	
	* json 내용 *
		idxno - 팝업 idxno 고유번호 
		title - 팝업의 제목 
		start - 팝업 시작일시
		end - 팝업 종료일시 
		status - 진행상태 (1=진행, 0=종료)
		popup_type - 팝업형태 (layer=레이어, window=윈도우)
		popup_size - auto (사용안함)
		popup_width - 팝업창크기(가로)
		popup_height - 팝업창크기(세로)
		position - auto (사용안함)
		x_position - 창의 x 위치 
		y_position - 창의 y 위치 
		apply_page - 적용페이지 (main, section, list, view 값이 입력 되어있음 , php에서 페이지 구분해서 json으로 만들어 줍니다.) 
		bottom_close - 하단표시 창닫기 출력여부 (Y=출력, N=출력안함)
		bottom_close_expire_ck - **동안 열지않기 (none=사용안함, day=하루동안 열지않기, days=몇일동안 열지않기)
		bottom_close_expire - 몇일인지
		layer_border - 레이어 팝업인 경우 외곽선 (Y=사용함, N=사용안함)
		layer_move - 레이어 팝업인 경우 드래그 가능 (Y=사용함, N=사용안함)
		layer_scroll - 레이어 팝업인 경우 스크롤 따라다니기 (Y=사용함, N=사용안함)
		layer_close - 레이어 팝업인 경우 닫기 아이콘 (Y=사용함, N=사용안함)
		layer_close_icon - 레이어 팝업인 경우 닫기 아이콘 유형 
		layer_close_position - 레이어 팝업인 경우 닫기 아이콘 출력 위치 (TL-상/좌, TR-상/우, BL-하/좌, BR-하/우)
		window_scroll - 윈도우 팝업인 경우 스크롤 활성화 (Y=사용함, N=사용안함)
		content - 출력 HTML 내용
	*****/
	,float:function(j)
	{
		// json 값
		var current = ___currentTime
			,start = Number(j.start)||0
			,end = Number(j.end)||(new Date().getTime()+100)	// 종료일이 기입되지 않았다면, 현재보다 100씩더해서 계속 늘림 
			,status = j.status||"0";
	
		if(this.vars.popup.view!="manager" && (status=="0" || current < start || (current > end && end!==0))) return false;												// 종료 or 기간이 아니라면 통과
			
		var	parents = this
			,idxno = j.idxno||"0"
			,oriTitle = j.title||""
			,title = decodeURIComponent(j.title)||""
			,popupType = j.popup_type||"window"
			,popupSize = j.popup_size||"auto"
			,popupWidth = Number(j.popup_width)||0
			,popupHeight = (Number(j.popup_height)||0) + 32
			,position = j.position||"auto"
			,xPosition = Number(j.x_position)||0
			,yPosition = Number(j.y_position)||0
			,applyPage = j.apply_page||"main"
			,bottomClose = j.bottom_close||"N"
			,bottomCloseExpireCk = j.bottom_close_expire_ck||"none"
			,bottomCloseExpire	= j.bottom_close_expire||1
			,layerBorder = j.layer_border||"N"
			,layerMove = j.layer_move||"N"
			,layerScroll = j.layer_scroll||"N"
			,layerClose = j.layer_close||"N"
			,layerCloseIcon = j.layer_close_icon||""
			,layerClosePosition = j.layer_close_position||"BR"
			,windowScroll = j.window_scroll||"Y"
			,content = decodeURIComponent(j.content)||""
			,popupUrl = j.popup_url||""// + (parents.vars.popup.view=="manager"?"?edit_mode=preview":"")||""
			,top = 0
			,left = 0
			,popname = parents.vars.popup.popname+idxno
			,_type = popupType; 								// default: 각자띄움 - 팝업과 레이어가 위치값을 공유하여 차례로 띄울려면 "window" or 공유하지 않고 각자 띄울려면 popupType;

		var type = {		
			calcPosition:function(){
				// x,y 가 0일때는 auto로 간주
				if((xPosition===0 && yPosition===0)/* || position=="auto"*/){
					var maxHeight = parents.arrayMaxMin(parents.vars.popup.height[_type],"max")
						,maxTop = parents.arrayMaxMin(parents.vars.popup.top[_type],"max")
						,initLeft = popupType=="window"?0:parents.vars.popup.bodyLeft
						,prevWidth = parents.vars.popup.width[_type][parents.vars.popup.width[_type].length-1]||0
						,prevLeft = parents.vars.popup.left[_type][parents.vars.popup.left[_type].length-1]||initLeft;			// 바로 이전 팝업 넓이를 left값으로 정함-window:0, layer:content의 left
		
		//console.log(popupWidth);
					left = prevLeft+prevWidth;
					
					// 페이지 넓이보다 자리잡은 left값이 크다면 화면상 한단계 내림
					if(left>parents.vars.popup[popupType=="window"?"screenWidth":"bodyWidth"]){
						top += maxHeight;						
						left = initLeft;
						
						// 다음 단계이니까 초기화 함
						parents.vars.popup.width[_type] = [];
						parents.vars.popup.height[_type] = [];
						parents.vars.popup.top[_type] = [];
						parents.vars.popup.left[_type] = [];
					}else{
						top = (maxTop||0);
					}
					
					// 변화된값 배열에 넣기 위해 조작
					xPosition = left;
					yPosition = top;
					
					// 변수에 담음
					parents.vars.popup.width[_type].push(popupWidth||0);
					parents.vars.popup.height[_type].push(popupHeight||0);
					parents.vars.popup.top[_type].push(yPosition||0);
					parents.vars.popup.left[_type].push(xPosition||0);
										
				}else{
					top = yPosition;
					left = xPosition;
				}
			}
		
			// 관리자 미리보기시 중앙에
			,setPositionCenter:function(){
				var _width = (document.body.clientWidth/2)-(popupWidth/2)
					,_scrollTop = document.body.scrollTop;
				
				top = _scrollTop + 50;
				left = _width;
			}
			
			// 띄울 페이지 applyPage
			,isApplyPage:function()
			{
				// 관리자 통과
				if(parents.vars.popup.view=="manager") return true;
				/*
				var params = bannerpop.linkToJson(location.search.replace("?",""))
					,mod = params.mod||""
					,act = params.act||""
					,section = params.section||"";
				
				// 메인
				if(((mod=="main" && act=="index" && !section) || (!mod && !act && !section)) && applyPage.indexOf("main")>=0) return true;
				// 섹션
				else if(mod=="main" && act=="index" && section && applyPage.indexOf("section")>=0) return true;
				// 기사 리스트
				else if(mod=="news" && act=="articleList" && applyPage.indexOf("list")>=0) return true;
				// 기사뷰
				else if(mod=="news" && act=="articleView" && applyPage.indexOf("view")>=0) return true;
				*/
			}
		
			,window:function(){
				//if(this.isApplyPage()!==true) return false;
				
				this.calcPosition(); // 위치 계산
				var winpopupUrl = '/bannerpop/popup.html?win_popup_idxno=' + idxno;
				window.open(winpopupUrl, popname, "width="+popupWidth+",height="+popupHeight+",scrollbars="+(windowScroll=="Y"?"yes":"no")+",resizable=yes,top="+top+",left="+left);
			}
		
			,layer:function(){
				//if(this.isApplyPage()!==true) return false;
				
				this.calcPosition(); // 위치 계산
			
				var $content = $(content);

				$content.attr({"id":popname})
				.css({"top":top+"px","left":left+"px","max-width":popupWidth+"px","min-height":popupHeight+"px","z-index":"100" + parents.vars.popup.order}).addClass("layer_box"+(layerScroll=="Y"?" layer_box_fixed":"")+(layerBorder=="Y"?" layer_box_border":""))
				.find(".popup_close_box").addClass("layer_close_box");
				
				// 드래그 가능
				if(layerMove=="Y") $content.addClass("layer_box_cursor_move").draggable();				
				
				// 창닫기-icon 닫기 버튼은 별개다
				//if(bottomClose=="Y"){	
				var $btnClose = $content.find(".popup_close, .popup_close_map, .popup_icon_close");
				$btnClose.each(function(){
					var _$this = $(this);
					//if(_$this.is(".popup_close") && bottomClose=="Y") _$this.text('창닫기');

					if(_$this.is(".popup_icon_close")) {
						if(layerClosePosition == 'BL' || layerClosePosition == 'BR') {
							
							if($content.find(".popup_close, .popup_close_map").length>0) {
								_$this.css('top',Number(j.popup_height)-40+'px');	
							}
						}

						_$this.addClass("layer_position_"+layerClosePosition);
					}
				});
				
				$btnClose.click(function(){
					parents.evtClose(popupType, idxno);	
					return false;
				});
				//}

				// 이미지내 링크가 창닫기 라면
				//$content.find("a[href*='javascript:window.close()']").click(function(){
				$content.find("[href*='javascript:window.close()']").click(function(){
					parents.evtClose(popupType, idxno);	
					return false;
				});

				// 하루, 몇일동안 열지 않기
				parents.daysNotOpen(bottomCloseExpireCk, bottomCloseExpire, $content.find(".popup-days, .popup_day_close_map"), j);
				
				// 관리자 미리보기시 중앙에
				if(parents.vars.popup.view=="manager"){
					$content.appendTo(document.body);
					this.setPositionCenter();	
					$content.removeClass("layer_box_fixed").css({"top":top+"px", "left":left+"px"});
				}else{
					$content.appendTo($("#layer-popups"));
				}
			}				
		};
	
		type[popupType]();		
	}
	
	// 팝업띄우기
	,popup:function()
	{
		//try{
			var parents = this;
			$(window).on("load", function(){
				if(!window.___popup) return ;
				if($.isArray(___popup)===false && ___popup.length>0) return ;
				if(!window.___currentTime) ___currentTime = Math.floor(new Date().getTime()/1000);// 시간이 설정되지 않았다면 js 시간으로 설정함
								
				var $content = $("#layer-popups");
				
				if($content.length<=0) return false;
				parents.vars.popup.bodyWidth = $content.innerWidth();			
				parents.vars.popup.bodyLeft = $content.position().left;
				parents.vars.popup.screenWidth = window.screen.width;
				for(var i=0,cnt=___popup.length; i<cnt; i++){
					// 쿠키인지 판단후 열기
					var coo = "";
					coo = bannerpop.getCookie(parents.vars.popup.popname+___popup[i].idxno)

					if(!coo){
						parents.vars.popup.order++;
						parents.float(___popup[i]);
					}
				}
			});
		//}catch(e){}		
	}
	
	
	// 창닫기
	,evtClose:function(mode, idxno)
	{
		if(mode=="layer"){
			var layerId = bannerpop.vars.popup.popname+idxno;
			
			$("#"+layerId).fadeOut("fast", function(){
				$(this).remove();
			});
		}else window.close();
	}
	
	// cookie
	,evtCookieClose:function(name, days)
	{
		bannerpop.setCookie(name, "popup", days);
	}
	
	// 하루,몇일동안 열지 않기
	,daysNotOpen:function(expire, period, $btn, p)
	{
		var parents = this
			,idxno = p.idxno
			,isClickedMap = false;
		
		if(expire!="none"){
			$btn.each(function(i,v) {
				var $thisBtn = $(this);
				if($thisBtn.is(".popup-days")){
					// 하루동안
					if(expire=="day"){
						$thisBtn.click(function(){
							parents.evtCookieClose(parents.vars.popup.popname+idxno, "1");
							parents.evtClose(p.popup_type, p.idxno);
							return false;
						})
						// 닫기 태그 안에 암것두 없는 거 찾아 닫기 텍스트 넣어주기
						.not(":has(*)").html('<a href="#close-to-layer">하루동안 보지 않기</a>');
					}
					// 몇일동안 daySubfix
					else if(expire=="days"){
						var select = '<a href="#link">'
									+'<label class="sr-only" for="popDays"></label>'
									+'<select name="popDays" id="popDays" class="tiny" title="기간">'
									+'	<option value="1">하루</option>'
									+'	<option value="2">2일</option>'
									+'	<option value="3">3일</option>'
									+'	<option value="4">4일</option>'
									+'	<option value="5">5일</option>'
									+'	<option value="6">6일</option>'
									+'	<option value="7">7일</option>'
									+'</select> 동안 열지않기'
									+'</a>';
						var html = '<a href="#link">'
									+ (period>1 ? '몇일동안 보지 않기' : '하루동안 보지 않기')
									+'</a>';
						//$btn.not(":has(*)").append(select).click(function(){
						$thisBtn.append(html).click(function(){
							var $this = $(this)
								//,days = $this.prev("select").val();
								,days = period;
							
							parents.evtCookieClose(parents.vars.popup.popname+idxno, days);
							parents.evtClose(p.popup_type, p.idxno);
							return false;
						});					
					}
				}else{
					// 이미지맵일때, 하루동안 열지않기
					$thisBtn.click(function(){
						parents.evtCookieClose(parents.vars.popup.popname+idxno, "1");
						parents.evtClose(p.popup_type, p.idxno);	
						return false;
					});	
					
					isClickedMap = true;
				}
			});
		}
		
		// expire 값이랑 관계없이 이미지맵을 찾아 처리
		if(isClickedMap===false && $btn.is(".popup_day_close_map")){
			// 이미지맵일때, 하루동안 열지않기
			$btn.click(function(){
				parents.evtCookieClose(parents.vars.popup.popname+idxno, "1");
				parents.evtClose(p.popup_type, p.idxno);	
				return false;
			});	
		}
	}
	
	// window popup control
	,popupControl:function()
	{
		if(!___popup) return ;
		if((typeof ___popup)!=="object") return ;
		
		var parents = this
			,p = ___popup		
			,title = decodeURIComponent(p.title)||"" 
			,popupType = p.popup_type||"window"
			,bottomClose = p.bottom_close||"Y"
			,bottomCloseExpireCk = p.bottom_close_expire_ck||"day"	// : day,days,none
			,bottomCloseExpire = p.bottom_close_expire||1	// : 몇일
			,$btnClose = $(".popup_close, .popup_close_map, .popup_icon_close")
			,$btnDayClose = $(".popup-days, .popup_day_close_map");
		
		if(popupType!="window") return ;
		
		// 윈도우 바 타이틀 교체
		document.title = title;
	
		// 창닫기
		if(bottomClose=="Y"){
			$btnClose.each(function(){
				var _$this = $(this);
				//if(_$this.is(".popup_close")) _$this.text('창닫기');
			});
			
			$btnClose.click(function(){
				parents.evtClose(p.popup_type, p.idxno);	
				return false;
			});
		}
		
		// 하루, 몇일동안 열지 않기
		this.daysNotOpen(bottomCloseExpireCk, bottomCloseExpire, $btnDayClose, p);
		
	}

	// array 최고값
	,arrayMaxMin:function(arr, mode)
	{
		if($.isArray(arr)===false) return false;
	
		if(!mode) mode = "max";
		arr.sort(function(a, b){
			return b-a;
		});
		return (mode=="max"?arr[0]:arr[arr.length-1])||0;
	}
};