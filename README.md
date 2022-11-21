# 作品說明

The F2E Week2 - 線上簽名網站

## 系統說明

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.1.

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

- node 版本: 14.17.5
- Angular Cli版本: 12.2.1

運行方法: `npm install -g @angular/cli` & `npm install` & `ng serve`

## 資料夾說明

- src/assets - 圖片與共用scss檔
- src/app/components - 元件資料夾
- src/app/components/add-sign - 新增簽名檔元件
- src/app/components/header - Header元件
- src/app/components/history - 歷史文件元件
- src/app/components/service-select - 選擇服務元件
- src/app/components/service-sign - 簽署文件元件
- src/app/components/service - 服務頁面元件(會將 add-sign & service-sign 擺放在裡面使用)

## 使用技術
- Angular Cli
- SCSS
- Canvas
- RXJS
- Flex
- Grid
- TypeScript

## 第三方服務
- 字型 (https://fonts.google.com/noto/specimen/Noto+Sans+TC)
- fabric 5.24: 用於簽名檔縮放至背景圖片功能 (https://www.npmjs.com/package/fabric)
- @types/fabric 4.5.12 用於簽名檔縮放至背景圖片功能 (https://www.npmjs.com/search?q=%40types%2Ffabric)
- ng2-pdf-viewer 5.24: 檢視PDF並將PDF轉成Canvas (https://www.npmjs.com/package/ng2-pdf-viewer)

## Note
- 參考視覺為: https://www.figma.com/file/5OPM5bD3IgPtPPKYs0Qtpi/week-2?node-id=0%3A1&t=xzJMNcAwcBLYW4ZW-0
- 由於時間問題，因此 RWD 還是有跑版情況, PDF上傳部分有時間會補上選擇其他頁面的功能, 目前只能使用第一頁, 並在簽名的地方希望可以加入顏色等其他設定
- 目前大致上功能為 Demo 用, 所以寫法上有些凌亂與不適當, 有時間會將其修正
