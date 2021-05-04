var fractal = require('fractal-transformer')();

class PersonalityQuestionTransformer {

  transform = (data) => fractal(data, {
    'id': 'id',
    'question': 'question',
    'options':  function (data) {
      return data.get('personality_options');
    },
    'sequence': 'sequence',
    'status': function (data) {
      return data.get('status');
    }
  });
}

module.exports = PersonalityQuestionTransformer;
