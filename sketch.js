// 設定走路精靈圖片的檔案路徑
const WALK_SPRITE_PATH = '1/Walk/walk/walk.png'; // 指定沒有按方向鍵時使用的圖片

// 設定停止精靈圖片的檔案路徑
const STOP_SPRITE_PATH = '1/stop/stop.png'; // 指定按下左右方向鍵時使用的圖片

// 設定走路精靈的影格數量
const WALK_FRAME_COUNT = 6; // 走路精靈共有六張水平排列的圖片

// 設定停止精靈的影格數量
const STOP_FRAME_COUNT = 5; // 停止精靈共有五張水平排列的圖片

// 設定走路精靈的原始寬度
const WALK_SPRITE_WIDTH = 209; // 走路精靈整張圖片的原始寬度

// 設定走路精靈的原始高度
const WALK_SPRITE_HEIGHT = 96; // 走路精靈整張圖片的原始高度

// 設定停止精靈的原始寬度
const STOP_SPRITE_WIDTH = 161; // 停止精靈整張圖片的原始寬度

// 設定停止精靈的原始高度
const STOP_SPRITE_HEIGHT = 96; // 停止精靈整張圖片的原始高度

// 設定角色移動速度
const MOVE_SPEED = 5; // 角色每次更新移動五個像素

// 設定動畫影格切換時間
const FRAME_INTERVAL = 100; // 每隔一百毫秒切換一次動畫影格

// 宣告走路精靈圖片變數
let walkSprite; // 儲存走路精靈圖片

// 宣告停止精靈圖片變數
let stopSprite; // 儲存停止精靈圖片

// 宣告走路圖片載入成功狀態
let walkImageLoaded = false; // 記錄走路圖片是否載入完成

// 宣告停止圖片載入成功狀態
let stopImageLoaded = false; // 記錄停止圖片是否載入完成

// 宣告走路圖片載入失敗狀態
let walkImageFailed = false; // 記錄走路圖片是否載入失敗

// 宣告停止圖片載入失敗狀態
let stopImageFailed = false; // 記錄停止圖片是否載入失敗

// 宣告目前動畫影格
let currentFrame = 0; // 記錄目前顯示的影格編號

// 宣告上一次切換影格的時間
let lastFrameTime = 0; // 記錄上一次切換影格的時間

// 宣告角色水平中心位置
let characterCenterX = 0; // 儲存角色中心點的水平座標

// 宣告目前角色移動方向
let movementDirection = 0; // 1 代表向右，-1 代表向左，0 代表不移動

// 宣告角色目前面向方向
let facingDirection = 1; // 1 代表面向右方，-1 代表面向左方

// 預先載入所有圖片精靈
function preload() { // 在 setup() 執行前載入圖片

  walkSprite = loadImage( // 開始載入走路精靈
    WALK_SPRITE_PATH, // 指定走路精靈圖片路徑

    function () { // 走路精靈載入成功時執行
      walkImageLoaded = true; // 設定走路精靈載入完成
    }, // 結束走路精靈成功回呼函式

    function (error) { // 走路精靈載入失敗時執行
      walkImageFailed = true; // 設定走路精靈載入失敗
      console.error('走路精靈載入失敗：', error); // 在主控台顯示錯誤資訊
    } // 結束走路精靈失敗回呼函式
  ); // 結束走路精靈載入

  stopSprite = loadImage( // 開始載入停止精靈
    STOP_SPRITE_PATH, // 指定停止精靈圖片路徑

    function () { // 停止精靈載入成功時執行
      stopImageLoaded = true; // 設定停止精靈載入完成
    }, // 結束停止精靈成功回呼函式

    function (error) { // 停止精靈載入失敗時執行
      stopImageFailed = true; // 設定停止精靈載入失敗
      console.error('停止精靈載入失敗：', error); // 在主控台顯示錯誤資訊
    } // 結束停止精靈失敗回呼函式
  ); // 結束停止精靈載入
} // 結束 preload() 函式

// 設定 p5.js 初始環境
function setup() { // p5.js 只會執行一次的設定函式
  createCanvas(windowWidth, windowHeight); // 建立符合視窗大小的全螢幕畫布
  imageMode(CORNER); // 使用圖片左上角作為繪製基準
  frameRate(60); // 設定畫面更新率為每秒六十張
  textFont('sans-serif'); // 設定畫面文字使用無襯線字型
  characterCenterX = width * 2 / 3; // 將角色中心放在畫布寬度的三分之二位置
} // 結束 setup() 函式

