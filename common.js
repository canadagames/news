/*---------------------------------------------------------------------------------------------
                                      JAVASCRIPT CODE
  ---------------------------------------------------------------------------------------------
	function name						| description				| use process
  ---------------------------------------------------------------------------------------------
	setCookie(쿠키명, 값, 유효기간(일))	| 							| 쿠키생성
	getCookie(쿠키명)					| 							| 쿠키가져오기
  ---------------------------------------------------------------------------------------------*/

// 쿠키 생성
function setCookie(cName, cValue, cDay, cDomain){
	var expire = new Date();
	expire.setDate(expire.getDate() + cDay);
	cookies = cName + '=' + escape(cValue) + '; path=/ '; // 한글 깨짐을 막기위해 escape(cValue)를 합니다.
	if(typeof cDay != 'undefined') cookies += ';expires=' + expire.toGMTString() + ';';
	document.cookie = cookies;
    if (cDomain) {
        document.cookie += "domain=" + cDomain + ";";
    }
}

// 쿠키 가져오기
function getCookie(cName) {
	cName = cName + '=';
	var cookieData = document.cookie;
	var start = cookieData.indexOf(cName);
	var cValue = '';
	if(start != -1){
		start += cName.length;
		var end = cookieData.indexOf(';', start);
		if(end == -1)end = cookieData.length;
		cValue = cookieData.substring(start, end);
	}
	return unescape(cValue);
}

// 쿠키 지움
function delCookie(cName) {
    var today = new Date();

    today.setTime(today.getTime() - 1);
    var value = getCookie(cName);
    if(value != "")
        document.cookie = cName + "=" + value + "; path=/; expires=" + today.toGMTString();
}


/*---------------------------------------------------------------------------------------------
                                      JAVASCRIPT CODE
  ---------------------------------------------------------------------------------------------
	function name						| description				| use process
  ---------------------------------------------------------------------------------------------
	checkMsgLength()					| 입력된 문자열 길이 검사			| 기사 댓글
	calculateMsgLength()				| 문자열 길이 반환				| 기사 댓글
	assertMsgLength()					| 문자열 길이만큼 잘라 변환		| 기사 댓글
  ---------------------------------------------------------------------------------------------*/

// 문자열길이 검사
function checkMsgLength(frm, id, lenStr) {
	var length = calculateMsgLength(document.getElementById(frm).value);
	document.getElementById(id).innerHTML = length;
	if (length > lenStr) {
		alert("최대 "+lenStr+" 바이트까지 남기실 수 있습니다.\r\n초과된 " + (length - lenStr) + "바이트는 자동으로 삭제됩니다.");
		document.getElementById(frm).value = assertMsgLength(document.getElementById(frm).value, lenStr, id);
	}
}

//문자열길이 반환
function calculateMsgLength(message) {
	var nbytes = 0;

	for (i=0; i<message.length; i++) {
		var ch = message.charAt(i);

		if (escape(ch).length > 4) {
			nbytes += 2;
		} else if (ch != "\r") {
			nbytes++;
		}
	}

	return nbytes;
}

//문자열 길이만큼 잘라 변환
function assertMsgLength(message, maximum, id) {
	var inc = 0;
	var nbytes = 0;
	var msg = "";
	var msglen = message.length;

	for (i=0; i<msglen; i++) {
		var ch = message.charAt(i);

		if (escape(ch).length > 4) {
			inc = 2;
		} else if (ch != "\r") {
			inc = 1;
		}

		if ((nbytes + inc) > maximum) {
			break;
		}

		nbytes += inc;
		msg += ch;
	}

	document.getElementById(id).innerHTML = nbytes;
	return msg;
}

/*---------------------------------------------------------------------------------------------
                                      JAVASCRIPT CODE
  ---------------------------------------------------------------------------------------------
	function name						| description				| use process
  ---------------------------------------------------------------------------------------------
	articleHeader()						| 기사뷰 헤더 네비			| 기사뷰 헤더 네비
  ---------------------------------------------------------------------------------------------*/

var articleHeader = {

	// 헤더 네비게이션 생성
	setScroll:function(){		
		jQuery(window).scroll(function() {
			if (jQuery(this).scrollTop() > 300) {
				jQuery('#article-header-title').slideDown(300);
			} else {
				jQuery('#article-header-title').slideUp(300);
			}
		});			
	},
	

	// 기사이동
	move:function(mod, order_type, order_value, section_code, sub_section_code, serial_code){
		jQuery.post( "ajaxGetForwardIdxno.php", { mod: mod, order_type:order_type, order_value: order_value, section_code: section_code, sub_section_code: sub_section_code, serial_code: serial_code }, function( f_idxno ) {
			
			if(f_idxno){
				location.href = '/news/articleView.html?idxno='+f_idxno				
			}else{
				alert('기사가 존재하지 않습니다');
			}
			
		});
	}
	
}


/*---------------------------------------------------------------------------------------------
                                      JAVASCRIPT CODE
  ---------------------------------------------------------------------------------------------
	function name						| description				| use process
  ---------------------------------------------------------------------------------------------
	articlePrint(idxno)					| 인쇄창 오픈				| 인쇄창 오픈
	articleMail(idxno)					| 메일보내기창 오픈			| 메일보내기창 오픈
	articleErr(idxno)					| 오류신고창 오픈				| 오류신고창 오픈
	articleSingo(idxno)					| 댓글신고창 오픈				| 댓글신고창 오픈
  ---------------------------------------------------------------------------------------------*/

// 인쇄창 오픈
function articlePrint( idxno ) {
	window.open('/news/articlePrint.html?idxno='+idxno, 'articlePrint', 'width=660,height=500,scrollbars=yes');
}

// 메일보내기창 오픈
function articleMail( idxno ) {
	window.open('/news/articleMail.html?idxno='+idxno, 'articleMail', 'width=660,height=500,scrollbars=yes');
}

// 오류신고창 오픈
function articleErr( idxno ) {
	window.open('/news/articleErr.html?idxno='+idxno, 'articleErr', 'width=660,height=500,scrollbars=yes');
}

// 댓글신고창 오픈
function articleSingo( idxno ) {
	window.open('/news/articleSingo.html?idxno='+idxno, 'articleSingo', 'width=660,height=500,scrollbars=yes');
}


// 세션갱신
var sReq;
function processAutoSessReload() 
{
	if (sReq.readyState == 4) {
		// only if "OK"
		if (sReq.status == 200) {
			// moveItem();
		} else {
  			alert("작업중 오류가 발생 했습니다.\n다시 시도해 주세요.");
			//alert("작업중 오류가 발생 했습니다.\n다시 시도해 주세요." + REQ.statusText);
		}
	}
}

function autoSessReload() 
{
	try {
		sReq = new XMLHttpRequest;
	} catch(e) {}

	if(!sReq) 
		try {
			sReq = new ActiveXObject("Msxml2.XMLHTTP");
		} catch(e) {}

	if(!sReq) 
       	try {
  			sReq = new ActiveXObject("Microsoft.XMLHTTP");
		} catch(e) {}

    if(!sReq) alert("호환되지 않는 브라우저 입니다.\n");

  	var handlerFunction = processAutoSessReload;
	sReq.onreadystatechange = handlerFunction;
		  		 
	sReq.open("POST", "/member/sessionReload.php", true);
  	sReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	sReq.send();	
}
