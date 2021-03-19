var fractal = require('fractal-transformer')();

class ConversationStarterTransformer {

  transform = (data) => fractal(data, {
    'id': 'id',
    'question': 'question',
    'sequence': 'sequence',
    'status': function (data) {
      return data.get('status');
    }
  });
}

module.exports = ConversationStarterTransformer;