// 持續繪製畫面
function draw() { // p5.js 會持續執行此函式
  background(135, 206, 235); // 使用天空藍色清除畫布背景

  if (walkImageFailed || stopImageFailed) { // 判斷是否有圖片載入失敗
    drawErrorMessage(); // 顯示圖片載入失敗訊息
    return; // 停止執行本次繪圖
  } // 結束圖片載入失敗判斷

  if (!walkImageLoaded || !stopImageLoaded) { // 判斷圖片是否尚未全部載入完成
    drawLoadingMessage(); // 顯示圖片載入中的訊息
    return; // 停止執行本次繪圖
  } // 結束圖片載入中判斷

  const controlState = getControlState(); // 取得目前鍵盤控制狀態

  movementDirection = controlState.direction; // 儲存角色目前移動方向

  if (movementDirection !== 0) { // 判斷角色是否正在移動
    facingDirection = movementDirection; // 讓角色面向目前移動方向
  } // 結束面向方向更新

  updateCharacterPosition(); // 更新角色的水平位置

  updateAnimation(controlState.usingStopSprite); // 更新目前圖片的動畫影格

  drawCharacter(controlState.usingStopSprite); // 繪製目前角色圖片
} // 結束 draw() 函式

// 取得鍵盤控制狀態
function getControlState() { // 建立鍵盤控制判斷函式
  const leftPressed = keyIsDown(LEFT_ARROW); // 判斷左方向鍵是否被按住
  const rightPressed = keyIsDown(RIGHT_ARROW); // 判斷右方向鍵是否被按住
  const bothPressed = leftPressed && rightPressed; // 判斷左右方向鍵是否同時被按住
  const usingStopSprite = leftPressed || rightPressed; // 按下任一方向鍵時使用停止精靈
  let direction = 0; // 預設角色不移動

  if (bothPressed) { // 判斷左右方向鍵是否同時按下
    direction = 0; // 同時按下時停止水平移動
  } else if (rightPressed) { // 判斷是否只有右方向鍵被按下
    direction = 1; // 設定角色向右移動
  } else if (leftPressed) { // 判斷是否只有左方向鍵被按下
    direction = -1; // 設定角色向左移動
  } // 結束方向判斷

  return { direction, usingStopSprite }; // 回傳目前控制狀態
} // 結束 getControlState() 函式

// 更新角色水平位置
function updateCharacterPosition() { // 建立角色位置更新函式
  const activeSprite = movementDirection === 0 ? walkSprite : stopSprite; // 依角色狀態選擇精靈
  const activeFrameCount = movementDirection === 0 ? WALK_FRAME_COUNT : STOP_FRAME_COUNT; // 取得目前精靈影格數
  const sourceWidth = activeSprite.width / activeFrameCount; // 計算目前單格影格的原始寬度
  const sourceHeight = activeSprite.height; // 取得目前精靈的原始高度
  const characterHeight = height / 3; // 將角色高度設定為畫布高度的三分之一
  const characterWidth = characterHeight * sourceWidth / sourceHeight; // 依原始比例計算角色寬度
  const halfCharacterWidth = characterWidth / 2; // 計算角色寬度的一半
  const minimumCenterX = halfCharacterWidth; // 設定角色中心的最小水平座標
  const maximumCenterX = width - halfCharacterWidth; // 設定角色中心的最大水平座標

  characterCenterX += movementDirection * MOVE_SPEED; // 依移動方向更新角色中心位置

  characterCenterX = constrain( // 將角色中心限制在畫布範圍內
    characterCenterX, // 傳入角色目前中心位置
    minimumCenterX, // 設定角色中心最小值
    maximumCenterX // 設定角色中心最大值
  ); // 結束 constrain() 計算
} // 結束 updateCharacterPosition() 函式

// 更新動畫影格
function updateAnimation(usingStopSprite) { // 建立動畫更新函式
  const currentTime = millis(); // 取得程式開始後經過的毫秒數
  const frameCount = usingStopSprite ? STOP_FRAME_COUNT : WALK_FRAME_COUNT; // 取得目前精靈的影格數量

  if (currentTime - lastFrameTime >= FRAME_INTERVAL) { // 判斷是否達到影格切換時間
    currentFrame = (currentFrame + 1) % frameCount; // 切換至下一張影格並循環播放
    lastFrameTime = currentTime; // 記錄最新的影格切換時間
  } // 結束影格切換判斷

  if (currentFrame >= frameCount) { // 判斷目前影格是否超出範圍
    currentFrame = 0; // 將影格重設為第一張
  } // 結束影格範圍判斷
} // 結束 updateAnimation() 函式

