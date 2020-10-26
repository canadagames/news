function trim(str)
{
	str += '';
	
	var pattern = /(^\s*)|(\s*$)/g;
    str = str.replace(pattern, "");

	return str;
}

function replaceAll(str1, str2, str3)
{
	while ( str1.indexOf(str2) > -1 )
	{
		str1 = str1.replace(str2, str3);
	}

	return str1;
}

var isTestMode = false;

if ( location.href.indexOf('testMode=Y') != -1 )
{
	isTestMode = true;
}

function getArticleBodySelectJQueryStr() {
	var str = '#articleBody';

	if ( helper__isMobile() )
	{
		str += ' > div.body';
	}

	return str;
}

function helper__getDocBodyItemTypeCode($item) {
	if ( $item.length == 0 )
	{
		return 'nil';
	}

	var bodyItemType = 'table';

	bodyItemType = $item.attr('data-bodyItemType');

	if ( typeof bodyItemType == 'undefined' || bodyItemType == null )
	{
		if ( $item.is('table') )
		{
			bodyItemType = 'table';

			if ( $item.attr('align').toLowerCase() == 'left' )
			{
				bodyItemType = 'leftTable';
			}
			else if ( $item.attr('align').toLowerCase() == 'right' )
			{
				bodyItemType = 'rightTable';
			}
		}
		else
		{
			if ( $item.find('iframe').length || $item.find('object').length )
			{
				bodyItemType = 'movie';
			}
			else
			{
				bodyItemType = 'plain';
			}
		}
	}

	return bodyItemType;
}

