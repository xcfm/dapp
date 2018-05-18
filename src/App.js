import React, { Component } from 'react';
import { Button,Input,List } from 'antd';
import './App.css';

class App extends Component {
  dappAddress = "n1ohace8tpgWGdd13uww3pHYczXR5zsV61m";
  NebPay =require('nebpay');
  sha256 =require('js-sha256');
  nebPay =new this.NebPay();
  state={
    data: new Set(),
    input:'',
    lotterying :false,
    winner :''
  }
  handleAdd = ()=>{
    const inputs =this.state.input.split(' ').map(a =>a.trim()).filter(a =>a.length>0);
    const inputSet =new Set(inputs);
    this.state.data.forEach( a => inputSet.add(a));
    this.setState({data:inputSet,input:''});
  }
  handleLottery =()=>{
    if(this.state.data.size === 0){
      return;
    }
    this.setState({lotterying:true})
    console.log(JSON.stringify(Array.from(this.state.data)))
    const serialNumber = this.nebPay.call(this.dappAddress, 0,  'save',JSON.stringify(Array.from(this.state.data)), {    //使用nebpay的call接口去调用合约,
      listener: resp => console.log(resp)
    });
    console.log(serialNumber);
    const intervalQuery =setInterval(()=>{
        this.nebPay.queryPayInfo(serialNumber)
        .then( resp =>{
          console.log("tx result: " + resp)   //resp is a JSON string
              const respObject = JSON.parse(resp)
              if (respObject.code !== 0) {
                return ;
              }
              let winner = '';
              let winnerSha256 = '';
              this.state.data.forEach(a => {
                  let shaA = this.sha256(a + respObject.data.hash);
                  if (shaA > winnerSha256) {
                      winnerSha256 = shaA;
                      winner = a;
                  }
              }) 
              this.setState({lotterying:false,winner:winner}) 
              alert('获胜者是' + winner)
              clearInterval(intervalQuery) 
        })
    },5000);
       
  }
  render() { 
    return (
      <div className="App">
      <header className="App-header">
          <img src='https://xhzy-my.oss-cn-hangzhou.aliyuncs.com/h_img/test/logo.svg' className="App-logo" alt="logo" />
          <h2 className="App-title">星云抽奖中心</h2>
          <h3 className="App-title">每次抽奖均保存在链上,无法修改,公开透明</h3>
        </header>
      <h4  >{this.state.lotterying?'正在抽奖...':(this.state.winner?'获胜者是'+this.state.winner:'')}</h4>
      <Input placeholder="请输入要抽奖的人员,一次添加多人可以用空格键分隔" style={{width:575}} value={this.state.input} onChange={e=>this.setState({input:e.target.value})}></Input>
        <Button className="Button" onClick={this.handleAdd} >添加</Button>
        <Button className="Button" type="primary" onClick ={this.handleLottery}>开始抽奖</Button>   
        <List  style={{margin:10}} bordered  dataSource={this.state.data}  renderItem= { item =><List.Item actions={[<a onClick={ ()=> {
          this.state.data.delete(item);
          this.setState(this.state.data)}}>删除</a>]} > {item}</List.Item>}  ></List> 
      </div>
    );
  }
}

export default App;
