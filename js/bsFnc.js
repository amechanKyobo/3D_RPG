"use starict"
/**
 * 基本的な関数をまとめています
 */

/**
 * ポインターロックが対応しているか調べます
 * @param {object} document_obj - 対象のドキュメント
 * @return {boolean} - 対応している
 */
window.DocumentIsSuppertedPointerLock = function(document_obj) {
  if (document_obj.exitPointerLock) return true;
  if (document_obj.webkitExitPointerLock) return true;
  if (document_obj.mozExitPointerLock) return true;
  return false;
}

 /**
  * 現在の時間を返します
  * @return {number} time - 現在の時間
  */
 window.getTime = function() {
   return performance.now();
 };

 /**
  * 数値の整数化
  * @param {number} i - 整数化する数値
  * @return {number} - 整数化された数値
  */
  window.I = function(i) {
    return i | 0;
  };

  /**
   * 数値の切り上げ
   * 負の数の場合でも負の数に切り上げします (例) -1.5 -> -2.0
   * @param {number} i - 切り上げする数値
   * @return {number} - 切り上げされた数値
   */
   window.ceil = function(i) {
     return Math.ceil(Math.abs(i)) * Math.sign(i);
   }

  /**
  * 範囲内か確認
  * @param {object} rct - {x, y, w, h}
  * @param {object} pos - {x, y, w, h}
  * @return {boolean} 範囲内か
  */
  window.inRng = function(rct, pos) {
  if (pos.x < rct.x || rct.x + rct.w <= pos.x
   || pos.y < rct.y || rct.y + rct.h <= pos.y) {
    return false;
  }
  return true;
  };

  /**
   * 数値を範囲内に納める
   */
   window.numRng = function(min, n, max) {
     if (n < min) return min;
     if (n > max) return max;
     return n;
   }

  /**
  * ウィンドウ縦横サイズ取得
  */
  window.getWinW = function() {
  return window.innerWidth
  };

  window.getWinH = function() {
  return window.innerHeight;
  };

  // 配列を指定値で埋めます
  window.bryArr = function(arr, len, p) {
    for (var i = 0; i < len; i++) arr[i] = p;
    return arr;
  }

  window.initArr = function(len, p) {
    return this.bryArr([], len, p);
  }

  /**
   * 現在のキャンバスサイズに適応しているサイズを取得します
   * @param {object} max_w - 最大横幅配列
   * @param {number} h_r - 縦幅比率
   * @param {number} marginX - 左右最小マージン比率
   * @param {number} marginY - 上下最小マージン比率
   * @return {object} size - 現在のキャンバスサイズに適応したサイズ
   */
  window.getSize = function(max_w, h_r, marginX, marginY) {
    let $SP = rpg.$SP;

    for (let i = 0; i < max_w.length; i++) {
      let w = max_w[i];
      let h = w * h_r;
      let size = {w, h};

      if (i == max_w.length - 1) {return size;}

      if (h + h * marginY * 2 >= $SP.cnvsH) {continue;}
      if (w + w * marginX * 2 >= $SP.cnvsW) {continue;}

      return size;
    }
  }

  /**
  * 複数のオブジェクトのプロパティをマージします。
  * @param {boolean}   - ディープコピー
  * @param {object}    - 対象のオブジェクト
  * @param {object}    - オブジェクト (個数制限なし)
  * @return {object}   - マージされた対象のオブジェクト
  */
 window.cmb = function() {
   var i = 1,
       key,
       length = arguments.length,
       // 引数がなければからのオブジェクトを返す
       target = arguments[0] || {},
       isDeep = false;

  　//　第一引数がtureだった場合ディープコピー
   if (target === true) {
     ++i;
     target = arguments[1] || {};
     isDeep = true;
   }

   // 引数の数だけループ
   // 第一引数は除く
   for (; i < length; ++i) {
     for (key in arguments[i]) {
       if (arguments[i].hasOwnProperty(key)) {
         // ディープコピーの場合は再度呼び出し
         if (isDeep && Object.prototype.toString.call(arguments[i][key]) === '[object Object]') {
           target[key] = cmb(target[key], arguments[i][key]);
         } else {
           target[key] = arguments[i][key];
         }
       }
     }
   }
   return target;
 };

 /**
  * ２次元配列のマップを作成します
  */
  window.mkMap2 = function(len, p) {
    let xArr = initArr(len, p);
    let zArr = initArr(len, xArr);

    return zArr;
  }

 /**
  * ３次元配列のマップを作成します
  */
 window.mkMap3 = function(len, p) {
   let xArr = initArr(len, p);
   let zArr = initArr(len, xArr);
   let yArr = initArr(len, zArr);

   return yArr;
 };
