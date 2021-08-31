"use starict"
/**
 * リソースファイルです
 */

 rpg.R = new function() {
   this.bsUrl   = "";       // 基準URL
   this.dlArr   = [];       // ダウンロード配列
   this.dlSz    = 0;        // ダウンロード数
   this.dlNow   = 0;        // 現在のダウンロード数
   this.dlOpt   = {};       // ダウンロード時のオプション
   this.isLdng  = false;    // ローディング中かのフラグ

   this.imgHsh  = {};       // 画像オブジェクト
   this.sndHsh  = {};       // 音声オブジェクト

   this.seMax = 5;          // SE同時発音数
   this.bgmId = null;       // 現在のBGM

   let $this = this;


   // 基準URLの設定
   this.setBsUrl = function(url) {
     this.bsUrl = url;
   };

   // DL配列の初期化
   this.resDlArr = function() {
     this.dlArr = [];
   };

   // リソースの初期化
   this.resR = function() {
     this.imgHsh = {};
     this.andHsh = {};
   };

   /**
    * ダウンロードするリソースを追加します。
    * @param {string} typ - img or snd
    * @param {string} id  - リソースの登録id
    * @param {string} fnm - リソースのファイルネーム
    * @param {object} opt - SEなら{isSe: true}と設定
    */
    this.add = function(typ, id, fnm, opt) {
      let $SP = rpg.$SP;
      let url = this.bsUrl + fnm;

      opt = cmb({isSe: false}, opt);

      this.dlArr.push({id, url, fnm, typ, opt});

      // 効果音の場合、同時再生のため複数回読み込む
      if (opt.isSe) {
        for (var i = 1; i < this.seMax; i++) this.dlArr.push({id: id + "@" + i, url, fnm, typ, opt});
      }

      // ダウンロードサイズを設定
      this.dlSz = this.dlArr.length;
    }

   /**
    * ダウンロード開始
    * @param {object} opt - ダウンロード進行 終了 イベント
    */
   this.strtDl = function(opt) {
     // 変数を初期化
     this.isLdng = true;
     this.dlNow = 0;
     this.dlSz = this.dlArr.length;

     // ダウンロードオプションの初期化
     this.dlOpt = cmb(true, {
        prgrs:  function(dlNow, dlSz, fnm) {}
       ,end:    function(dlNow, dlSz) {}
     }, opt);

     this.dlOpt.prgrs(this.dlNow, this.dlSz, this.dlArr[0].fnm);    // 初回
     this.execDl();
   }

   this.execDl = function() {
     // 終了確認
     if (this.dlNow >= this.dlSz) {
       this.dlOpt.end(this.dlNow, this.dlSz);
       this.isLdng = false;
       return;
     }

     let dl = this.dlArr[this.dlNow];

     // 画像
     if (dl.typ == "img") {
       let img = new Image();

       img.onload = function() {
         let dt = {img, url: dl.url, fnm: dl.fnm};

         $this.imgHsh[dl.id] = dt;

         $this.dlNow ++;                // 進行
         let nxt = $this.dlArr[$this.dlNow];
         if (typeof nxt === "undefined") nxt = dt;
         $this.dlOpt.prgrs($this.dlNow, $this.dlSz, nxt.fnm);
         $this.execDl();                // 復帰
       };
       img.src = dl.url;
     } else
     // サウンド
     if (dl.typ == "snd") {
       let loader = this.load;

       let callback = function() {
         $this.dlNow ++;                // 進行
         let nxt = $this.dlArr[$this.dlNow];
         if (typeof nxt === "undefined") nxt = dt;
         $this.dlOpt.prgrs($this.dlNow, $this.dlSz, nxt.fnm);
         $this.execDl();                // 復帰
       };

       setTimeout((function(dlNow) {
         return function() {
           // 既に進行済みか確認
           if (dlNow != $this.dlNow) return;

           // 読み込み失敗 ５秒以上経過
           console.log("Load Error : " + $this.dlArr[$tihs.dlNow].fnm);
           $this.dlNow = $this.dlSz;      // 最後まで飛ばす
           $this.execDl();
         }
       })($this.dlNow), 5 * 1000);

       loader(dl, callback);        // 読み込み開始
     }
   }

   /**
    * 画像の描画
    * また、描画する際、画像の中心に原点を移動してか描画します。
    * @param {object} prm - 画像描画の指定
    * prm.id      画像ID
    * prm.cntxt   コンテキスト
    * prm.dx      描画 X 位置
    * prm.dy      描画 Y 位置
    * prm.dw      描画横幅
    * prm.dh      描画高さ
    * prm.sx      描画参照 X 位置
    * prm.sy      画像参照 Y 位置
    * prm.sw      画像参照横幅
    * prm.sh      画像参照高さ
    * prm.rtt     回転
    * prm.clp     クリップ領域オブジェクト
    * prm.scl     拡大縮小オブジェクト
    */
   this.drwImg = function(prm) {
     if (this.isLdng) return;

     if (typeof prm.id === "undefined") return;
     if (typeof this.imgHsh[prm.id] === "undefined") return;
     console.log(this.imgHsh);
     if (typeof prm.cntxt === "undefined") return;

     let img = this.imgHsh[prm.id].img;
     let cntxt = prm.cntxt;

     let dw = I(prm.dw || img.width);
     let dh = I(prm.dh || img.height);
     let dx = I(prm.dx || 0);
     let dy = I(prm.dy || 0);

     // 原点移動
     cntxt.save();
     cntxt.translate(dx + dw / 2, dy + dh / 2);

     // クリップ
     if (typeof prm.clp !== "undefined") {
       let clp = prm.clp;
       cntxt.beginPath();
       cntxt.rect(clp.x - dw / 2, clp.y - dh / 2, clp.w, clp.h);
       cntxt.clip();
     }

     // 拡縮
     if (typeof prm.scr !== "undefined") {
       cntxt.scale(prm.scr.x, prm.scr.y);
     }

     // 回転
     if (typeof prm.ttl !== "undefined") {
       cntxt.rotate(prm.rtt);
     }

     // 描画
     cntxt.drawImage(img
         ,prm.sx || 0, prm.sy || 0, prm.sw || img.width, prm.sh || img.height
         ,- I(dw / 2), - I(dh / 2), dw, dh);
         console.log((- I(dw / 2)) + " " + (- I(dw / 2)) + " " + dw + " " + dh);

     cntxt.restore()
   }
 }
