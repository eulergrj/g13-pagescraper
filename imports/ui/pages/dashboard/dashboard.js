import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import Contracts from '/imports/api/contracts/contracts';
import {getTotal, getViagens} from "/imports/api/contracts/methods"
import './dashboard.html';

Template.dashboard.onCreated(function bodyOnCreated() {
    let $this = this;  
    this.state = new ReactiveDict();   
    this.state.set("contracts", null);
    this.state.set("totalViagens", null);
    this.state.set("total", null);
    this.state.set("avg", null);
    let dt;

    // let handler = this.subscribe('contracts.listAll');   
    // this.autorun(function() {        
    //     if(handler.ready()){       
    //         let ctrs = Contracts.find().fetch();            
    //         $this.state.set("contracts", ctrs);
    //     }
    // }); 


});

Template.dashboard.onRendered(function() {  
        
    getTotal.call((err, res) => {        
        if(res){
            this.state.set('total', res);
        }
        if(err) console.log(err);
    }); 
    
    getViagens.call((err, res) => {        
        if(res){
            this.state.set('contracts', res);
            this.state.set('totalViagens', res.length);


            let totalCts = res.length;
            let totalPrice = 0;                              
            let id = 0;

            res.forEach(el => {
                let preco = el.precCtr.replace("€", '');
                preco = preco.replace('.', '');
                preco = preco.replace(',', '.');                                
                preco = parseFloat(preco);
                totalPrice += preco;
                id++;
                

                if(id == totalCts){
                    let avg = (totalPrice / totalCts).toFixed(2);
                    this.state.set('avg', avg);

                    avg = parseFloat(avg);
                    let margem = (avg * 0.5).toFixed(2);        
                    margem = parseFloat(margem);                                    

                    let min = avg - margem;
                    min = min.toFixed(2);
                    this.state.set('min', min);

                    let max = avg + margem;
                    max = max.toFixed(2);
                    this.state.set('max', max);          
                }

            }); 


        }
        if(err) console.log(err);
    }); 
});

Template.dashboard.helpers({
    total(){        
        let cts = Template.instance().state.get("total");                        
        if(cts) return cts;
    },
    totalViagens(){        
        let cts = Template.instance().state.get("totalViagens");                        
        if(cts) return cts;
    },
    minMax(attr){
        let v = attr.hash.v;        
        let min = Template.instance().state.get("min");  
        let max = Template.instance().state.get("max");  
        if(min && max){
            if(v == 0) return min.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");;
            if(v == 1) return max.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");;        
        }
    },
    mediaPreco(){
        let avg = Template.instance().state.get("avg");                                
        if(avg) return avg.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    TN(){
        let fn = 0;
        let cts = Template.instance().state.get("contracts");     
        let max = Template.instance().state.get("max");     
        let min = Template.instance().state.get("min");     
        if(cts){            
            cts.forEach(el => {
                let preco = el.precCtr.replace("€", '');
                preco = preco.replace('.', '');
                preco = preco.replace(',', '.');                                
                preco = parseFloat(preco);
                if(preco <= min || preco >= max) fn++                                

            }); 
        }

        return fn;
    },
    TP(){
        let fp = 0;
        let cts = Template.instance().state.get("contracts");     
        let max = Template.instance().state.get("max");     
        let min = Template.instance().state.get("min");     
        if(cts){            
            cts.forEach(el => {
                let preco = el.precCtr.replace("€", '');
                preco = preco.replace('.', '');
                preco = preco.replace(',', '.');                                
                preco = parseFloat(preco);
                if(preco >= min && preco <= max) fp++
            }); 
        }

        return fp;
    },
});

Template.dashboard.events({  
});

