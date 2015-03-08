var menuOpenFlg = false;

// 映像読み込んで重ねる
var capture = function (id) {
  // 変数
  var video = document.getElementById("video");
  var canvas = document.getElementById('superimpose');
  var context = canvas.getContext('2d');

  var width = video.videoWidth;
  var height = video.videoHeight;
  var canvasConfirm = document.getElementById(id);
  canvasConfirm.width = width;
  canvasConfirm.height = height;
  var confirm = canvasConfirm.getContext('2d');
  confirm.drawImage(video, 0, 0);
}

// ヘルプ表示時の背景画像取得
function captureToGlassCanvas() {
  capture('glassSuperimpose');
  $("#glassSuperimpose").Vague({intensity:10}).blur();
  setTimeout(captureToGlassCanvas, 100);
}
setTimeout(captureToGlassCanvas, 100);

$("#helpCapture").click(function() {
  showMenu();
});
$("#closeHelp").click(function() {
  hideMenu();
});

function showMenu() {
    menuOpenFlg = true;
    $('#hand').css('z-index', 30);

    $('#upIcon').hide();
    $('#webIcon').hide();
    $('#shareIcon').hide();

    var glassElem   = $("#glassSuperimpose");
    var helpDisp    = $("#helpDisp");
    var helpContent = $("#helpContent");
    var helpUnit    = $(".helpUnit");

    //captureToGlassCanvas();
    glassElem.addClass("show");
    helpDisp.addClass("show");
    helpUnit.addClass("show");
    helpContent.addClass("show");

    helpUnit.each(function(i) {
      var top = 40 + i * ($(this).height() + 40);
      $(this).css({'top': top, 'left': 250});
    });
}

function hideMenu() {
    menuOpenFlg = false;
    $('#hand').css('z-index', 10);

    $('#upIcon').show();
    $('#webIcon').show();
    $('#shareIcon').show();

    var glassElem   = $("#glassSuperimpose");
    var helpDisp    = $("#helpDisp");
    var helpContent = $("#helpContent");
    var helpUnit    = $(".helpUnit");

    captureToGlassCanvas();
    glassElem.removeClass("show");
    helpDisp.removeClass("show");
    helpUnit.removeClass("show");
    helpContent.removeClass("show");
}