function helper__chagneDocBody() {
	jQuery(getArticleBodySelectJQueryStr() + ' object').each(function(index, node) {
		var src = jQuery(node).find('embed').attr('src');
		var indexOfQMark = src.indexOf('?');

		if ( indexOfQMark != -1 )
		{
			src = src.substr(0, indexOfQMark);
			
			var removeWord = '//www.youtube.com/v/';

			src = replaceAll(src, 'http:' + removeWord, '');
			src = replaceAll(src, 'https:' + removeWord, '');
			src = replaceAll(src, removeWord, '');

			src = '//www.youtube.com/embed/' + src + '?feature=player_detailpage';
		}

		var newHtml = '<iframe width="640" height="360" src="' + src + '" frameborder="0" allowfullscreen></iframe>';
		jQuery(node).after(newHtml);
		jQuery(node).remove();
	});

	jQuery(getArticleBodySelectJQueryStr() + ' > p').each(function(index, node) {
		var text = jQuery(node).text();
		text = trim(text);

		var html = jQuery(node).html();
		html = trim(html);

		if ( text.substr(0, '##'.length) == '##' )
		{
			var txt = trim(text.substr(1));
			txt = txt.replace(/◆/gi, '');
			txt = replaceAll(txt, '*', '');
			txt = replaceAll(txt, '#', '');
			txt = replaceAll(txt, '◆', '');
			txt = helper__trim(txt);
			$target = jQuery(node);
			
			if ( helper__isMobile() )
			{
				$target.after('<div class="tltBox2Wrap" data-bodyItemType="smallTitle"><div class="tltBox2">' + txt + '</div></div>');
			}
			else
			{
				$target.after('<div class="tltBox2Wrap" data-bodyItemType="smallTitle"><div class="tltBox2">' + txt + '</div><div class="tltBoxFoot"></div></div>');
			}

			$target.remove();
		}

		html = replaceAll(html, '&nbsp;', '');
		html = replaceAll(html, '&nbsp', '');

		// 만약에 비어있는 거라면 지운다.
		if ( html == '' )
		{
			jQuery(node).remove();
		}
	});

	jQuery(getArticleBodySelectJQueryStr() + ' > p').each(function(index, node) {
		var text = jQuery(node).text();
		text = trim(text);

		if ( text.substr(0, '#'.length) == '#' )
		{
			var txt = trim(text.substr(1));
			txt = txt.replace(/◆/gi, '');
			txt = replaceAll(txt, '*', '');
			txt = replaceAll(txt, '#', '');
			txt = replaceAll(txt, '◆', '');
			txt = helper__trim(txt);
			$target = jQuery(node);
			
			if ( helper__isMobile() )
			{
				$target.after('<div class="tltBoxWrap" data-bodyItemType="middleTitle"><div class="tltBox">' + txt + '</div></div>');
			}
			else
			{
				$target.after('<div class="tltBoxWrap" data-bodyItemType="middleTitle"><div class="tltBox">' + txt + '</div><div class="tltBoxFoot"></div></div>');
			}

			$target.remove();
		}
	});

	jQuery(getArticleBodySelectJQueryStr() + ' > p > strong').each(function(index, node) {
		if ( jQuery(node).text().indexOf('◆') != -1 || jQuery(node).text().indexOf('*') != -1 )
		{
			var txt = jQuery(node).parent().text();
			txt = txt.replace(/◆/gi, '');
			txt = replaceAll(txt, '*', '');
			txt = helper__trim(txt);
			$target = jQuery(node).parent();
			
			if ( helper__isMobile() )
			{
				$target.after('<div class="tltBoxWrap" data-bodyItemType="middleTitle"><div class="tltBox">' + txt + '</div></div>');
			}
			else
			{
				$target.after('<div class="tltBoxWrap" data-bodyItemType="middleTitle"><div class="tltBox">' + txt + '</div><div class="tltBoxFoot"></div></div>');
			}

			$target.remove();
		}
	});

	if ( helper__isMobile() == false ) {
		$currentPos = jQuery(getArticleBodySelectJQueryStr() + '').children().first();

		for ( var i = 0; true; i++ )
		{
			if ( $currentPos.length == 0 )
			{
				break;
			}

			$oldPos = $currentPos;
			$currentPos = $currentPos.next();

			if ( $oldPos.is('iframe') )
			{
				$oldPos.wrap( "<p></p>" );
			}
		}

		$currentPos = jQuery(getArticleBodySelectJQueryStr() + '').children().first();

		for ( var i = 0; true; i++ )
		{
			if ( $currentPos.length == 0 )
			{
				break;
			}

			var $prevPos = $currentPos.prev();

			var html = $currentPos.html();

			html = replaceAll(html, '&nbsp;', '');
			html = replaceAll(html, '&nbsp', '');
			html = replaceAll(html, "\t", '');
			html = replaceAll(html, "\n", '');
			html = replaceAll(html, "\r", '');
			html = replaceAll(html, " ", '');

			if ( html == '' )
			{
				/*
				var $pos2 = $currentPos;
				$currentPos = $currentPos.next();
				$pos2.remove();
				continue;
				*/
			}

			if ( $currentPos.hasClass('copy') )
			{
				break;
			}

			var typeCode = helper__getDocBodyItemTypeCode($currentPos);

			if ( $prevPos.length )
			{
				$prevPos.attr('data-nextBodyItemType', typeCode);
			}

			$currentPos.addClass('bodyItemType__' + typeCode);
			$currentPos.attr('data-bodyItemType', typeCode);

			if ( i == 0 )
			{
				$currentPos.attr('data-prevBodyItemType', 'none');
				$currentPos.attr('data-prevBodyItemType2', 'none');
				$currentPos.addClass('firstBodyItem');
			}

			var typeCode2Pre = $currentPos.attr('data-prevBodyItemType2');

			var $originPos = $currentPos;

			$currentPos = $currentPos.next();

			var typeCode2 = typeCode;

			if ( $currentPos.length )
			{
				if ( typeCode2 == 'plain' )
				{
					typeCode2 = typeCode2Pre;
				}

				$currentPos.attr('data-prevBodyItemType2', typeCode2);
				$currentPos.attr('data-prevBodyItemType', typeCode);

				if ( typeCode == 'middleTitle' || typeCode == 'smallTitle' )
				{
					if ( $currentPos.is('table') )
					{
						$currentPos.css('margin-top', '25px');
					}
				}
			}
		}

		jQuery(getArticleBodySelectJQueryStr() + '').children().last().attr('data-nextBodyItemType', 'none');

		$adPos = null;

		jQuery(getArticleBodySelectJQueryStr() + ' > p.bodyItemType__plain').each(function(index, node) {
			var top = jQuery(node).offset().top;

			if ( top >= 900 && $adPos == null )
			{
				$adPos = jQuery(node);
			}
		});

		if ( $adPos == null )
		{
			$adPos = jQuery(getArticleBodySelectJQueryStr() + ' > p.bodyItemType__plain').last();
		}

		if ( $adPos.length && $adPos.attr('data-nextBodyItemType') != 'plain' )
		{
			if ( $adPos.attr('data-prevBodyItemType') == 'plain'  )
			{
				$adPos = $adPos.prev();
			}

			if ( $adPos.attr('data-prevBodyItemType') == 'plain' )
			{
				$adPos = $adPos.prev();
			}
		}

		if ( $adPos.length )
		{
			var marginTop = 16;

			var prevBodyItemType2 = $adPos.attr('data-prevBodyItemType2');
			var prevBodyItemType = $adPos.attr('data-prevBodyItemType');
			var bodyItemType = $adPos.attr('data-bodyItemType');

			if ( prevBodyItemType == 'table' )
			{
				marginTop = 10;
			}
			else if ( prevBodyItemType == 'rightTable' )
			{
				marginTop = 10;
			}
			else if ( prevBodyItemType == 'leftTable' )
			{
				marginTop = 10;
			}
			else if ( prevBodyItemType == 'plain' )
			{
				marginTop = 4;
			}
			else if ( prevBodyItemType == 'middleTitle' )
			{
				marginTop = 10;
			}
			else if ( prevBodyItemType == 'smallTitle' )
			{
				marginTop = 10;
			}
			else if ( prevBodyItemType == 'none' )
			{
				marginTop = 5;
			}

			if ( prevBodyItemType2 == 'leftTable' || prevBodyItemType2 == 'rightTable' )
			{
				//$adPos.before('<div style="clear:both;"></div>');
			}
			
			// 아이프레임 광고로딩방식
			if ( true )
			{
				// 광고를 멈춘다.
				//$adPos.before('<table align="right" style="margin-top:' + marginTop + 'px; margin-left:10px; margin-bottom:16px;"><tr><td>' + getMotorgraphAdManagerServerAdIframe_(19) + '</td></tr></table>');
			}
			// 자바스크립트 광고로딩방식
			// 느려서 사용하지 않는다.
			else
			{
				$adPos.before('<table align="right" style="margin-top:' + marginTop + 'px; margin-left:10px; margin-bottom:16px;"><tr><td id="ad250True"></td></tr></table>');

				if ( isTestMode )
				{
					jQuery('#ad250').find('div').eq(0).find('script').remove();
					jQuery('#ad250True').empty().append(jQuery('#ad250').find('div').eq(0));
				}
				else if ( jQuery('#Admin_Top').length )
				{
					jQuery('#ad250').find('div').eq(0).find('script').remove();
					jQuery('#ad250True').empty().append(jQuery('#ad250').find('div').eq(0));
				}
				else
				{
					jQuery('#ad250').find('div').eq(0).find('script').remove();
					jQuery('#ad250True').empty().append(jQuery('#ad250').find('div').eq(0));
				}
			}
		}
	}
}

