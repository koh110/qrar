var scaleMode = false;

var bookPoint;
$(function() {
  $('#scaleMode').on('click', function() {
    scaleMode = !scaleMode;
  });

  // 変数
  var video = document.getElementById("video");
  var canvas = document.getElementById('superimpose');
  var context = canvas.getContext('2d');

  // worker作成
  var worker = new Worker('js/worker.js');
  var isPosting = false;
  worker.onmessage = function(e){
      // HTMLを出力するための何らかの処理をここに記述
      // でもさいとからぱくってきた.でも出力してみると、カラッぽ
      var html = "",
          colorObj = e.data.ary,
          tmpNum = 0,
          tmpNum2 = 0,
          tmpNum3 = 0,
          colorNum = e.data.colorNum;


      for(var i=0,len=e.data.ary.length; i<len; i++){
          console.log("rgb(" + e.data.ary[i].name  + ")");
      }

      // 結果をhtmlに表示
      if(colorObj.base.length>0){
        var rgb = colorObj.base[0].name.split(',');
        if (!scaleMode) {
          var get_page = getPage(rgb[0], rgb[1], rgb[2]);
        }
        $('#color').html(colorObj.base[0].name);
      }else {
        $('#color').html('hoge');
      }

      isPosting = false;
  };

  // 映像読み込んで重ねる
  var capture = function () {
    var width = video.videoWidth ? video.videoWidth : 1;
    var height = video.videoHeight ? video.videoHeight : 1;
    var canvasConfirm = document.getElementById('confirmation');
    canvasConfirm.width = width;
    canvasConfirm.height = height;
    var confirm = canvasConfirm.getContext('2d');
    confirm.drawImage(video, 0, 0);

    if (scaleMode) {
    // 表示領域計算
    var pageInfo = crocroCanvas(confirm);
//console.log(pageInfo);
    if (pageInfo == 0){
        page = 0;
    } else {
        page = pageInfo.page;
	bookPoint = pageInfo.point;
    }
    }

    // workerに計算させる
    if (!isPosting) {
      var imageData = confirm.getImageData(viewRange.x, viewRange.y, viewRange.width, viewRange.height);
      var msgData = {
          width: width,
          height: width,
          pixdata:imageData
    };

      isPosting = true;
      worker.postMessage(msgData);
    }
  }

  // 定期的に取り込む
  // 最終的にはleap-motionのloopに入れていい
  function captureToCanvas() {
    capture();
    setTimeout(captureToCanvas, 200);
  }
  setTimeout(captureToCanvas, 200);

  // 表示領域測定用
  function crocroCanvas(confirm) {
	var width = video.videoWidth ? video.videoWidth : 1;
	var height = video.videoHeight ? video.videoHeight : 1;
	var inImg = confirm.getImageData(0,0,width,height);
	var canvasConfirm = document.getElementById('confirmation');
	canvasConfirm.width = width;
	canvasConfirm.height = height;
	var confirm = canvasConfirm.getContext('2d');
	// 追加編集：yuicnish
	// 抽出領域のRGBαパラム
	// とりあえず赤領域
	// 理想的な赤領域として(255,0,0)
//console.log(inImg.data.length);
	var idealR = {r:255, g:0, b:0}; 
	var idealG = {r:0, g:255, b:0}; 
	var idealB = {r:0, g:0, b:255}; 
	var idealY = {r:255, g:255, b:0};
	/*
	var bR = [];
	var bG = [];
	var bB = [];
	*/
	var bR = {"w":[], "h":[]};
	var bG = {"w":[], "h":[]};
	var bB = {"w":[], "h":[]};
	var bY = {"w":[], "h":[]};

	// 精度用パラム
	// 1:全件探索
	// n:n-1件飛ばしでの探索
	var numPrecise = 1;
	// 探索ロジック
	for (var h=30; h<height-30; h+=numPrecise){
		for (var w=30; w<2*width/3; w+=numPrecise){
			var i = 4 * (w + (width * h));
//console.log(i);
			var paramRR = idealR.r - inImg.data[i];
			var paramRG = idealR.g - inImg.data[i+1];
			var paramRB = idealR.b - inImg.data[i+2];
			var paramGR = idealG.r - inImg.data[i];
			var paramGG = idealG.g - inImg.data[i+1];
			var paramGB = idealG.b - inImg.data[i+2];
			var paramBR = idealB.r - inImg.data[i];
			var paramBG = idealB.g - inImg.data[i+1];
			var paramBB = idealB.b - inImg.data[i+2];
			var paramYR = idealY.r - inImg.data[i];
			var paramYG = idealY.g - inImg.data[i+1];
			var paramYB = idealY.b - inImg.data[i+2];
			// 理想的な領域から範囲60までのものをしきい値とする
			var red    = (paramRR * paramRR) + (paramRG * paramRG) + (paramRB * paramRB);
			var green  = (paramGR * paramGR) + (paramGG * paramGG) + (paramGB * paramGB);
			var blue   = (paramBR * paramBR) + (paramBG * paramBG) + (paramBB * paramBB);
			var yellow = (paramYR * paramYR) + (paramYG * paramYG) + (paramYB * paramYB);
//console.log("red="    + red);
//console.log("green="  + green);
//console.log("blue="   + blue);
//console.log("yellow=" + yellow);
	/**
	 * cellパターン（上下左右端探索には不向きのためコメントアウト）
			if (red   < 30000) { var cell = {"w":w, "h":h}; bR.push(cell); }
			if (green < 30000) { var cell = {"w":w, "h":h}; bG.push(cell); }
			if (blue  < 30000) { var cell = {"w":w, "h":h}; bB.push(cell); }
	*/
			if (red    < 20000) { bR.w.push(w); bR.h.push(h); }
			if (green  < 25000) { bG.w.push(w); bG.h.push(h); }
			if (blue   < 20000) { bB.w.push(w); bB.h.push(h); }
			if (yellow < 20000) { bY.w.push(w); bY.h.push(h); }
		}
	}
//console.log(bR);
	if (bR.w.length == 0){ bR.w.push(0); bR.h.push(0); }
	var pointR = {
	b:Math.max.apply(null,bR.h),
	t:Math.min.apply(null,bR.h),
	r:Math.max.apply(null,bR.w),
	l:Math.min.apply(null,bR.w)};
//console.log(pointR);

//console.log(bG);
	if (bG.w.length == 0){ bG.w.push(0); bG.h.push(0); }
	var pointG = {
	b:Math.max.apply(null,bG.h),
	t:Math.min.apply(null,bG.h),
	r:Math.max.apply(null,bG.w),
	l:Math.min.apply(null,bG.w)};
//console.log(pointG);

//console.log(bB);
	if (bB.w.length == 0){ bB.w.push(0); bB.h.push(0); }
	var pointB = {
	b:Math.max.apply(null,bB.h),
	t:Math.min.apply(null,bB.h),
	r:Math.max.apply(null,bB.w),
	l:Math.min.apply(null,bB.w)};
//console.log(pointB);

//console.log(bY);
	if (bY.w.length == 0){ bY.w.push(0); bY.h.push(0); }
	var pointY = {
	b:Math.max.apply(null,bY.h),
	t:Math.min.apply(null,bY.h),
	r:Math.max.apply(null,bY.w),
	l:Math.min.apply(null,bY.w)};
//console.log(pointY);

	// 領域が最大のパラメータをリターン
	var areaR = (pointR.b - pointR.t) * (pointR.r - pointR.l);
	var areaG = (pointG.b - pointG.t) * (pointG.r - pointG.l);
	var areaB = (pointB.b - pointB.t) * (pointB.r - pointB.l);
	var areaY = (pointY.b - pointY.t) * (pointY.r - pointY.l);
	if (areaR == 0 && areaG == 0 && areaB == 0 && areaY == 0){
		return 0;
	} else {
		var max = Math.max(areaR, areaG, areaB, areaY);
		switch (max){
			case areaR: return {page:1, point:pointR}; break;
			case areaG: return {page:2, point:pointG}; break;
			case areaB: return {page:3, point:pointB}; break;
			case areaY: return {page:4, point:pointY}; break;
			default:    return 0;
		}
	}
  }

});
