const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
  content             : { type: String, required: true }
  , comments         : [{ type: Schema.Types.ObjectId, ref: 'Answer' }]
  , upVotes        : []
  , downVotes      : []
  , voteScore      : { type: Number, default: 0 }
});

// Autopopulation
const autoPopulateAnswers = function(next) {
  this.populate('comments');
  next();
};

AnswerSchema.
  pre('find', autoPopulateAnswers).
  pre('findOne', autoPopulateAnswers);

module.exports = mongoose.model('Answer', AnswerSchema);
