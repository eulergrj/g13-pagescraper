import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import Contracts from '/imports/api/contracts/contracts';
import {getTotal, getViagens} from "/imports/api/contracts/methods"
import './dashboard.html';
import moment from "moment";
import datatables from 'datatables.net';
import datatables_bs from 'datatables.net-bs';
import 'datatables.net-bs/css/dataTables.bootstrap.css';

Template.dashboard.onCreated(function bodyOnCreated() {
    let $this = this;
    datatables(window, $);
    datatables_bs(window, $);

    this.state = new ReactiveDict();   
    this.state.set("contracts", null);
    this.state.set("totalViagens", null);
    this.state.set("total", null);
    this.state.set("avg", null);
    this.state.set("data", null);
    this.state.set("view", null);
    this.state.set("FP", 9);
    this.state.set("FN", 62);
    let dt;

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

            let dtCtrs = res.map(c => {                
                let actions = `
                    <a href="" class="js-view btn-sm btn-primary" title="Ver Mais" data-id="${c._id}"><i class="fa fa-eye"></i></a>                    
                `;
                return [c.ctrNum, c.objCtr, actions];
            });
            
            //recreate datatable with new data
            dt = $('#mytable').DataTable({
                data: dtCtrs,
                order: [[ 0, "desc" ]],                
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
    viagens(){
        let cts = Template.instance().state.get("contracts");       
        console.log(cts);                 
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
        let TN = 0;
        let cts = Template.instance().state.get("contracts");     
        let max = Template.instance().state.get("max");     
        let min = Template.instance().state.get("min");     
        let FN = Template.instance().state.get("FN");  

        if(cts){            
            cts.forEach(el => {
                let preco = el.precCtr.replace("€", '');
                preco = preco.replace('.', '');
                preco = preco.replace(',', '.');                                
                preco = parseFloat(preco);
                if(preco <= min || preco >= max) TN++                                

            }); 
        }

        return TN - FN;
    },
    TP(){
        let TP = 0;
        let cts = Template.instance().state.get("contracts");     
        let max = Template.instance().state.get("max");     
        let min = Template.instance().state.get("min");  
        let FP = Template.instance().state.get("FP");  
          
        if(cts){            
            cts.forEach(el => {
                let preco = el.precCtr.replace("€", '');
                preco = preco.replace('.', '');
                preco = preco.replace(',', '.');                                
                preco = parseFloat(preco);
                if(preco >= min && preco <= max) TP++
            }); 
        }

        return TP - FP;
    },
    FP(){
        let num = Template.instance().state.get("FP");                        
        if(num) return num;
    },    
    FN(){
        let num = Template.instance().state.get("FN");                        
        if(num) return num;
    },    
    view(){
        let ctr = Template.instance().state.get("view");
        if(ctr) return ctr;
    }
});

Template.dashboard.events({  
    "click .js-view"(e, instance){
        e.preventDefault();
        let id = $(e.currentTarget).attr("data-id");      
        let cts = Template.instance().state.get("contracts");  
        let ctr = cts.find(el => el._id == id);
        console.log(ctr);
        instance.state.set("view", ctr);        
        $('#viewContract').modal('show');
    },
    "change #FP"(e, instance){
        e.preventDefault();
        let val = $(e.currentTarget).val();
        instance.state.set("FP", val);
    },
    "change #FN"(e, instance){
        e.preventDefault();
        let val = $(e.currentTarget).val();
        instance.state.set("FN", val);
    },
});

