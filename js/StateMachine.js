"use starict"
/**
 * Stateを管理するStateマシンを実装します。
 */

 rpg.StateMachine = function() {
   this.states          = null;     // state配列
   this.currentState    = null;     // 現在のstate
   this.nextState       = null;     // 次のstate
   this.currentStateNm  = null;     // 現在のstateの名前
   this.nextStateNm     = null;     // 次のstateの名前
   this.phase = null;       // enter, exec, leave
   this.waitState = true;   // マシンを停止するか

   this.accptEvnt = true;   // イベント入力拒否


   this.constructor = function(opt) {
     let $SP = rpg.$SP;

     this.states = opt.states;    // stateリストを登録

     let lyrTop = $SP.lyrTap.cnvs;
     let $this = this;

     /**
      * マウスイベント
      */
     lyrTop.addEventListener("mousedown", function(e) {
       $this.evnt($this, e, {typ: "mou", act: 0});      // ダウン
     });
     lyrTop.addEventListener("mouseup", function(e) {
       $this.evnt($this, e, {typ: "mou", act: 1<<1});   // アップ
     });
     lyrTop.addEventListener("mousemove", function(e) {
       $this.evnt($this, e, {typ: "mou", act: 1<<2});   // ムーブ
     });

     /**
      * キーボードイベント
      */
     window.addEventListener("keydown", function(e) {
       $this.evnt($this, e, {typ: "key", act: 0, key: e.key});
     });
     // window.addEventListener("keypress", function(e) {
     //   console.log("press");
     // });
     // $SP.lyrClk.cnvs.addEventListener("keyup", function(e) {
     //   console.log("up");
     // });

     this.transition(opt.currentState || null);
   };

   this.transition = function(nextStateNm) {
     if (this.currentState == null) {
       // 初回処理
       this.currentState    = this.states[nextStateNm];
       this.currentStateNm  = nextStateNm;
       this.phase           = "enter";

       // 初回実行
       this.currentState.enter();
     } else {
         this.nextState     = this.states[nextStateNm];
         this.nextStateNm   = nextStateNm;
         this.phase         = "leave";
     }
   };

   /**
    * レンダー
    * Stateからフェーズに合わせたレンダーを呼び出します
    */
   this.render = function() {
     let $UP = rpg.$UP;
     let stt = this.currentState;
     let phs = this.phase;

     // 時間の有効確認
     if (! $UP.tmEnbl) return;

     rpg.tm.update("render");     // 時間の更新

     // フェーズによる分岐
     if (phs == "enter")  {stt.renderEnter();}  else
     if (phs == "exec")   {stt.renderExec();}   else
     if (phs == "leave")  {stt.renderLeave();}
   };

   /**
    * アップデート
    * Stateからフェーズに合わせたアップデートを呼び出します
    * アップデート処理でtrueが帰ってきた場合、フェーズの繊維を行います
    */
    this.update = function() {
      rpg.tm.update("update");

      let next;
      let updates = [
         {nm: "enter",  fnc: "updateEnter"}
        ,{nm: "exec",   fnc: "updateExec"}
        ,{nm: "leave",  fnc: "updateLeave"}
      ];

      for (var i = 0; i < updates.length; i++) {
        if (this.phase != updates[i].nm) continue;
        if (next = this.currentState[updates[i].fnc]()) {
          this.phase = updates[(i + 1) % updates.length].nm;
          break;
        }
      }

      // フェーズの遷移がある場合
      if (next) {
        // 時間のリセット
        rpg.tm.reset("phase");

        // enter初回実行
        if (this.phase == "enter") {
          this.currentState = this.nextState;
          this.currentStateNm = this.nextStateNm;
          this.nextState = null;

          this.currentState.enter();
        }

        // exec初回実行
        if (this.phase == "exec") {
          this.currentState.exec();
        }
      }
    };

    this.evnt = function($this, e, opt) {
      // ダイアログ実行時
      if (rpg.Dialog.enbl) {
        if (opt.typ == "mou" && opt.act == 0) {
          rpg.Dialog.clk(e);
        }
      } else {
        // 通常時
        if ($this.waitState == true)  return;
        if ($this.phase != "exec")    return;
        if (! $this.accptEvnt)        return;

        let $UP = rpg.$UP;
        if (! $UP.tmEnbl) return;

        let evntPrm = cmb(true, {type: "mou", x: e.x || null, y: e.y || null}, opt);

        this.currentState.actItemEvnt(evntPrm);
      }
    };

    this.constructor.apply(this, arguments);
 }
