#　t2-climate

## 用意するもの
- [Tessel 2](https://tessel.io/)
- [Climateモジュール (climate-si7020)](https://tessel.io/modules#module-climate)

## 手順

1. nodeモジュールをインストール
  ```shell
  $ git clone https://github.com/megurock/t2-climate.git
  $ cd t2-climate
  $ npm i
  ```

1. Webサーバ、Socketサーバを起動
  ```shell
  $ npm start
  ```
  ブラウザから `localhost:8080` にアクセス

1. Climateモジュールを起動
  ```shell
  $ t2 run climate.js
  ```

![](https://github.com/megurock/t2-climate/climate.gif)
