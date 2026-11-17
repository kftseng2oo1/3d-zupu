# 龍山派 曾氏族譜・3D 祠堂

three.js 打造的立體世系祠堂（單檔 PWA）。網址：https://kftseng2oo1.github.io/3d-zupu/

- 神位牌直書（名諱放大），背面生平、照片、字號；在世家人以宣紙卡呈現
- 「三省堂」匾額與楹聯、家族沿革碑、每世字輩牌、靈骨塔位側殿
- 忌日（含農曆）當天牌位發光；上香、語音口述、祭祀紀錄
- 開場卷軸、逐世導覽、存圖海報
- 除夕祭祖（底列「除夕」或祭祀面板）：家中神明廳——觀音彩繪、祖宗長佑子孫賢／佛力永扶家門盛、歷代祖考妣神位、佛龕觀音、鹽燈、蝴蝶蘭；下桌擺鮮花、素果三盤、糖果五盤、飲料、三牲、發粿插春。流程：擺供品 → 鐘鼓齊鳴上供祈福 → 上香三拜 → 祈福圓滿（記入祭祀紀錄・歷代祖先）；除夕當天開啟時會出現提示

## 資料來源

與族譜紀念堂（https://kftseng2oo1.github.io/zupu/）同網域，會自動讀取紀念堂存在瀏覽器的資料（localStorage `ancestorApp_v28`）：
祖先名冊、神位文字、生卒忌日、生平、照片、配偶、塔位、家族沿革。內建資料寫在 `index.html` 的 `PEOPLE`；匾額、楹聯、字輩在 `HALL`。

## 祭祀雲端（arcar `/zupu`）

上香紀錄與語音要全家共用，需部署已併入 `/zupu` 的 arcar Worker **v27**（`kftseng2oo1/grandpa` 的 `worker/arcar-worker_v27.js`），並在 arcar 新增 KV 綁定 `ZUPU_KV`。
`worker/zupu-module.js` 是同一份後端的獨立模組原稿。

未部署時自動改為本機模式（上香只記在該裝置，語音無法上傳）。

## 檔案

| 檔案 | 說明 |
|---|---|
| `index.html` | 3D 祠堂主程式 |
| `manifest.json`、`sw.js` | PWA 設定與離線快取（three.js、字型會快取） |
| `icon.svg`、`icon-192.png`、`icon-512.png`、`apple-touch-icon.png` | 圖示（神位牌「曾」字） |
| `worker/zupu-module.js` | 祭祀雲端後端模組 |
| `audio/xinjing-*.mp3`、`*.json` | 《心經》誦念音檔（曉臻 hsiaochen、曉雨 hsiaoyu、雲哲 yunjhe）與逐字時間軸，由 kftseng2oo1/tts-studio 的 `jobs/xinjing` 產生 |
