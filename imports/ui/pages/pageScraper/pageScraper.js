import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import {saveContract,removeContract} from "/imports/api/contracts/methods"
import Contracts from '/imports/api/contracts/contracts';
import moment from "moment";

import datatables from 'datatables.net';
import datatables_bs from 'datatables.net-bs';
import 'datatables.net-bs/css/dataTables.bootstrap.css';
import './pageScraper.html';

Template.pageScraper.onCreated(function bodyOnCreated() {
    let $this = this;
    datatables(window, $);
    datatables_bs(window, $);
    
    this.state = new ReactiveDict();        
    this.state.set("data", null);
    this.state.set("amount", 1);
    this.state.set("next", 1);     
    this.state.set("processing", false);
    this.state.set("view", null);

});

Template.pageScraper.onRendered(function() {      
    let $this = this    
    let dt;
    let handler = this.subscribe('contracts.listAll');   

    this.autorun(function() {        
        if(handler.ready()){      
            
            let ctrs = Contracts.find({}, {sort: {ctrNum: -1}}).fetch();       
            $this.state.set("contracts", ctrs);
            let processing = $this.state.get("processing");            
            if(!processing){

                //destroy datatable
                if(dt) dt.destroy();
                
                if(ctrs.length > 0){
        
                    $this.state.set("next", (ctrs[0].ctrNum + 1));     
        
                    let dtCtrs = ctrs.map(c => {
                        let cdate = moment(c.createdAt).format("DD/MM/YYYY h:mm:ss a");
                        let udate = moment(c.updatedAt).format("DD/MM/YYYY h:mm:ss a");
                        let actions = `
                            <a href="" class="js-view btn-sm btn-primary" title="Ver Mais" data-id="${c._id}"><i class="fa fa-eye"></i></a>
                            <a href="" class="js-update btn-sm btn-success" title="Atualizar" data-id="${c._id}"><i class="fa fa-sync"></i></a>
                            <a href="" class="js-remove btn-sm btn-danger" title="Remover" data-id="${c._id}"><i class="fa fa-trash"></i></a>
                        `;
                        return [c.ctrNum, c.publiDate, c.objCtr, cdate, udate, actions];
                    });
                    
                    //recreate datatable with new data
                    dt = $('#mytable').DataTable({
                        data: dtCtrs,
                        order: [[ 0, "desc" ]],
                        columnDefs: [
                            { "width": "40%", "targets": 2 }
                        ]
                    });
                }
            }
        }
    }); 

});

Template.pageScraper.helpers({
    next(){        
        let next = Template.instance().state.get("next");                        
        if(next) return next;
    },
    amount(){        
        let amount = Template.instance().state.get("amount");                        
        if(amount) return amount;
    },
    total(){        
        let ctrs = Template.instance().state.get("contracts");                        
        if(ctrs) return ctrs.length;
    },
    view(){
        let ctr = Template.instance().state.get("view");
        if(ctr) return ctr;
    }

});

Template.pageScraper.events({  
    "click .js-scrape"(e, instance){
        e.preventDefault();        
        $(".js-scrape").prop("disabled", true);
        $(".js-spin").show();   
        instance.state.set("processing", true);  
        getData(instance);
    },
    "change .js-next"(e, instance){
        e.preventDefault();
        let val = $(e.currentTarget).val();
        instance.state.set("next", val);        
    },
    "change .js-amount"(e, instance){
        e.preventDefault();
        let val = $(e.currentTarget).val();
        instance.state.set("amount", val);        
    },
    "click .js-view"(e, instance){
        e.preventDefault();
        let id = $(e.currentTarget).attr("data-id");        
        let ctr = Contracts.findOne({_id: id});        
        instance.state.set("view", ctr);        
        $('#viewContract').modal('show');
    }
    
});


function getData(instance){    
    let next = parseInt(instance.state.get("next"));
    let amount = parseInt(instance.state.get("amount"));    
    let empty = 0;
    let success = 0;
    let startTime = moment();
    let endTime;

    for (let i = next; i < (next + amount); i++) {             
        let url = `http://www.base.gov.pt/Base/pt/Pesquisa/Contrato?a=${i}`;

        $.get("https://cors-anywhere.herokuapp.com/" + url, (data, status) => {
                
            if(status == "success"){            
                let parsed = new DOMParser().parseFromString(data, "text/html");
                let trs = $("tbody tr", parsed);

                if($("td", trs[0])[1].innerHTML != "-"){
                    
                    let ctr = {
                        "ctrNum"    : i, 
                        "publiDate" : $("td", trs[0])[1].innerHTML,
                        "ctrType"   : $("td", trs[1])[1].innerHTML,
                        "procType"  : $("td", trs[2])[1].innerHTML,
                        "desc"      : $("td", trs[3])[1].innerHTML,
                        "fund"      : $("td", trs[4])[1].innerHTML,
                        "fundap"    : $("td", trs[5])[1].innerHTML,
                        "entAdje"   : $("td", trs[6])[1].innerHTML,
                        "entAdja"   : $("td", trs[7])[1].innerHTML,
                        "objCtr"    : $("td", trs[8])[1].innerHTML,
                        "procCent"  : $("td", trs[9])[1].innerHTML,
                        "cpv"       : $("td", trs[10])[1].innerHTML,
                        "dataCCtr"  : $("td", trs[11])[1].innerHTML,
                        "precCtr"   : $("td", trs[12])[1].innerHTML,
                        "prazExe"   : $("td", trs[13])[1].innerHTML,
                        "locExe"    : $("td", trs[14])[1].innerHTML,
                        "conc"      : $("td", trs[15])[1].innerHTML,
                        "anun"      : $("td", trs[16])[1].innerHTML,
                        "increm"    : $("td", trs[17])[1].innerHTML,
                        "docs"      : $("td", trs[18])[1].innerHTML,
                        "obs"       : $("td", trs[19])[1].innerHTML,
                        "dataFecho" : $("td", trs[20])[1].innerHTML,
                        "precTotal" : $("td", trs[21])[1].innerHTML,
                        "altPrazo"  : $("td", trs[22])[1].innerHTML,
                        "altPreco"  : $("td", trs[23])[1].innerHTML,
                    }
                    
                    
                    saveContract.call(ctr, (err, res) => {
                        if(err) console.log(err);                        
                    }); 
                    
                    success++;

                } else {
                    empty++;
                }                
                
            }        
            
        })
        .fail((err) => {
            alert("Error: " + err.statusText);
        })
        .always(() => {            
            // run at the end of the loop
            if(i == (next + (amount - 1))){
                $(".js-spin").hide();
                $(".js-scrape").prop("disabled", false);
                instance.state.set("processing", false);  
                endTime = moment();
                let time = endTime.diff(startTime, 'seconds');
                setTimeout(() => {                    
                    alert(`Processo Finalizado!  Contratos Existentes: ${success}  |  inexistentes: ${empty}    |   Tempo: ${time}s`);
                }, 300);
            }
        });

        
    }
    
      
}
