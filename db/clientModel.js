import { Schema, model } from 'mongodb';

const clientSchema = new Schema({
  name: { type: String, required: true, unique: true },
  count: { type: Number, required: true, min: 0 },
  expDate: Date
});

const CLient = model('CLient', clientSchema);
export default CLient;
