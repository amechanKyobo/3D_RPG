"use starict"

/**
 * WebGLを利用してワールドを描画します
 * 角度 位置 の視点移動も行います
 */

 my.ItemWorld = class extends rpg.Item {
   constructor(opt) {
     super(cmb(true, {
        typ: "world"
       ,needRender: true
       ,needUpdate: true

       ,accptMouEvnt: true
       ,accptKeyEvnt: true

       ,isPtrLck: false
       ,jmpOpt: {
          isJump: false
         ,radPerFrame: 2 * Math.PI /40
         ,tmFire: 0
         ,tmWait: 500
         ,height: 1.5
       }
     }, opt));

     // ポインター座標
     this.lstPtr = null;
     this.agl = {x: 0, y: 0, z: 0};

     // カメラの位置
     this.camPos = {x: 0, y: 0, z: 0};
     this.maxX = my.D.map_stg_cen;
     this.minX = -this.maxX + (my.D.map_stg_len % 2 == 0 ? 1 : 0);

     // webGLのセットアップ
     my.utlWebGL.initGl(this.trgt);

     if (DocumentIsSuppertedPointerLock(document)) {
       // this.isPtrLck = true;
       // this.pointerLock();
     } else {
       window.alert("pointerLock is not supperted in your browser :(");
       return;
     }


   }

   update() {
     if (this.jmpOpt.isJump) {
       this.jump();
     }
     // this.chckFall();
   }

   render() {
     super.render();

     // webGlクリアー
     my.utlWebGL.clearGl(this.trgt);

     // 視点移動
     let aglX = this.agl.y * Math.PI / 180;
     let aglY = this.agl.x * Math.PI / 180;

     // マップを描画
     let len = my.D.map_stg_len;
     let map = my.D.maps["チュートリアル"];
     let cen = my.D.map_stg_cen;
     for (var y = 0; y < len; y++) {
       for (var z = 0; z < len; z++) {
         for (var x = 0; x < len; x++) {
           if (map[y][z][x] == 0) continue;

           let pos = [x - cen, y, z - cen];
           let camPos = this.camPos;
           let agl = {x: aglX, y: aglY};
           let img = new Uint8Array([0, 0, 255, 255]);
           if ((x == 4 && z == 4 && y == 0) || (y == 1)) {
             img = new Uint8Array([0, 255, 0, 255])
           }
            my.utlWebGL.drwSquare(
              this.trgt,
                  pos,
              camPos,
              agl,
              img);
         }
       }
     }
   }

   evnt(e) {
     // マウスロックを有効に
     if (! this.isPtrLck && e.act == 0) {
       this.isPtrLck = true;
       this.pointerLock();
     }

     if (e.typ == "mou") {
       // マウス入力イベント
       // this.mouEvnt(e);
     } else if (e.typ == "key") {
       // キーボード入力イベント
       this.keyEvnt(e);
     }
   }

   keyEvnt(e) {
     // マウスアクションがdownではない場合
     if (e.act != 0) return;

     let xAmt = 0;
     let zAmt = 0;
     let agl = -this.agl.x * (Math.PI / 180);

     // キーイベント
     if (e.key == " ") {
       // ジャンプ
       if (this.jmpOpt.isJump) return;

       let $SP = rpg.$UP;
       let now = $SP.tm.phase.update.sum;
       this.jmpOpt.tmFire = now;
       this.jmpOpt.isJump = true;
       this.jmpOpt.vel = -10;
     } else
     if (e.key == "w") {
       xAmt += Math.sin(agl) * 0.3;
       zAmt += Math.cos(agl) * 0.3;
       // zAmt += 0.2;
     } else
     if (e.key == "a") {
       xAmt += 0.2;
     } else
     if (e.key == "s") {
       zAmt -= 0.2;
     } else
     if (e.key == "d") {
       xAmt -= 0.2;
     } else
     if (e.key == "t") {
       zAmt += 0.2;
       xAmt += 0.2;
     } else
     if (e.key == "y") {
       zAmt -= 0.2;
       xAmt -= 0.2
     }
     else {
       return;
     }

     // 当たり判定

     let map = my.D.maps["チュートリアル"];
     let len = my.D.map_stg_len;
     let cen = my.D.map_stg_cen;

     // NOTE: 1 is Max
     let COLLIDER_WIDTH = 0.6;

     let dx = ceil(this.camPos.x + xAmt);
     let dz = ceil(this.camPos.z + zAmt);
     let dy = I(this.camPos.y) + 1;
     console.log(dy);

     let d_x_1 = Math.round(this.camPos.x + xAmt + COLLIDER_WIDTH / 2);
     let d_z_1 = Math.round(this.camPos.z + zAmt + COLLIDER_WIDTH / 2);

     let d_x_2 = Math.round(this.camPos.x + xAmt - COLLIDER_WIDTH / 2);
     let d_z_2 = Math.round(this.camPos.z + zAmt - COLLIDER_WIDTH / 2);

     if (Math.sign(zAmt) == -1 && Math.sign(this.camPos.z) == 1
      || Math.sign(zAmt) == 1  && Math.sign(this.camPos.z) == -1) {
        dz = I(this.camPos.z);
     }

     if (map[dy][cen - dz][cen - d_x_1] != 0 || map[dy][cen - dz][cen - d_x_2] != 0) {
       zAmt = 0;
     }


     if (Math.sign(xAmt) == -1 && Math.sign(this.camPos.x) == 1
      || Math.sign(xAmt) == 1  && Math.sign(this.camPos.x) == -1) {
       dx = I(this.camPos.x);
     }

     if (map[dy][cen - d_z_1][cen - dx] != 0 || map[dy][cen - d_z_2][cen - dx] != 0) {
       xAmt = 0;
     }

     if (map[dy][cen - dz][cen - dx] != 0) {

     }

     this.camPos.x += xAmt;
     this.camPos.z += zAmt;

     this.needRender = true;
   }

   jump() {
     let $UP = rpg.$UP;
     let elps = $UP.tm.phase.update.sum;

     let jmpOpt = this.jmpOpt;
     let frames = (elps - jmpOpt.tmFire) / jmpOpt.tmWait * 20;
     this.camPos.y = jmpOpt.height * Math.sin(jmpOpt.radPerFrame * frames);
     this.needRender = true;

     if (this.camPos.y < 0) {
       this.camPos.y = 0;
       jmpOpt.isJump = false;
     }
   }

   pointerLock() {
     // エレメントをフルスクリーンに表示する関数
     function ElementRequestFullScreen (element) {
       let list = [
         "requestFUllScreen",
         "webkitRequestFullScreen",
         "mozRequestFullScreen",
         "msRequestFullScreen"
       ];
       let i;
       let num = list.length;
       for (i = 0; i < num; i++) {
         if (element[list[i]]) {
           element[list[i]]();
           return true;
         }
       }
       return false;
     }

     // エレメントからポインタロックを開始する関数
     function ElementRequestPointerLock (element) {
       let list = [
         "requestPointerLock",
         "webkitRequestPointerLock",
         "mozRequestPointerLock"
       ];
       let i;
       let num = list.length;
       for (i = 0; i < num; i++) {
         if (element[list[i]]) {
           element[list[i]]();
           return true;
         }
       }
       return false;
     }

     // ポインターから移動量を取得する関数
     function MouseEventGetMomentX (mouse_event) {
       return (mouse_event.movementX || mouse_event.webkitMovementX || mouse_event.mozMovementX || 0);
     }

     function MouseEventGetMomentY (mouse_event) {
       return (mouse_event.movementY || mouse_event.webkitMovementY || mouse_event.mozMovementY || 0);
     }

     let $SP = rpg.$SP;
     let element = $SP.lyrTap.cnvs;

     // マウスを移動するたびに実行されるイベント
     let $this = this;
     document.onmousemove = function(e) {
       if(! e) e = window.event;

       $this.agl.x += MouseEventGetMomentX(e);
       $this.agl.y += MouseEventGetMomentY(e);

       $this.needRender = true;
     };

     // ElementRequestFullScreen(element);
     ElementRequestPointerLock(element);
   }
 }
