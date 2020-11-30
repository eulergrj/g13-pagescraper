import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';
import Contracts from '/imports/api/contracts/contracts';
import ContractSchema from './ContractSchema';

export const saveContract = new ValidatedMethod({
	name: 'contracts.upsert',
	validate: ContractSchema.validator(),
    run(ctr) {            
		let cNum = ctr.ctrNum;
		let c = Contracts.findOne({ctrNum: cNum});

        if(!c) {		
            ctr.createdAt = new Date();
            ctr.updatedAt = new Date();	
			return Contracts.insert(ctr);
		} else {
            ctr.updatedAt = new Date();	
			return Contracts.update({ _id: c._id }, { $set: ctr });
		}
    },
});

export const removeContract = new ValidatedMethod({
	name: 'contracts.remove',
	validate: new SimpleSchema({
		_id: { type: String }
	}).validator(),
	run({ _id }) {
		Contracts.remove(_id);
	},
});