$(function() {
  //APIを格納
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
  //window.URLのAPIをすべてwindow.URLに統一
  window.URL = window.URL || window.webkitURL;

  // 変数
  var video = document.getElementById("video");
  var canvas = document.getElementById('superimpose');
  var context = canvas.getContext('2d');
  var localMediaStream;

  if (navigator.getUserMedia) {
      navigator.getUserMedia({video: true, audio: false}, function(stream) {
          localMediaStream = stream;
          video.src = window.URL.createObjectURL(localMediaStream);
      }, function(error) {
          console.error("getUserMedia error: ", error.code);
      });

      $('#stop').on('click', function() {
        localMediaStream.stop();
      });

      $('#photo').on('click', function() {
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
      });
  }
});
