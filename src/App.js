import React from 'react';
import ReactDOM from 'react-dom'
import InputRange from 'react-input-range';

class App extends React.Component {
  constructor(props) {
    super(props);
 
    // this.loanAmt = React.createRef();
    // this.noOfMonths = React.createRef();

    this.state = {
      amtValue: 500,
      monthsValue: 6,
      interestRate:0,
      monthlyPayment:0,
      sideBarData:[]
    }
    this.calculate=this.calculate.bind(this);
    this.updateSearch = this.updateSearch.bind(this);
    localStorage.clear();
  }
  calculate() {
    var url="https://ftl-frontend-test.herokuapp.com/interest?amount="+this.state.amtValue+"&numMonths="+this.state.monthsValue;
    fetch(url).then(
      results => {
        return results.json();
      }
    ).then(data => {
      let interestRate = data.interestRate;
      let monthlyPayment = data.monthlyPayment.amount;
      this.setState({interestRate: interestRate});  
      this.setState({monthlyPayment: monthlyPayment});
      this.onSearchResult();
    });     
  }

  onSearchResult() {
    let searchResult = {
      amount : this.state.amtValue,
      noOfMonths : this.state.monthsValue,
      interestRate : this.state.interestRate,
      monthlyPayment : this.state.monthlyPayment
    };

    if(localStorage.getItem('sideBarData')!=null && localStorage.getItem('sideBarData').length>0)
    {
      let sideBarDataString = localStorage.getItem('sideBarData');
      let sideBarData = JSON.parse(sideBarDataString);
      console.log(sideBarData.length);
      sideBarData.push(searchResult);
      localStorage.setItem('sideBarData',JSON.stringify(sideBarData));
      this.setState({sideBarData:sideBarData});
    }
    else{
      let sideBarData = [];
      sideBarData.push(searchResult);
      localStorage.setItem('sideBarData',JSON.stringify(sideBarData));
      this.setState({sideBarData:sideBarData});
    }
  };

  updateSearch(index) {
    let sideBarData = localStorage.getItem('sideBarData');
    let sideBarArray = JSON.parse(sideBarData);
    let data = sideBarArray[index];
    // React.findDOMNode(this.refs.loanAmt).value= data.amount;
    // React.findDOMNode(this.refs.noOfMonths).value= data.noOfMonths;
    this.refs.loanAmt.value = data.amount;
    this.refs.noOfMonths.value = data.noOfMonths;
    document.getElementById("interest").value = data.interestRate;
    document.getElementById("payment").value = data.monthlyPayment;
  };

   render() {
      return (
         <div class="container-fluid">
         <h1 class="h1" style={{textAlign: "center"}}>EMI Calculator</h1>
         <div class="row">
            <div class="main col-8" style={{marginTop: "5%", marginLeft: "2%", border: "1px solid black", padding: "30px"}}>
            <div class="row">
              <div class="col-4">
                  <label>Enter number of months:</label>
              </div>
              <div class="col-4 months" >
              <InputRange ref="noOfMonths" id="noOfMonths" class="noOfMonths" maxValue={24} minValue={6} value={this.state.monthsValue} onChange={monthsValue => this.setState({ monthsValue })} />
              </div>
            </div>
            <div class="row"  style={{marginTop: "5%"}}>
              <div class="col-4">
                  <label>Select loan amount: (in $)</label>
              </div>
              <div class="col-6 amount">
                  <InputRange ref="loanAmt" id="loanAmt" class="loanAmt" maxValue={5000} minValue={500} value={this.state.amtValue} onChange={amtValue => this.setState({ amtValue })} />
              </div>
            </div>
            
            <div class="row"  style={{marginTop: "5%"}}>
                <div class="col-4">
                    <label>Interest rate:</label>
                </div>
                <div class="col-4" ref="interest">
                  <input type="text" id="interest" value={this.state.interestRate} style={{border: "none", width:"30px"}}></input>%
                </div>
            </div>
            <div class="row"  style={{marginTop: "5%"}}>
                <div class="col-4">
                    <label>Amount to be paid monthly:</label>
                </div>
                <div class="col-4" ref="payment">
                $<input type="text" id="payment" value={this.state.monthlyPayment} style={{border: "none"}}></input>
                
                </div>
            </div>
            
            <div class="button" style={{float: "right"}}>
              <button class="btn btn-primary" onClick={this.calculate}>Check Interest</button>
            </div>
          </div>
        
            
            <div class="sidebar col-2" style={{marginTop: "5%", marginLeft: "2%", border: "1px solid black", padding: "30px"}}>
              <div class="row">
                <div id="collapse" style={{overflowY:"scroll", height:"300px"}}>
                <table class="table table-hover">
                <thead>
                  <th>LoanAmt</th>
                  <th>Months</th>
                </thead>
                <tbody class="smooth-scroll">
                  
                    {this.state.sideBarData.map((hits, index) =>(
                      <tr>
                      <td key={index} onClick={() => {this.updateSearch(index)}}>{hits.amount}</td>
                      <td key={index} onClick={() => {this.updateSearch(index)}}>{hits.noOfMonths}</td>
                      </tr>
                      ))}
                  
                </tbody>
              </table>
                </div>

                
              </div>
            </div>
          </div>
        </div>
           
      );
   }
}
export default App;
