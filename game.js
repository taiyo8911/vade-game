// キャンバス
var canvas, g;

// 自キャラの位置座標、画像、当たり判定の円の半径
var characterPositionX, characterPositionY, characterImage, characterR;

// 自キャラジャンプ時のスピードと重力
var speed = 0, acceleration = 0;

// 障害物の位置座標、画像、移動速度、当たり判定の円の半径
var enemyPositionX, enemyPositionY, enemyImage, enemySpeed, enemyR;

// スコア表示用
var score;

// シーン
var scene;

// シーンの定義
const Scenes = {
  GameMain: "GameMain",
  GameOver: "GameOver",
}


// 読み込みの1秒後にゲームを開始する
onload = function () {
  // 描画コンテキストの取得
  canvas = document.getElementById("game_canvas");
  g = canvas.getContext("2d");
  // 初期化
  init();
  // 入力処理の指定
  document.onkeydown = keydown;

  // 1秒後にゲームループ開始
  // 16ミリ秒に1回（1秒で60回）gameLoopを実行する
  setTimeout("setInterval('gameLoop()', 16)", 1000);
};


// ゲームループ（更新処理と描画処理を繰り返す）
function gameLoop() {
  update();
  draw();
}


// ゲーム開始時の初期化
function init() {
  // 自キャラ（もも）の設定
  characterImage = new Image();
  characterImage.src = "./images/momo.png";
  characterPositionX = 100; // X座標を指定
  characterPositionY = 400; // Y座標を指定
  characterR = 16; // 当たり判定用の円の半径を指定


  // 敵（包丁）の設定
  enemyImage = new Image();
  enemyImage.src = "./images/hocho.png";
  enemyPositionX = canvas.width + 120; // X座標を指定。右から左に移動なので初期値は右の画面外
  enemyPositionY = 400; // Y座標を指定
  enemyR = 16; // 当たり判定用の円の半径を指定
  enemySpeed = 5; // 毎フレーム5ドット動く

  // スコアの初期化
  score = 0;

  // シーンの初期化
  scene = Scenes.GameMain;
}


// キーボード入力があった時の処理
function keydown(e) {
  // ジャンプ処理（Y座標が初期位置場合のみ）（ジャンプしていたらそれ以上ジャンプさせない）
  if (characterPositionY == 400) {
    speed = -20; // Y軸方向の1フレーム当たりの移動距離
    acceleration = 1.5; // 重力
  }
}


// 状態の更新処理（キャラクターの移動と当たり判定）
function update() {
  // シーンがゲームプレイの場合
  if (scene == Scenes.GameMain) {
    // ジャンプ（スピードを徐々に減らして落下を表現する）
    speed = speed + acceleration; // スピードを更新
    characterPositionY = characterPositionY + speed;

    // ジャンプの停止処理（キャラクターが初期位置より下にきたら初期位置にすることでジャンプの停止を表現）
    if (characterPositionY > 400) {
      characterPositionY = 400;
      speed = 0;
      acceleration = 0;
    }

    // 障害物の移動
    enemyPositionX -= enemySpeed;
    // 障害物が左端までいったら元の位置に戻して再度障害物を出現させる
    if (enemyPositionX < -100) {
      enemyPositionX = canvas.width + 120;
      score += 100; // スコアを加算
    }

    // 当たり判定（自キャラの円と障害物の円の重なりが発生するか判定する）
    // X軸方向の距離とY軸方向の距離を計算
    var diffX = characterPositionX - enemyPositionX;
    var diffY = characterPositionY - enemyPositionY;

    // 2つの円の半径を足した長さより、2点間の距離が短ければ接触していると考える
    var distance = Math.sqrt(diffX * diffX + diffY * diffY);
    if (distance < characterR + enemyR) {
      // 当たったときの処理
      scene = Scenes.GameOver;
      enemySpeed = 0; // 敵（障害物）を停止
    }
    // ゲームオーバー中
  } else if (scene == Scenes.GameOver) {
    // 障害物の状態更新
    enemyPositionX += enemySpeed;
    // リトライボタンを表示
    var retryButton = document.getElementById("retry_button");
    retryButton.style.display = "block";
  }
}


// 描画処理
function draw() {
  // ゲームプレイ中
  if (scene == Scenes.GameMain) {
    // 背景の描画
    g.fillStyle = "rgb(0, 0, 0)";
    g.fillRect(0, 0, canvas.width, canvas.height); // x始点, y始点, x幅, y幅

    // キャラクター描画
    g.drawImage(
      characterImage, // 画像を指定
      characterPositionX - characterImage.width / 2, // 描画の始点を指定
      characterPositionY - characterImage.height / 2 // 描画の始点を指定
    );

    // 障害物描画
    g.drawImage(
      enemyImage, // 画像を指定
      enemyPositionX - enemyImage.width / 2, // 描画の始点を指定
      enemyPositionY - enemyImage.height / 2 // 描画の始点を指定
    );

    // スコア描画
    g.fillStyle = "rgb(255, 255, 255)"; // 文字色の設定
    g.font = "16px Arial"; // フォントの設定
    var scoreLabel = "SCORE：" + score; // 描画文字の設定
    var scoreLabelWidth = g.measureText(scoreLabel).width; // 表示幅を取得
    g.fillText(scoreLabel, canvas.width - 20 - scoreLabelWidth, 40); // 表示位置を指定（右端になるように）

    // ゲームオーバー時の処理
  } else if (scene == Scenes.GameOver) {
    // 背景の描画
    g.fillStyle = "rgb(0, 0, 0)";
    g.fillRect(0, 0, canvas.width, canvas.height);

    // キャラクター描画
    g.drawImage(
      characterImage, // 画像を指定
      characterPositionX - characterImage.width / 2, // 描画の始点を指定
      characterPositionY - characterImage.height / 2 // 描画の始点を指定
    );

    // 障害物描画
    g.drawImage(
      enemyImage, // 画像を指定
      enemyPositionX - enemyImage.width / 2, // 描画の始点を指定
      enemyPositionY - enemyImage.height / 2 // 描画の始点を指定
    );

    // 「スコア」描画
    g.fillStyle = "rgb(255, 255, 255)"; // 文字色の設定
    g.font = "16px Arial"; // フォントの設定
    var scoreLabel = "SCORE：" + score; // 描画文字の設定
    var scoreLabelWidth = g.measureText(scoreLabel).width; // 表示幅を取得
    g.fillText(scoreLabel, canvas.width - 20 - scoreLabelWidth, 40); // 表示位置を指定（右端になるように）

    // 「ゲームオーバー文字」描画
    g.fillStyle = "rgb(255,0, 0)"; // 文字色の設定
    g.font = "48px Arial"; // フォントの設定
    var text = "GAME OVER"; // 描画文字の設定
    var textWidth = g.measureText(text).width; // 表示幅を取得
    g.fillText(text, (canvas.width - textWidth) / 2, canvas.height / 2); // 表示位置を指定（上下中央になるように）
  }
}
