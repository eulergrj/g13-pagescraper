import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import './dashboard.html';

Template.dashboard.onCreated(function bodyOnCreated() {
    this.state = new ReactiveDict();    
    // const mapHandler = this.subscribe('maps.listActive');  
  
    //   this.autorun(function() {
    //     if(handler.ready()){      
    //     }
    //   });  

});

Template.dashboard.onRendered(function() {  

});

Template.dashboard.helpers({
});

Template.dashboard.events({  
});