function helper__isMobile() {
	var curUrl = window.location.href;

	var isMobile = false;

	if ( curUrl.indexOf('m.motorgraph.com') != -1 )
	{
		isMobile = true;
	}

	return isMobile;
}

function helper__trim(str)
{
	str += '';
	
	var pattern = /(^\s*)|(\s*$)/g;
    str = str.replace(pattern, "");

	return str;
}

function helper__callAddCss()
{
	if ( typeof jQuery != 'undefined' )
	{
		jQuery(function() {
			helper__addCss();
		});
	}
	else
	{
		setTimeout(function() {
			helper__callAddCss();
		}, 100);
	}
}

function helper__addCss() {
	if ( helper__isMobile() )
	{
		jQuery(function() {
			var url = '//api.motorgraph.com/static/forExtern/ndsoft__motorgraph/articleDetail__mb.css';

			if ( document.createStyleSheet )
			{
				document.createStyleSheet(url);
			}
			else
			{
				jQuery('head').append("<link rel=\"stylesheet\" href=\"" + url + "\" title=\"Motorgraph Aricle Detail Stylesheet\" type=\"text/css\" media=\"all\" />");
			}
		});
	}
	else
	{
		jQuery(function() {
			var url = '//api.motorgraph.com/static/forExtern/ndsoft__motorgraph/articleDetail.css';

			if ( document.createStyleSheet )
			{
				document.createStyleSheet(url);
			}
			else
			{
				jQuery('head').append("<link rel=\"stylesheet\" href=\"" + url + "\" title=\"Motorgraph Aricle Detail Stylesheet\" type=\"text/css\" media=\"all\" />");
			}
		});
	}
}

