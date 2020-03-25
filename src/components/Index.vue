<template>
  <div>
    <!-- 欢迎语-->
    <div class="welcome" v-if="user != null && user.username">
      <em>欢迎，
        <el-dropdown @command="myOrder">
          <span class="el-dropdown-link">
            {{user.username}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click="myOrder">
                    我的订单
                  </el-dropdown-item>
                </el-dropdown-menu>
        </el-dropdown>
      </em>
      <a href="javascript:" @click="logout">退出</a>
    </div>
    <!--注册登录-->
    <div class="login-register" v-if="!user.username">
      <a href="javascript:" @click="dialogLogin = true">登录/</a>
      <a href="javascript:" @click="dialogRegister = true">注册</a>
    </div>
    <!--搜索结果展示-->
    <div class="goods-list">
      <ul >
        <li class="" v-for="goods in goodsList">
          <div class="list-wrap" >
            <div class="p-img">
              <a :href=" 'item/' + goods.id +'.html'" target="_blank"><img :src="'static/images/' + goods.images" height="200"/></a>
            </div>
            <div class="price">
              <strong>
                <em>¥</em>
                <i>{{goods.actual_price}}</i>
              </strong>
            </div>
            <div class="attr">
              <em>{{goods.title}}</em>
            </div>
            <div class="operate">
              <a href="javascript:"  @click="kill(goods)">立即抢购</a>
            </div>
          </div>
        </li>
      </ul>
    </div>
 <!--   <div class="fr">
      <div class="sui-pagination pagination-large">
        <ul>
          <li class="prev disabled">
            <a @click="">«上一页</a>
          </li>
          <li :class="" v-for="" :key="">
            <a @click=""></a>
          </li>
          <li class="dotted" v-show=""><span>...</span></li>
          <li :class="">
            <a @click="">下一页»</a>
          </li>
        </ul>
        <div>
          <span>&nbsp;</span>
          <span>
                            到第
                            <input type="text" class="page-num" ref="">
                            页 <button class="page-confirm" @click="">确定</button>
                        </span>
        </div>
      </div>
    </div>  -->
    <!--  登录表单对话框 -->
    <el-dialog title="登录" :visible.sync="dialogLogin" width="400px" @close="resetLoginForm">
      <el-form :model="loginForm" :rules="loginRules" ref="loginForm">
        <el-form-item label="用户名" label-width="70px" prop="username">
          <el-input v-model="loginForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="70px" prop="password">
          <el-input v-model="loginForm.password" autocomplete="off" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogLogin = false;resetLoginForm">取 消</el-button>
        <el-button type="primary" @click="submitLoginForm">确 定</el-button>
      </div>
    </el-dialog>

    <!--  注册表单对话框 -->
    <el-dialog title="注册" :visible.sync="dialogRegister" width="400px" @close="resetRegisterForm">
      <el-form :model="registerForm" :rules="registerRules" ref="registerForm">
        <el-form-item label="用户名" label-width="80px" prop="username">
          <el-input v-model="registerForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="80px" prop="password">
          <el-input v-model="registerForm.password" autocomplete="off" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" label-width="80px" prop="repassword">
          <el-input v-model="registerForm.repassword" autocomplete="off" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRegister = false;resetRegisterForm">取 消</el-button>
        <el-button type="primary" @click="submitRegisterForm">确 定</el-button>
      </div>
    </el-dialog>

    <!--  填写订单对话框 -->
    <el-dialog title="填写订单" :visible.sync="dialogOrder" width="400px" @close="resetOrderForm">
      <el-form :model="orderForm" :rules="orderRules" ref="orderForm">
        <el-form-item label="商品" label-width="80px" >
          <el-input v-model="orderGood.title" autocomplete="off" disabled></el-input>
        </el-form-item>
        <!--  商品id  不显示，用于传到后台数据  -->
        <el-form-item style="display: none">
          <el-input v-model="orderForm.goodId" autocomplete="off" ></el-input>
        </el-form-item>
        <!--  商品价钱 不显示，用于传到后台数据  -->
        <el-form-item style="display: none">
          <el-input v-model="orderForm.price" autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item label="收货人" label-width="80px" prop="receiver">
          <el-input v-model="orderForm.receiver" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="收货地址" label-width="80px" prop="address">
          <el-input v-model="orderForm.address" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" label-width="80px" prop="phone">
          <el-input v-model="orderForm.phone" autocomplete="off" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogOrder = false;resetOrderForm">取 消</el-button>
        <el-button type="primary" @click="submitOrderForm">确 定</el-button>
      </div>
    </el-dialog>

    <!--  我的订单对话框 -->
    <el-dialog title="我的订单" :visible.sync="orderListDialog" width="800px">
      <el-table
        :data="orderList"
        style="width: 100%">
        <el-table-column
          prop="title"
          label="商品名称"
          width="170"
          >
        </el-table-column>
        <el-table-column
          prop="receiver"
          label="收件人"
          width="70"
          >
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="70"
        >
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="日期"
          width="100"
          >
        </el-table-column>
        <el-table-column
            prop="price"
            label="价钱"
            width="70"
          >
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button @click="handlePay(scope.row.id)" type="text" size="small" v-if="scope.row.status=='未支付'">支付</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
    export default {
      name: "Index",
      data(){
        var validateRepassword = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请再次输入密码'));
          } else {
            if (value != this.registerForm.password) {
              callback(new Error('两次输入密码不一致'));
            }
            callback();
          }
        }
        var validatePhone = (rule, value, callback) => {
          if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(value))){
            callback(new Error('手机号码不符合规则！'));
          }else{
            callback();
          }
        }
        return{
          goodsList:[],
          timeList:{
          },
          user: {},
          //订单里的商品
          orderGood: {},
          orderList: [],
          dialogLogin: false,
          dialogRegister: false,
          dialogOrder:false,
          orderListDialog:false,
          aliAdress:"http://106.15.75.118:8080",
          localAdress: "http://localhost:7079",
          useAdress: "http://106.15.75.118:8080",
          loginForm: {
            username: '',
            password: ''
          },
          registerForm: {
            username: '',
            password: '',
            repassword: ''
          },
          orderForm: {
            goodId:'',
            price: '',
            receiver:'',
            address:'',
            phone:''
          },
          loginRules:{
            username: [
              { required: true, message: '请输入用户名', trigger: 'blur' },
              { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
            ],
            password: [
              { required: true, message: '请输入密码', trigger: 'blur' },
              { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
            ]
          },
          registerRules:{
            username: [
              { required: true, message: '请输入用户名', trigger: 'blur' },
              { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
            ],
            password: [
              { required: true, message: '请输入密码', trigger: 'blur' },
              { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
            ],
            repassword: [
              {required: true, validator: validateRepassword, trigger: 'blur'}
            ]
          },
          orderRules:{
            receiver: [
              { required: true, message: '请输入收件人', trigger: 'blur' },
              { min: 2, max: 4, message: '收件人姓名2到4个中文', trigger: 'blur' }
            ],
            address: [
              { required: true, message: '请输入地址', trigger: 'blur' }
            ],
            phone: [
              {required: true, validator: validatePhone, trigger: 'blur'}
            ]
          }
        }
      },
      methods: {
        //加载商品信息
        async loadGoodsList() {
          const result = await this.$http.get(this.useAdress + "/mybatis/sku/list")
          if (result.status != 200)
            this.$message.error("获取数据失败！")
          this.goodsList = result.data
          this.goodsList.forEach(good => {
            good.actual_price = good.price/100
          })
          console.log(this.goodsList)
          console.log(this.timeList)
        },
        //重置登录表单
        resetLoginForm(){
          this.$refs['loginForm'].resetFields();
        },
        //重置注册表单
        resetRegisterForm(){
          this.$refs['registerForm'].resetFields();
        },
        //重置订单表单
        resetOrderForm(){
          this.$refs['orderForm'].resetFields();
        },
        /*
        //让结束倒计时跑起来
        setTimeRun(){
          var timeList = this.timeList
          var vue = this
          setInterval(function () {
            for (var item in timeList){
              if(timeList[item] =="活动已结束")
                return ;
              const time = (timeList[item] + "").split(":")
              var h = Number(time[0])
              var m = Number(time[1])
              var s = Number(time[2])
              if (s != 0){
                s--
              }
              else if (s == 0 && m!= 0 ){
                s = 59
                m --
              }
              else if (s == 0 && m==0){
                if (h == 0)
                  return item = "活动已结束"
                else
                  h--
                  m = 59
                  s = 59
              }
              timeList[item] = (h + "") + ":" + (m + "") + ":" + (s + "")
              vue.$forceUpdate();
            }
          },1000)
        },
        */
        //立即抢购业务处理逻辑
        async kill(good) {
          const result = await this.$http.get(this.useAdress + "/mybatis/order/auth",{params:{sku_id:good.id}})
          console.log(result)
          if(result.data.code == -1){
            this.$alert("检测到您未登录，请先登录！", '提示', {
              confirmButtonText: '确定',
              callback: action => {
                this.$message({
                  type: 'info',
                  message: result.data.msg
                });
              }
            });
          }else if(result.data.code == -2){
            this.$alert("您已购买过该商品！", '提示', {
              confirmButtonText: '确定',
              callback: action => {
                this.$message({
                  type: 'info',
                  message: result.data.msg
                });
              }
            });
          } else{
            this.$message.success("校验成功，请填写订单信息！")
            this.orderGood = good
            this.orderForm.goodId = good.id
            this.orderForm.price = good.price
            this.dialogOrder = true
          }
        },
        //提交登录表单
        async submitLoginForm() {
          const result = await this.$http.get(this.useAdress + "/mybatis/user/login", {params:this.loginForm})
          if (result.data.code == -1){
            return this.$message(result.data.msg)
          }
          this.user = result.data.data
          this.dialogLogin = false
          this.resetLoginForm()
        },
        //提交注册表单
        async submitRegisterForm() {
          this.$refs['registerForm'].validate(async (validate) => {
            if (validate) {
              const result = await this.$http.post(this.useAdress + "/mybatis/user/add", "username=" + this.registerForm.username + "&password=" + this.registerForm.password)
              console.log(result);
              if (result.data.code == -1) {
                return this.$message(result.data.msg)
              }else{
                this.$message(result.data.msg)
                this.dialogRegister = false
              }
            }
          })
        },
        //用户退出
        async logout() {
          //提示用户是否退出
          this.$confirm('确定要退出当前用户吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const result = this.$http.post(this.useAdress + "/mybatis/user/logout").then((data)=>{
              if (data.status == 200 && data.data.code == 0)
              {
                this.user = {}
                this.$message({
                  type: 'success',
                  message: '退出成功!'
                });
              }else{
                this.$message({
                  type: 'info',
                  message: '退出失败，原因未知!'
                });
              }
            }).catch(()=>{
              this.$message({
                type: 'info',
                message: '退出失败，原因未知!'
              });
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
          });
        },
        //提交订单
        async submitOrderForm() {
          this.$refs['orderForm'].validate(async (validate)=> {
            if (validate) {
              const result = await this.$http.post(this.useAdress + "/mybatis/order/add", JSON.stringify(this.orderForm), {headers: {'Content-Type': 'application/json'}})
              if (result.status == 200 && result.data.code != -1)
                //提示用户完成订单支付
                this.$confirm('已提交订单，请在我的订单里完成支付！', '提示', {
                  confirmButtonText: '确定',
                  type: 'warning'
                })
              this.$refs['orderForm'].resetFields()
              this.dialogOrder = false
            }
          })
        },
        //判断用户是否已登录
        async auth() {
          const result = await this.$http.get(this.useAdress + "/mybatis/user/auth")
          if (result.data.code == 0) {
            this.user = result.data.data
          }
        },
        //获取我的订单
        async myOrder() {
          const result = await this.$http.get(this.useAdress + "/mybatis/order/get")
          if (result.data.code == 0) {
            this.orderList = result.data.data
            this.orderList.forEach(o => {
              o.price = o.price/100
              o.status = o.status==-1?"未支付":"已支付"
            })
            this.orderListDialog = true
          }else {
            this.$message.error(result.data.msg)
            this.user = {}
          }
        },
        //支付订单
        async handlePay(orderId) {
          window.open(this.useAdress + "/mybatis/pay?orderId="+ orderId);
        }
      },
      created() {
        this.auth()
        this.loadGoodsList()
      }
    }
</script>

<style lang="less" scoped>
  .login-register,.welcome{
    position: absolute;
    top: 10px;
    right: 10px;
  }
ul{
  list-style: none;
  margin-left: 50px;
  li{
    display: inline;
    .price{
      color: red;
    }
    .policy{
      position: absolute;
      top: 0px;
      background-color: red;
      color: white;
    }
    .attr{
      color: #666;
      font-size: 12px;
      em{
        font-style: normal;
      }
      em:hover{
        color: red;
        cursor: pointer;
      }
    }
  }
}
  .list-wrap{
    float: left;
    width: 300px;
    margin-left: 20px;
    margin-bottom: 20px;
  }
  .fr{
    clear: both;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
