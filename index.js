import React from 'react';
import AppViews from './views/AppViews';
import DeployerViews from './views/DeployerViews';
import AttacherViews from './views/AttacherViews';
import { renderDOM, renderView } from './views/render';
import './index.css';
import * as backend from './build/index.main.mjs';
import { loadStdlib } from '@reach-sh/stdlib';
const reach = loadStdlib(process.env);

import { ALGO_MyAlgoConnect as MyAlgoConnect } from '@reach-sh/stdlib';
reach.setWalletFallback(reach.walletFallback({
  providerEnv: 'TestNet', MyAlgoConnect }));

const {standardUnit} = reach;
const defaults = {defaultFundAmt: '5', standardUnit}

class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {view: 'ConnectAccount', ...defaults}
    }
    async componentDidMount() {
        const acc = await reach.getDefaultAccount();
        const balAtomic = await reach.balanceOf(acc);
        const bal = reach.formatCurrency(balAtomic, 4);
        this.setState({acc,bal});
        if(await reach.canFundFromFaucet()){
            this.setState({view: 'FundAccount'});
        }else{
            this.setState({view: 'DeployerOrAttacher'});
        }
    }
    async fundAccount(fundAmount){
        await reach.fundFromFaucet(this.state.acc, reach.parseCurrency(fundAmount));
        this.setState({view: 'DeployerOrAttacher'});
    }
    async skipFundAccount(){ this.setState({view: 'DeployerOrAttacher' }); }
    selectAttacher() { this.setState({view: 'Wrapper', ContentView: Attacher}); }
    selectDeployer() { this.setState({view: 'Wrapper', ContentView: Deployer}); }
    render(){return renderView(this, AppViews);}
}

class User extends React.Component {
    random() { return reach.hasRandom.random(); }
    async setDetails(){
        const obj = await new Promise(resolvedObj => {
            this.setState({view:'SetDetails', resolvedObj});
        });

        const { id, brand, name, info, origin, date, retailer } = obj;

        return { id, brand, name, info, origin, date, retailer }
    }
    resolved(id, brand, name, info, origin, date, retailer) {
         const resolvedObj = {id, brand, name, info, origin, date, retailer}
         this.state.resolvedObj(resolvedObj); 
    }

    async getDetails(product){
        return await new Promise(resolvedGetDetailP => {
            this.setState({
                view:'ShowAuthenticity', 
                id: product.id,
                brand: product.brand, 
                name: product.name, 
                info: product.info,
                origin: product.origin,
                date: product.date, 
                retailer: product.retailer, resolvedGetDetailP});
        })       
    }
    showDetails(){
        this.state.resolvedGetDetailP();
        this.setState({view: 'Outcome'});
    }
}

class Deployer extends User {
    constructor(props){
        super(props);
        this.state = {view:'Deploy'}
    }
    async deploy() {
        const ctc = this.props.acc.contract(backend);
        this.setState({view: 'Deploying', ctc});
        backend.Alice(ctc, this);
        const ctcInfoStr = JSON.stringify(await ctc.getInfo(), null, 2);
        this.setState({view: 'WaitingForAttacher', ctcInfoStr});
    }
    render() { return renderView(this,DeployerViews); }
}

class Attacher extends User {
    constructor(props){
        super(props);
        this.state = {view: 'Attach'};
    }
    attach(ctcInfoStr){
        const ctc = this.props.acc.contract(backend, JSON.parse(ctcInfoStr));
        this.setState({view: 'Attaching'});
        backend.Bob(ctc, this);
    }
    render() {return renderView(this, AttacherViews); }
}

renderDOM(<App />);