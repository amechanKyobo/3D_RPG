"use starict"
/**
 * 言語管理ライブラリ
 */

 rpg.lng = function() {
   this.lng = "jp";

   /**
    * 言語データーオブジェクト
    * @type {object} lngObj - {key: 文字, en: letter, dflt: デフォルト文字}
    */
   this.lngObj = {};

   // 言語データの追加
   this.addObj = function(obj) {cmb(this.lngObj, obj)};

   // 言語の種類を設定
   this.setLng = function(lng) {this.lng = lng};

   /**
    * キーに対応した言語データを取得します
    * @param {string} key - 対応の文字列
    * @return {string}
    */
   this.get = function(key) {
     if (typeof this.lngObj[key] === "undefined") return;

     // 指定されていない場合デフォルトの文字列
     let res = this.lngObj[key][this.lng];
     if (typeof res === "undefined") res = this.lngObj[key].dflt;

     return res;
   }
 }
