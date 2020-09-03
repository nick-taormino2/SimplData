import React, { Component } from 'react';
import './App.css';
import {  Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, CardLink} from 'reactstrap';

class App extends Component {

  constructor(props){
      super(props);

  
  this.state = {
    stockData : [],
    latestNews : [],
    cryptoEx : [],
    basicFin:[],
    latest: '{"data":[{"p":100,"s":"AAPL-Not up to date","t":1598628510519,"v":15}],"type":"trade"}',
    symbol:'AAPL'
    }

  const finnhub = require('finnhub');

  const api_key = finnhub.ApiClient.instance.authentications['api_key'];
  api_key.apiKey= "bt22qa748v6rjboup0vg";
  const finnhubClient = new finnhub.DefaultApi();

  finnhubClient.generalNews("general", {}, (error, data, response) => {
    this.setState({latestNews:data});
    //this.state.latestNews = data;
    //console.log(this.state.latestNews);
  });

  finnhubClient.stockSymbols("US", (error, data, response) => {
    this.setState({stockData:data});
    //this.state.stockData = data;
    //console.log(this.state.stockData);
  });

  finnhubClient.cryptoExchanges((error, data, response) => {
    this.setState({cryptoEx:data});
    //this.state.cryptoEx = data;
    //console.log(this.state.cryptoEx);
  });

  finnhubClient.companyBasicFinancials("AAPL", "margin", (error, data, response) => {
    this.setState({basicFin:data});
    //console.log(this.state.basicFin);
  });

  const socket = new WebSocket('wss://ws.finnhub.io?token=bt22qa748v6rjboup0vg');

// Connection opened -> Subscribe (grabs the current price for the symbol provided - use this for the graphs?)
socket.addEventListener('open', function (event) {
  socket.send(JSON.stringify({'type':'subscribe', 'symbol': this.state.symbol}))
  //socket.send(JSON.stringify({'type':'subscribe', 'symbol': 'BINANCE:BTCUSDT'}))
  //socket.send(JSON.stringify({'type':'subscribe', 'symbol': 'IC MARKETS:1'}))
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
    //console.log(string);
  }

  let handle = handleChange.bind(this);
}

//Nasdaq symbol
//ndaq
//dow symbol
//dow
  render() { 
      return ( 
         <div className="">
           <div className="">
             <div className="Main">
               <table className="table2">
               <tr><th>Welcome to</th></tr>
            <tr><th><h1>SimplData</h1></th></tr>
               <tr><th>Symbols</th></tr>
             {this.state.stockData.map((number) =>
             <tr><td><button className='myButton' onClick={(e) => {this.setState({symbol: number.symbol})}}>{number.symbol}</button></td></tr>
             )}
             </table>
             <table className="table3">
             <tr><td>Stock:<br/>{this.state.latest.replace(/{/g,"").replace("[","").replace(/}/g,"").replace("]","").replace(/"/g,'').split(",")[1].replace("s:","")}</td><td>Volume: {this.state.latest.replace(/{/g,"").replace("[","").replace(/}/g,"").replace("]","").replace(/"/g,'').split(",")[3].replace("v:","")}</td></tr>
             <tr><td><h1 className="green">Price: {this.state.latest.replace(/{/g,"").replace("[","").replace(/}/g,"").replace("]","").replace(/"/g,'').split(",")[0].replace("data:p:","")}</h1></td></tr>
             </table>
               <table className="table">
                 <tr><th>Latest Stories</th></tr>
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

export default App;