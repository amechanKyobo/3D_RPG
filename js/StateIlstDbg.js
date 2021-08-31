"use static"

/**
 * 現在、イラストの制作用に画像をドロップするだけで描画できるようにしています。
 *
 */

my.StateIlstDbg = class extends rpg.State {
  constructor(opt) {
    super({
       name: "StateIlstDbg"
     });
  }

  enter() {
    let $SP = rpg.$SP;
    let cntxt = $SP.lyrs[my.lyr.bg].cntxt;

    let img = new Image();
    let center = -50

    img.onload = function() {
      cntxt.save();
      cntxt.drawImage(img, $SP.winW -512 + center, $SP.winH - 256);

      cntxt.scale(-1,1);
      cntxt.translate(0 + center, $SP.winH - 256);
      cntxt.drawImage(img, -512, 0);

      cntxt.restore();
      cntxt.fillStyle = "rgba(237, 207, 229, 0.5)";
      cntxt.fillRect(-center, $SP.winH - 256, $SP.winW + center * 2, 256);

      cntxt.fillStyle = "rgba(252, 252, 212, 0.5)";
      cntxt.fillRect(-center, $SP.winH - 256, 1024, 256);

      cntxt.fillStyle = "BLACK";
      cntxt.font = "30px serif";
      cntxt.textAlign = "center";
      cntxt.textBaseline = "middle";
      cntxt.fillText("Main Hand", -center + 1024 / 2, $SP.winH -(256 / 2));
      cntxt.fillText("Sub Hand", -center + 1024 + 256 / 2, $SP.winH -(256 / 2));
    };

    img.src = "../img/______.210712.png";


    // var obj1 = document.createElement("input");
    var obj1 = document.getElementById("ilst");
    console.log(obj1);
    // obj1.type = "file";

    // document.body.appendChild(obj1);

    obj1.addEventListener("change", function(evt){
      var file = evt.target.files;
      var reader = new FileReader();

      //dataURL形式でファイルを読み込む
      reader.readAsDataURL(file[0]);

      //ファイルの読込が終了した時の処理
      reader.onload = function(){
        var dataUrl = reader.result;

        console.log(dataUrl);
        var img = new Image();

        img.onload = function() {
          cntxt.clearRect(0, 0, $SP.winW, $SP.winH);
          cntxt.save();
          cntxt.drawImage(img, $SP.winW -512 + center, $SP.winH - 256);

          cntxt.scale(-1,1);
          cntxt.translate(0 + center, $SP.winH - 256);
          cntxt.drawImage(img, -512, 0);

          cntxt.restore();
          cntxt.fillStyle = "rgba(237, 207, 229, 0.5)";
          cntxt.fillRect(-center, $SP.winH - 256, $SP.winW + center * 2, 256);

          cntxt.fillStyle = "rgba(252, 252, 212, 0.5)";
          cntxt.fillRect(-center, $SP.winH - 256, 1024, 256);

          cntxt.fillStyle = "BLACK";
          cntxt.font = "30px serif";
          cntxt.textAlign = "center";
          cntxt.textBaseline = "middle";
          cntxt.fillText("Main Hand", -center + 1024 / 2, $SP.winH -(256 / 2));
          cntxt.fillText("Sub Hand", -center + 1024 + 256 / 2, $SP.winH -(256 / 2));
        };

        img.src = dataUrl;
      }
    },false);
  }
}
