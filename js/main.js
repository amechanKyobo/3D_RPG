"use star"
/**
 * ゲームの初期化、実行を行います。
 */

window.onload = function() {
  rpg.init({
     wrpId: "cnvsArea"
    ,lyrNo: my.lyr.sz
  });

  rpg.lyr.init();     // レイヤーの初期化
  rpg.tm.init();      // タイマーの初期化
  rpg.utl.initVwPrts() // 表示設定の初期化
  my.init();

  let stt = new rpg.StateList

  // stt.add(new my.StateIlstDbg());
  stt.add(new my.StateAuthor());
  stt.add(new my.StateStgSel());
  stt.add(new my.StateMainGame());


  // ステイトマシーンの作成
  let stateMachine = new rpg.StateMachine({
     states:        stt.getLst()
    ,currentState:  stt.getFrstNm()
  });

  // ゲームエンジンの登録
  // ゲーム実行
  let engine = new rpg.Engine(stateMachine);
}
