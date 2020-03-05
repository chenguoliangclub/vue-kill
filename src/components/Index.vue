<template>
  <div>
    <!--注册登录-->
    <div class="login-register">
      <a href="javascript:" @click="dialogLogin = true">登录/</a>
      <a href="javascript:" @click="dialogRegister = true">注册</a>
    </div>
    <!--搜索结果展示-->
    <div class="goods-list">
      <ul >
        <li class="" v-for="goods in goodsList">
          <div class="list-wrap" >
            <div class="p-img">
              <a :href=" 'item/' + goods.id +'.html'" target="_blank"><img :src="'/static/images/' + goods.images" height="200"/></a>
            </div>
            <div v-if="goods.policy" class="policy">
              <em>秒杀价格:{{goods.policy.price}}</em>
              <em>剩余:{{goods.policy.quanty}}件</em>
              <em>剩余时间:{{timeList[goods.id]}}</em>
            </div>
            <div class="price">
              <strong>
                <em>¥</em>
                <i>{{goods.price}}</i>
              </strong>
            </div>
            <div class="attr">
              <em>{{goods.title}}</em>
            </div>
            <div class="operate">
              <a href="javascript:"  @click="kill(goods.id)">立即抢购</a>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="fr">
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
    </div>
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
        <el-button type="primary" @click="dialogRegister = false">确 定</el-button>
      </div>
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
        return{
          goodsList:[],
          timeList:{
          },
          dialogLogin: false,
          dialogRegister: false,
          loginForm: {
            username: '',
            password: ''
          },
          registerForm: {
            username: '',
            password: '',
            repassword: ''
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
          }
        }
      },
      methods: {
        //加载商品信息
        async loadGoodsList() {
          const result = await this.$http.get("http://localhost:7000/sku/list")
          if (result.status != 200)
            this.$message.error("获取数据失败！")
          this.goodsList = result.data
          this.goodsList.forEach(good => {
            if (good.policy){
              const endTime = new Date(good.policy.end_time).getTime()
              const now = new Date().getTime()
              if ( now < endTime ){
                const h = Math.floor(Math.floor((Math.floor(endTime - now)/1000)/60)/60)
                const m = Math.floor((Math.floor(endTime - now)/1000)/60)%60
                const s = Math.floor((endTime - now)/1000)%60
                this.timeList[good.id] =  h + ":" + m + ":" + s
              }
              else
                this.timeList[good.id] = "活动已结束"
            }
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
        //立即抢购业务处理逻辑
        async kill(id) {
          const result = await this.$http.post("http://localhost:4000/user/auth")
          console.log(result)
          if(result.data.code == -1){
            this.$alert('检测到您未登录，请先登录！', '提示', {
              confirmButtonText: '确定',
              callback: action => {
                this.$message({
                  type: 'info',
                  message: `请先登录`
                });
              }
            });
          }
        },
        //提交登录表单
        async submitLoginForm() {
          const result = await this.$http.post("http://localhost:4000/user/login", this.loginForm)
          console.log(result)
        }
      },
      computed:{

      },
      created() {
        this.loadGoodsList()
        this.setTimeRun()
      }
    }
</script>

<style lang="less" scoped>
  .login-register{
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
</style>
