import SimpleSchema from 'simpl-schema';
import MetaSchema from '/imports/api/commons/metaSchema';

const ContractSchema = new SimpleSchema({      
    _id:        {type: String, optional: true},       
    ctrNum:     {type: Number},
    publiDate:  {type: String},
    ctrType:    {type: String},
    procType:   {type: String},
    desc:       {type: String},
    fund:       {type: String},
    fundap:     {type: String},
    entAdje:    {type: String},
    entAdja:    {type: String},
    objCtr:     {type: String},
    procCent:   {type: String},
    cpv:        {type: String},
    dataCCtr:   {type: String},
    precCtr:    {type: String},
    prazExe:    {type: String},
    locExe:     {type: String},
    conc:       {type: String},
    anun:       {type: String},
    increm:     {type: String},
    docs:       {type: String},
    obs:        {type: String},
    dataFecho:  {type: String},
    precTotal:  {type: String},
    altPrazo:   {type: String},
    altPreco:   {type: String},
});
ContractSchema.extend(MetaSchema);

export default ContractSchema;
