"use static"

/**
 * webGLを扱うユーティリティーファイルです
 *
 */

 my.utlWebGL = {
   /**
    * WebGLの初期化
    */
    initGl: function(gl) {
      gl.enable(gl.CULL_FACE);
      gl.depthFunc(gl.LEQUAL);

      if (!gl) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it :(');
        return;
      }

      // 頂点シェーダープログラム
      const vsSource = `
      attribute vec4 aVertexPosition;
      attribute vec2 aTextureCoord;
      uniform mat4 uModelViewMatrix;
      uniform mat4 uProjectionMatrix;
      varying highp vec2 vTextureCoord;
      void main(void) {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vTextureCoord = aTextureCoord;
      }
      `;

      // フラグメントシェーダープログラム
      const fsSource = `
      varying highp vec2 vTextureCoord;
      uniform sampler2D uSampler;
      void main(void) {
        gl_FragColor = texture2D(uSampler, vTextureCoord);
      }
      `;

      // シェーダープログラムの作成
      const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

      // 保存して簡単に渡せるようにする
      this.programInfo = {
        program: shaderProgram,
        attribLocations: {
          vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
          textureCoord:    gl.getAttribLocation(shaderProgram, "aTextureCoord"),
        },
        uniformLocations: {
          projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
          modelViewMatrix:  gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
          uSampler: gl.getUniformLocation(shaderProgram, "uSampler"),
        },
      };

      // シェーダーの初期化
      function initShaderProgram(gl, vsSource, fsSource) {
        const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
        const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

        // シェーダープログラムの作成
        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        // シェーダープログラムの生成に失敗した場合
        if (! gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
          alert("Unable to initialize the shader program:" + gl.getProgramInfolog(shaderProgram));
          return null;
        }

        return shaderProgram;
      };

      // 指定されたシェーダーを作成し、ソースをアップロードしてコンパイルします
      function loadShader(gl, type, source) {
        const shader = gl.createShader(type);

        // シェーダーオブジェクトにソースを送信
        gl.shaderSource(shader, source);

        // シェーダープログラムをコンパイル
        gl.compileShader(shader);

        // 正常にコンパイルされているか確認
        if (! gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
          gl.deleteShader(shader);
          return null;
        }

        return shader;
      };

      this.textureCoordinates = [
        // 前面
        0.0,   0.0,
        1.0,   0.0,
        1.0,   1.0,
        0.0,   1.0,

        // 背面
        0.0,   0.0,
        1.0,   0.0,
        1.0,   1.0,
        0.0,   1.0,

        // 上面
        0.0,   0.0,
        1.0,   0.0,
        0.0,   1.0,
        0.0,   1.0,

        // 底面
        0.0,   0.0,
        1.0,   0.0,
        1.0,   1.0,
        0.0,   1.0,

        // 右面
        0.0,   0.0,
        1.0,   0.0,
        1.0,   1.0,
        0.0,   1.0,

        // 左面
        0.0,   0.0,
        1.0,   0.0,
        1.0,   1.0,
        0.0,   1.0,
      ];

      // インデックス
      this.indices = [
        0,   1,   2,       0,   2,   3,      // 前面
        4,   5,   6,       4,   6,   7,      // 背面
        8,   9,  10,       8,  10,  11,      // 上面
       12,  13,  14,      12,  14,  15,      // 底面
       16,  17,  18,      16,  18,  19,      // 右面
       20,  21,  22,      20,  22,  23,      // 左面
      ];
    }

   /**
   * WebGLをクリアします
   */
   ,clearGl: function(gl) {
     // WebGlの設定を初期化
     gl.clearColor(0.0, 0.0, 0.0, 1.0);
     gl.clearDepth(1.0);
     gl.enable(gl.DEPTH_TEST);     // en - Enable depth testing
     gl.depthFunc(gl.LEQUAL);      // en - Near things obscure far things

     // スタートする前にキャンバスをクリアします
     gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
   }

   /**
    * 立方体を描画します
    */
   ,drwSquare: function(gl, pos, camPos, agl, url) {
     // mat4の定義
     const mat4 = my.mat4;

     const buffers = initBuffers(gl, pos);

     const texture = loadTexture(gl, url);

     drawScene(gl, this.programInfo, buffers, texture, camPos, agl);


     function initBuffers(gl, pos) {
       // 正方形のバッファ生成
       const positionBuffer = gl.createBuffer();

       // バッファを操作を適応するものとしてpositionBufferを選択
       gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

       // 正方形の位置の配列
       let positions = [
         // 前面
         -0.5, -0.5,  0.5,
          0.5, -0.5,  0.5,
          0.5,  0.5,  0.5,
         -0.5,  0.5,  0.5,

         // 背面
         -0.5, -0.5, -0.5,
         -0.5,  0.5, -0.5,
          0.5,  0.5, -0.5,
          0.5, -0.5, -0.5,

         // 上面
         -0.5,  0.5, -0.5,
         -0.5,  0.5,  0.5,
          0.5,  0.5,  0.5,
          0.5,  0.5, -0.5,

         // 底面
         -0.5, -0.5, -0.5,
          0.5, -0.5, -0.5,
          0.5, -0.5,  0.5,
         -0.5, -0.5,  0.5,

         // 右面
          0.5, -0.5, -0.5,
          0.5,  0.5, -0.5,
          0.5,  0.5,  0.5,
          0.5, -0.5,  0.5,

         // 左面
         -0.5, -0.5, -0.5,
         -0.5, -0.5,  0.5,
         -0.5,  0.5,  0.5,
         -0.5,  0.5, -0.5,
       ];

       // ポジションの適応
       for (let i = 0; i < positions.length; i++) {
         if (i % 3 == 0) {
           // X
           positions[i] += pos[0];
         } else if (i % 3 == 1) {
           // Y
           positions[i] += pos[1];
         } else if (i % 3 == 2) {
           // Z
           positions[i] += pos[2];
         }
       }

       gl.bufferData(gl.ARRAY_BUFFER,
                     new Float32Array(positions),
                     gl.STATIC_DRAW);

       const textureCoordBuffer = gl.createBuffer();
       gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

       gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(my.utlWebGL.textureCoordinates),
                     gl.STATIC_DRAW);

       // インデックスを指定するbuffer
       const indexBuffer = gl.createBuffer();
       gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);


       gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(my.utlWebGL.indices), gl.STATIC_DRAW);

       return {
         position: positionBuffer,
         textureCoord: textureCoordBuffer,
         indices: indexBuffer,
       }
     };

    /**
     * テクスチャ初期化、読み込み
     * 読み込みが完了したら、画像をテクスチャにコピーします
     */
     function loadTexture(gl, url) {
       const texture = gl.createTexture();
       gl.bindTexture(gl.TEXTURE_2D, texture);

       // 画像はインターネット経由でダウンロードする必要があるため時間がかかります
       // それまでは、代用のピクセルを配置します
       // 画像のダウンロード完了次第、画像を更新します
       const level = 0;
       const internalFormat = gl.RGBA;
       const width = 1;
       const height = 1;
       const border = 0;
       const srcFormat = gl.RGBA;
       const srcType = gl.UNSIGNED_BYTE;
       // const pixel = new Uint8Array([0, 0, 255, 255]);
       const pixel = url;
       gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                     width, height, border, srcFormat, srcType, pixel);

       // const image = new Image();
       // image.onload = function() {
       //   gl.bindTexture(gl.TEXTURE_2D, texture);
       //   gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
       //                 srcFormat, srcType, image);
       //
       //   if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
       //     // 両方の長さが２の累乗である場合
       //     // ミニマップを生成
       //     gl.generateMipmap(gl.TEXTURE_2D);
       //   } else {
       //     // 両辺の差が２の累乗でない場合
       //
       //     // S座標のラッピングを禁止
       //     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
       //     // T座標のラッピングを禁止
       //     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
       //     // gl.LINEARの代わりに gl.NEARESTも許可　　ミニマップは不可
       //     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
       //   }
       // };
       // image.src = url;

       return texture;
     }

     /**
     * 受け取った値が２の累乗であるかを返します
     */
     function isPowerOf2(value) {
       return (value & (value - 1)) == 0;
     }

    /**
     * シーンをレンダリングします
     */
    function drawScene(gl, programInfo, buffers, texture, camPos, agl) {
      // カメラは遠近法の歪みをシュミレートするために使用されています
      // 視野は45度
      // 高さを基準とするアスペクト比
      // 0.1単位の間でオブジェクトを見る
      // カメラから100単位離れている
      const fieldOfView = 80 * Math.PI / 180;
      const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
      const zNear = 0.1;
      const zFar = 100.0;
      const projectionMatrix = mat4.create();

      // 結果を受け取る宛先
      mat4.perspective(projectionMatrix,
                       fieldOfView,
                       aspect,
                       zNear,
                       zFar);

      const modelViewMatrix = mat4.create();

      // rotateの変更
      // X軸の視点移動
      mat4.rotate(modelViewMatrix,
                  modelViewMatrix,
                  agl.x,         // ラジアンで回転する量
                  [1, 0, 0]);           // 回転する軸

      // Y軸の視点移動
      mat4.rotate(modelViewMatrix,
                 modelViewMatrix,
                 agl.y,
                 [0, 1, 0]);

      // 描画位置の変更
      // オブジェクトの初期位置
      mat4.translate(modelViewMatrix,       // 宛先のマトリックス
                     modelViewMatrix,       // 変更するマトリックス
                     [camPos.x, - camPos.y - 2.0, camPos.z]);    // 移動量

      // mat4.rotate(modelViewMatrix,
      //             modelViewMatrix,
      //             cubeRotation * .7,
      //             [0, 1, 0]);

      // positionからWebGLにpositionを引き出すように指示
      // vertexPosition属性にバッファリングします
      {
        const numComponents = 3;    // 反復ごとに２つの値を引き出す
        const type = gl.FLOAT;      // バッファ内のでデータは32ビット
        const normalize = false;    // 正規化しないでください
        const stride = 0;           // 次のセットに取得するバイト数  0=上記のtypeとnumCompunentsを使用
        const offset = 0;           // バッファ内の何バイトから開始するか
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(
            programInfo.attribLocations.vertexPosition);
      }

      // colorBufferからカラーを引き出すように指示
      // 頂点カラー属性に
      {
        const numComponents = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
        gl.vertexAttribPointer(
          programInfo.attribLocations.textureCoord,
          numComponents,
          type,
          normalize,
          stride,
          offset);
        gl.enableVertexAttribArray(
            programInfo.attribLocations.textureCoord);
      }

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

      // 描画時にprogramを使用するように指定
      gl.useProgram(programInfo.program);

      // シェーダーユニフォームの設定
      gl.uniformMatrix4fv(
          programInfo.uniformLocations.projectionMatrix,
          false,
          projectionMatrix);

      gl.uniformMatrix4fv(
          programInfo.uniformLocations.modelViewMatrix,
          false,
          modelViewMatrix
      );

      // texture unit 0 に影響を与える
      gl.activeTexture(gl.TEXTURE0);

      // TEXTURE_2Dテクスチャユニットの0バインドポイントにバインドすることを呼び出し
      gl.bindTexture(gl.TEXTURE_2D, texture);

      // テクスチャをテクスチャユニット0にバインドしたことをシェーダーに伝える
      gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

      {
        const vertexCount = 36;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
      }
    }
  }
};
