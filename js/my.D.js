"use starict"

/**
 * ゲームの固有データを保存するファイルです
 * またファイルを複数に分割して管理しやすくしています
 */

 my.D = new function() {
   let $this = this;
   // HUD情報

   // 画像サイズ
   this.hnd_chr_hndH = 256;
   this.hnd_chr_hndW = 1028;

   // ボード系 情報
   this.brd_maxW  = [700, 500, 300];    // 横幅配列
   this.brd_h_r   = 0.7;    // 縦比率
   this.brd_mrgnX = 0.3;    // 左右マージン比率
   this.brd_mrgnY = 0.1;    // 上下マージン比率
   this.brd_dnt   = 5;      // 凹みの幅
   this.brd_con   = 5;      // 輪郭の幅
   this.brd_bbl   = this.brd_dnt * 1.5  // ベベルの幅
   this.brd_frm_r = 0.04;   // フレーム比率

   // ステージセレクト画面の設定
   this.brd_btn_yMax_stg = 5;     // 最大で縦に表示できる数
   this.brd_btn_pdn_r = 0.1;      // ボタンのパディング比率
   this.brd_btn_top_mrgn_r = 2;   // 最初のボタンのマージン
   this.brd_scr_pdn_r = 0.1;      // スクロールのパディング比率

   // ダイアログ系　情報
   this.dlg_maxW = [900, 700, 500];
   this.dlg_h_r = 0.7;
   this.brd_mrgnX = 0.1;
   this.brd_mrgnY = 0.1;
}