function helper__callChagneDocBody()
{
	if ( typeof jQuery != 'undefined' )
	{
		jQuery(function() {
			helper__chagneDocBody();
		});
	}
	else
	{
		setTimeout(function() {
			helper__callChagneDocBody();
		}, 100);
	}
}

function helper__applyDeco() {
	if ( jQuery(getArticleBodySelectJQueryStr() + '').length == 0 )
	{
		return false;
	}

	var articleBodyHtml = jQuery(getArticleBodySelectJQueryStr() + '').html();
	var startWord = '<!-- START ARTICLE PART 1 -->';
	var endWord = '<!-- END ARTICLE PART 1 -->';

	var cutStartPos = articleBodyHtml.indexOf(startWord) + startWord.length;
	var cutEndPos = articleBodyHtml.indexOf(endWord);

	if ( cutStartPos == -1 )
	{
		return false;
	}

	if ( cutEndPos == -1 )
	{
		return false;
	}

	var newHtml1 = articleBodyHtml.substr(cutStartPos, cutEndPos - cutStartPos);
	var newHtml2 = articleBodyHtml.substr(cutEndPos + endWord.length);

	jQuery(getArticleBodySelectJQueryStr() + '').html(newHtml2);

	var newHtml3 = '';

	var curTableCnt = 0;

	var bodyBits = {};

	jQuery('<div>' + newHtml1 + '</div>').children().each(function(index, node) {
		if ( jQuery(node).get(0).tagName == 'TABLE' )
		{
			curTableCnt++;
			var src = jQuery(node).find('img').attr('src');

			if ( curTableCnt > 1 )
			{
				newHtml3 += '<div style="float:left; margin-top:50px;"><img src="' + src + '"></div>';
			}
			else
			{
				newHtml3 += '<div style="float:left;"><img src="' + src + '"></div>';
			}

			var afterHtml = '';

			if ( curTableCnt != 2 && curTableCnt != 3 )
			{
				var afterHtmlImgUrl = 'http://cms.motorgraph.com/static/forExtern/ndsoft__motorgraph/articleImg/2428/body_addi_1.jpg';

				afterHtml = '<img style="margin-top:24px;" src="' + afterHtmlImgUrl + '">';
			}
			else
			{
				var afterHtmlImgUrl = 'http://cms.motorgraph.com/static/forExtern/ndsoft__motorgraph/articleImg/2428/body_addi_' + curTableCnt + '.jpg';

				afterHtml = '<img src="' + afterHtmlImgUrl + '">';
			}

			afterHtml = '<div style="float:left;">' + afterHtml + '</div>';

			if ( afterHtml )
			{
				afterHtml += '<div style="float:left; text-align:left; width:440px; padding-left:15px;" id="bodyDsp__' + curTableCnt + '"></div>';
			}
			else
			{
				afterHtml += '<div style="float:left; text-align:left;" id="bodyDsp__' + curTableCnt + '"></div>';
			}

			newHtml3 += afterHtml;
		}
		else if ( jQuery(node).get(0).tagName == 'P' )
		{
			if ( !bodyBits[curTableCnt] )
			{
				bodyBits[curTableCnt] = '';
			}

			bodyBits[curTableCnt] += '<p style="margin-top:16px; margin-bottom:16px;">' + jQuery(node).html() + '</p>';
		}
	});

	jQuery(getArticleBodySelectJQueryStr() + ' *:first-child').css('clear', 'both');

	jQuery(getArticleBodySelectJQueryStr() + '').prepend('<div style="text-align:center; margin:0 auto; width:645px;">' + newHtml3 + '</div>');

	jQuery(getArticleBodySelectJQueryStr() + '').find('img').css('border', '0px');

	for ( key in bodyBits )
	{
		jQuery('#bodyDsp__' + key).append(bodyBits[key]);
	}

	for ( var i = 1; true; i++ )
	{
		if ( jQuery('#bodyDsp__' + i).length == 0 )
		{
			break;
		}

		if ( jQuery('#bodyDsp__' + i).html() == '' )
		{
			jQuery('#bodyDsp__' + i).prev().remove();
			jQuery('#bodyDsp__' + i).remove();
		}
	}
}

