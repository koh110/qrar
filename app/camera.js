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

  $('#changeCamera').on('click', function() {
    changeCamera();
  });

  // クリックイベント
  $('#stop').on('click', function() {
    localMediaStream.stop();
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

});
