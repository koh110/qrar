var handImg = {
  path: 'img/hand.png',
  x: 0,
  y: 0,
};

var menuRange = {
  x: {
    min: -100,
    max: 150,
  },
  y: {
    min: -50,
    max: 200,
  },
};

var takanotumeRange = {
  x: {
    min: 200,
    max: 1000,
  },
  y: {
    min: 35,
    max: 260,
  },
};
var twochRange = {
  x: {
    min: 200,
    max: 1000,
  },
  y: {
    min: 530,
    max: 750,
  },
};
var eroRange = {
  x: {
    min: 200,
    max: 1000,
  },
  y: {
    min: 300,
    max: 500,
  },
};

$(function() {
  var video = document.getElementById("video");
  var handcanvas = document.getElementById('hand');
  var hcontext = handcanvas.getContext('2d');

  var showHandFlg = true;

  // 映像読み込んで重ねる
  var capture = function () {
    var width = video.videoWidth ? video.videoWidth : 1;
    var height = video.videoHeight ? video.videoHeight : 1;
    var imgObj = new Image();
    handcanvas.width = width;
    handcanvas.height = height;
    imgObj.src = handImg.path;
    hcontext.scale(0.5, 0.5);
    if (showHandFlg) {
      hcontext.drawImage(imgObj, handImg.x, handImg.y);
    }
  }

  // 定期的に取り込む
  // 最終的にはleap-motionのloopに入れていい
  function captureToCanvas() {
    capture();
    setTimeout(captureToCanvas, 300);
  }
  setTimeout(captureToCanvas, 300);

  // leap-motion
  var controller = new Leap.Controller();
  controller.loop(function(frame) {
    var previousFrame = controller.frame(30);

    var hand = frame.hands[0];
    var _hand = hand ? hand.palmPosition : null;
    handImg.x = handcanvas.width/2;
    //handImg.y = handcanvas.height/2;
    handImg.y = 0;
    if (_hand) {
      handImg.x = handImg.x + Math.floor(_hand[0] * 8);
      handImg.y = handImg.y + Math.floor(_hand[2] * 6);
    }
    $('#handvalue').html('(x, y)=(' + handImg.x + ',' + handImg.y + ')');

    var gesturetype = '';
    if(frame.valid && frame.gestures.length > 0){
      frame.gestures.forEach(function(gesture){
          gesturetype = gesture.type;

          switch (gesture.type){
            case "circle":
                if (menuOpenFlg) {
                  //hideMenu();
                }
                if (book.selected.name == "mufufu") {
                    selectBook('takanotume');
                }
                break;
            case "keyTap":
                //showHandFlg = !showHandFlg;
                //$('#handstatus').html('show hand:' + showHandFlg);
                if (menuOpenFlg) {
                  if (takanotumeRange.x.min <= handImg.x && handImg.x <= takanotumeRange.x.max && takanotumeRange.y.min <= handImg.y && handImg.y <= takanotumeRange.y.max) {
                    selectBook('takanotume');
                    hideMenu();
                  } else if (eroRange.x.min <= handImg.x && handImg.x <= eroRange.x.max && eroRange.y.min <= handImg.y && handImg.y <= eroRange.y.max) {
                    selectBook('ero');
                    hideMenu();
                  } else if (twochRange.x.min <= handImg.x && handImg.x <= twochRange.x.max && twochRange.y.min <= handImg.y && handImg.y <= twochRange.y.max) {
                    selectBook('2ch');
                    hideMenu();
                  }
                } else {
                  if (menuRange.x.min <= handImg.x && handImg.x <= menuRange.x.max && menuRange.y.min <= handImg.y && handImg.y <= menuRange.y.max) {
                    showMenu();
                  }
                }
                break;
            case "screenTap":
                break;
            case "swipe":
                if (book.selected.name == "mufufu") {
                    selectBook('takanotume');
                }
                break;
          }
      });
    }

    var leap = '';
    leap = gesturetype;
    //leap = frame.rotationAngle(previousFrame);
    //leap = frame.translation(previousFrame);
    $('#leap').html(leap.toString());
    $('#leapdump').html(frame.dump());
  });

});
