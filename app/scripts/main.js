$(function() {
  // カメラ取得
  var cameraData = [];
  var nowCameraIndex = 0;
  MediaStreamTrack.getSources(function(data){
       //カメラ情報を取得して、出力する
       var strCamera = "";
       var len = data.length;
       for( var i = 0 ; i < len ; i ++ ){
         strCamera += "<p>種類："+ data[i].kind+"<br/>ID："+ data[i].id+"</p>";
         if( data[i].kind == "video" ){
           cameraData.push(data[i]);
         }
       }
       setCamera(nowCameraIndex);
  });

  // 変数
  var video = document.getElementById("video");
  var canvas = document.getElementById('superimpose');
  var context = canvas.getContext('2d');
  var localMediaStream;
  // クリックイベント
  $('#stop').on('click', function() {
    localMediaStream.stop();
  });
  $('#changeCamera').on('click', function() {
    changeCamera();
  });

  function changeCamera() {
    nowCameraIndex++;
    if (nowCameraIndex >= cameraData.length) {
      nowCameraIndex = 0;
    }
    setCamera(nowCameraIndex);
  }
  function setCamera(cameraIndex) {
    //APIを格納
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    //window.URLのAPIをすべてwindow.URLに統一
    window.URL = window.URL || window.webkitURL;

    if (navigator.getUserMedia) {
        navigator.getUserMedia({video: {optional: [{sourceId: cameraData[cameraIndex].id }]}, audio: false}, function(stream) {
            localMediaStream = stream;
            video.src = window.URL.createObjectURL(localMediaStream);
        }, function(error) {
            console.error("getUserMedia error: ", error.code);
        });

    }
  }

  // 映像読み込んで重ねる
  var capture = function () {
    var width = video.videoWidth;
    var height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;
    context.globalAlpha = 0.5;
    context.drawImage(video, 0, 0);
    var canvasConfirm = document.getElementById('confirmation');
    canvasConfirm.width = width;
    canvasConfirm.height = height;
    var confirm = canvasConfirm.getContext('2d');
    confirm.drawImage(video, 0, 0);
  }

  // qrcode decoder
  qrcode.debug = true;
  qrcode.callback = function(e) {
    console.log(e);
    $('#qrdecode').html(e);
  };

  // 定期的に取り込む
  // 最終的にはleap-motionのloopに入れていい
  function captureToCanvas() {
    capture();
    //var img = context.getImageData(0, 0, canvas.width, canvas.height);
    //qrcode.decode(video);
    setTimeout(captureToCanvas, 500);
  }
  setTimeout(captureToCanvas, 500);

  // leap-motion
  /*
  var controller = new Leap.Controller();
  controller.loop(function(frame) {
    $('#leap').html(frame.dump());
  });
  */

});
