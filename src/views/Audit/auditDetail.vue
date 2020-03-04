<template>
  <div class="auditDetail">
    <mySkeleton v-if="showSke" />
    <div v-else>
      <div class="header">
        <div class="idbolck">
          <label style="font-size:14px">{{pageID | filterPageID(pageID)}}</label>
        </div>
        <div class="header_top">
          <div>
            <label>套账</label>
            <select ref="selecttz" v-model="tzName" @change="getWarehouseData(tzName)" >
              <option
                v-for="(item,id) in warehouseList"
                :key="id"
                :value="item.tzid"
              >{{item.dbname}}</option>
            </select>
          </div>
          <div>
            <label>仓库</label>
            <select ref="selectid" v-model="warehouseName" @click="selectHH" >
              <!-- <option :value="0">请选择仓库</option> -->
              <option
                v-for="(item,id) in warehouseData"
                :key="id"
                :value="item.id"
              >{{item.warehouse}}</option>
            </select>
          </div>
        </div>
      </div>
      <div class="content_box">
        <!-- 循环货号 -->
        <div class="content" v-for="(index,id) in no" :key="id">
          <div class="body content_top" ref="lightcss">
            <div class="size_quantity_box">
              <span>{{id | size_quantityFilter}}</span>
              <span class="small">order</span>
            </div>
            <div class="round_box" style>
              <div class="close_box"></div>
            </div>
            <div @click="itemClose(index.item)">
              <i
                id="itemClose"
                class="iconfont icon-guanbi"
                style="color:#fff;font-size:14px;position:absolute;right:6px;top:5px;"
              ></i>
            </div>
            <div class="item">
              <div class="line_box">
                <label>
                  <span class="redFont">*</span>货号
                </label>
                <div>
                  <input
                    class="inputBox keybOpen goodNo"
                    type="tel"
                    :value="index.item"
                    ref="goodsid"
                    disabled
                  />
                </div>
              </div>
              <div class="line_box">
                <label>
                  <span class="redFont">*</span>尺码数量
                </label>
                <input
                  class="inputBox keybOpen"
                  type="tel"
                  :value="getSizequantitys(index.item)"
                  disabled
                />
              </div>
            </div>
          </div>
          <div class="content_bottom">
            <div class="body">
              <div class="item">
                <span v-for="(item,id) in tableTitle" :key="id">{{item}}</span>
              </div>
              <div class="bgItem" v-for="(itm,id) in Lists.get(index.item)||''" :key="id">
                <div class="bg" ref="smalllightcss">
                  <span class="size" ref="itemsize">{{itm.item_size}}</span>
                  <span>{{itm.stock | filterStock(itm.stock)}}</span>
                  <input
                    class="keybOpen getVal"
                    type="tel"
                    placeholder="请填写"
                    v-model="itm.size_quantity"
                    style="width:12vw;padding-left:0;padding-right:0;text-align:center"
                    @keyup="updateQuantitys(index.item)"
                  />
                </div>
              </div>
              <div class="last_item">
                <p style="margin:12px 0 0;">
                  合计：
                  <span
                    id="quantityssize_quantity"
                    style="font-weight:bold;font-size:20px;color:#464a50"
                  >{{index.quantitys}}</span>
                </p>
                <input type="button" value="核对" class="checkBtn" @click="checkItemOp(index.item)" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="leftbox" style="color:#46484f;">
          <div class="sweepCode">
            <form action>
              <van-search
                type="search"
                class="keybOpen keybOpen_input"
                placeholder="请输入货号"
                v-model="searchVal"
                style="padding:0;line-height:35px;height:35px;"
                @search="searchOp"
              />
            </form>
            <div class="swpBtn" @click="swpOption" disabled>
              <i class="iconfont icon-saoma" style="font-size:22px;font-weight:normal"></i>
            </div>
          </div>
        </div>
        <div class="btnBox">
          <input type="button" value="删除" class="del" @click="deleteContent" />
          <input type="button" value="保存" @click="saveContent" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Dialog, Toast, Notify } from "vant";
