import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import Contracts from '/imports/api/contracts/contracts';

Meteor.publish('contracts.listAll', function() {
	return Contracts.find();
});
