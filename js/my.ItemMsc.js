"use starict"

/**
 * ステージ選択が画面 ゲームに共通で使うボタン などを担当しまいす
 */

 // ステージ選択アイテム
 my.ItemSelStg = class extends rpg.Item {
   constructor(opt) {
     super(cmb(true, {
       typ: "SelStg"
      ,accptMouEvnt: true
      ,act: 0 | 1<<1 | 1<<2 // down - up - move
      ,rndArr: []           // 領域配列
      ,clkStg: null         // クリックしたステージ

      // スクロール設定
      ,scrOptY: {
         isDrg: false       // ドラッグ有効
        ,scrAmt: 0          // スクロール量
        ,scrMaxAmt: 0       // 最大
        ,lstPos: 0          // 前回のスクロール位置
      }

      ,scrOptX: {
         isDrg: false
        ,scrAmt: 0
        ,scrMaxAmt: 0
        ,lstPos: 0
      }

      ,tmWait: 1000
      ,tmFire: 0
    }, opt));

    // 変数の初期化
    let frm   = this.frm  = this.w * my.D.brd_frm_r;    // フレームの幅
    let bx    = this.bx   = this.x + frm;                   // ボードのベースとなるX座標
    let by    = this.by   = this.y + frm * 2;               // ボードのベースとなるY座標
    let bw    = this.bw   = this.w - frm * 2;               // ボードのベース横幅
    let bh    = this.bh   = this.h - frm * 3;               // ボードのベース縦幅
    let stgH  = this.stgH = bh / my.D.brd_btn_yMax_stg;     // ボタンの縦幅
    let stgW  = this.stgW = stgH;                           // ボタンの横幅
    let pdn   = this.pdn  = stgH * my.D.brd_btn_pdn_r;      // ボタンのパディングの幅
    let topMrgn = this.topMrgn = stgH * my.D.brd_btn_top_mrgn_r;    // 最初のボタンのマージントップ
    let lftMrgn = this.lftMrgn = (bw - stgW) / 2 / 2;

    let scrOptY = this.scrOptY;
    let scrOptX = this.scrOptX;

    // 拡張ステージ(child)を探す再帰関数
    let chckCldMap = function(stg, par) {
      console.log("chck");
      let x = par.x + stgH;
      let y = par.y;
      let rngW = par.rngW;
      let rngH = par.rngH;

      let rng = {x, y, rngW, rngH};
      par.child = [];
      par.child.push(opt);

      // 横スクロールのコンテンツ量の更新
      if(scrOptX.scrCont < x + rngW - lftMrgn) {
        scrOptX.scrCont = x + rngW - lftMrgn;
      }

      if (typeof stg.child !== "undefined") {
        chckCldMap(stg.child, rng);
      }
    }

    // 横スクロールコンテンツ量
    scrOptX.scrCont = lftMrgn;

    // ステージボタン登録
    for (let i = 0; i < my.D.stg_tre_len; i++) {
      let stg = my.D.stg_tre[i];

      let x = bx + lftMrgn;
      let y = by + topMrgn + stgH * i;
      let rngW = stgW - pdn * 2;
      let rngH = stgH - pdn * 2;

      let rng = {x, y, rngW, rngH};
      this.rndArr.push(rng);

      // 拡張ステージがある場合
      if (typeof stg.child !== "undefined") {
        chckCldMap(stg, rng);
      }
    }

    // 縦スクロールのコンテンツ量
    scrOptY.scrCont = this.rndArr[my.D.stg_tre_len - 1].y + stgH - this.bx - topMrgn;

    // スクロール設定
    let scrW = bw * 0.07;
    scrOptY.w = scrW;
    scrOptY.h = bh * 0.9;
    scrOptY.x = bx + bw - scrW * 1.2;
    scrOptY.y = by + scrOptY.w / 2;
    scrOptY.sh = scrOptY.h * 0.2;
    scrOptY.sw = scrOptY.w * 1.2;
    scrOptY.sx = scrOptY.x + (scrOptY.w - scrOptY.sw) / 2;
    scrOptY.scrMaxAmt = scrOptY.h - scrOptY.sh;
    scrOptY.stv = scrOptY.scrCont / scrOptY.scrMaxAmt;
    scrOptY.b = scrOptY.dw * 0.01;

    scrOptX.h = scrW;
    scrOptX.w = (bw - scrW) * 0.8;
    scrOptX.x = bx + (bw - scrOptX.w) / 2;
    scrOptX.y = by + bh - scrW / 2;
    scrOptX.sw = scrOptX.w * 0.2;
    scrOptX.sh = scrOptX.h * 1.2;
    scrOptX.sy = scrOptX.y + (scrOptX.h - scrOptX.sh) / 2;
    scrOptX.scrMaxAmt = scrOptX.w - scrOptX.sw
    scrOptX.stv = scrOptX.scrCont / scrOptX.scrMaxAmt;
    scrOptX.b = scrOptX.dh * 0.01;
  }

  render() {
    super.render();

    let cntxt = this.trgt;
    let c = my.D.brd_con;
    let d = my.D.brd_dnt;
    let b = my.D.brd_bbl;

    let scrOptY = this.scrOptY;
    let scrOptX = this.scrOptX;

    let pdn = this.pdn;
    let $this = this;

    let $UP = rpg.$UP;
    let clrCnt = $UP.stgDat.clrCnt;

    rpg.utl.clrCntxt(cntxt);

    // ベース描画
    rpg.utl.drwBrdBs(cntxt, this.bx, this.by, this.bw, this.bh);

    // 拡張ステージを探して枝を描画する再帰関数
    let drwChldBrc = function(stg, rng, stat) {
      let x = rng.x + $this.stgW - scrOptX.scrAmt * scrOptX.stv;
      let y = rng.y - scrOptY.scrAmt * scrOptY.stv;

      // ボタン描画
      rpg.utl.drwBrdBtn({cntxt,
          x: x + pdn, y: y + pdn, w: rng.rngW, h: rng.rngH, d, b, stat});

      // ツリー構造の枝描画
      rpg.utl.drwBrdBtnBrc(cntxt,
          x - pdn, y + (rng.rngH + pdn) / 2, pdn * 2, pdn);

      if (typeof stg.child !== "undefined") {
        drwChldBrc(stg.child,
          {x, y: rng.y, rngW: rng.rngW, rngH: rng.rngH}, stat);
      }
    }

    for (let i = 0; i < my.D.stg_tre_len; i++) {
      let rng = this.rndArr[i];
      let stg = my.D.stg_tre[i];
      let x = rng.x - scrOptX.scrAmt * scrOptX.stv;
      let y = rng.y - scrOptY.scrAmt * scrOptY.stv;

      // ボタン描画
      let stat = clrCnt < i ? 1 : 0;
      rpg.utl.drwBrdBtn({cntxt,
          x: x + pdn, y: y + pdn, w: rng.rngW, h: rng.rngH, d, b, stat});

      // ツリー構造の枝描画
      if (i != 0) {
        rpg.utl.drwBrdBtnBrc(cntxt,
            x + (this.stgW - pdn) / 2, y - pdn, pdn, pdn * 2);

        if (typeof stg.child !== "undefined") {
          drwChldBrc(stg.child, rng, stat);
        }
      }
    }

    // フレーム描画
    rpg.utl.drwBrdFrm(cntxt, this.x, this.y, this.w, this.h, d, c, b);

    rpg.utl.drwScrBar(cntxt,
       scrOptY.x, scrOptY.y, scrOptY.w, scrOptY.h,
       scrOptY.sx, scrOptY.y + scrOptY.scrAmt, scrOptY.sw, scrOptY.sh, scrOptY.b);

    // scrOpt.sx = (scrOptX.x - scrOptX.sw) * scrOptX.scrAmt / scrOptX.scrAmtMax;
  }

  update() {
    if (this.clkStg != null) {
      let $SP = rpg.$SP;
      let $UP = rpg.$UP;
      let elps = $UP.tm.phase.update.sum;
      if (elps >= this.tmFire + this.tmWait) {
        $SP.sm.accptEvnt = true;    // イベント処理を再開
        this.clkStg = null;         // 押下状態から復帰
        this.needRender = true;
      }
    }
  }

  evnt(e) {
    if (e.typ != "mou") return;
    if ((e.act & this.act) != e.act) return;
    if (! inRng(this, e)) {
      // ドラッグ状態解除
      this.scrOptY.isDrg = false;
      return
    };

    this.scrEvnt(e);
    this.chckSelStg(e);

    return true;
  }

  scrEvnt(e) {
    let scrOptY = this.scrOptY;
    let scrOptX = this.scrOptX;

    // ドラッグ解除
    if (e.act == 1<<1) {
      scrOptY.isDrg = false;
    }

    // 縦スクロールドラッグ確認
    if (e.act == 0 &&
       inRng({x: scrOptY.sx, y: scrOptY.sy, w: scrOptY.sw, h: scrOptY.sh}, e)) {
      scrOptY.lstPos = e.y;
      scrOptY.isDrg = true;
      console.log(true);
    }

    // // 横スクロールドラッグ確認
    // if (e.act == 0 &&
    //    inRng({x: scrOptX.sx, y: scrOptX.sy, w: scrOptX.sw, h: scrOptX.sh}, e)) {
    //   scrOptX.lstPos = e.x;
    //   scrOptX.isDrg = true;
    // }

    // 縦スクロール更新
    if (e.act == 1<<2 && scrOptY.isDrg) {
      // 移動量を加算
      scrOptY.scrAmt += e.y - scrOptY.lstPos;
      scrOptY.scrAmt = numRng(0, scrOptY.scrAmt, scrOptY.scrMaxAmt);

      this.needRender = true;

      scrOptY.lstPos = e.y;
    }

    // // 横スクロール更新
    // if (e.act == 1<<2 && scrOptX.isDrg) {
    //   // 移動量を加算
    //   scrOptX.scrAmt += e.x - scrOptX.lstPos;
    //   scrOptX.scrAmt = numRng(0, scrOptX.scrAmt, scrOptX.w - scrOpt.sw);
    //
    //   this.needRender = true;
    //
    //   scrOptX.lstPos = x.y;
    // }
  }

  /**
   * どのステージが選択されたか
   */
  chckSelStg(e) {
    if (e.act != 0) return;


    let scrOptY = this.scrOptY;
    let stgX = this.bx + this.lftMrgn;
    let stgY = this.by + this.topMrgn - scrOptY.scrAmt * scrOptY.stv;

    // 範囲内にではければ終了
    if (e.y - stgY < 0 || e.x - stgX < 0) return;

    let x = I((e.x - stgX) / this.stgW);
    let y = I((e.y - stgY) / this.stgH);

    // パディング分判定処理
    if (I((e.y - stgY + this.pdn) / this.stgH) != y || I((e.y - stgY - this.pdn) / this.stgH) != y) {
      return;
    }
    if (I((e.x - stgX + this.pdn) / this.stgW) != x || I((e.x - stgX - this.pdn) / this.stgW) != x) {
      return
    }

    let stg = my.D.stg_tre[y];

    for (let i = 0; i < x; i++) {
      if (typeof stg == "undefined") {
        // ステージが存在しない場合
        return;
      }
      stg = stg.child;
    }

    if (typeof stg == "undefined") {
      return;
    }


    let $SP = rpg.$SP;
    let $UP = rpg.$UP;
    let clrCnt = $UP.stgDat.clrCnt;
    // クリアできていないステージ
    if (clrCnt < y) {
      rpg.Dialog.alrt({
        ttl: "まだこのステージを受けられません"
       ,txt: `現在のクリア数:${clrCnt}`
      });
      return;
    }

    let $this = this;
    let ttl = stg.name;
    let txt = stg.txt;
    let btn = rpg.Dialog.BTN_YES | rpg.Dialog.BTN_NO
    rpg.Dialog.alrt({
      ttl
     ,txt
     ,btn
     ,callback: function(res) {
       let $UP = rpg.$UP;
       $SP.sm.accptEvnt = true
       console.log(res);

       // YESのステージ選択終了
       if (res == 1) {
         $UP.stgDat.selStg = stg;
         $this.prm.evntEnd.apply($this, [$this.prm.state]);
       }
     }
    });

    this.tmFire = $UP.tm.phase.update.sum;
    $SP.sm.accptEvnt = false;
    this.clkStg = stg;

    this.needRender = true;

  }
}
