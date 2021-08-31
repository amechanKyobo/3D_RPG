"use starict"

/**
 * ゲーム固有情報初期化ファイルです
 * ステージ　マップ情報をまとめています
 */

 cmb(true, my.D, new function() {
   // ステージ系 情報
   // ステージ配列
   this.stg_tre = [{name: "チュートリアル", txt: "クリア条件: 宝箱を見つけて鍵を入手\nクリア報酬: なし\n時間制限: なし"}
                  ,{name: "ダンジョン01", child:
                      {name: "エキストラ01", child:
                          {name: "ハイパー01", child:
                              {name: "試練01"}
                          }
                        }
                      }
                  ,{name: "ダンジョン02"}
                  ,{name: "ダンジョン03"}];
   this.stg_tre_len = this.stg_tre.length;    // ステージ数

   // マップ情報
   this.map_stg_len = 8;
   this.map_stg_cen = I(this.map_stg_len / 2);
   let len = this.map_stg_len;

   // ステージ01のマップ
   this.maps = [];

   this.maps["チュートリアル"] = mkMap3(len, 0);

   let map = this.maps["チュートリアル"];
   map[0] = mkMap2(len, initArr(len, 1));
   map[1] = [
     [0, 0, 0, 0, 0, 0, 0, 0],
     [0, 0, 0, 0, 0, 0, 0, 0],
     [0, 1, 0, 1, 0, 0, 0, 0],
     [0, 0, 0, 0, 0, 0, 0, 0],
     [0, 0, 0, 0, 0, 1, 0, 0],
     [0, 0, 0, 0, 0, 1, 0, 0],
     [0, 0, 0, 0, 0, 0, 0, 0],
     [0, 0, 0, 0, 0, 0, 0, 0]
   ];
   // map[2] = map[1].concat();
   // map[3] = map[1].concat();
   // map[4] = [
   //   [0, 0, 0, 0, 0, 0, 0, 0],
   //   [0, 0, 0, 0, 0, 0, 0, 0],
   //   [0, 1, 1, 1, 1, 1, 1, 0],
   //   [0, 0, 0, 0, 0, 0, 0, 0],
   //   [0, 0, 0, 0, 0, 0, 0, 0],
   //   [0, 0, 0, 0, 0, 0, 0, 0],
   //   [0, 0, 0, 0, 0, 0, 0, 0],
   //   [0, 0, 0, 0, 0, 0, 0, 0]
   // ]

   let $UP = rpg.$UP;
   $UP.stgDat = {};         // ステージデータ
   $UP.stgDat.stgArr = initArr(this.stg_tre_len, false);    // クリア情報
   $UP.stgDat.clrCnt = 0;   // ステージクリア数
   $UP.stgDat.selStg = 0;
 });
