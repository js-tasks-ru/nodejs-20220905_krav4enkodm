import mongoose from 'mongoose';
// import beautifyUnique from 'mongoose-beautiful-unique-validation';
import config from '../config';

// mongoose.plugin(beautifyUnique);

export default mongoose.createConnection(config.mongodb.uri);
