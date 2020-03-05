<template>
  <div id="body">
        <el-form :model="form" :rules="rules" ref="form" size="mini" label-width="80px">
          <el-form-item  label="商品名称" prop="sku_id">
            <el-select v-model="form.sku_id" placeholder="请选择商品">
              <el-option
                v-for="item in goodsList"
                :key="item.id"
                :label="item.title"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item  label="商品原价">
            <el-tooltip content="单位:分" placement="top">
              <el-input  v-model="selectedPrice" :disabled="true"></el-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item prop="price" label="秒杀价格">
            <el-tooltip content="单位:分" placement="top">
              <el-input  v-model.number="form.price"></el-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item prop="quanty" label="秒杀库存">
            <el-input  v-model.number="form.quanty"></el-input>
          </el-form-item>
          <el-form-item label="开始时间" prop="begin_time">
            <el-date-picker
              v-model="form.begin_time"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" prop="end_time">
            <el-date-picker
              v-model="form.end_time"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item class="form-btn">
            <el-button type="primary" @click="submitForm('form')">提交</el-button>
            <el-button type="info" @click="resetForm('form')">重置</el-button>
          </el-form-item>
        </el-form>
  </div>
</template>

<script>
  export default {
    name: "Polity",
    data(){
      var checkKillPrice = (rule,value,callback) => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'));
        } else {
          if (value > this.selectedPrice) {
            callback(new Error('不能大于商品原价！'));
          } else {
            callback();
          }
        }
      };
      var checkQuanty = (rule,value,callback) => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'));
        } else {
          if (value < 0) {
            callback(new Error('库存必须大于0'));
          } else {
            callback();
          }
        }
      };
      var checkEndTime = (rule,value,callback) => {
        console.log("end time check")
        const beginTime = Date.parse(this.form.begin_time)
        const endTime = Date.parse(value)
        console.log("beginTime:" + beginTime + " ,end_time:" + endTime)
        if (endTime <= beginTime) {
          callback(new Error('结束时间必须大于开始时间'));
        } else {
          callback();
        }
      };
      return{
        form:{
          sku_id:"",
          price: "",
          quanty: "",
          begin_time: "",
          end_time: ""
        },
        rules: {
          sku_id: [
            {required: true, message: '请选择商品', trigger: 'blur'},
          ],
          price: [
            {required: true, message: '请输入秒杀价格', trigger: 'blur'},
            { validator: checkKillPrice, trigger: 'blur' }
          ],
          quanty: [
            {required: true, message: '请输入库存', trigger: 'blur'},
            { validator: checkQuanty, trigger: 'blur' }
          ],
          begin_time: [
            {required: true, message: '请输入开始时间', trigger: 'change'},
          ],
          end_time: [
            {required: true, message: '请输入结束时间', trigger: 'change'},
            { validator: checkEndTime, trigger: 'change' }
          ]
        },
        //待秒杀的商品列表
        goodsList:[],
        //正在被选择的商品
        selectedPrice:""
      }
    },
    computed:{
      skuId(){
        return this.form.sku_id
      }
    },
    watch:{
      //监控选中商品是否改变，如果改变就修改商品价格
      skuId(newVal,oldVal){
        console.log("skuId watch")
        if (newVal === oldVal)
          return null
        this.goodsList.forEach(good =>{
          if (good.id === newVal)
            this.selectedPrice = good.price
        })
      }
    },
    methods:{
      submitForm(formName){
        this.$refs[formName].validate(async (validate)=> {
          if (validate) {
            console.log("true")
            const {data: result} = await this.$http.post("http://localhost:7000/policy/add",
              JSON.stringify(this.form),{headers:{'Content-Type':'application/json'}});
            console.log(result);
            if (result.status == 201){
              this.$message.success("添加成功")
              this.resetForm('form')
            }else{
              this.$message.error("添加错误")
            }
          } else {
            this.$message.error("输入信息有误");
          }
        })
      },
      resetForm(formName){
        this.$refs[formName].resetFields();
      },
      async loadGoodsList() {
        const result = await this.$http.get("http://localhost:7000/sku/list")
        console.log(result)
        if (result.status != 200)
          this.$message.error("获取数据失败！")
        this.goodsList = result.data
      }
    },
    created() {
      this.loadGoodsList()
    }
  }
</script>

<style lang="less" scoped>
  #body{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    .el-select{
      display: flex;
    }
  }
</style>
