"use starict"

/**
 * ゲームを表示するStateです
 */

 my.StateMainGame = class extends rpg.StateBase {
   constructor(opt) {
     super({
        name: "StateMainGame"
      });
   }

   enter() {
     super.enter();

     let $SP = rpg.$SP;

     // ワールド描画アイテム
     this.itms.push(new my.ItemWorld({trgt: $SP.lyrs[my.lyr.wd].gl}));

     // ハンド描画アイテム
     // this.itms.push(new my.ItemChrHnd({
     //      trgt: $SP.lyrs[my.lyr.cr].cntxt,
     //      // ハンドアニメーションイベント登録
     //      hndAnms: [{
     //         name: "hand_dash"
     //        ,typ: "key"
     //        ,key: "w"
     //        ,act: 0
     //        ,imgLst: ["hnd_dash_00", "hnd_dash_01", "hnd_dash_02", "hnd_dash_03"],
     //      }]
     //    }));
  }
}
