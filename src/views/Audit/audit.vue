<template>
  <div class="audit" ref="au">
    <div class="header">
      <h2>
        <span class="iconfont">仓库盘点</span>
      </h2>
      <div class="header_item">
        <label style="flex:none">日期</label>
        <div class="dateBox">
          <input
            class="startDate"
            style="width:50%;"
            type="text"
            readonly="readonly"
            @click="startTimeShow = true"
            :value="startdate"
            placeholder="请选择开始日期"
          />
          <span
            style="height:35px;line-height:35px;color:#dbdedf;font-weight:600;padding-left: 8px;margin-left:2px;width: 8vw;box-sizing: border-box;"
          >—</span>
          <input
            class="endDate"
            style="width:50%;"
            type="text"
            readonly="readonly"
            @click="endTimeShow = true"
            :value="enddate"
            placeholder="请选择结束日期"
          />
        </div>
        <van-overlay
          :show="startTimeShow"
          style="width:100%;height:100%;display:flex;align-items:flex-end"
          @click="startTimeShow = false"
        >
          <div style="width:100%;" @click.stop>
            <van-datetime-picker
              v-model="defaultStart"
              type="date"
              style="width:100%;"
              @cancel="startTimeShow=false"
              @confirm="startOnConfirm"
            />
          </div>
        </van-overlay>
        <van-overlay
          :show="endTimeShow"
          style="width:100%;height:100%;display:flex;align-items:flex-end"
          @cancel="endTimeShow=false"
          @click="endTimeShow = false"
        >
          <div style="width:100%;" @click.stop>
            <van-datetime-picker
              id="end"
              v-model="defaultEnd"
              type="date"
              style="width:100%;"
              @cancel="startTimeShow=false"
              @confirm="endOnConfirm"
            />
          </div>
        </van-overlay>
      </div>
      <div class="header_item">
        <label>套账</label>
        <select class="selectItem" v-model="tzName" @change="getWarehouseData(tzName)">
          <option v-for="(item,id) in warehouseList" :key="id" :value="item.tzid">{{item.dbname}}</option>
        </select>
          <label class="secondLabel">仓库</label>
        <select class="selectItem" v-model="warehouseName">
          <option value="0">全部仓库</option>
          <option v-for="(item,id) in warehouseData" :key="id" :value="item.id">{{item.warehouse}}</option>
        </select>
        <!-- <van-button
          hairline
          plain
          type="info"
          style="margin-left:3px;height:35px;line-height:35px;"
          @click="selectWH"
        >查询</van-button> -->
      </div>
      <van-button
          type="info"
          style="margin-left:3px;height:35px;line-height:35px;width:90vw;border:none;background:#2d77ed;"
          @click="selectWH"
        >查询</van-button>
    </div>
    <div>
      <div class="notice" style="text-align:center"></div>
      <div
        class="body"
        id="body"
        v-for="(item,id) in contentList"
        :key="id"
        @click="thisDetail(item.id)"
      >
        <h3 class="smalliconfont">{{item.warehouse }}</h3>
        <div class="body_number">
          <span ref="bb">单据号:{{item.no}}</span>
          <span>{{item.date}}</span>
        </div>
        <div class="body_content">
          <div>
            <p>{{item.item_quantity}}</p>
            <p>{{numberList.id}}</p>
          </div>
          <div>
            <p>{{item.size_quantity}}</p>
            <p>{{numberList.size_number}}</p>
          </div>
          <div>
            <p>{{item.quantitys}}</p>
            <p>{{numberList.total}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="addbox">
        <div class="block" @click="toDetailPage">
          <i class="iconfont icon-addTodo-nav"></i>
        </div>
      </div>
      <div class="backbox">
        <div class="goback" @click="backTop">
          <svg
            t="1578703241111"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="1105"
            width="200"
            height="200"
          >
            <path
              d="M796.422846 524.478323 537.312727 265.185862c-6.368176-6.39914-14.688778-9.471415-22.976697-9.407768-1.119849-0.096331-2.07972-0.639914-3.19957-0.639914-4.67206 0-9.024163 1.087166-13.023626 2.879613-4.032146 1.536138-7.87163 3.872168-11.136568 7.135385L227.647682 524.27706c-12.512727 12.480043-12.54369 32.735385-0.032684 45.248112 6.239161 6.271845 14.432469 9.407768 22.65674 9.407768 8.191587 0 16.352211-3.135923 22.624056-9.34412L479.1356 363.426421l0 563.712619c0 17.695686 14.336138 31.99914 32.00086 31.99914s32.00086-14.303454 32.00086-31.99914L543.13732 361.8576l207.91012 207.73982c6.240882 6.271845 14.496116 9.440452 22.687703 9.440452s16.319527-3.103239 22.560409-9.311437C808.870206 557.277355 808.902889 536.989329 796.422846 524.478323z"
              p-id="1106"
              fill="#2c2c2c"
            />
            <path
              d="M864.00258 192 160.00258 192c-17.664722 0-32.00086-14.336138-32.00086-32.00086S142.337858 128 160.00258 128l704 0c17.695686 0 31.99914 14.336138 31.99914 32.00086S881.698266 192 864.00258 192z"
              p-id="1107"
              fill="#2c2c2c"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import http from "../../utils/http";
import * as api from "../../utils/apiname";
import * as post from "../../utils/apis";
import { Toast } from "vant";
import { mapGetters, mapState, mapMutations } from "vuex";
var that = "";
export default {
  name: "audit",
  data() {
    return {
      startshow: true,
      endshow: true,
      showSke: true,
      defaultStart: new Date(),
      defaultEnd: new Date(),
      startdate: this.formatDate(new Date()),
      enddate: this.formatDate(new Date()),
      startTimeShow: false,
      endTimeShow: false,
      warehouseList: "", //套账列表
      warehouseMap: "",
      contentList: [], //单据列表
      numberList: { id: "货号数", size_number: "尺码数", total: "总件数" },
      routeVal: this.$route.params,
      // routeVal: ,
      warehouseName: 0,
      tzName:'',
      warehouseData:[]//仓库列表
    };
  },
  beforeCreate: function() {
    that = this;
  },
  mounted() {
    // console.log(this.token);
    // console.log(this.$route.meta)
  },
  computed: {
    ...mapGetters(["token", "status"])
  },
  created() {
    this.setToken(this.$route.query.apptoken)
    // alert(window.location.href)
    // let token="6b71b5ec81631712"
    post.axiosPost(api.getWarehouse,{token:this.token}).then(res=>{
      if (res.errcode == 0) {
          this.warehouseList = res.data;
          this.tzName=this.warehouseList[0].tzid
          this.warehouseData=this.warehouseList[0].dbdata
        } else {
          Toast({
            message: "数据加载错误~",
            duration: 1500,
            forbidClick: true
          });
        }
      })
      .catch(err => {});
  },
  watch: {
    '$route.meta':{  //监听meta刷新页面
      deep:true,
      handler(val,old){
        if(val){
          this.selectWH();
          this.$route.meta.isFlash=false
        }
      }
    }
  },
  methods: {
    ...mapMutations({
      setStatus: "SET_STATUS",
      setToken: "SET_TOKEN"
    }),
    formatDate(date) {
      return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    },
    startOnConfirm(date) {
      this.startTimeShow = false; //开始日期选择后关闭日期选择器
      this.startdate = `${this.formatDate(date)}`;
    },
    endOnConfirm(date) {
      const end = `${this.formatDate(date)}`;
      this.endTimeShow = false; //结束日期选择正确后关闭日期选择器
      this.enddate = end;
    },
    toDetailPage() {
      this.$router.push("/auditDetail"); //跳转到详情页
    },
    backTop() {
      //回到顶部
      if (window.scrollY) {
        $("html , body").animate(
          {
            scrollTop: 0
          },
          "fast"
        );
      } else {
        return;
      }
    },
    selectWH() {
      this.$nextTick(() => {//加载对应审计单
        $(".notice").html("");
        let startDay = this.startdate.replace(/\//g, "-");
        let endDay = this.enddate.replace(/\//g, "-");
        let warehouse = this.warehouseName;
        // ||this.$route.query.warehouse
        // warehouse == "全部仓库" ? (warehouse = "") : 1;
        let token = this.token;
        // let token = "6b71b5ec81631712";
        let tzid=this.tzName
        let params = { token, startDay, endDay, warehouse,tzid };
        post.axiosPost(api.searchDocument,params).then(res=>{
              if (res.errcode == 0) {
              this.contentList = res.data;
              if (res.data.length == 0) {
                //返回数据为空
                $(".notice").html(
                  "<p style='padding-top:20px;color:#32363c;font-size:18px'>没有数据哦~</p>"
                );
              } else {
                $(".notice").html("");
              }
            } else {
            }
        }).catch(r=>{})
      });
    },
    thisDetail(id) {
      //进入单据的详情页面
      this.$router.push({
        name: "auditDetail",
        params: {
          id: id,
          token:this.token,
          tzid:this.tzName,
          warehouseName:this.warehouseName
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import "./css/audit.css";
.audit {
  margin: 0 5vw;
  // padding-top: env(safe-area-inset-top);
  .iconfont {
    font-style: "iconfont";
    font-size: 27px;
  }
  .smalliconfont {
    font-style: "iconfont";
    font-size: 20px;
  }
  .header {
    text-align: left;
    h2 {
      margin: 4vw 0;
      color: #4f5359;
      font-size: 27px;
      span {
        background: linear-gradient(to top, #4f5359, #32363c);
        -webkit-background-clip: text;
        color: transparent;
      }
    }
    .header_item {
      padding-bottom: 5px;
      margin-bottom: 8px;
      display: flex;
      
      label {
        width: 8vw;
        line-height: 35px;
        &.secondLabel{
          padding-left: 8px;
        }
      }
      .dateBox {
        width: 100vw;
        display: flex;
        input{
        width: 35vw!important;
        margin: 0 5px;

      }
      }
      select.selectItem {
        margin: 0 5px;
        color: #484c50;
        width: 35vw;
        margin-right: 0;
      }
      select {
        background: #f3f6f6;
        border: none;
        outline: none;
        border: none;
        appearance: none;
        -moz-appearance: none;
        -webkit-appearance: none; //修改移动端默认样式
        option {
          border: 1px solid #6297ec;
        }
      }
    }
  }
  .body {
    box-shadow: 2px 2px 30px #ebebeb;
    border-radius: 10px;
    padding: 8px 6vw 10px;
    margin: 25px 0;
    // position: sticky;
    // top: 0;
    &:last-child {
      margin-bottom: 120px;
    }
    h3 {
      margin: 2vw 0;
      margin-bottom: 5vw;
      color: #3d4147;
    }
    .body_number {
      span {
        font-size: 15px;
        padding: 5px 13px;
        margin-right: 15px;
        &:first-child {
          background: #edf4fa;
          color: #3376dc;
        }
        &:last-child {
          background: #eef1f3;
          color: #6f7274;
        }
      }
    }
    .body_content {
      margin-top: 4vw;
      display: flex;
      justify-content: space-between;
      div {
        text-align: center;
        display: inline-block;
        p:first-child {
          color: #34383e;
          font-weight: bold;
          font-size: 21px;
          margin-bottom: 6px;
        }
        p:last-child {
          color: #a7a7a7;
          margin-top: 0;
        }
      }
    }
  }
  .footer {
    // position: sticky;
    position: fixed;
    bottom: env(safe-area-inset-bottom);
    right: 5vw;
    .addbox {
      .block {
        color: #fff;
        background: #2d77ed;
        box-shadow: 2px 2px 20px #dbe6f3;
        border-radius: 50%;
        padding: 11px 12px;
        margin-bottom: 5px;
        display: inline-block;
        i {
          font-size: 25px;
        }
      }
    }
    .backbox {
      // position: fixed;
      // bottom:env(safe-area-inset-bottom);
      // right: 5vw;
      display: inline-block;
      background: #fff;
      box-shadow: 2px 2px 20px #dbdedf;
      border-radius: 50%;
      svg {
        width: 35px;
        height: 29px;
        padding: 8px 7px;
      }
    }
  }
}
</style>