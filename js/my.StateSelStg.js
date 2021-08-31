"use starict"

/**
 * ステージ選択画面です
 */

 my.StateStgSel = class extends rpg.StateBase {
   constructor(opt) {
     super(cmb(true, {
        name: "StateSelStg"
     }, opt));
   }

   enter() {
     super.enter();
     let $SP = rpg.$SP;

     let max_w  = my.D.brd_maxW;
     let h_r    = my.D.brd_h_r;
     let mrgnX  = my.D.brd_mrgnX;
     let mrgnY  = my.D.brd_mrgnY;
     let size   = getSize(max_w, h_r, mrgnX, mrgnY);

     let c = my.D.brd_con;
     let x = I($SP.cnvsW / 2 - size.w / 2 + c);
     let y = I($SP.cnvsH / 2 - size.h / 2 + c);
     let w = I(size.w - c * 2);
     let h = I(size.h - c * 2);

     this.itms.push(new my.ItemSelStg({trgt: $SP.lyrs[my.lyr.bd].cntxt, x, y, w, h,
          prm : {
             state: this
            ,evntStrt: function(state) {
              $SP.sm.accptEvnt = false;
            }

            ,evntEnd: function(state) {
              state.nxtState = "StateMainGame";
  						$SP.sm.accptEvnt = true;
  					}}
          }));
   }

   updateEnter() {
     return true;
   }
 };
