"use starict"

/**
 * キャラクターのハンドを描画します
 * また、マウス、キーイベントによるアニメーションも登録します
 */

 my.ItemChrHnd = class extends rpg.Item {
   // 構築子
   constructor(opt) {
     super(cmb(true, {
       // 変数
        typ: "hud_hand"
       ,accptMouEvnt: true    // マウスイベントを可能に
       ,accptKeyEvnt: true    // タップイベントを可能に
       ,needRender: false     // 初回実行はしない
       ,needUpdate: false

       ,currentAnmNm: ""      // 現在のアニメーションの名前
       ,currentAnm: null      // 現在実行中にアニメーション
       ,hndAnms: []           // アニメーション配列
     }, opt));

     // アニメーションのプロパティの補充
     for (let i = 0; i < this.hndAnms.length; i++) {
       this.hndAnms[i] = cmb(true, {
          name: "hand_TEST"       // アニメーションの名前
         ,typ:  "mou"             // 対応するイベントタイプ
         ,key:  ""                // 対応するキー
         ,tmFire: 0               // アニメーション開始時間
         ,act: 0 | 1 | 1<<1       // 対応するアクション down press up
                                  // move - マウスイベント専用
         ,loop: false             // アニメーションをループするか

         ,evntStrt: function() {} // アニメーション実行時のイベント
         ,evntEnd:  function() {} // アニメーション終了時のイベント

         ,imgLst: []              // アニメーション時に描画する画像のID
         ,crImgLen: null          // 現在の描画する画像配列の値
         ,tmWait: 1000
       },
       this.hndAnms[i]);
     }

     let $SP = rpg.$SP;

     // 位置の初期化
     this.w = $SP.cnvsW;
     this.h = $SP.cnvsH;
   }

   render() {
     super.render();

     // すでにアニメーションが終了している場合
     if (this.currentAnmNm == "") return;

     let $SP = rpg.$SP;
     let $UP = rpg.$UP;
     let anm = this.currentAnm;

     rpg.R.drwImg({
        cntxt: this.trgt
       ,dx: ($SP.cnvsW - my.D.hnd_chr_hndW) / 2 , dy: $SP.cnvsH - my.D.hnd_chr_hndH
       ,id: anm.imgLst[anm.crImgLen]
     });
   }

   /**
    * アニメーションの割合の経過時間に対応して描画します
    * 例 １秒間に５枚 - 200msごとに描画
    */
   update() {
     let $UP = rpg.$UP;
     let elps = $UP.tm.phase.update.sum;
     let anm = this.currentAnm;
     let len = anm.imgLst.length;

     let crImgLen =  I(Math.min((elps - anm.tmFire) / (anm.tmWait / len), len - 1));
     if (crImgLen != anm.crImgLen) {
       // 経過時間に対応する画像が更新されたら描画
       anm.crImgLen = crImgLen;

       this.needRender = true;
     }

     // アニメーション終了時
     if (elps >= anm.tmFire + anm.tmWait) {
       if (anm.loop == true) {
         // ループが有効な場合は再度アニメーションを実行
         anm.tmFire = elps;
         anm.crImgLen = null;
         return;
       }
       // rpg.utl.clearCnvs();

       anm.evntEnd.apply(this);

       // アニメーションの終了
       this.cancelAnm();
     }
   }

   evnt(e) {
     if (e.typ == "mou" && this.accptMouEvnt) {
       // マウス入力イベント
       this.mouEvnt(e);
     } else if (e.typ == "key" && this.accptKeyEvnt) {
       // キーボード入力
       this.keyEvnt(e);
     }
   }

   /**
    * キーイベント
    */
   keyEvnt(e) {
     // キーアクションがプレスかつアニメーション中の場合は後回し
     if (e.act == 1 && this.currentAnmNm != "") {return false;}

     for (let i = 0; i < this.hndAnms.length; i++) {
       let anm = this.hndAnms[i];

       // イベントタイプが異なる場合は飛ばす
       if (anm.typ != "key") continue;
       // キーコード　キーのアクション　が対応している場合実行
       if ((anm.key == e.key) && ((e.act & anm.act) == e.act)) {
         let $UP = rpg.$UP;
         anm.tmFire = $UP.tm.phase.update.sum;
         anm.crImgLen = null;

         this.currentAnmNm = anm.name;
         this.currentAnm = anm;

         this.needUpdate = true;

         anm.evntStrt.apply(this);

         // 有効なイベント
         return true;
       }
     }
   };

   /**
    * マウスイベント
    */
   mouEvnt(e) {
     if (! inRng(this, e)) {return false;}
     //  マウスアクションがプレスかつアニメーション中の場合は後回し
     if (e.act == 1　&& this.currentAnmNm != "") {return false;}

     for (let i = 0; i < this.hndAnms.length; i++) {
       let anm = this.hndAnms[i];

       // イベントタイプが異なる場合は飛ばす
       if(anm.typ != "mou") continue;
       // マウスのアクションが対応している場合実行
       if ((e.act & anm.act) == e.act) {
         let $UP = rpg.$UP;
         anm.tmFire = $UP.tm.phase.update.sum;

         this.currentAnmNm = anm.name;
         this.currentAnm = anm;

         this.needUpdate = true;

         anm.evntStrt.apply(this);

         return true;
       }
     }
   };

   /**
    * アニメーションをキャンセルします
    */
   cancelAnm() {
     this.needUpdate = false;
     this.needRender = false;

     if (this.currentAnmNm != "") {
       this.currentAnm.crImgLen = null;
     }

     this.currentAnmNm = "";
     this.currentAnm = null;
   }
 }
