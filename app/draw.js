var viewRange = {
  x: 50,
  y: 170,
  width: 200,
  height: 200,
};

$(function() {
  var video = document.getElementById("video");
  var range = document.getElementById('range');
  var rcontext = range.getContext('2d');


  // 映像読み込んで重ねる
  var capture = function () {
    var width = video.videoWidth ? video.videoWidth : 1;
    var height = video.videoHeight ? video.videoHeight : 1;
    range.width = width;
    range.height = height;
    viewRange.width = width/2 - viewRange.x * 2;
    rcontext.strokeStyle = 'red';
    rcontext.rect(viewRange.x, viewRange.y, viewRange.width, viewRange.height);
    rcontext.stroke();
  }

  // 定期的に取り込む
  // 最終的にはleap-motionのloopに入れていい
  function captureToCanvas() {
    capture();
    setTimeout(captureToCanvas, 300);
  }
  setTimeout(captureToCanvas, 300);
});
