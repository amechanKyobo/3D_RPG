"use starict"

/**
 * このStateを継承することで、様々な処理が可能になります。
 *
 * @class ゲームを構築するState(シーン)です。
 */
 rpg.State = class {
   /**
   * @constructor {object} opt - 拡張するプロパティ
   */
   constructor(opt) {
     this.name = "State";    // stateの名前
     this.itms = [];         // 描画アイテム配列
     this.nxtState = null;   // 次のstate


     cmb(true, this, opt);
   };

   // 入室(初回実行)
   enter() {
     this.nextState = null;
     this.itms = [];
   };
   // 実行(初回実行)
   exec() {};

   // レンダー
   renderEnter() {};
   renderExec() {
     this.actItemRender();      // アイテムのレンダー呼び出し
   };
   renderLeave() {};

   // アップデート
   updateEnter() {};
   updateExec() {
     this.actItemUpdate();      // アイテムのアップデート
     return this.chckNxtStt();  // 次のシーンの確認
   };
   updateLeave() {};

   /**
    * 次の状態がセットされていれば、遷移を行います
    */
   chckNxtStt() {
     let $SP = rpg.$SP;

     if (this.nxtState) {
       $SP.sm.transition(this.nxtState);    // シーンの設定
       return true;                         // 次のシーンに移動
     }
     return false;
   };

   /**
    * 描画アイテムのレンダーとアップデートを呼び出します
    */
   actItemRender() {
     for (var i = 0; i < this.itms.length; i++) {
       // 途中で次の状態が登録されれば終了
       if (this.nxtState != null) return;

       let itm = this.itms[i];
       if(itm.needRender) itm.render();
     }
   };

   actItemUpdate() {
     for (var i = 0; i < this.itms.length; i++) {
       // 途中で次の状態が登録されれば終了
       if (this.nxtState != null) return;

       let itm = this.itms[i];
       if (itm.needUpdate) itm.update();
     }
   };

   /**
    * 描画アイテムのイベント処理呼び出し
    * @param {object} evnt - イベントの情報
    */
   actItemEvnt(evnt) {
     // 次の状態が登録されれば終了
     if (this.nxtState != null) return;

     let $SP = rpg.$SP;
     let lyrs = $SP.lyrs;

     // 上から順に判定
     outer: for (var i = lyrs.length - 1; i >= 0; i --) {
      var tgtCntxt = lyrs[i].cntxt || lyrs[i].gl;

      for (var j = 0; j < this.itms.length; j++) {
        var itm = this.itms[j];
        if (itm.trgt != tgtCntxt) continue;
        if (! itm.accptMouEvnt && ! itm.accptKeyEvnt) continue;

        // trueを戻せば終了
        if (itm.evnt(evnt)) break outer;
       }
     }
   };
 };

 /**
  * ステイトマシーンに登録するステイトリストを作成します
  */
 rpg.StateList = function() {
   this.stateList = {};
   this.frstNm    = null;

   this.add = function(state) {
     let nm = state.name;
     this.stateList[nm] = state;
     if (this.frstNm == null) this.frstNm = nm;
   }

   this.getLst = function() {
     return this.stateList;
   }

   this.getFrstNm = function() {
     return this.frstNm;
   }
 };
