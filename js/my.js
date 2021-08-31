/**
 * 実際にゲームを実装するための初期化を行います。
 */

 // パッケージ
 let my = {};

 /**
  * ゲーム固有のレイヤーの初期化
  */
 my.lyr = {};
 my.lyr.wd = 0;       // ワールド
 my.lyr.cr = 1        // キャラクター
 my.lyr.bg = 2;       // 背景
 my.lyr.pl = 3;       // プレイヤー
 my.lyr.ui = 4;       // UI
 my.lyr.bd = 5;       // ボード
 my.lyr.dl = 6;       // ダイアログ
 my.lyr.sz = 7;       // レイヤー数

 /**
  * 初期化処理
  */
  my.init = function() {
    my.R.init();          // リソースの初期化
    my.L.init();          // 言語データの初期化

    let $UP = rpg.$SP;
    $UP.datId = "rpg";    // データ入出力用ユニークID
  };

  // リソース管理
  my.R = {};

  // リソース初期化
  my.R.init = function() {
    let R = rpg.R;
    R.resDlArr();
    R.resR();

    R.setBsUrl("img/hnd_anm/dash/");
    R.add("img", "hnd_dash_00", "hnd_dash_00.png");
    R.add("img", "hnd_dash_01", "hnd_dash_01.png");
    R.add("img", "hnd_dash_02", "hnd_dash_02.png");
    R.add("img", "hnd_dash_03", "hnd_dash_03.png");
  };

  // 言語管理
  my.L = {};

  // 言語管理初期化
  my.L.init = function() {

  };
