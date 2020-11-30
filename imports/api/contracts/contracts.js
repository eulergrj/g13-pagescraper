import {Mongo} from 'meteor/mongo';


const Contracts = new Mongo.Collection('contracts');

Contracts.toggleActive = function(_id) {
    const map = Contracts.findOne(_id);
    return Contracts.update({ _id: _id }, { $set: { active: !map.active } });
};


export default Contracts;

Contracts.allow({
    insert: () => false,
    update: () => false,
    remove: () => false,
});

Contracts.deny({
    insert: () => true,
    update: () => true,
    remove: () => true,
});
