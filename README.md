# 龍山派 曾氏族譜・3D 祠堂

three.js 打造的立體世系祠堂（單檔 PWA）。網址：https://kftseng2oo1.github.io/3d-zupu/

- 神位牌直書（名諱放大），背面生平、照片、字號；在世家人以宣紙卡呈現
- 「三省堂」匾額與楹聯、家族沿革碑、每世字輩牌、靈骨塔位側殿
- 忌日（含農曆）當天牌位發光；上香、語音口述、祭祀紀錄
- 開場卷軸、逐世導覽、存圖海報

## 資料來源

與族譜紀念堂（https://kftseng2oo1.github.io/zupu/）同網域，會自動讀取紀念堂存在瀏覽器的資料（localStorage `ancestorApp_v28`）：
祖先名冊、神位文字、生卒忌日、生平、照片、配偶、塔位、家族沿革。內建資料寫在 `index.html` 的 `PEOPLE`；匾額、楹聯、字輩在 `HALL`。

## 祭祀雲端（arcar `/zupu`）

上香紀錄與語音要全家共用，需把 `worker/zupu-module.js` 併入 arcar Worker：

1. arcar 新增 KV 綁定 `ZUPU_KV`
2. 貼入 `handleZupu`、`withZupuCors`、`ZUPU_CORS` 與 `z*` 輔助函式（`export default` 那段不用）
3. 在 arcar `fetch` 最前面（全域 CORS 之前）加：

```js
if (url.pathname.startsWith('/zupu')) {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: ZUPU_CORS });
  return withZupuCors(await handleZupu(request, env, url.pathname.slice(5), url));
}
```

未部署時自動改為本機模式（上香只記在該裝置，語音無法上傳）。

## 檔案

| 檔案 | 說明 |
|---|---|
| `index.html` | 3D 祠堂主程式 |
| `manifest.json`、`sw.js` | PWA 設定與離線快取（three.js、字型會快取） |
| `icon.svg`、`icon-192.png`、`icon-512.png`、`apple-touch-icon.png` | 圖示（神位牌「曾」字） |
| `worker/zupu-module.js` | 祭祀雲端後端模組 |
| `audio/xinjing-*.mp3`、`*.json` | 《心經》誦念音檔（曉臻 hsiaochen、曉雨 hsiaoyu、雲哲 yunjhe）與逐字時間軸，由 kftseng2oo1/tts-studio 的 `jobs/xinjing` 產生 |
