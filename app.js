import React from 'react';
var $ = require("jquery");

class WagesTable extends React.Component{
    constructor(props) {
        super(props);
        this.handleSortClick = this.handleSortClick.bind(this);
    }
    handleSortClick(e){
        let column = e.target.innerHTML.replace(/ +/g, "");
        this.props.sortCol(column);
    }
    render () {
        var rows = [];
        this.props.records.forEach((item,i) => {
            var color;
            if(i%2 === 0){
                color ='#ecf0f1'
            }else{
                color = 'white'
            }
            rows.push( <tr style={{ backgroundColor:color}}>
            <td style={tdCls1}> {item.jobtitle}</td>
            <td style={tdCls}> {item.no_female_empl}</td>
            <td style={tdCls}> {item.female_avg_hrly_rate}</td>
            <td style={tdCls}> {item.no_male_empl}</td>
            <td style={tdCls}> {item.male_avg_hrly_rate} </td>
            </tr>);
        });
        return(
            <table style={styles}>
            <thead>
            <tr style= {theadStyle}>
        <th style={thStyle} onClick={this.handleSortClick}>Job Title </th>
        <th style={thStyle} onClick={this.handleSortClick}>Female Employees </th>
        <th style={thStyle} onClick={this.handleSortClick}>Avg Female Hourly Wages</th>
        <th style={thStyle} onClick={this.handleSortClick}>Male Employees </th>
        <th style={thStyle} onClick={this.handleSortClick}>Avg Male Hourly Wages </th>
        </tr>
        </thead>
        <tbody>{rows}</tbody>
        </table>
    );
    }
}

class PageSizeSelection extends React.Component{
    constructor(props) {
        super(props);
        this.handlePageSizeChange = this.handlePageSizeChange.bind(this);
    }

    handlePageSizeChange(e){
        this.props.onSelectionChange(e.target.value);
    }

    render () {
    var rows =[];
    [5,10,25].forEach(function (number) {
        rows.push(<option value={number} >{number}</option>);
     });

    return(
     <div style={{ paddingLeft:'0.7em'}}> <label>Select Size:</label>  <select value = {this.props.selection} onChange = {this.handlePageSizeChange}>
     {rows} </select >
         </div>
    );
    }
}

class FilterSelection extends React.Component{
    constructor(props) {
        super(props);
        this.handleFilterChange = this.handleFilterChange.bind(this);
    }

    handleFilterChange(e){
        this.props.onFilterChange(e.target.value);
    }
 render () {
        var rows =[];
        rows.push(<option value="" selected disabled hidden></option>);
        rows.push(<option value='menEarnMore' >Men earn more</option>);
        rows.push(<option value='womenEarnMore' >Women earn more</option>);
        rows.push(<option value='wageGap1' >Wage gap is more than 50 cent</option>);
        rows.push(<option value='equal' >Men and women have equal pay</option>);
        rows.push(<option value='clear' >clear filter</option>);
        return(
        <div style={{ paddingLeft:"4em"}}> <label> Select where:</label>  <select value = {this.props.selection} onChange = {this.handleFilterChange}>
        {rows} </select >
        </div>
    );
    }
}


class PageLinks extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(val){
        this.props.onPrevNextClick(val);
    }

    pageCount(){
       var numPages = Math.floor(this.props.linksTotal / this.props.pageSize)
            if (this.props.linksTotal % this.props.pageSize > 0) {
                numPages++
            }
            return numPages
    }
    render () {
        var pageLinks = [];
        var count = this.pageCount();
        if (this.props.currentPage > 1) {
            if (this.props.currentPage > 2) {
                pageLinks.push(<span className="pageLink" onClick={()=>this.handleClick(1)}><span style={arStyle}>  «  </span></span>)
                pageLinks.push(' ')
            }
            pageLinks.push(<span className="pageLink" onClick={()=>this.handleClick(this.props.currentPage - 1)}><span style={arStyle}>  ‹  </span></span>)
            pageLinks.push(' ')
        }
        if (this.props.currentPage <= count) {
            pageLinks.push(' ')
            pageLinks.push(<span className="pageLink" style={pLinks} onClick={()=>this.handleClick(this.props.currentPage + 1)}>Showing Results  {this.props.currentPage} of {count}<span style={arStyle}>  ›  </span></span>)
            if (this.props.currentPage < count - 1) {
                pageLinks.push(' ')
                pageLinks.push(<span className="pageLink" style={pLinks} onClick={()=>this.handleClick(count)}><span style={arStyle}>»</span> </span>)
            }
        }
        return (
         <div style={{ paddingLeft:".8em",fontWeight:700}} className="pagination" >  {pageLinks}</div>
    )
    }

}

