"use starict"
/**
 * このItemを継承することで、様々な描画が可能になります。
 * @class Stateに登録して使用する描画オブジェクトです。
 */

rpg.Item = class {
  typ = "item";         // アイテムのタイプ
  stat = 0;             // 状態
  accptClkEvnt = false; // クリックイベントの受け入れの可否
  accptKeyEvnt = false; // キーイベントの受け入れの可否
  needRender = true;    // 描画が必要かのフラグ
  needUpdate = true;    // アップデートが必要かのフラグ
  x = 0;                // 描画位置とサイズ
  y = 0;
  w = 0;
  h = 0;
  prm = {};             // 拡張用プロパティ

  /**
   * @constructor {object} opt - 拡張するプロパティ
   */
  constructor(opt) {
    cmb(true, this, opt);
  }

  // レンダー
  render() {
    this.needRender = false;
  }

  // アップデート
  update() {
    if (this.stat == 1) this.needRender = true;
  }

  // イベント
  evnt(e) {
    return false;
  }
}
