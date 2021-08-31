"use starict"

/**
 * シーン移動時のフェードイン、フェードアウトを実装します
 */

rpg.StateBase = class extends rpg.State {
  /**
  * @constructor {object} opt - 拡張するプロパティ
  */
  constructor(opt) {
    super(cmb(true, {
      name: "StateBase"
    }, opt));
  }

  updateLeave() {
    let $SP = rpg.$SP;
    rpg.utl.clrCntxt($SP.lyrs[my.lyr.bd].cntxt);
    return true;
  }

  updateEnter() {
    return true;
  }
}
