"use starict"

/**
 * ダイアログを表示します
 */

rpg.Dialog = new function() {
  this.enbl = false;
  this.callback = function(itmNo) {};
  this.tmWait = 300;

  // ダイアログ情報
  this.pTtl   = "";
  this.pItms  = [];
  this.pBtn   = 0;

  // ボタン情報
  this.btnSz      = 0;
  this.btnArr     = [];
  this.btnRctArr  = [];
  this.btnSel     = -1;
  this.resOffst   = 0;
  this.btnLck     = false;

  let $this = this;


  // ページ情報
  this.pg = null;
  this.PgDat = function() {
    this.pg = 1;
    this.pgNow = this.selNow = this.selDflt = 0;

    // 配列のデータ
    this.PgPrm = function() {
      this.sz = this.strt = this.end = 0;
      this.itms = [];
    }

    // ページ配列の初期化
    this.arr = [new this.PgPrm()];

    // ページ追加
    this.addArr = function() {
      this.pg ++;
      this.arr.push(new this.PpgPrm());
    }

    // 配列の末尾取得
    this.getArrTail = function() {
      return this.arr[this.arr.length - 1];
    }

    // 選択配列の取得
    this.getArrSel = function() {
      return this.arr[this.pgNow];
    }
  };

  // 描画位置
  this.bg   = {};     // 全体
  this.ttl  = {};     // タイトル
  this.inn  = {};     // 内部領域
  this.btn  = {};     // ボタン

  /**
   * ボタン指定
   * 1ビットをシフトして指定します
   */

   this.BTN_BLNK    = 0;        // 非表示
   this.BTN_PG_PRV  = 1;        // ページ前へ
   this.BTN_PG_NO   = 1 << 1;   // ページ表示数
   this.BTN_PG_NXT  = 1 << 2;   // ページ次へ
   this.BTN_YES     = 1 << 3;   // YES
   this.BTN_NO      = 1 << 4;   // NO
   this.BTN_OK      = 1 << 5;   // OK
   this.BTN_CNSL    = 1 << 6;   // CANCEL
   this.BTN_BCK     = 1 << 7;   // BACK
   this.BTN_CLS     = 1 << 8;   // CLOSE
   this.BTN_NXT     = 1 << 9;   // NEXT
   this.BTN_SKP     = 1 << 10;  // SKIP
   this.BTN_SZ      = 11;       // 最大サイズ
   this.BTN_NM = ["<<", " | ", ">>", "YES", "NO", "OK", "CANCEL",
                  "BACK", "CLOSE", "NEXT", "SKIP"];

   // レイアウトの初期化
   this.init = function(opt) {
     let $SP = rpg.$SP;

     let max_w  = my.D.dlg_maxW;
     let h_r    = my.D.dlg_h_r;
     let mrgnX  = my.D.dlg_mrgnX;
     let mrgnY  = my.D.dlg_mrgnY;
     let size   = getSize(max_w, h_r, mrgnX, mrgnY);

     let w = size.w;
     let h = size.h;
     let cntxt = $SP.lyrDlg.cntxt;
     let grdSz = rpg.utl.vw_grdSzBs;
     let mrgn = grdSz / 2;

     // ダイアログ領域を初期化
     let x = ($SP.cnvsW - w) / 2;
     let y = ($SP.cnvsH - h) / 2;
     let bg = this.bg = {x, y, w, h};

     // タイトル領域
     this.ttl.x = this.bg.x + mrgn;
     this.ttl.y = this.bg.y + grdSz * 0.25;
     this.ttl.w = this.bg.w - mrgn * 2;
     this.ttl.h = grdSz * 0.75;

     // 内部領域
     this.inn.x = this.bg.x + mrgn;
     this.inn.y = this.ttl.y + this.ttl.h;
     this.inn.w = this.ttl.w;
     this.inn.h = this.bg.h - this.ttl.h - grdSz;

     // ボタン領域
     this.btn.x = this.bg.x + mrgn;
     this.btn.y = this.inn.y + this.inn.h - grdSz;
     this.btn.w = this.ttl.w;
     this.btn.h = grdSz * 0.85;
   }

   // 内部領域の高さ取得
   this.getInH = function() {
     return this.inn.h;
   }

   // イベントの受け入れ
   this.clk = function(e) {
     if (inRng(this.btn, e)) {this.execEvntBtn(e);} else
     if (inRng(this.inn, e)) {this.execEvntItm(e);}
   };

   // ボタンイベント
   this.execEvntBtn = function(e) {
     if (this.btnLck) return;
     console.log(this.btnArr);
     for (let i = 0; i < this.btnSz; i++) {
       // ボタンをクリックしているか
       if (inRng(this.btnRctArr[i], e)) {
         // ページ数表示の場合飛ばす
         if (1 << this.btnArr[i] == this.BTN_PG_NO) continue;
         // 描画と実行
         this.BtnSel = i;
         this.BtnLck = true;
         this.mkDlg();
         setTimeout((function(i) {
           return function() {
             $this.btnSel = -1
             $this.execBtn($this.btnArr[i]);
             $this.btnLck = false;
           }
         })(i), this.tmWait);
         break;
       }
     }
   };

   // 選択項目実行
   this.execEvntItm = function(e) {
     if (this.btnLck) return;

     let pgDat = this.pg.getArrSel();
     for (var i = 0; i < pgDat.itms.length; i++) {
       let itm = pgDat.itms[i];
       if (! itm.accptEvnt) continue;

       if (inRng(itm, e)) {
         // 再描画
         this.pg.selNow =  pgDat.strt + i;
         this.mkDlg();

         // OKボタンがない場合
         if (I(this.pBtn & this.BTN_OK)) {
           this.btnLck = true;
           setTimeout(function() {
             let sel = $this.pg.selNow - $this.resOffst;
             $this.close();
             $this.callback(sel);

             $this.btnLck = false;
           }, this.tmWait);
         }
         break;
       }
     }
   };

   // ボタンを実行
   this.execBtn = function(btnTyp) {
     btnTyp = 1 << btnTyp;
     let pg = this.pg;
     console.log(btnTyp);
     if (btnTyp == this.BTN_PG_PRV) {
       // ページ前へ
       if (pg.pgNow < 0) {pg.Now --;}
       this.mkDlg();
     } else
     if (btnTyp == this.BTN_PG_NXT) {
       // ページ次へ
       if (pg.pgNow + 1 < pg.arr.length) pg.pgNow ++;
       this.mkDlg();
     } else
     if (btnTyp == this.BTN_YES) {
       // YES
       this.close();
       this.callback(true);
     } else
     if (btnTyp == this.BTN_NO) {
       // NO
       this.close();
       this.callback(false);
     } else
     if (btnTyp = this.BTN_OK) {
       // OK
       let sel;
       if (this.pg.selNow == -1) {
         // 未選択時
         sel = this.pg.selNow;
       } else {
         // 選択時
         sel = this.pg.selNow - this.resOffst;
       }
       this.close(); this.callback(sel);
     } else
     if (btnTyp == this.BTN_CNSL || btnTyp == this.BTN_BCK) {
       // CANCEL BACK
       this.close();
       this.callback(-1);
     } else
     if (btnTyp == this.BTN_CLS) {
       // CLOSE
       this.close();
       this.callback(null);
     } else
     if (btnTyp == this.BTN_NXT) {
       // NEXT
       this.close();
       this.callback("next");
     } else
     if (btnTyp == this.BTN_SKP) {
       this.close(); this.callback();
     }
   };

   // ダイアログを閉じる
   this.close = function() {
     $this.enbl = false;    // ダイアログの受付を無効
     $this.clear();         // ダイアログをクリアー
     rpg.tm.start();        // 時間経過を再開
   };

   // ダイアログの作成
   this.mkDlg = function() {
     this.drwBG();      // 背景の描画
     this.drwTtl();     // タイトルの描画
     this.drwItm();     // アイテムの描画
     this.drwBtn();     // ボタンをの描画
   };

   // ダイアログ　タイトルの描画
   this.drwTtl = function() {
     // タイトルがに場合終了
     if (! this.pTtl) return;

     let $SP = rpg.$SP;
     let cntxt = $SP.lyrDlg.cntxt;

     rpg.Dialog.drwTxt1Ln(cntxt, this.pTtl
       ,this.ttl.x, this.ttl.y, this.ttl.w, this.ttl.h);
   };


   // ダイアログ　背景の描画
   this.drwBG = function() {
     let $SP = rpg.$SP;
     let cnvsW = $SP.cnvsW;
     let cnvsH = $SP.cnvsH;
     let cntxt = $SP.lyrDlg.cntxt;
     let grdSz = rpg.utl.vw_grdSzBs;

     this.clear();

     // 背景の描画
     cntxt.globalAlpha = 0.7;
     cntxt.fillStyle = "BLACK";
     cntxt.fillRect(this.bg.x, this.bg.y, this.bg.w, this.bg.h);
     cntxt.globalAlpha = 1;
   };

   // アイテム描画
   this.drwItm = function() {
     let $SP = rpg.$SP;
     let cntxt = $SP.lyrDlg.cntxt;

     // アイテムの描画
     let pgDat = this.pg.getArrSel();
     for (let i = 0; i < pgDat.itms.length; i++) {
       let itm = pgDat.itms[i];
       if (itm.accptEvnt && this.pg.selNow == pgDat.strt + i) {
         itm.select = true;
       }
       itm.draw(cntxt);
     }
   };

   // ボタン描画
   this.drwBtn = function() {
     let $SP = rpg.$SP;
     let cntxt = $SP.lyrDlg.cntxt;

     // ボタンサイズ
     this.btnSz  = 0;
     this.btnArr = [];
     this.btnRctArr = [];
     for (let i = 0; i < this.BTN_SZ; i++) {
       let chck = 1 << i;
       if (chck & this.pBtn) {
         this.btnSz ++
         this.btnArr.push(i);
       }
     }
     // 描画するボタンがない場合
     if (this.btnSz <= 0) return;

     // ボタンサイズ
     let btnOneW = I(this.btn.w / this.btnSz);

     // ボタン描画
     for (let i = 0; i < this.btnSz; i++) {
       let btnTyp = this.btnArr[i];
       let isPg = (1 << btnTyp) == this.BTN_PG_NO;

       this.btnRctArr.push({
          x: this.btn.x + btnOneW * i, y: this.btn.y
         ,w: btnOneW, h: this.btn.h
       });

       let btnNm = this.BTN_NM[btnTyp];
       if (isPg) {
         // ページ数表示の場合
         btnNm = (this.pg.pgNow + 1)
           + this.BTN_NM[btnTyp] + this.pg.arr.length;
       }

       // ボタン表示 1 - 選択  2 - ページ数
       let btnStat = 0;
       if (isPg) {btnStat = 2;}
       if (i == this.btnSel) {btnStat = 1;}

       let r = this.btnRctArr[i];

       // ボタン描画
       console.log(r.h);
       rpg.utl.drwBtn({cntxt, str: btnNm
        ,x: r.x, y: r.y, w: r.w, h: r.h, b: r.h * 0.1, stat: btnStat});
     }
   };

   // 画面クリア
   this.clear = function() {
     let $SP = rpg.$SP;
     let cntxt = $SP.lyrDlg.cntxt;
     rpg.utl.clrCntxt(cntxt);
   };

   // 1行高さ取得
   this.getLnH = function() {
     let utl = rpg.utl;
     return utl.vw_fntSzBs * utl.vw_lnH;
   }

   // 文字描画
   this.drwTxt = function(cntxt, txt, x, y, w, h) {
     let utl = rpg.utl;
     let txtArr = txt.split("\n");
     let yStp = this.getLnH();
     let yPos = y + utl.vw_fntSzBs;
     let opt = {textAlign: "left", fillStyle: "WHITE"};

     cntxt.save();
     cntxt.beginPath();
     cntxt.rect(x, y, w, h);
     cntxt.clip();

     for (let i = 0; i < txtArr.length; i++) {
       utl.drwStr(cntxt, txtArr[i], x, yPos, opt);
       yPos += yStp;
     }
     cntxt.restore();
   }

   // 1行の文字列を描画します
   this.drwTxt1Ln = function(cntxt, txt, x, y, w, h) {
     rpg.utl.drwStr(cntxt, txt, x, y + h / 2
       ,{textAlign: "left",  fillStyle: "WHITE", wMax: w});
   };

   /**
    * ダイアログ情報の初期化
    * 描画アイテムの高さがダイアログの高さを超えた場合ページを分割をします
    */
    this.setDlgPrm = function(ttl, itms, btn, strtSel) {
      this.pTtl   = ttl;
      this.pItms  = itms;
      this.pBtn   = btn;

      this.btnSel = -1;

      // ページ初期化
      let pg = this.pg = new this.PgDat();
      pg.selNow   = strtSel;
      pg.selDflt  = strtSel;

      let xPos = this.inn.x;
      let yPos = this.inn.y;
      let yMax = this.inn.y + this.inn.h;
      for (let i = 0; i < this.pItms.length; i++) {
        // ページ遷移の確認
        if (yPos + this.pItms[i].h > yMax) {
          // ページ追加
          pg.addArr();
          let tail = pg.getArrTail();
          tail.strt = i;        // 開始位置
          yPos = this.inn.y;    // Y座標を戻す
        }

        this.pItms[i].x = xPos;
        this.pItms[i].y = yPos;

        yPos+= this.pItms[i].h  // Y座標の更新

        // ページ情報の格納
        let tail = pg.getArrTail();
        tail.sz ++;
        tail.end = i;
        tail.itms.push(this.pItms[i]);

        // 選択項目なら選択ページに
        if (pg.selDflt == i) {pg.pgNow = pg.arr.lngth - 1;}
      }

      // ページめくりがあるならボタンを追加
      if (pg.arr.length <= 1) return;
      this.pBtn |= this.BTN_PG_PRV | this.BTN_PG_NO | this.BTN_PG_NXT;
    };

    /**
     * ダイアログ準備設定
     * @param {object} opt - ダイアログ設定オプション
     */
    this.prpr = function(opt) {
      rpg.tm.stop();
      this.enbl = true;
      this.callback = opt.callback;
      this.resOffst = 0;
      this.init(opt);
    };

    /**
     * アラートを表示
     * @param {object} opt - アラート設定オプション
     * opt.ttl      タイトル
     * opt.txt      本文
     * opt.btn      ボタン
     * opt.callback ダイアログが閉じた時に呼び出されるコールバック関数
     * opt.txtItm   ダイアログ本体を描画する描画アイテム
     * opt.txtPrm   直接引数を渡したい場合のパラメーター
          txtPrm: {prm: {
            text: "text"
           ,imgPrm: {id: "smplID", sx: 0, sy: 0}
          }}
     * opt.rct      サイズ指定
     */
     this.alrt = function(opt) {
       opt = cmb(true, {
          ttl: null
         ,txt: "Message"
         ,txtPrm: null
         ,txtItm: this.ItemMsg
         ,callback: function() {
           rpg.$SP.sm.accptEvnt = true;
         }
         ,btn: this.BTN_CLS
       }, opt);

       this.prpr(opt);

       let itms = [], itm;

       if (opt.txtPrm == null) {
         itm = new opt.txtItm({prm: {txt: opt.txt}});
       } else {
         itm = new opt.txtItm(opt.txtPrm);
       }
       itms.push(itm);

       // ダイアログを作成
       this.setDlgPrm(opt.ttl, itms, opt.btn, -1);
       this.mkDlg();
     };

     /**
      * リスト　ダイアログを表示
      * @param {opt} - リストダイアログの設定
      * opt.ttl       タイトル
      * opt.txt       選択リストの前に表示される説明
      * opt.btn       ボタン
      * opt.callback  ダイアログを閉じた時に呼び出されるコールバック
      * opt.txtItm    ダイアログの説明を描画するアイテム
      * opt.txtPrm    直接引数を設定したい場合のパラメーター
      * opt.datArr    選択項目を文字列の配列として設定
      * opt.enblArr   選択項目を一部選択不可にしたい場合 0 or false に設定
                        ["選択肢0", "選択肢1", "選択肢2"]
                        [ 1,        0,        1]
      * opt.selDflt   初期選択項目の番号
      * opt.mono      選択項目の文字列を等幅にするか
      * opt.datItm    enblArrで非表示にした項目を描画する描画アイテム
      * opt.datPrm    txtItmの選択項目
                ttl: "title"
               ,datPrm: {
                  {mrgn: 5, prm: {txt: "選択肢0", imgPrm, imgPrm0}}
                 ,{mrgn: 5, prm: {txt: "選択肢1", imgPrm, imgPrm1}}
                 ,{mrgn: 5, prm: {txt: "選択肢2", imgPrm, imgPrm2}}
               }
      */
      this.lst = function(opt) {
        opt = cmb(true, {
           ttl: null                  // タイトル
          ,txt: null                  // 説明
          ,txtPrm: null               // カスタム無地列
          ,txtItm: this.ItemMsg       // 文字部分表示アイテム
          ,datArr: []                 // リスト文字列配列
          ,datPrm: null               // カスタム リスト
          ,datItm: this.ItemSel       // リスト部分表示アイテム
          ,enblArr: null              // 有効配列 nullの場合すべて選択可能
          ,unblItm: this.ItemSelBlnk  // 無効時表示アイテム
          ,selDef: -1
          ,callback: function() {     // コールバック
            rpg.$SP.sm.accptEvnt = true;
          }
          ,btn: this.BTN_OK | this.BTN_CNSL   // ボタン
          ,mono: false                        // 等幅
        }, opt);

        this.prpr(opt);

        let itms = [], itm = null;

        if (opt.txt != null) {itm = new opt.txtItm({prm: {opt: txt}});}
        if (opt.txtPrm != null) {itm = new opt.txtItm(opt.txtPrm);}
        if (itm != null) {
          itms.push(itm);
          this.resOffst = 1;
          if (opt.selDflt != -1) {opt.selDflt ++;}
        }

        // 選択肢
        let sz = opt.datArr.length;
        if (opt.datPrm != null) {sz = opt.datPrm.length;}

        for (let i = 0; i < sz; i++) {
          let dat = null;
          if (opt.datPrm != null) {
            dat = opt.datPrm[i]
          } else {
            dat = {prm: {txt: opt.datArr[i]}};
          }

          // 等幅設定
          if (opt.mono != null) {dat.mono = opt.mono;}

          // アイテム作成
          if (opt.enblArr == null) {
            // 全て有効
            itm = new opt.datItm(dat);
          } else {
            // 無効有り
            if (opt.enblArr[i] == null) {
              itm = new opt.datItm(dat);      // 有効
            } else {
              itm = new opt.unblItm(dat);     // 無効
            }
          }
          itms.push(itm);
        }
        // ダイアログを作成
        this.setDlgPrm(opt.ttl, itms, opt.btn, opt.selDflt);
        this.mlDlg();
      }
   }
