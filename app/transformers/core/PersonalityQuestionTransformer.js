var fractal = require('fractal-transformer')();

class PersonalityQuestionTransformer {

  transform = (data) => fractal(data, {
    'id': 'id',
    'question': 'question',
    'options':  'options',
    'sequence': 'sequence',
    'status': function (data) {
      return data.get('status');
    }
  });
}

module.exports = PersonalityQuestionTransformer;
