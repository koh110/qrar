var imgPathPrefix = 'img';

var takanotume = {
  name: '鷹の爪',
  scale: 0.75,
  hosei: {
    x: 0,
    y: 0,
    haba: -200,
  },
  page: [
    { path: imgPathPrefix + '/takanotume/content0.jpg', scale: 0.9,},
    { path: imgPathPrefix + '/takanotume/content1.jpg', scale: 0.9,},
    { path: imgPathPrefix + '/takanotume/content2.jpg', scale: 1, hosei: {x: 50, y: 0, haba: -120}},
    { path: imgPathPrefix + '/takanotume/content3.jpg', scale: 1, hosei: {x: 50, y: 0, haba: -120}},
    { path: imgPathPrefix + '/takanotume/content4.jpg', scale: 0.8,},
    { path: imgPathPrefix + '/takanotume/content5.jpg', scale: 0.8,},
    { path: imgPathPrefix + '/takanotume/content6.jpg', scale: 0.4, hosei: {x: 130, y: 200, haba: 400}},
    { path: imgPathPrefix + '/takanotume/content7.jpg', scale: 0.4, hosei: {x: 130, y: 200, haba: 400}},
    { path: imgPathPrefix + '/takanotume/content8.jpg', scale: 0.4, hosei: {x: 130, y: 100, haba: 420}},
    { path: imgPathPrefix + '/takanotume/content9.jpg', scale: 0.4, hosei: {x: 130, y: 100, haba: 420}},
  ]
};

var twoch = {
  name: 'aa',
  scale: 0.5,
  hosei: {
    x: 10,
    y: 40,
    haba: -80,
  },
  page: [
    { path: imgPathPrefix + '/2ch/2ch0.jpg', scale: 1,},
    { path: imgPathPrefix + '/2ch/2ch1.jpg', scale: 1,},
    { path: imgPathPrefix + '/2ch/2ch2.jpg', scale: 1,},
    { path: imgPathPrefix + '/2ch/2ch3.jpg', scale: 1,},
    { path: imgPathPrefix + '/2ch/2ch4.jpg', scale: 1,},
  ]
};

var ero = {
  name: 'mufufu',
  scale: 0.7,
  hosei: {
    x: 30,
    y: 40,
    haba: -250,
  },
  page: [
    { path: imgPathPrefix + '/ero/ero0.jpg', scale: 1,},
    { path: imgPathPrefix + '/ero/ero1.jpg', scale: 1,},
    { path: imgPathPrefix + '/ero/ero2.jpg', scale: 1,},
    { path: imgPathPrefix + '/ero/ero3.jpg', scale: 1,},
    { path: imgPathPrefix + '/ero/ero4.jpg', scale: 1,},
  ]
};

var book = {
  x: viewRange.x,
  y: viewRange.y,
  selected: takanotume,
}

function selectBook(bookName) {
  switch(bookName) {
    case 'takanotume':
      book.selected = takanotume;
    break;
    case '2ch':
      book.selected = twoch;
    break;
    case 'ero':
      book.selected = ero;
    break;
    default:
      book.selected = takanotume;
  }
}

$(function() {
  $('#chooseTaka').on('click', function() {
    selectBook('takanotume');
  });
  $('#chooseMufufu').on('click', function() {
    selectBook('ero');
  });
  $('#choose2ch').on('click', function() {
    selectBook('2ch');
  });


  var video = document.getElementById("video");
  var bookcanvas = document.getElementById('bookarea');
  var bookRightcanvas = document.getElementById('bookareaRight');
  var bookcontext = bookcanvas.getContext('2d');
  var bookRightcontext = bookRightcanvas.getContext('2d');

  var showHandFlg = true;

  // 映像読み込んで重ねる
  var capture = function () {
    var width = video.videoWidth ? video.videoWidth : 1;
    var height = video.videoHeight ? video.videoHeight : 1;
    bookcanvas.width = width;
    bookcanvas.height = height;
    bookRightcanvas.width = width;
    bookRightcanvas.height = height;
    if (page != 0 && !menuOpenFlg) {
      index = page * 2 - 2;
      if (book.selected.page[index]) {
        var imgObj = new Image();
        var bookObj = book.selected.page[index];
        imgObj.src = bookObj.path;
        if (scaleMode) {
        bookcontext.scale((bookPoint.r - bookPoint.l) / imgObj.naturalWidth, (bookPoint.B - bookPoint.T) / imgObj.naturalHeight );
        bookcontext.drawImage(imgObj, bookPoint.l, bookPoint.t, bookPoint.r - bookPoint.l, bookPoint.b - bookPoint.t);
        } else {
        bookcontext.scale(book.selected.scale * bookObj.scale, book.selected.scale * bookObj.scale);
        var x = book.x + book.selected.hosei.x;
        var y = book.y + book.selected.hosei.y;
        if (bookObj.hosei) {
          x += bookObj.hosei.x;
          y += bookObj.hosei.y;
        }
        bookcontext.drawImage(imgObj, x, y);
        }
      }
      if (book.selected.page[index + 1]) {
        var rightImgObj = new Image();
        var bookObj = book.selected.page[index + 1];
        rightImgObj.src = bookObj.path;
        if (scaleMode) {
        bookRightcontext.scale((bookPoint.r - bookPoint.l) / rightImgObj.naturalWidth, (bookPoint.B - bookPoint.T) / rightImgObj.naturalHeight );
        bookRightcontext.drawImage(rightImgObj, bookPoint.r, bookPoint.t, bookPoint.r - bookPoint.l, bookPoint.b - bookPoint.t);
        } else {
        bookRightcontext.scale(book.selected.scale * bookObj.scale, book.selected.scale * bookObj.scale);
        var x = book.x + width + book.selected.hosei.x + book.selected.hosei.haba;
        var y = book.y + book.selected.hosei.y;
        if (bookObj.hosei) {
          x += bookObj.hosei.x + bookObj.hosei.haba;
          y += bookObj.hosei.y;
        }
        bookRightcontext.drawImage(rightImgObj, x, y);
        }
      }
    }
    $('#book').html('book:' + book.selected.name);
  }

  // 定期的に取り込む
  // 最終的にはleap-motionのloopに入れていい
  function captureToCanvas() {
    capture();
    setTimeout(captureToCanvas, 300);
  }
  setTimeout(captureToCanvas, 300);
});