class App extends React.Component {
    constructor() {
        super();
        this.state = {data: [], currentPage: 1,  total:20, pageSize:5, currentSort:'asc', currentFilter:''};
        this.handlePrevNextClick = this.handlePrevNextClick.bind(this);
        this.handlePageSizeChange = this.handlePageSizeChange.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleSortClick =  this.handleSortClick.bind(this);
    }

     fetchUrl(url){
        fetch(url).then((response) => {
            return response.json();
        }).then((data) => {
            this.setState({ data: data.data})
            this.setState({total:data.size});
        }).catch((err) => {
            throw new Error(err);
        });
    }

    componentDidMount() {
        let url = 'http://localhost:3000/wages?count='+this.state.pageSize;
        this.fetchUrl(url);
    }

    handlePageSizeChange(val) {
        this.setState({
            pageSize: val
        });
        this.setState({
            currentPage:1
        });
        var url = "http://localhost:3000/wages?count="+val;
        this.fetchUrl(url);
    }

    handleFilterChange(val){
        this.setState({
            currentFilter:val
        })
        this.setState({
            currentPage:1
        })
  //      alert(val);
        var url = "http://localhost:3000/wages?count="+this.state.pageSize+'&filter='+val;
        this.fetchUrl(url);

    }
    handlePrevNextClick(val) {
        this.setState({
            currentPage: val
        });
        let start = Number(val-1) * Number(this.state.pageSize);
       var url = "http://localhost:3000/wages?count="+this.state.pageSize+"&start="+start+'&filter='+this.state.currentFilter;
        this.fetchUrl(url);
    }

    handleSortClick(column){
        var sort = this.state.currentSort==='asc' ? 'des': 'asc';
        this.setState({
            currentSort:sort
        });
        let url = 'http://localhost:3000/wages?count='+this.state.pageSize+'&sortBy='+column+'&sortOrder='+sort;
        this.fetchUrl(url);
    }

    render() {
        return(
        <div>
        <div style={inlineStyle}>
        < PageSizeSelection selection = {this.state.pageSize} onSelectionChange = {this.handlePageSizeChange}/>
        < FilterSelection filterSelection onFilterChange = {this.handleFilterChange}/>
        </div>
        < WagesTable sortCol = {this.handleSortClick} records = {this.state.data} />
        < PageLinks linksTotal = { this.state.total} currentPage = {this.state.currentPage} pageSize = {this.state.pageSize} onPrevNextClick = { this.handlePrevNextClick}/>
        </div>
      )
    }
}

var marginStyle ={
    margin:0
}
const pLinks ={
    color: '#4183C4',
   cursor: "pointer",
    textAlign:"center"
}
const styles = {
    margin: "0.5em",
    paddingLeft: "1px",
    listStyle: 'none',
    border: "1px solid ",
    width: "90%",
}
const tdCls ={
    paddingRight:"1em",
    textAlign: "right",
    margin:"5px",
    height:"30px"
}
const tdCls1 = {
    paddingLeft:".5em",
    textAlign: "left",
    margin:"5px",
    height:"30px"
}
const thStyle ={
    textAlign:"center",

}
const arStyle ={
    fontSize: '1.25em',
    color: '#4183C4'
}
const theadStyle ={
    height:'50px'
}
const inlineStyle = {
 display:"inline-flex"
}

export default App;