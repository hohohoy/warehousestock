<template>
  <div class="skeleton">
    <van-skeleton :row="1" row-width="100%" style="margin-top:10px;width:35vw">
      <div style="width:100px;height:35px;display:inline-block"></div>
    </van-skeleton>
    <van-skeleton :row="1" row-width="100%" style="margin-top:10px;width:20vw">
      <div style="width:100px;height:35px;display:inline-block"></div>
    </van-skeleton>
    <van-skeleton
      class="titleitem"
      :row="1"
      row-width="100%"
      style="margin-top:10px;width:35vw;"
      v-for=" it in 2"
      :key="it"
    >
      <div style="width:100px;height:35px;display:inline-block"></div>
    </van-skeleton>
    <div v-for="item in 2" :key="item">
      <div
        style="box-shadow: 2px 2px 30px #ebebeb;border-radius: 10px;padding:25px 10px;margin:15px 0;"
      >
        <van-skeleton :row="1" row-width="100%" style="margin-top:10px;width:35vw">
          <div style="width:100px;height:35px;display:inline-block"></div>
        </van-skeleton>
        <van-skeleton :row="1" row-width="100%" style="margin-top:10px;width:20vw">
          <div style="width:100px;height:35px;display:inline-block"></div>
        </van-skeleton>
        <van-skeleton
          class="item"
          :row="1"
          row-width="100%"
          style="margin-top:10px;width:35vw;"
          v-for=" it in 2"
          :key="it"
        >
          <div style="width:100px;height:35px;display:inline-block"></div>
        </van-skeleton>
      </div>
      <div
        style="box-shadow: 2px 2px 30px #ebebeb;border-radius: 10px;padding: 8px 0 10px;margin:0 3vw"
      >
        <van-skeleton
          class="bigitem"
          :row="1"
          row-width="100%"
          style="margin-top:10px;width:18vw;"
          v-for=" i in 3"
          :key="i"
        >
          <div style="width:100px;height:35px;display:inline-block"></div>
        </van-skeleton>
        <!-- <div style="display:flex;justify-content:space-around"> -->
        <van-skeleton
          class="fillblock"
          :row="1"
          row-width="100%"
          v-for=" i in 3"
          :key="i"
          style="display:block"
        >
          <div style="width:100px;height:35px;display:inline-block"></div>
        </van-skeleton>
        <van-skeleton
          :row="1"
          row-width="100%"
          style="margin-top:10px;width:25vw;padding-left:10vw"
        >
          <div style="width:100px;height:35px;display:inline-block"></div>
        </van-skeleton>
        <van-skeleton
          :row="1"
          row-width="100%"
          style="margin-top:10px;width:10vw;padding-left:25vw"
        >
          <div style="width:100px;height:35px;display:inline-block"></div>
        </van-skeleton>
        <!-- </div> -->
      </div>
    </div>
    <div class="footer">
      <van-skeleton class="item" :row="1" row-width="100%" style="margin-top:10px;width:35vw">
        <div style="width:100px;height:35px;display:inline-block"></div>
      </van-skeleton>
      <van-skeleton :row="1" row-width="100%" style="margin-top:10px;width:10vw;padding-left:20vw">
        <div style="width:100px;height:35px;display:inline-block"></div>
      </van-skeleton>
      <van-skeleton :row="1" row-width="100%" style="margin-top:10px;width:10vw;padding-left:0vw">
        <div style="width:100px;height:35px;display:inline-block"></div>
      </van-skeleton>
    </div>
    <!-- <van-skeleton class="item" :row="1" row-width="100%" style="margin-top:10px;width:20vw">
            <div style="width:100px;height:35px;display:inline-block"></div>
        </van-skeleton>
        <van-skeleton class="item" :row="1" row-width="100%" style="margin-top:10px;width:20vw">
            <div style="width:100px;height:35px;display:inline-block"></div>
    </van-skeleton>-->

    <!-- <van-skeleton class="bigitem" :row="1" row-width="100%" style="margin-top:10px;width:20vw">
            <div style="width:100px;height:35px;display:inline-block"></div>
        </van-skeleton>
        <van-skeleton class="bigitem" :row="1" row-width="100%" style="margin-top:10px;width:20vw">
            <div style="width:100px;height:35px;display:inline-block"></div>
    </van-skeleton>-->
  </div>
</template>
<style lang="less" scoped>
/deep/.van-skeleton,
.van-skeleton--animate {
  display: inline-block;
  width: 40%;
}
/deep/.van-skeleton__content {
  display: inline-block;
  width: 18vw;
}
/deep/ .van-skeleton__row {
  display: inline-block;
  width: 40vw;
  height: 22px;
}
.item > .van-skeleton__content {
  width: 40vw;
  // padding-left: 9vw
}
.titleitem > .van-skeleton__content {
  width: 60vw;
  // padding-left: 9vw
}
.bigitem > .van-skeleton__content {
  width: 14vw;
  padding-left: 8vw;
}
.fillblock > .van-skeleton__content {
  display: block;
  width: 100vw;
  padding: 5px 8vw;
}
.footer {
  border-top: 1px solid rgb(245, 244, 244);
  position: fixed;
  background: #fff;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  padding: 5px 12px;
}
</style>
