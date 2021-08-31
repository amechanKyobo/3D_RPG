"use starict"

/**
 * 描画に関するユーティリティーファイルです
 */

rpg.utl = {
  /**
   * 角が凹んでいる短形パス作成
   * @param {object} cntxt - 対象のコンテキスト
   * @param {number} x - x座標
   * @param {number} y - y座標
   * @param {number} w - w座標
   * @param {number} h - h座標
   * @param {number} c - 凹の幅
   */
    dntRct: function(cntxt, x, y, w, h, c, opt) {
      cntxt.beginPath();
      cntxt.moveTo(x + c, y);
      cntxt.lineTo(x + c, y + c);
      cntxt.lineTo(x, y + c);

      cntxt.lineTo(x, y + h - c);
      cntxt.lineTo(x + c, y + h - c);
      cntxt.lineTo(x + c, y + h);

      cntxt.lineTo(x + w - c, y + h);
      cntxt.lineTo(x + w - c, y + h - c);
      cntxt.lineTo(x + w, y + h - c);

      cntxt.lineTo(x + w, y + c);
      cntxt.lineTo(x + w - c, y + c);
      cntxt.lineTo(x + w - c, y);
      cntxt.closePath();
    }

    // ボタン描画設定
   ,vw_btnBdyCol:   ["BLUE", "RED", "GREEN"]            // 待機 クリック　無効
   ,vw_btnBblhghLght: ["PURPLE", "PURPLE", "PURPLE"]    // ベベル　ハイライト
   ,vw_btnBblShdw:    ["GLAY", "GLAY", "GLAY"]          // ベベル　シャドウ
   ,vw_btnFlmCol:   ["#ffffff", "#ffffff", "#ffffff"]   // 枠
   ,vw_btnTxtCol:   ["#ffffff", "#ffffff", "#ffffff"]   // テキスト


   // ボード描画設定
   ,vw_brdBdyCol:     "#242424"
   ,vw_brdBblShdw:    "#696969"
   ,vw_brdBblHghLght: "WHITE"
   ,vw_brdFrmCol:     "#f5f5f5"

   // ボード ボタン
   ,vw_brdBtnbdyCol:      ["#f5f5f5", "#666666", "#666666"]
   ,vw_brdBtnBblHghLght:  ["WHITE",   "#b3b3b3", "#b3b3b3"]
   ,vw_brdBtnBblShdw:     ["#696969", "#4d4d4d", "#4d4d4d"]

   // ボード スクロール
   ,vw_brdScrBsCol:       "#330000"
   ,vw_brdScrBarBdyCol:   "#f5f5f5"
   ,vw_brdScrBarBblShdw:  "#696969"

   ,vw_contourCol: "BLACK"    // 輪郭

   // フォント　テンプレート
   ,fnt_tmplt: "'ＭＳ Ｐゴシック', 'Lucida Grande', sans-serif"

   // 表示サイズ
   ,vw_fntSzBs: 32            // フォントサイズ
   ,vw_fntBsMddl: "32px ''"   // フォントサイズ　中
   ,vw_fntMonoMddl: ""        // フォントサイズ　中　等幅
   ,vw_grdSzBs:   64          // グリッドサイズ基準
   ,vw_mrgnSzBs:  8           // マージンサイズ基準
   ,vw_btnSzBs:   58          // ボタンサイズ基準
   ,vw_lnH: 1.4               // 行の高さ

   // 表示部品の初期化
   ,initVwPrts: function() {
     let $SP = rpg.$SP;
     let cnvsMin = Math.min($SP.cnvsW, $SP.cnvsH);

     this.vw_fntSzBs    = I(cnvsMin / 20);
     this.vw_grdSzBs    = this.vw_fntSzBs * 2;
     this.vw_mrgnSzBs   = I(this.vw_fntSzBs / 4);
     this.vw_btnSzBs    = this.vw_grdSzBs - this.vw_mrgnSzBs;

     // フォントサイズ初期化
     this.vw_fntBsMddl  = this.vw_fntSzBs + "px " + this.fnt_tmplt;
   }


   /**
    * ボタンのベースを描画します
    */
   ,drwBtnBs: function(cntxt, x, y, w, h, b, stat) {
     // 描画の設定の保存
     cntxt.save();

     // 本体描画
     cntxt.fillStyle = this.vw_btnBdyCol[stat];
     cntxt.fillRect(x, y, w, h);

     // ハイライト
     cntxt.fillStyle = this.vw_btnBblhghLght[stat];
     cntxt.fillRect(x, y, w, b);
     cntxt.fillRect(x, y, b, h - b);

     // シャドウ
     cntxt.fillStyle = this.vw_btnBblShdw[stat];
     cntxt.fillRect(x, y + h - b, w, b);
     cntxt.fillRect(x + w - b, y + b, b, h - b);

     cntxt.restore();
   }

   /**
    * ボタンを描画します
    * @param {object} prm - 描画設定
    */
   ,drwBtn: function(prm) {
     this.drwBtnBs(prm.cntxt, prm.x, prm.y, prm.w, prm.h, prm.b, prm.stat);
     console.log(prm.h);

     prm.cntxt.strokeStyle = "red"
     prm.cntxt.strokeRect(prm.x, prm.y, prm.w, prm.h);

     let x = prm.x + prm.w / 2;
     let y = prm.y + prm.h / 2;
     rpg.utl.drwStr(prm.cntxt, prm.str, x, y, {
       font: this.vw_fntBsMddl
      ,wMax: prm.w * 0.8
      ,fillStyle: this.vw_btnTxtCol[prm.stat]
    });
   }

   /**
   * ボードのフレーム描画します
   *
   * cntxt  コンテキスト
   * x      x座標
   * y      y座標
   * w      横幅
   * h      縦幅
   * d      凹の幅
   * c      輪郭の幅
   * b      ベベルの幅
   */
   ,drwBrdFrm: function(cntxt, x, y, w, h, d, c, b) {
     cntxt.save();

     // 枠の描画
     cntxt.globalCompositeOperation = "destination-over";
     cntxt.fillStyle = this.vw_brdFrmCol;
     this.dntRct(cntxt, x, y, w, h, d);
     cntxt.fill();

     // ハイライト
     cntxt.globalCompositeOperation = "source-over";
     cntxt.fillStyle = this.vw_brdBblHghLght;
     cntxt.fillRect(x + d, y, w - d * 2, b);
     cntxt.fillRect(x, y + d, b, h - d * 2);

     // シャドウ
     cntxt.fillStyle = this.vw_brdBblShdw;
     cntxt.fillRect(x + d, y + h - b, w - d * 2, b);
     cntxt.fillRect(x + w - b, y + d, b, h - d * 2);

     // 輪郭
     cntxt.globalCompositeOperation = "destination-over";
     cntxt.fillStyle = this.vw_contourCol;
     this.dntRct(cntxt, x - c, y - c, w + c * 2, h + c * 2, c);
     cntxt.fill();

     // 描画の設定の復帰
     cntxt.restore();
   }

   /**
    * ボードのベースを描画します
    */
   ,drwBrdBs: function(cntxt, x, y, w, h) {
     cntxt.save();

     cntxt.fillStyle = this.vw_brdBdyCol;
     cntxt.fillRect(x, y, w, h);
     cntxt.restore();
   }

   /**
    * ボードで使用するボタンを描画します
    * @param {object} prm - フレームを描画の設定
    * prm.img     表示する画像ID
    * prm.stat    ボタンのステイト
    */
    ,drwBrdBtn: function(prm) {
      let cntxt = prm.cntxt;
      cntxt.save();

      let x = prm.x;
      let y = prm.y;
      let w = prm.w;
      let h = prm.h;
      let d = prm.d;
      let b = prm.b;
      let stat = prm.stat || 0;

      // 本体
      cntxt.globalCompositeOperation = "source-atop";
      cntxt.fillStyle = this.vw_brdBtnbdyCol[stat];
      this.dntRct(cntxt, x, y, w, h, d);
      cntxt.fill();

      // ハイライト
      cntxt.fillStyle = this.vw_brdBtnBblHghLght[stat];
      cntxt.fillRect(x + d, y, w - d * 2, b);
      cntxt.fillRect(x, y + d, b, h - d * 2);

      // シャドウ
      cntxt.fillStyle = this.vw_brdBtnBblShdw[stat];
      cntxt.fillRect(x + d, y + h - b, w - d * 2, b);
      cntxt.fillRect(x + w - b, y + d, b, h - d * 2);


      // 描画の設定の復帰
      cntxt.restore();
    }

    /**
     * ボードで使用するボタンの連結部分を描画します
     */
    ,drwBrdBtnBrc: function(cntxt, x, y, w, h, b) {
      cntxt.save();

      cntxt.globalCompositeOperation = "source-atop";
      cntxt.fillStyle = this.vw_brdBtnbdyCol[0];
      cntxt.fillRect(x, y, w, h);

      cntxt.fillStyle = this.vw_brdBtnBblShdw[0];
      cntxt.fillRect(x + w - b, y, b, h);

      cntxt.restore();
    }

    /**
     * スクロールバーの描画
     *
     * cntxt    対象のコンテキスト
     * x        ベース X座標
     * y        ベース Y座標
     * w        ベース 横幅
     * h        ベース 縦幅
     * sx       スクロールバー X座標
     * sy       スクロールバー Y
     * sw       スクロールバー 横幅
     * sh       スクロールバー 縦幅
     */
    ,drwScrBar: function(cntxt, x, y, w, h, sx, sy, sw, sh, b) {
      cntxt.save();

      // ベース
      cntxt.fillStyle = this.vw_brdScrBsCol;
      cntxt.fillRect(x, y, w, h);

      // スクロールバー
      cntxt.fillStyle = this.vw_brdScrBarBdyCol;
      cntxt.fillRect(sx, sy, sw, sh);

      // シャドウ
      cntxt.fillStyle = this.vw_brdScrBarBblShdw;
      cntxt.fillRect(sx + sw - b, sy , b, sh);
      cntxt.fillRect(sx, sy + sh - b, sw, b);

      cntxt.restore();
    }

    /**
     * 描画のクリア
     * @param {object} cntxt - 対象レイヤー
     * @param`{object} opt - クリア設定
     */
    ,clrCntxt: function(cntxt, opt) {
      let $SP = rpg.$SP;
      opt = cmb(true, {x: 0, y: 0, w: $SP.cnvsW, h: $SP.cnvsH}, opt);

      // レイヤー番号を指定している場合
      if (typeof cntxt == "number") cntxt = $SP.lyrs[cntxt].cntxt;

      cntxt.clearRect(opt.x, opt.y, opt.w, opt.h);
    }

    /**
     * 文字列の折り返し
     * @param {object} cntxt  - コンテキスト
     * @param {string} fnt    - フォント
     * @param {number} lnH    - 文字列縦幅
     * @param {string} str    - 文字列
     * @param {number} w      - 文字列の最大横幅
     */
     ,fldStr: function(cntxt, fnt, lnH, str, w) {
       var res = {strArr: [], h: 0};

			// エラー対策
			if (w <= 0) {return res;}
			if (fnt == null) {fnt = this.vw_fntBsMddl;}
			if (lnH == null) {lnH = this.vw_fntSzBs * this.vw_lnH;}

			// 変数の初期化
			var strLn = "";
			var reUnHead = /[、。　,\. \n]/;	// 行頭禁止文字
			var wSum = 0;
			var wMax = w;
			var txt = str.replace(/\r/g, "");
			cntxt.font = fnt;

			// 文字列の折り返し処理
			for (var i = 0; i < txt.length; i ++) {
				var c = txt.charAt(i);
				var wC = cntxt.measureText(c).width;

				if (wC + wSum > wMax) {
					var isLn = false;
					if (c.match(reUnHead)) {isLn = true;}

					if (wC > wMax && wSum == 0) {
						// 1文字目、1文字だけではみ出している場合
						// エラー対策
						strLn += c;
						res.strArr.push(strLn);
						strLn = ""; wSum = 0;
						continue;
					} else {
						if (! isLn) {
							// 通常時の処理
							res.strArr.push(strLn);
							i --; strLn = ""; wSum = 0;
							continue;
						}
					}
				}

				if (c == "\n") {
					res.strArr.push(strLn);
					strLn = ""; wSum = 0;
					continue;
				}

				strLn += c; wSum += wC;
			}
			if (strLn != "") {res.strArr.push(strLn);}

			res.h = res.strArr.length * lnH;	// 高さの計算
			console.log(res);

			// 戻り値を戻して終了
			return res;
     }

    /**
     * 文字列の描画
     * @param {object} cntxt  - 対象のコンテキスト
     * @param {string} str    - 描画右する文字列
     * @param {number} x      - 描画X位置
     * @param {number} y      - 描画Y位置
     * @param {object} opt    - 描画設定
     *
     * opt.font       - フォント
     * opt.textAlign  - X座標に対してどのように描画するか
     * opt.textBaseline - Y座標に対してどのように描画するか
     * opt.useFill    - 文字列を塗りつぶして描画するか
     * opt.fillStyle  - 塗りつぶしのカラー
     * opt.xMax       - 指定横幅
     * opt.useStroke  - 文字列の縁描画するか
     * opt.strokeStyle - 縁のカラー
     * opt.lineWidth  - 文字の幅
     */
    ,drwStr: function(cntxt, str, x, y, opt) {
       let $SP = rpg.$SP;
       let drwTxt;

       opt = cmb(true, {
           font:          this.vw_fntBsMddl
          ,textAlign:     "center"
          ,textBaseline:  "middle"
          ,useFill:       true
          ,fillStyle:     "#000000"
          ,xMax:          null
          ,useStroke:     false
          ,strokeStyle:   "#ffffff"
          ,lineWidth:     2
       }, opt);

       cntxt.save();

       cntxt.font = opt.font;
       cntxt.textAlign = opt.textAlign;
       cntxt.textBaseline = opt.textBaseline;
       cntxt.fillStyle = opt.fillStyle;

       // 描画方法を設定
       for (var i = 0; i < 2; i++) {
         if (i == 0) {
           if (! opt.useStroke) continue;

           // 枠描画の設定を初期化
           drwTxt = cntxt.strokeText;
           cntxt.strokeStyle = opt.strokeStyle;
           cntxt.lineWidth = opt.lineWidth;
           cntxt.lineJoin = "round";
         } else {
           if (! opt.useFill) continue;

           // 塗りつぶし
           drwTxt = cntxt.fillText;
         }
       }


       drwTxt.apply(cntxt, [str, x, y, opt.wMax]);

       cntxt.restore();
    }
};
