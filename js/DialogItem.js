"use starict"

/**
 * ダイヤログ　描画アイテム
 */

 rpg.Dialog.Item = class {
   /**
    * 構築子
    * @param {object} opt - 描画設定
    */
   constructor(opt) {
     this.prm = null        // {txt: 文字列, imgPrm: 描画画像}
     this.accptEvnt = null; // イベント受付のフラグ
     this.x = null;         // 呼び出し元が設定する
     this.y = null;         // 呼び出し元が設定する
     this.w = null;         // 初期化時に自身が設定します
     this.h = null;         // 初期化時に自身が設定します
     this.select = false;   // 描画時に一時的にフラグを立てる

     this.prm = {};
     this.w = rpg.Dialog.inn.w;
     this.h = rpg.utl.vw_grdSzBs;
     cmb(true, this, opt);
   }

   draw(cntxt) {}
 };

 rpg.Dialog.ItemMsg = class extends rpg.Dialog.Item {
   constructor(opt) {
     super(cmb(true, {
        accptEvnt: false
       ,mrgn: 0             // マージン
       ,txtLft: 0           // 文字列左位置
       ,imgPrm: null        // 画像
       ,imgPos: null        // "lft" or "btm"
       ,txtH: 0             // 文字列の高さ
       ,imgPrmArr: null     // 画像配列
     }, opt));

     // 文字列の初期位置
     this.src = {};
     this.src.txt = this.prm.txt;
     this.src.h = this.h;
     let txtW = this.w;
     let imgH = 0;

     // 画像の有無確認
     if (this.imgPrm != null) {
       this.mrgn = I(this.w * 0.03);
       if (this.prm.imgPos == null || this.prm.imgPos == "lft") {
         // 左寄せ
         this.txtLft = this.prm.imgPrm.dw + this.mrgn;
         txtW -= this.txtLft;
       }
       imgH = this.prm.imgPrm.dh + this.mrgn * 2;
     }

     // 画像配列の有無確認
     if (this.prm.imgPrmArr != null) {
       this.mrgn = I(this.w * 0.03);
       let imgPrmArr = this.prm.imgPrm;
       let imgPrmFrst = imgPrmArr[0].imgPrm;
       let imgPrmLst = imgPrmArr[imgPrmArr.length - 1].imgPrm;

       if (this.prm.imgPos == null || this.prm.imgPos == "lft") {
         // 左寄せ
         this.txtLft = this.prm.imgPrm.dw + this.mrgn;
         txtW -= this.txtLft;

         let lnH = rpg.Dialog.getLnH();
         let lstLnY = imgPrmLst.line * lnH;
         imgH = lstLnY + imgPrmLst.dh + this.mrgn * 2
       } else
       if (this.prm.imgPos == "btm") {
         // 下寄せ
         for (let i = 0; i < imgPrmArr.length; i++) {
           imgH = Math.max(imgPrmArr[i].dh, imgH);
         }
         imgH += this.mrgn * 2;
       }
     }
     // 文字の折り返し
     let res = this.fldStr(this.src.txt, txtW, this.src.h);
     this.prm.txt = res.str;

     // 高さの記録
     this.txtH = this.h = res.h;
     if (imgH > 0) {
       if (this.prm.imgPos == null || this.prm.imgPos == "lft") {
         // 左寄せ
         if (imgH > this.h) {this.h = imgH;}
       } else
       if (this.prm.imgPos == "btm") {
         // 下寄せ
         this.h += imgH;
       }
     }

     // 高さの最大値は内部領域の高さ
     let hMax = rpg.Dialog.getInH();
     if (this.h > hMax) {this.h = hMax};
   }

   // 初期値に戻す
   bckSrcPrm() {
     this.prm.txt = this.src.txt;
     this.h = this.src.h;
   }

   /**
    * 文字を折り返します
    * @param {string} str - 文字列
    * @param {number} w - 文字の幅
    * @param {number} h - 行の高さ
    */
   fldStr(str, w, h) {
     let res = {h, str};
     let $SP = rpg.$SP;
     let cntxt = $SP.lyrDlg.cntxt;
     let lnH = rpg.utl.vw_fntSzBs * rpg.utl.vw_lnH;

     let resFld = rpg.utl.fldStr(cntxt, null, lnH, str, w);

     res.h = h - lnH + resFld.h;
     res.str = resFld.strArr.join("\n");
     return res;
   }

   /**
    * 背景　ダイアログの描画を行います
    */

   draw(cntxt) {
     // 画像の描画
      if (this.prm.imgPrm) {
        let imgPrm = this.prm.imgPrm;
        imgPrm.cntxt = cntxt;
        if (this.prm.imgPos == null || this.prm.imgPos == "lft") {
          imgPrm.dx = this.x;
          imgPrm.dy = this.y + mrgn;
        } else
        if (this.prm.imgPos == "btm") {
          imgPrm.dx = this.x + (this.w - imgPrm.dw) / 2;
          imgPrm.dy = this.y + this.txtH + this.mrgn;
        }
        rpg.R.drwImg(imgPrm);
      }

      // 画像配列の描画
      if (this.prm.imgPrmArr) {
        let imgPrmArr = this.prm.imgPrmArr;
        if (this.prm.imgPos == null || this.prm.imgPos == "lft") {
          let lnH = rpg.Dialog.getLnH();
          for (let i = 0; i < imgPrmArr.length; i++) {
            let imgPrm = imgPrmArr[i].imgPrm;
            let line   = imgPrmArr[i].line;
            imgPrm.cntxt = cntxt;
            imgPrm.dx    = this.x;
            imgPrm.dy    = this.y + this.mrgn + line * lnH;
            rpg.R.drwImg(imgPrm);
          }
        } else
        if (this.prm.imgPos == "btm") {
          let imgSumW = 0;
          for (let i = 0; i < imgPrmArr.length; i++) {
            let imgPrm = imgPrmArr[i].imgPrm;
            let mrgn   = imgPrmArr[i].mrgn | 0;

            imgSumW += imgPrm.dw;
            if (i != 0) {imgSumW + mrgn;}
          }

          let imgX = this.x + (this.w - imgSumW) / 2;
          let imtY = this.y + this.txtH + this.mrgn;

          // 画像の描画
          for (let i = 0; i < imgPrmArr.length; i++) {
            let imgPmr = imgPrmArr[i].imgPrm;
            let mrgn = imgPrmArr[i].mrgn | 0;
            imgPrm.cntxt = cntxt;
            imgPrm.dx = imgX;
            imgPrm.dy = imgY;
            rpg.utl.drwImg(imgPrm);

            imgX += imgPrm.dw + mrgn;
          }
        }
      }

      // 文字列描画
      rpg.Dialog.drwTxt(cntxt, this.prm.txt,
        this.x + this.txtLft, this.y,
        this.w - this.txtLft + this.x, this.h);
   }
 }
