var page = 1;

function getPage(r, g, b) {
  if (r >= 100 && g >= 100) {
    page = 4;
  } else if (r >= 60 &&  g <= 55 && b >= 100) {
    page = 5;
  } else if (r >= 200) {
    page = 1;
  } else if(b >= 100) {
    page = 2;
  } else if (g >= 100) {
    page = 3;
  } else {
    page = 0;
  }
  return page;
}

$(function() {
  // 定期的に取り込む
  function captureToCanvas() {
    $('#page').html('page:' + page);
    setTimeout(captureToCanvas, 300);
  }
  setTimeout(captureToCanvas, 300);
});