import http from "../../utils/http";
import * as api from "../../utils/apiname";
import * as post from "../../utils/apis";
import { mapGetters, mapMutations } from "vuex";
import mySkeleton from "./skeleton/skeleton";
export default {
  name: "auditDetail",
  components: {
    [Dialog.Component.name]: Dialog.Component
  },
  data() {
    return {
      colorcss: false,
      id: "", //单据id
      showSke: true, //显示骨架屏
      tzName:'',//套账id
      warehouseName: "",//仓库id
      tableTitle: ["尺码", "库存", "件数"],
      no: [], //货号列表
      Lists: new Map(), //尺码列表
      goodid: "",
      searchVal: "",
      warehouseList: [],
      pageID: "", //单据号
      light: false,
      warehouseData:[]
    };
  },
  computed: {
    ...mapGetters(["token", "status"])
  },
  components: {
    mySkeleton
  },
  filters: {
    size_quantityFilter(val) {
      val++;
      return val < 9 ? "0" + val : val;
    },
    filterStock(val) {
      if (!val) {
        return "-"; //库存未核对时为-
      }
      return val;
    },
    filterPageID(val) {
      if (!val) {
        return "";
      }
      return "单据 " + val;
    }
  },
  mounted() {
    let cliPositon, oldPosition;
    let blockOffset;
    let time = null;
    $("body").on("focus", ".keybOpen", function() {
      cliPositon = jQuery(window).scrollTop();
      this.KeybIsOpen = true;
      if (time) clearTimeout(time);
    }).on("blur", ".keybOpen", function() {
      oldPosition = $(this).offset().top;
      // time = setTimeout(() => {
        $("html,body").animate(
          {
            scrollTop: cliPositon
          },
          "fast"
        );
        // time = null;
      // }, 50);
    });
    // $("body").on("blur", ".keybOpen", function() {
    //   oldPosition = $(this).offset().top;
    //   // time = setTimeout(() => {
    //     $("html,body").animate(
    //       {
    //         scrollTop: cliPositon
    //       },
    //       "fast"
    //     );
    //     // time = null;
    //   // }, 50);
    // });
  },
  updated(){
    this.$nextTick(()=>{
      if(this.id){
        this.$refs.selecttz.disabled=true
        this.$refs.selectid.disabled=true
      }
    })
  },
  created() {
    this.id = this.$route.params.id;
    if (this.id) {
      this.params=this.$route.params;
      this.tzName=this.params.tzid
      this.warehouseName=this.params.warehouseName
      this.itemDetail(this.$route.params);
    } else {
      // "6b71b5ec81631712"
      post.axiosPost(api.getWarehouse,{token:this.token}).then(res=>{
        this.showSke = false; //不显示骨架屏
        if (res.errcode == 0) {
            this.warehouseList = res.data;
            this.tzName = res.data[0].tzid; //默认选择首个仓库
            this.warehouseData=this.warehouseList[0].dbdata
            // this.warehouseName=this.warehouseList[0].dbdata[0].id
          }
      }).catch(r=>{})
    }
  },
  beforeRouteLeave(to,from, next) {
    if (to.name) {
      if(to.meta.isFlash){
        to.meta.isFlash = true;
      }
      next();
    }
  },
  methods: {
    ...mapMutations({
      setStatus: "SET_STATUS"
    }),
    selectHH(){
      this.warehouseName=this.warehouseData[0].id
    },
    swpOption() {
      //扫码接口
      console.log(this.warehouseName)
      if(this.tzName==''||this.warehouseName==''){
        Notify({ type: 'warning', message: '请先选择套账名和仓库名' });
          return
      }
      llApp.init();
      llApp.scanQRCode((result) =>{
        this.searchVal=result
        this.searchOp(result);
      });
    },
    // getWarehouseData(val){
    //   console.log(this.$root)
    //   for(let index in this.warehouseList){
    //     if(parseInt(this.warehouseList[index].tzid)==val){
    //       this.warehouseData=this.warehouseList[index].dbdata
    //     }
    //   }
    // },
    itemDetail(params) {
      let axios_warehouse=post.axiosPost(api.getWarehouse,{token: this.token}) //获取仓库名
      let axios_details = post.axiosPost(api.getDocumentDetail, params); //获取单据详细
      // 获取仓库名和详细单据渲染到页面
      Promise.all([axios_warehouse, axios_details])
        .then(res => {
          this.showSke = false; //不显示骨架屏
          if (res[0].errcode == 0) {
            this.warehouseList = res[0].data;
            for(let index in this.warehouseList){
        if(parseInt(this.warehouseList[index].tzid)==this.tzName){
          this.warehouseData=this.warehouseList[index].dbdata
        }
      }
          }
          if (res[1].errcode == 0) {
            this.warehouseName = res[1].data[0].warehouseid;
            this.pageID = res[1].data[0].no;
            let arr = res[1].data[0].itemData;
            this.no = [];
            this.Lists = new Map();
            for (let i in arr) {
              let item = arr[i].item; //货号
              let quantitys = arr[i].quantitys; //总数量
              let mxid = arr[i].mxid; //mxid
              this.no.push({ item, quantitys, mxid });
              this.Lists.set(arr[i].item, arr[i].sizeData);
            }
          } else {
            Toast({
              message: "数据加载失败~",
              duration: 1500,
              forbidClick: true
            });
          }
        })
        .catch(r => {});
    },
    searchOp(i) {//查询货号
      if(this.tzName==null||this.warehouseName==null){
        Notify({ type: 'warning', message: '请先选择套账名和仓库名' });
          return
      }
      if(!this.searchVal){
        Notify({ type: 'warning', message: '货号不能为空！' });
          return
      }
      let list; //存放后端传的数据
      var selectSize, selectID; //查询的尺码
      let params={
          token:this.token,
          item:this.searchVal,
          tzid:this.tzName
        }
      // "19DTX0011Y160100001"
      post.axiosPost(api.searchID,params)
        .then(res => {
          if (res.errcode == 0) {
            if(res.data.length==0){
              Toast({
              message: "仓库不存在该货号~",
              duration: 1500,
              forbidClick: true
            });
            }else{
            selectSize = res.data[0].item_size;
            selectID = res.data[0].item;
            this.$nextTick(()=>{
            if (res.data[0].item) {
              console.log(res.data)
              if (this.Lists.get(res.data[0].item) == undefined) {//查看是否已存在该货号,不存在时
                res.data[0].size_quantity = 1; //默认数量为1
                list = res.data;
                for (let i in list) {
                  let item = list[i].item;
                  this.no.push({ item, quantitys: 1, mxid: 0 }); //mxid为0 新增
                  this.Lists.set(list[i].item, list); //将数组放入map对象 键值为货号
                }
              } else {
                //存在货号
                let itemArr = this.Lists.get(res.data[0].item);
                let ishas=false;
                for (let index in itemArr) {
                  if (itemArr[index].item_size == res.data[0].item_size) {//是否存在该尺码
                    itemArr[index].size_quantity =parseInt(itemArr[index].size_quantity) + 1;
                    ishas=true
                  }
                }
                if(!ishas){
                    res.data[0].size_quantity=1;
                    itemArr.push(res.data[0])
                  }
                  this.Lists = new Map(this.Lists);
                for (let i in this.no) {
                  if (this.no[i].item == res.data[0].item) {
                    this.no[i].quantitys = parseInt(this.no[i].quantitys) + 1;
                  }
                }
              }
                this.addCSS(res.data[0].item,res.data[0].item_size) //修改新增项样式
            }
          })
          }
        }
        })
        .catch(r => {
        });
    },
    saveContent() {
      this.removeCSS()
      let itemData = [],itemObj;
      if(this.tzName==null||this.warehouseName==null){
        Notify({ type: 'warning', message: '请先选择套账名和仓库名' });
          return
      }
      if (this.no.length == 0) {
        Toast("页面无内容，无法保存!");
      } else {
        for (let it in this.no) {
          let item = this.no[it].item; //货号
          let quantity = this.no[it].quantitys; //总数
          let mxid = this.no[it].mxid; //mxid
          let arr = this.Lists.get(item);
          let sizeData = [];
          for (let i in arr) {
            let size_quantity = arr[i].size_quantity.toString();
            let size_item = arr[i].item_size;
            itemObj = Object.assign({ size_item, size_quantity });
            sizeData.push(itemObj);
          }
          itemData.push({ item, quantity, mxid, sizeData });
        }
        // "6b71b5ec81631712"
        let params={
            token: this.token,
            warehouse: this.warehouseName,
            id: this.id || "0", //单据id
            tzid:this.tzName,
            itemData
          }
        post.axiosPost(api.saveDocument,params)//保存更新数据
          .then(async res => {
            if (res.errcode == 0) {
              console.log(res.data);
              var sta = await this.leavePage("保存");
              this.id=res.data[0].id
              this.itemDetail({
                id: res.data[0].id,
                token: this.token
              }); //创新获取列表并渲染
            } else {
              Toast.fail("保存失败,请稍后再试");
            }
          })
          .catch(r => {});
      }
    },
    deleteContent() {
      //删除数据
      if (this.no.length == 0) {
        Toast("页面无内容，无法删除!");
      } else {
        Dialog.confirm({
          //删除提示框
          title: "提示",
          message: "是否确认删除整个单据?"
        })
          .then(() => {
            //确认删除
            this.deleteOption()
          })
          .catch(() => {
            return;
          });
      }
    },
    deleteOption(){
      console.log(this.id)
      let params={
          token: this.token,
          id: this.id
        }
        post.axiosPost(api.deleteDocument,params)
        .then(async res => {
          if (res.errcode == 0) {
            this.no = [];
            this.Lists = new Map();
            var sta = await this.leavePage("删除");
            this.$router.push({name:'audit'});
            // if(sta){
            //   this.leave()
            // }
          } else {
            Toast.fail("删除失败,请稍后再试");
          }
        })
        .catch(r => {});
    },
    removeCSS(){
    this.$nextTick(()=>{
      const lightarr=this.$refs.lightcss
      const smallArr=this.$refs.smalllightcss
          for(let i in lightarr){
            lightarr[i].classList.remove('content_top_now')
          }
          for(let i in smallArr){
            smallArr[i].classList.remove('content_top_size_now')
          }
    })
    },
    addCSS(id,size){//添加新增项高光
      this.removeCSS()//清除已有高光
    this.$nextTick(()=>{
      let arr=this.$refs.goodsid
      let sizeArr=this.$refs.itemsize      
      for(let i in arr){
        if(arr[i].value==id){ //根据货号添加高亮
          $("html,body").animate(
            {
              scrollTop: arr[i].offsetParent.offsetTop-100
            },
            "fast"
          );
          arr[i].offsetParent.classList.add('content_top_now')
          let sizenowArr=arr[i].offsetParent.nextSibling.childNodes[0].childNodes;
          for(let index=1;index<sizenowArr.length;index++){
            sizenowArr[index].innerText.replace(/\-/,'')
            if(parseInt(sizenowArr[index].innerText)==size){
              sizenowArr[index].childNodes[0].classList.add('content_top_size_now')
            }
          }
      }
      }
    })
    },
    leavePage(sta) {
      return new Promise((resolve, reject) => {
        if (sta) {
          Toast.success(sta + "成功");
          setTimeout(() => {
            resolve(1);
          }, 300);
        }
      });
    },
    // leave() {
    //   //修改vuex 并跳转到主页面
    //   this.setStatus(1);
    //   this.$router.push("/");
    // },
    itemClose(id) {//删除货号信息
      Dialog.confirm({
        title: "提示",
        message: "是否确认删除?"
      })
        .then(() => {
          if(!this.id){
            this.no=[];
            this.Lists=new Map()
          }else{
            if(this.no.length==1){
            this.deleteOption()
      }else{
        for (let i in this.no) {
            if (this.no[i].item == id) {
              this.no.splice(i, 1); //删除货号列表的信息
            }
          }
          this.removeCSS()
          this.Lists.delete(id); //删除货号对应的尺码和数量
          this.Lists = new Map(this.Lists);
      }
          }
        })
        .catch(() => {
          return;
        });
    },
    updateQuantitys(no) {//更新总计数量
      let quantitys = 0;
      let arr = this.Lists.get(no);
      for (let i in arr) {
        if (arr[i].size_quantity == "") {
          //为空时 quantitys+0
          quantitys += 0;
        } else {
          //不为空时进行累加
          quantitys += parseInt(arr[i].size_quantity);
        }
      }
      for (let index in this.no) {
        if (this.no[index].item == no) {
          this.no[index].quantitys = quantitys.toString();
        }
      }
    },
    checkItemOp(item) {
      //核对货号信息
      let warehouse = this.warehouseName;
      let token = this.token;
      let tzid=this.tzName
      let dataObj = { token, item, warehouse ,tzid};
      post.axiosPost(api.checkDocument,dataObj)
        .then(res => {
          if (res.errcode == 0) {
            let arr = res.data;
            if (arr.length == 0) {
              Toast({
                message: "无库存信息~",
                duration: 1500,
                forbidClick: true
              });
            }
            let sizeArr = this.Lists.get(item);
            for (let index in sizeArr) {
              for (let i in arr) {
                if (item == arr[i].item) {
                  if (sizeArr[index].item_size == arr[i].size) {
                    //货号、尺码对应的库存
                    sizeArr[index].stock = arr[i].quantity;
                    console.log(sizeArr[index]);
                  }
                } else {
                  Toast({
                    message: "无尺码库存信息~",
                    duration: 1500,
                    forbidClick: true
                  });
                }
              }
            }
            this.Lists = new Map(this.Lists); //刷新map对象
          }
        })
        .catch(r => {});
    },
    getSizequantitys(no) {
      return this.Lists.get(no).length; //获取货号对应的所有尺码列表
    },
  }
};
</script>
<style lang="less" scoped>
@import "./css/audit.css";
.auditDetail {
  padding-bottom: env(safe-area-inset-bottom);
  margin: 20px 4vw 0;
  .header {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .idbolck {
      display: block;
      padding-bottom: 5px;
    }
    div.header_top {
      display: flex;
      .inputBox {
        padding-left: 8px;
      }
      div {
        display: flex;
        margin-left: 1vw;
        label {
          padding: 0px 0 0 0px;
          width: 10vw;
          line-height: 35px;
          text-align: center;
        }
        input,
        select {
          margin: 0px 0 0 3px;
          width: 32vw;
          -webkit-appearance: none;
          option {
            width: 40vw;
          }
        }
      }
    }
  }
  .content_box {
    .content {
      .content_top_now {
        box-shadow: 0px 0px 10px rgba(228, 109, 122, 0.6);
      }
      .content_top_size_now {
        box-shadow: 0px 0px 10px rgba(189, 189, 190, 0.8);
      }
      .content_top {
        // box-shadow: 0px 0px 10px rgba(228, 109, 122,.6);
        padding-left: 5vw;
        position: relative;
        margin-top: 40px;
        margin-bottom: 0;
        div.size_quantity_box {
          position: absolute;
          top: -22px;
          left: 5vw;
          span {
            font-size: 45px;
            font-weight: bolder;
            &:first-child {
              background: linear-gradient(to top, #4f5359, #32363c);
              -webkit-background-clip: text;
              color: transparent;
              margin-right: 10px;
            }
            &.small {
              font-size: 20px;
              color: #dce0e6;
              font-weight: bold;
            }
          }
        }
        .round_box {
          width: 60px;
          height: 60px;
          display: inline-block;
          position: absolute;
          right: 0px;
          top: 0px;
          border-radius: 10px;
          overflow: hidden;
          .close_box {
            width: 60px;
            height: 60px;
            color: #fff;
            position: absolute;
            right: -30px;
            top: -30px;
            text-align: right;
            border-radius: 50%;
            background: #e46d7a;
          }
        }
        .item {
          display: flex;
          justify-content: space-between;
          padding: 37px 0 5px;
          div.line_box {
            padding-bottom: 20px;
            input {
              width: 38vw;
              margin-top: 5px;
              padding-left: 8px;
              outline: none;
            }
            div {
              display: flex;
              margin-right: 20px;
              span {
                margin: 5px 0 0 7px;
                height: 35px;
                line-height: 35px;
                padding: 0 6px;
                background: #2d77ed;
                border-radius: 2px;
                i {
                  color: #fff;
                  font-size: 22px;
                }
              }
            }
            label {
              .redFont {
                color: red;
                padding: 0 3px;
              }
            }
          }
        }
        .item_bottom {
          p {
            margin: 8px 0;
            color: #a5a8aa;
            span {
              color: #464d50;
            }
          }
        }
      }
    }
    .content_bottom {
      max-height: 300px;
      overflow: auto;
      .body {
        margin: 0 3vw;
        .item {
          padding: 8px 10px 8px 6px;
          color: #919398;
          display: flex;
          justify-content: space-between;
        }
        .bgItem {
          margin-bottom: 12px;
          background: #f3f6f6;
          border-radius: 6px;
          div.bg {
            display: flex;
            display: flex;
            justify-content: space-between;
          }
          span {
            color: #464a50;
            padding: 8px 12px 8px 6px;
            &:first-child {
              color: #fff;
              background: linear-gradient(to right, #30343a 0%, #4d5157 100%);
              border-top-right-radius: 100%;
              border-bottom-right-radius: 100%;
            }
          }
        }
        .last_item {
          display: flex;
          justify-content: space-between;
          .checkBtn {
            height: 30px;
            line-height: 30px;
            background: #e46d7a;
            color: #fff;
            padding: 0px 13px;
            margin: 8px 0 0;
            box-shadow: 0px 0px 10px #fdc9cf;
            border-radius: 5px;
            -webkit-appearance: none;
          }
        }
      }
    }
    .content {
      &:last-child {
        margin-bottom: 110px;
      }
    }
  }
  .footer {
    width: 100vw;
    border-top: 1px solid rgb(245, 244, 244);
    background: #fff;
    position: fixed;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    padding: 0px 12px;
    padding-bottom: env(safe-area-inset-bottom);
    div.leftbox {
      padding: 15px 0;
      padding-left: 30px;
      line-height: 35px;
      span {
        font-weight: bold;
        font-size: 19px;
      }
      .sweepCode {
        display: flex;
        height: 35px;
        padding: 0;
        input {
          -webkit-appearance: none;
        }
        .swpBtn {
          display: inline-block;
          height: 35px;
          margin-left: 5px;
          // margin: 5px 0 0 7px;
          padding: 0 7px;
          background: #2d77ed;
          border-radius: 2px;
          color: #fff;
        }
      }
    }
    .btnBox {
      font-size: 0;
      padding: 15px 0;
      display: flex;
      align-items: flex-end;
      input[type="button"] {
        height: 35px;
        font-size: 16px;
        margin-right: 5px;
        padding: 0 22px;
        border-radius: 2px;
        outline: none;
        -webkit-appearance: none;
        &:last-child {
          background: #2d77de;
          color: #fff;
        }
      }
      .del {
        background: #fff;
        border: 1px solid rgb(230, 227, 227);
      }
    }
  }
}
.van-cell {
  padding: 0 !important;
  width: 33vw;
}
/deep/.van-icon,
.van-icon::before {
  display: inline-block;
  line-height: 35px;
  background: #f6f6f6;
}
</style>