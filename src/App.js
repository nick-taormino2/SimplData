import React, { Component } from 'react';
import './App.css';
import logo from './simpldata.png';
import logo2 from './metacloud media4.png';
import { BrowserRouter as Router, Switch, Route, Link, useParams} from "react-router-dom";
import {  Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, CardLink} from 'reactstrap';

//Stock information page
class App extends Component {

  constructor(props){
      super(props);

  
  this.state = {
    priceTar: [],
    comp: [],
    latest: '{"data":[{"p":Market Closed,"s":"AAPL-Not up to date","t":1598628510519,"v":0}],"type":"trade"}',
    symbol: window.location.href.split("/")[3]
    }

  const finnhub = require('finnhub');

  const api_key = finnhub.ApiClient.instance.authentications['api_key'];
  api_key.apiKey= "bt22qa748v6rjboup0vg";
  const finnhubClient = new finnhub.DefaultApi();

  finnhubClient.companyProfile2({'symbol': this.state.symbol}, (error, data, response) => {
    this.setState({comp:data});
});


  finnhubClient.priceTarget(this.state.symbol, (error, data, response) => {
    this.setState({priceTar:data});
    console.log(this.state.priceTar);
});

  const socket = new WebSocket('wss://ws.finnhub.io?token=bt22qa748v6rjboup0vg');

// Connection opened -> Subscribe (grabs the current price for the symbol provided - use this for the graphs?)
socket.addEventListener('open', function (event) {
  socket.send(JSON.stringify({'type':'subscribe', 'symbol': this.state.symbol}))
}.bind(this));

// Listen for messages
socket.addEventListener('message', function (event) {
  handle(event);
});

  function handleChange(event){
    var string = event.data;
    if(!string.includes("ping"))
    {
      this.setState({latest:string});
    }
  }

  let handle = handleChange.bind(this);

}


  render() { 
      return ( 
         <div className="">
           <div className="">
             <div className="Main">
               <table className="table2">
                 <tr><td><Link to="/"><input type="button" value="Home" className="myButton" /></Link></td></tr>
            {
              <tr><td>
                <Card>
              <CardImg top width="100" height="100" src={this.state.comp.logo} alt="Card image cap" />
                <CardBody>
            <CardTitle>{this.state.comp.name}</CardTitle>
                  <CardText>{"Exchange: "}{this.state.comp.exchange}</CardText>
                  <CardText>{"Shares Available"}{": "}{this.state.comp.shareOutstanding}</CardText>
                  <CardText>{"Market Cap"}{": "}{this.state.comp.marketCapitalization}</CardText>
              </CardBody>
            </Card>
              </td></tr>
            }
             </table>
             <table className="table3">
             <tr><td>Stock:<br/>{this.state.symbol}</td><td>Volume: {this.state.latest.replace(/{/g,"").replace("[","").replace(/}/g,"").replace("]","").replace(/"/g,'').split(",")[3].replace("v:","")}</td></tr>
             <tr><td><h1 className="green">Price: {this.state.latest.replace(/{/g,"").replace("[","").replace(/}/g,"").replace("]","").replace(/"/g,'').split(",")[0].replace("data:p:","")}</h1></td></tr>
             </table>
             <table className="table4">
               {
               <tr><td><Card>
                 <CardBody>
                   <CardText>Target High: {this.state.priceTar.targetHigh}</CardText>
                   <CardText>Target Low: {this.state.priceTar.targetLow}</CardText>
                   <CardText>Target Mean: {this.state.priceTar.targetMean}</CardText>
                   <CardText>Target Median: {this.state.priceTar.targetMedian}</CardText>
               </CardBody>
             </Card></td></tr>
               }
               </table>
             </div>
           </div>
         </div>
       );
  }
}



//Home page and news
class App2 extends Component {

  constructor(props){
      super(props);

  
  this.state = {
    latestNews : [],
    searched : [],
    symbols: [],
    symbol:''
    }

  const finnhub = require('finnhub');

  const api_key = finnhub.ApiClient.instance.authentications['api_key'];
  api_key.apiKey= "bt22qa748v6rjboup0vg";
  const finnhubClient = new finnhub.DefaultApi();

  finnhubClient.generalNews("general", {}, (error, data, response) => {
    this.setState({latestNews:data});
  });

  finnhubClient.stockSymbols("US", (error, data, response) => {
    this.setState({symbols:data});
});

  this.handleChange = this.handleChange.bind(this);
  this.find = this.find.bind(this);
}
handleChange(event) {
  this.setState({symbol: event.target.value});
}
find(numbers){
  var ans = [];
  numbers.map((number) =>
  {
  if(this.state.symbol != "")
  {
    if(number.symbol.toLowerCase().includes(this.state.symbol.toLowerCase()) || number.description.toLowerCase().includes(this.state.symbol.toLowerCase()))
    {
      ans.push(number.description + " :" + number.symbol);
    }
  }
})
return ans;
}

  render() { 
      return ( 
         <div className="">
           <div className="">
             <div className="Main">
             <center>
            <input type="text" name="search" id="search" placeholder="search a company or symbol" className="search" value={this.state.symbol} onChange={this.handleChange}/>
            <p>Powered by </p>
            <img src={logo2} width="50" height="50"></img>
            </center>
            <ul>
            {this.find(this.state.symbols).map((number) => 
            <Link to={"/" + number.split(":")[1]}><li>{number}</li></Link>
            )}
            </ul>
               <table className="table">
                 <tr><th>General News</th></tr>
             {this.state.latestNews.map((number) =>
            <tr><td><Card>
              <CardImg top width="100" height="100" src={number.image} alt="Card image cap" />
                <CardBody>
                  <CardTitle>{number.category}{": "}{number.source}</CardTitle>
                  <CardSubtitle>{number.headline}</CardSubtitle>
                  <CardText>{number.summary}</CardText>
                  <CardLink href={number.url}>Full Article</CardLink>
              </CardBody>
            </Card></td></tr>
             )}
             </table>
             </div>
           </div>
         </div>
       );
  }
}

//header
export default function Navigation() {
  return (
    <Router>
      <div>
            <center><h1><img src={logo} width="500" height="400"></img></h1></center>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/:id" children={<Child/>} />
        </Switch>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <App2 />
  );
}

function Child() {

  let { id } = useParams();
  return (
    <App symbol={id}/>
  );
}


