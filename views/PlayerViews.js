import React from 'react';

const exports = {};

// Player views must be extended.
// It does not have its own Wrapper view.

exports.SetDetails = class extends React.Component {
  render() {
    const {parent} = this.props;
    const { id, brand, name, info, origin, date, retailer } = this.state || {}
    return (
      <div>
      <h2>Enter Product Details</h2> <br />
      <div class="details">
      <div class="element"><p class="detailstype">Id       </p><p>:</p><input type="text" onChange={(e)=> this.setState({id: e.currentTarget.value})}></input></div>
      <div class="element"><p class="detailstype">Brand    </p><p>:</p><input type="text" onChange={(e)=> this.setState({brand: e.currentTarget.value})}></input></div>
      <div class="element"><p class="detailstype">Name     </p><p>:</p><input type="text" onChange={(e)=> this.setState({name: e.currentTarget.value})}></input></div>
      <div class="element"><p class="detailstype">Info     </p><p>:</p><input type="text" onChange={(e)=> this.setState({info: e.currentTarget.value})}></input></div>
      <div class="element"><p class="detailstype">Origin   </p><p>:</p><input type="text" onChange={(e)=> this.setState({origin: e.currentTarget.value})}></input></div>
      <div class="element"><p class="detailstype">Date     </p><p>:</p><input class="date" type="date" onChange={(e)=> this.setState({date: e.currentTarget.value})}></input></div>
      <div class="element"><p class="detailstype">Retailer </p><p>:</p><input type="text" onChange={(e)=> this.setState({retailer: e.currentTarget.value})}></input></div></div>
      <button 
        onClick={() =>{ parent.resolved(id,brand,name,info,origin,date,retailer);
          }} 
      >Submit</button>
    </div>
  );
  }
}

exports.WaitingForResults = class extends React.Component {
  render() {
    return (
      <div>
        Waiting for results...
      </div>
    );
  }
}

exports.Outcome = class extends React.Component {
  render() {
    const {id, brand, name, info, origin, date, retailer} = this.props;
    return (
      <div>
      <h2>Product details:</h2> 
      <div class="details">
      <div class="elements"><p class="detailstype">Product Id</p><p>:</p><p class="detailstype">{id}</p></div>
      <div class="elements"><p class="detailstype">Product Brand</p><p>:</p><p class="detailstype">{brand}</p></div>
      <div class="elements"><p class="detailstype">Product Name</p><p>:</p><p class="detailstype">{name}</p></div>
      <div class="elements"><p class="detailstype">Product Info</p><p>:</p><p class="detailstype">{info}</p></div>
      <div class="elements"><p class="detailstype">Product Origin</p><p>:</p><p class="detailstype">{origin}</p></div>
      <div class="elements"><p class="detailstype">Product Manufacture Date</p><p>:</p><p class="detailstype">{date}</p></div>
      <div class="elements"><p class="detailstype">Product Retailer</p><p>:</p><p class="detailstype">{retailer}</p></div>
      </div>
      </div>
    );
  }
}

exports.ShowAuthenticity = class extends React.Component {
  render() {
    const {parent} = this.props;
    return (
      <div>
        <h2>Your product is AUTHENTIC ! ! !</h2>
        <br />
        <button
          onClick={() =>{ parent.showDetails();}}
        >Click to show the product details</button>
      </div>
    );
  }
}
export default exports;