var fractal = require("fractal-transformer")();

class ConversationStarterTransformer {
  static transform = (data) =>
    fractal(data, {
      id: "id",
      question: "question",
      sequence: "sequence",
      number_of_answer: "number_of_answer",
      answer_label: "answer_label",
      question_icon: "question_icon",
      status: function (data) {
        return data.get("status");
      },
    });
}

module.exports = ConversationStarterTransformer;