function helper__isBoxNode(node) {
	var styleAttr = jQuery(node).attr('style');
	styleAttr = trim(styleAttr);
	var hasClassNoNeedBorder = jQuery(node).hasClass('noNeedBorder');

	var tureOrFalse = false;

	if ( typeof styleAttr == 'undefined' )
	{
		styleAttr = '';
	}

	if ( styleAttr.indexOf('background:#eee;border:1px') == 0 )
	{
		tureOrFalse = true;
	}
	else if ( styleAttr.indexOf('background: rgb(') == 0 )
	{
		tureOrFalse = true;
	}
	else if ( styleAttr.indexOf('background-color:') == 0 )
	{
		tureOrFalse = true;
	}
	else if ( hasClassNoNeedBorder )
	{
		tureOrFalse = true;
	}
	else if ( styleAttr.indexOf('BORDER-TOP:') != -1 && styleAttr.indexOf('PADDING-BOTTOM:') != -1 && styleAttr.indexOf('BACKGROUND:') != -1 )
	{
		tureOrFalse = true;
	}

	return tureOrFalse;
}

function helper__getBoxNodes()
{
	var nodes = {};
	var key = -1;

	jQuery(getArticleBodySelectJQueryStr() + ' div').each(function(index, node) {
		if ( helper__isBoxNode(node) )
		{
			key++;
			nodes[key] = node;
		}
	});

	return nodes;
}

function helper__decoBoxNodes() {
	var nodes = helper__getBoxNodes();

	var dvWord = '[[DV]]';

	for ( key in nodes )
	{
		var $node = jQuery(nodes[key]);
		var html = $node.html();

		var tags = ['br/', '/p', '/div'];

		for ( var i = 0; i < tags.length; i++ )
		{
			var tag = tags[i];
			var tags2 = [];

			if ( tag.substr(0, 1) == '/' )
			{
				tags2.push('<' + tag + '>');
			}
			else if ( tag.substr(tag.length - 1, 1) == '/' )
			{
				tag = tag.substr(0, tag.length - 1);

				tags2.push('<' + tag + '>');
				tags2.push('<' + tag + ' >');
				tags2.push('<' + tag + '/>');
				tags2.push('<' + tag + ' />');
			}

			for ( var j = 0; j < tags2.length; j++ )
			{
				html = replaceAll(html, tags2[j].toLowerCase(), dvWord + tags2[j]);
				html = replaceAll(html, tags2[j].toUpperCase(), dvWord + tags2[j]);
			}
		}

		var text = $node.html(html).text();

		var textBits = text.split(dvWord);

		var newHtml = '';

		var curSubTitleInBoxCnt = 0;

		for ( var key2 = 0; key2 < textBits.length; key2++ )
		{
			var textBit = textBits[key2];

			textBit = trim(textBit);

			if ( textBit )
			{
				if ( textBit.substr(0, 1) == '◆' || textBit.substr(0, 1) == '*' || textBit.substr(0, 1) == '＊' )
				{
					curSubTitleInBoxCnt++;

					if ( curSubTitleInBoxCnt > 1 )
					{
						newHtml += '<div style="padding-top:16px;"></div>';
					}

					textBit = textBit.substr(1);
					textBit = trim(textBit);

					newHtml += '<div style="font-weight:bold; font-size:20px; margin:0px; padding:0px;">' + textBit + '</div>';
					newHtml += '<div style="background-color:#bbbbbb; padding-top:1px; margin-top:3px; margin-bottom:10px;"></div>';
				}
				else
				{
					newHtml += '<div>' + textBit + '</div>';
				}
			}
			else
			{
				if ( key2 + 1 < textBits.length )
				{
					newHtml += '<div>&nbsp;</div>';
				}
			}
		}

		$node.css('padding', '15px 23px 18px 23px');

		$node.html(newHtml);
	}
}