// 繪製角色
function drawCharacter(usingStopSprite) { // 建立角色繪製函式
  const activeSprite = usingStopSprite ? stopSprite : walkSprite; // 依控制狀態選擇目前精靈
  const frameCount = usingStopSprite ? STOP_FRAME_COUNT : WALK_FRAME_COUNT; // 取得目前精靈的影格數量
  const sourceWidth = activeSprite.width / frameCount; // 計算目前單格影格的原始寬度
  const sourceHeight = activeSprite.height; // 取得目前精靈的原始高度
  const characterHeight = height / 3; // 將角色顯示高度設定為畫布高度的三分之一
  const characterWidth = characterHeight * sourceWidth / sourceHeight; // 依比例計算角色顯示寬度
  const characterX = characterCenterX - characterWidth / 2; // 計算角色左上角的水平座標
  const characterY = height - characterHeight; // 計算角色左上角的垂直座標
  const sourceX = currentFrame * sourceWidth; // 計算目前影格的裁切水平起點
  const sourceY = 0; // 設定圖片裁切垂直起點為零

  push(); // 儲存目前畫布的繪圖狀態

  if (facingDirection === -1) { // 判斷角色是否面向左方
    translate(characterCenterX, 0); // 將座標原點移動至角色中心
    scale(-1, 1); // 將畫布水平翻轉

    image( // 使用九參數 image() 繪製翻轉後的角色
      activeSprite, // 指定目前使用的圖片精靈
      -characterWidth / 2, // 設定翻轉後角色左上角的水平位置
      characterY, // 設定角色左上角的垂直位置
      characterWidth, // 設定角色顯示寬度
      characterHeight, // 設定角色顯示高度
      sourceX, // 指定圖片來源裁切水平起點
      sourceY, // 指定圖片來源裁切垂直起點
      sourceWidth, // 指定圖片來源裁切寬度
      sourceHeight // 指定圖片來源裁切高度
    ); // 結束翻轉角色繪製
  } else { // 當角色面向右方時執行
    image( // 使用九參數 image() 繪製一般方向角色
      activeSprite, // 指定目前使用的圖片精靈
      characterX, // 設定角色左上角的水平位置
      characterY, // 設定角色左上角的垂直位置
      characterWidth, // 設定角色顯示寬度
      characterHeight, // 設定角色顯示高度
      sourceX, // 指定圖片來源裁切水平起點
      sourceY, // 指定圖片來源裁切垂直起點
      sourceWidth, // 指定圖片來源裁切寬度
      sourceHeight // 指定圖片來源裁切高度
    ); // 結束一般角色繪製
  } // 結束角色方向判斷

  pop(); // 還原原本的繪圖狀態
} // 結束 drawCharacter() 函式

// 顯示圖片載入中的訊息
function drawLoadingMessage() { // 建立圖片載入中提示函式
  fill(255); // 設定文字顏色為白色
  noStroke(); // 移除文字外框
  textAlign(CENTER, CENTER); // 設定文字水平與垂直置中
  textSize(24); // 設定載入文字大小
  text('圖片載入中...', width / 2, height / 2); // 在畫布中央顯示載入訊息
} // 結束 drawLoadingMessage() 函式

// 顯示圖片載入失敗的訊息
function drawErrorMessage() { // 建立圖片載入失敗提示函式
  fill(255); // 設定錯誤訊息文字顏色為白色
  noStroke(); // 移除錯誤文字外框
  textAlign(CENTER, CENTER); // 設定文字水平與垂直置中
  textSize(24); // 設定錯誤標題文字大小
  text('圖片載入失敗', width / 2, height / 2 - 110); // 顯示圖片載入失敗標題
  textSize(15); // 設定圖片路徑文字大小
  text(WALK_SPRITE_PATH, width / 2, height / 2 - 65); // 顯示走路精靈圖片路徑
  text(STOP_SPRITE_PATH, width / 2, height / 2 - 35); // 顯示停止精靈圖片路徑
  textSize(14); // 設定排錯提示文字大小
  text('請確認資料夾、檔案名稱與副檔名大小寫完全一致', width / 2, height / 2 + 10); // 顯示檔案名稱檢查提示
  text('請使用 Live Server 或其他本機伺服器開啟網頁', width / 2, height / 2 + 40); // 顯示本機伺服器使用提示
} // 結束 drawErrorMessage() 函式

// 當瀏覽器視窗尺寸改變時重新調整畫布
function windowResized() { // 建立視窗尺寸變更處理函式
  resizeCanvas(windowWidth, windowHeight); // 將畫布調整為最新視窗大小
  characterCenterX = constrain(characterCenterX, 0, width); // 將角色中心限制在新畫布範圍內
} // 結束 windowResized() 函式