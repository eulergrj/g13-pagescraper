import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import {saveContract} from "/imports/api/contracts/methods"
import './importer.html';

Template.importer.onCreated(function bodyOnCreated() {});

Template.importer.onRendered(function() {});

Template.importer.helpers({    
});

Template.importer.events({ 
    'change #selectfile'(e, instance){
        var func = this;
        var file = e.currentTarget.files[0];
        var reader = new FileReader();        
        

        reader.readAsBinaryString(file);
        reader.onload = function(file) {            
            let xml = reader.result;                                                            
            xml = xml.replace("ï»¿", "");                        
            var parseString = require('xml2js').parseString;
            parseString(xml, function (err, result) {
                let json = result.Base.Contrato;                                
                processJson(json);
            });
         };

        // reader.readAsBinaryString(file);
        // reader.onload = function(file) {            
        //     let json = reader.result;                                                
        //     processJson(json);
        //  };
    } 
});

function processJson(json){
    // json = JSON.parse(json);
    let total = json.length;
    let processed = 0;
    let err = 0;

    // console.log(total);

    json.forEach(el => {        
        let id = el.Link[0].replace("http://www.base.gov.pt/Base/pt/Pesquisa/Contrato?a=", ' ');
        let obj = el.Detalhes;    

        let ct = {    
            "ctrNum" : parseInt(id),
            "publiDate" : obj[0].$.Valor,
            "ctrType" : obj[1].$.Valor,
            "procType" : obj[2].$.Valor,
            "desc" : obj[3].$.Valor,
            "fund" : obj[4].$.Valor,
            "fundap" : obj[5].$.Valor,
            "entAdje" : obj[6].$.Valor,
            "entAdja" : obj[7].$.Valor,
            "objCtr" : obj[8].$.Valor,
            "procCent" : obj[9].$.Valor,
            "cpv" : obj[10].$.Valor,
            "dataCCtr" : obj[11].$.Valor,
            "precCtr" : obj[12].$.Valor,
            "prazExe" : obj[13].$.Valor,
            "locExe" : obj[14].$.Valor,
            "conc" : obj[15].$.Valor,
            "anun" : obj[16].$.Valor,
            "increm" : obj[17].$.Valor,
            "docs" : obj[18].$.Valor,
            "obs" : obj[19].$.Valor,
            "dataFecho" : obj[20].$.Valor,
            "precTotal" : obj[21].$.Valor,
            "altPrazo" : obj[22].$.Valor,
            "altPreco" : obj[23].$.Valor 
        }

        // console.log(ct);

        saveContract.call(ct, (er, res) => {
            if(er) err++                    
            if(res){
                processed++;
                if((processed + err) == total){
                    // alert(`FINISHED! SUCCESS: ${processed - err} ERRORS: ${err}`);
                    location.reload();
                }

            }    
        }); 


        // if((processed + err) == total){
        //     // alert(`FINISHED! SUCCESS: ${processed - err} ERRORS: ${err}`);
        //     location.reload();
        // }
        
    });
}

// function processJson(json){
//     // json = JSON.parse(json);
//     let total = json.length;
//     let processed = 0;
//     let err = 0;

//     // console.log(total);

//     json.forEach(el => {
//         console.log(el);
//         let id = el.Link.replace("http://www.base.gov.pt/Base/pt/Pesquisa/Contrato?a=", ' ');
//         let obj = el.Detalhes;    

//         let ct = {    
//             "ctrNum" : parseInt(id),
//             "publiDate" : obj[0]._Valor,
//             "ctrType" : obj[1]._Valor,
//             "procType" : obj[2]._Valor,
//             "desc" : obj[3]._Valor,
//             "fund" : obj[4]._Valor,
//             "fundap" : obj[5]._Valor,
//             "entAdje" : obj[6]._Valor,
//             "entAdja" : obj[7]._Valor,
//             "objCtr" : obj[8]._Valor,
//             "procCent" : obj[9]._Valor,
//             "cpv" : obj[10]._Valor,
//             "dataCCtr" : obj[11]._Valor,
//             "precCtr" : obj[12]._Valor,
//             "prazExe" : obj[13]._Valor,
//             "locExe" : obj[14]._Valor,
//             "conc" : obj[15]._Valor,
//             "anun" : obj[16]._Valor,
//             "increm" : obj[17]._Valor,
//             "docs" : obj[18]._Valor,
//             "obs" : obj[19]._Valor,
//             "dataFecho" : obj[20]._Valor,
//             "precTotal" : obj[21]._Valor,
//             "altPrazo" : obj[22]._Valor,
//             "altPreco" : obj[23]._Valor 
//         }

//         saveContract.call(ct, (er, res) => {
//             if(er) err++                        
//         }); 

//         processed++

//         if((processed + err) == total){
//             alert(`FINISHED! SUCCESS: ${processed - err} ERRORS: ${err}`);
//         }
        
//     });
// }