function helper__hideEmptyCaptionSpace() {
	jQuery(getArticleBodySelectJQueryStr() + ' td.view_r_caption').each(function(index, node) {
		var $node = jQuery(node);
		var html = $node.html();
		html = trim(html);
		html = html.replace('&nbsp;', '');
		html = html.replace('&nbsp', '');
		html = trim(html);

		if ( html == '' )
		{
			$node.closest('tr').hide();
		}
		else
		{
			$node.css('padding-top', '3px');
			$node.css('padding-bottom', '0px');
		}

		$node.closest('table').css('margin-bottom', '10px');
	});
}

function helper__decoBoxNodes2() {
	var nodes = helper__getBoxNodes();

	for ( key in nodes )
	{
		var $node = jQuery(nodes[key]);

		$node.find('p').each(function(index, node) {
			var textBit = jQuery(node).text();
			textBit = trim(textBit);

			if ( textBit.substr(0, 1) == '◆' || textBit.substr(0, 1) == '*' || textBit.substr(0, 1) == '＊' )
			{
				var newHtml = '';

				newHtml += '<div style="font-weight:bold; font-size:20px; margin:0px; padding:0px;">' + textBit + '</div>';
				newHtml += '<div style="background-color:#bbbbbb; padding-top:1px; margin-top:3px; margin-bottom:10px;"></div>';

				jQuery(node).html(newHtml);
			}
		});
		
		$node.css('padding', '15px 23px 18px 23px');
		$node.css('margin-bottom', '20px');
	}
}

jQuery(function() {
	helper__applyDeco();
	//helper__decoBoxNodes();
	helper__decoBoxNodes2();
	helper__hideEmptyCaptionSpace();
});

helper__callChagneDocBody();
helper__callAddCss();

var articleDetailLoaded = true;


function getAlbumLinks() {
	var nodes = [];

	jQuery('a[data-bgSrc],a[data-src]').each(function(index, node) {
		var href = jQuery(node).attr('href');

		if ( href.indexOf('album.motorgraph') != -1 )
		{
			nodes.push(node);
		}
	});

	return nodes;
}

function decoAlbumnLinksStep1() {
	var nodes = getAlbumLinks();

	for ( var i = 0; i < nodes.length; i++ )
	{
		$node = jQuery(nodes[i]);

		$node.before('<p></p>');

		var text = $node.text();

		$node
		.css('color', '#E9A029')
		.css('font-weight', 'bold')
		.empty().append('[' + text + ']');

		var href = $node.attr('href');

		var src = 'http://api.motorgraph.com/static/forExtern/ndsoft__motorgraph/img/gallery/btn_1.jpg';

		if ( $node.attr('data-src') )
		{
			src = $node.attr('data-src');
		}

		$node.after('<div class="albumLinkDsp"><a href="' + href + '" target="_blank"><img style="max-width:645px" src="' + src + '"></a></div>');
		//$node.after('<div class="albumLinkDsp"><table class="albumLinkDspTb"><tr><td style="position:relative;"><img style="max-width:645px" src="' + $node.attr('data-bgSrc') + '"></td></tr></table></div>');
	}
}

