"use starict"
/**
 * StateMachineを制御します。
 * シングルプレイでフォーカスが外れた際一時停止します。*実装予定
 */

 rpg.Engine = function() {
   this.stateMachine = null;          // ステイトマシーン
   this.updateInterval = 1000 / 16;   // 16fps
   this.renderInterval = 1000 / 30;   // 30fps
   this.renderId = null;              // レンダーID     停止時に必要
   this.updateId = null;              // アップデートID 停止時に必要
   let $this = this;

   this.constructor = function(stateMachine) {
     this.stateMachine = stateMachine;
     let $SP = rpg.$SP;
     $SP.sm = stateMachine;           // ショートカットの作成

     // 初期設定
     rpg.tm.init();
     this.start();                    // エンジンのスタート
   };

   // エンジン開始処理
   this.start = function() {
     // 重複防止
     if (this.stateMachine.waitState == false) return;

     this.stateMachine.waitState = false;

     // レンダーとアップデート実行
     if (! this.renderId) {
       // this.render();
       this.renderId = setInterval(
         this.render,
         this.renderInterval
       )
     }
     if (! this.updateId) {
       this.updateId = setInterval(
         this.update,
         this.updateInterval
       );
     }
   };

   // エンジン停止処理
   this.stop = function() {
     // 重複防止
     if (this.stateMachine.waitState == true) return;

     this.stateMachine.waitState = true;

     // レンダーとアップデートのイベント消去
     if (this.renderId) {
       cancelAnimationFrame(this.renderId);
     }
     if (this.updateId) {
       cancelInterval(this.updateId);
       this.updateId = null;
     }
   };

   // レンダー
   this.render = function() {
     // let $UP = rpg.$UP;
     // $this.renderId = window.requestAnimationFrame($this.render);
     $this.stateMachine.render();
   }

   // アップデート
   this.update = function() {
     $this.stateMachine.update();
   }

   this.constructor.apply(this, arguments);
 }
