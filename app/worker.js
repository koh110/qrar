var worker_getAllColor = {};

// ピクセル走査処理
worker_getAllColor.search = function(e){
    // e.data に、メッセージの値が入ってくる
    var pixdata = e.data.pixdata.data,
        colorNum = 5, // ベース/サブ/キーカラーそれぞれ5色を出力
        tmplabel = "",
        colorObj = {},
        colorAry = {
            base:[],
            sub:[],
            key:[]
        };
    // ピクセルの総数
    var pixNum = pixdata.length;

    // 全ピクセルデータからオブジェクトを作成する処理
    // colorObjのkeyを "Rの値,Gの値,Bの値"とし、valueには同色のピクセルの個数
    // 1件め追加
    colorObj[pixdata[0] + ',' + pixdata[1] + ',' + pixdata[2]] = 1;
    var flag;

    // 2件目以降
    // ピクセルデータは RGBaの順番で取得されるので、4番目のalpha（透明度）は今回は取得せずに飛ばす
    for(var i=4; i<pixNum; i++){
        if(i % 4 === 3) continue;
        if(i % 4 === 2) {
            tmplabel += pixdata[i];
            // 近似色を比較し、近似色なら元オブジェクトの数値をプラス
            for(var label in colorObj){
                if(!worker_getAllColor.checkNum(label,tmplabel)) {
                    colorObj[label] = colorObj[label]+1;
                    flag = true;
                    break;
                }
            }
            // 近似色でない場合、新たにオブジェクトを追加
            if(!flag) {
                colorObj[tmplabel] = 1;
            } else {
                flag = false;
            }
            tmplabel = "";
        } else {
            tmplabel += pixdata[i] + ',';
        }
    }

    // 返り値データの成型
    var count = 0;
    for(var label in colorObj) {
        // 数値が全ピクセルの15%以上ならベースカラー
        // 1％〜10％ならサブカラー
        // 1％以下ならキーカラー
        var lineNum = (colorObj[label]/pixNum * 100);
        if(lineNum > 8) { // ベースカラー
            var type = {name:"base"};
        } else if(lineNum <= 1) { // キーカラー
            var type = {name:"key"};
        } else if(lineNum <= 8) { // サブカラー
            var type = {name:"sub"};
        } else {
            continue;
        }

        // 配列の個数が規定数以下の時は配列に追加
        if(colorAry[type.name].length < colorNum) {
            colorAry[type.name].push({name:label, num:colorObj[label]});
        } else {
            // 各オブジェクトを比較し、valueが多い方を配列に残す
            for(var i=0,len=colorAry[type.name].length; i<len; i++){
                if(colorAry[type.name][i].num < colorObj[label]) {
                    colorAry[type.name][i] = {name:label, num:colorObj[label]};
                    break;
                }
            }
        }
        count++;
    }

    // それぞれvalueの多い順にソート
    colorAry.base.sort( function( a, b ) { return b.num - a.num; } );
    colorAry.sub.sort( function( a, b ) { return b.num - a.num; } );
    colorAry.key.sort( function( a, b ) { return b.num - a.num; } );

    // UIスレッドにオブジェクトを返す
    postMessage({ary:colorAry});
};

// 近似色かチェック(近似色ならfalse、別色ならtrueを返す)
worker_getAllColor.checkNum = function(obj1,obj2){
    var col1 = obj1.split(",");
    var col2 = obj2.split(",");
    var r = col1[0] - col2[0],
            g = col1[1] - col2[1],
            b = col1[2] - col2[2];
    var d = Math.sqrt(r*r + g*g + b*b);
//  postMessage({log:d});
    if(60 < d) return true; // 閾値
    return false;
};

// onmessageイベント
// ここに設定したオブジェクトから処理を開始
onmessage = worker_getAllColor.search;