function decoAlbumnLinksStep2() {
	var nodes = getAlbumLinks();

	for ( var i = 0; i < nodes.length; i++ )
	{
		$node = jQuery(nodes[i]);

		$node.attr('target', '_blank');
		var href = $node.attr('href');

		var imgWidth = $node.next().find('img').width();
		var imgHeight = $node.next().find('img').height();

		var maxWidth = 645;

		if ( imgWidth > maxWidth )
		{
			imgHeight = imgHeight * maxWidth / imgWidth;
			imgWidth = maxWidth;			
		}

		$node.next().find('img').remove();

		$node.next().find('table')
		.css('width', imgWidth + 'px')
		.css('height', imgHeight + 'px')
		.css('background-image', 'url(' + $node.attr('data-bgSrc') + ')')
		.attr('width', imgWidth)
		.attr('height', imgHeight);

		$node.next().find('td')
		.css('text-align', 'center')
		.css('vertical-align', 'middle')
		.append('<div style="position:absolute; left:0px top:0px; width:10px; height:10px;"></div><img class="btnImg" style="border:0px" border="0" src="http://hot.motorgraph.com/img/btn_1_out.png">')

		$node.next().find('table td div')
		.css('background-image', 'url(http://hot.motorgraph.com/img/bg_tran.png)')
		.css('top', '0px')
		.css('left', '0px')
		.css('cursor', 'pointer')
		.click(function() { window.open(href, '', ''); })
		.css('width', imgWidth + 'px')
		.css('height', imgHeight + 'px')
		.attr('width', imgWidth)
		.attr('height', imgHeight)
		.mouseover(function() {
			$node.next().find('.btnImg').attr('src', 'http://hot.motorgraph.com/img/btn_1_over.png');
		})
		.mouseout(function() {
			$node.next().find('.btnImg').attr('src', 'http://hot.motorgraph.com/img/btn_1_out.png');
		})
	}
}

function decoAlbumnLinks() {
	decoAlbumnLinksStep1();
	jQuery(window).load(function() {
		setTimeout(function() {
			//decoAlbumnLinksStep2();
		}, 10);
	});
}

jQuery(function() {
    // 모바일 에서만 실행
	if ( helper__isMobile() ) {
        // 기기의 방향 확인
        var orientation = "portrait";
        if(window.innerWidth > window.innerHeight) orientation = "landscape";

        // 기사 본문 모터그래프 배너 높이 조정
        var contentMaxWidth = jQuery('#articleBody').width();
        var contentWidth = jQuery(document).width() - 20; // 본문넓이 = 문서넓이 - 양측 총 마진 20픽셀
        if (orientation == "landscape" && contentWidth > contentMaxWidth) contentWidth = contentMaxWidth;
        var contentBannerHeight = parseInt(contentWidth * 120 / 640); // 사용중 배너 규격 640x160
        contentBannerHeight = 0;
        jQuery('#ae20d36a').height(contentBannerHeight);
        jQuery('#ae20d36a').css({"padding":"1rem 0 0.25rem 0", "border-bottom":"0px"});

        // 기사본문 하단에 배너 넣기
        jQuery(getArticleBodySelectJQueryStr() + '').append('<div style="text-align:center;display:none"><a href="http://hot.motorgraph.com" target="_blank"><img src="http://static.motorgraph.com/static/forExtern/ndsoft__motorgraph/201504/2/mr/bn_8.jpg" style="width:100%; max-width:500px;"></div>');

		jQuery('script').each(function(index, node) {
			var src = jQuery(node).attr('src');

			if ( src == '//static.motorgraph.com/static/forExtern/ndsoft__motorgraph/1/section__mobile__top_1.js' )
			{
				var $node = jQuery(node);

				$node.parent().closest('div').css('border', 0).prev().css('padding-top', '10px');
			}
		});
	}
	
	decoAlbumnLinks();
});
