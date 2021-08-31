"use starict"

/**
 * 初期化設定をまとめています
 */

 let rpg = {};    // 名前空間の作成

 rpg.$SP = {};    // システムパラメータ
 rpg.$UP = {};    // ユーザーパラメータ

/**
 * ライブラリの初期設定
 * @param {object} prm - パラメータの初期値
 */
 rpg.initPrm = function(prm) {
   let $SP = rpg.$SP;         // ショートカットの作成
   let $UP = rpg.$UP;

   // システムパラメータの初期化
   $SP.wrpId  = prm.wrpId;    // ラップ要素のID
   $SP.winW   = prm.winW;     // ウィンドウ幅
   $SP.winH   = prm.winH;     // ウィンドウ高さ
   $SP.cnvsW  = prm.cnvsW;    // キャンバス幅
   $SP.cnvsH  = prm.cnvsH;    // キャンバス高さ
   $SP.cnvsX  = 0;
   $SP.cnvsY  = 0;

   // レイヤー関係
   $SP.lyrNo  = prm.lyrNo;    // レイヤー枚数
   $SP.lyrs   = [];           // レイヤー配列
   $SP.lyrTap = null;
   $SP.lyrDlg = null;

   // ユーザーパラメータの初期化
   $UP.tmEnbl = false;        // 時間有効
   $UP.tm = {                 // 時間
      whole: null
     ,phase: null
   }
   $UP.gmDat  = null;         // ゲームデータ
 }

 /**
  * 起動時の初期化処理
  * @param {object} prm - パラメータの初期値
  */
rpg.init = function(prm) {
  rpg.initPrm(prm);       // パラメータの初期化

  let $SP = rpg.$SP;
  // ウィンドウサイズ取得
  $SP.winW = getWinW();
  $SP.winH = getWinH();

  // キャンバスサイズ
  $SP.cnvsW = $SP.winW;
  $SP.cnvsH = $SP.winH;
}

rpg.lyr = {};

/**
 * レイヤーの初期化
 * @param {object} prm - レイヤーパラメーター
 */
rpg.lyr.init = function(prm)
{
  let $SP = rpg.$SP;

  // レイヤーの初期化
  $SP.lyrs = [];
  for (var i = 0; i < $SP.lyrNo; i++) {
    $SP.lyrs.push(this.mkLyr($SP.wrpId + "_cnvs_" + i));
  }

  // タップ　レイヤー
  $SP.lyrDlg = this.mkLyr("cnvsDlg");
  $SP.lyrTap = this.mkLyr("cnvsTap");
}

/**
 * レイヤー作成
 * @param {string} cnvsId - キャンバスID
 * @return {object} lyr - {cnvsId, cnvs, cntxt}
 */
 rpg.lyr.mkLyr = function(cnvsId){
   let $SP = rpg.$SP;

   // document.getElementById($SP.wrpId).style.position = "relative";

   let cnvs   = document.createElement("canvas");
   // WebGLレイヤーでは取得しない
   let cntxt  =
      (cnvsId != "cnvsArea_cnvs_" + my.lyr.wd) ? cnvs.getContext("2d") : null;
   let style = cnvs.style;

   // キャンバスの初期化
   cnvs.id        = cnvsId;
   cnvs.setAttribute("width", $SP.cnvsW);
   cnvs.setAttribute("height", $SP.cnvsH);

   style.position = "absolute";
   style.left     = $SP.cnvsX + "px";
   style.top      = $SP.cnvsY + "px";

   // ラップ要素に追加
   document.getElementById($SP.wrpId).appendChild(cnvs);

   // webGLレイヤーを取得
   // 初期化する前に取得をすると不具合が発生するため
   let gl     = cnvs.getContext("webgl");
   let lyr = {cnvsId, cnvs, cntxt, gl};
   return lyr;
 }

rpg.tm = {};

/**
 * 時間の初期化
 */
rpg.tm.init = function() {
  let $UP = rpg.$UP;

  // 時間を有効に
  $UP.tmEnbl = true;

  // 時間ブジェクト作成
  let TmPrm = function() {
    let TmPrmIn = function() {
      this.sum  = 0;
      this.elps = 0;
      this.old  = 0;
    }
    this.update = new TmPrmIn();
    this.render = new TmPrmIn();
  }

  $UP.tm.whole = new TmPrm();       // 全体のタイマー
  $UP.tm.phase = new TmPrm();       // フェーズのタイマー
}

/**
 * 時間のリセット
 * @param {string} key - whole or phase
 */
 rpg.tm.reset = function(key) {
   let $UP = rpg.$UP;
   let now = getTime();

   $UP.tm[key].render.old = $UP.tm[key].update.old = now;
   $UP.tm[key].render.now = $UP.tm[key].update.now = 0;
   this.resetTimeout(key);
 }

 /**
  * 時間の停止
  */
 rpg.tm.stop = function() {
   rpg.$UP.tmEnbl = false;
 }

/**
 * 時間の開始
 */
rpg.tm.start = function() {
  let $UP = rpg.$UP;
  $UP.tmEnbl = true;
  let now = getTime();

  // 古い時間を現在の時間にする
  for (var key in $UP.tm) {
    $UP.tm[key].render.old = $UP.tm[key].update.old = now;
  }
}

/**
 * 時間の更新
 * @param {string} typ - update or render
 */
 rpg.tm.update = function(typ) {
   let $UP = rpg.$UP;
   if (!$UP.tmEnbl) return;

   let now = getTime();

   // アップデート処理
   for (var key in $UP.tm) {
     let t = $UP.tm[key][typ];
     // 時間更新
     t.elps = now - t.old;
     t.sum += t.elps;
     t.old = now;

     // updateの場合は、renderとリンクさせる
     if (typ == "update") {
       let t2 = $UP.tm[key]["render"];
       t2.sum = t.sum  - (now - t2.old);
     }
   }
   rpg.tm.chckTimeout();        // タイムアウト実行
 }

rpg.timeoutArr = [];

/**
 * タイムアウトをセットします
 * @param {function} fnc - 実行する関数
 * @param {number} tm - 発火するまでの時間
 * @param {string} key - whole or phase
 * @param {string} typ - update or render
 */
 rpg.tm.setTimeout = function(fnc, tm, key, typ) {
   let $UP = rpg.$UP;
   let t = $UP.tm[key][typ];
   let sum = t.sum;

   this.timeoutArr.push({fnc, tm: tm + sum, key, typ});
 }

 /**
  * タイムアウトの処理
  */
rpg.tm.chckTimeout = function() {
  let $UP = rpg.$UP;
  let arr = rpg.timeoutArr;

  for (var i = 0; i < arr.length; i++) {
    let dt = arr[i];
    let sum = $UP.tm[dt.key][dt.typ].sum;

    // 確認
    if (sum >= dt.tm) {
      dt.fnc();               // 実行
      arr.splice(i, 1);       // タイムアウト消去
    }
  }
}

/**
 * 指定したタイムアウトを消去します
 * @parm {string} key - whole or pahse
 */
rpg.tm.resetTimeout = function(key) {
  let $UP = rpg.$UP;
  let arr = rpg.timeoutArr;

  for (var i = 0; i < arr.length; i++) {
    let dt = arr[i];

    if (dt.key == key) arr.splice(i, 1);
  }
}
