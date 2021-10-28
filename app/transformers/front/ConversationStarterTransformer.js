var fractal = require("fractal-transformer")();

class ConversationStarterTransformer {
  static transform = (data) =>
    fractal(data, {
      id: "id",
      question: "question",
      fields: function (data) {
        let fields = data.get("answer_label").split(",");
        return fields.map((item) => {
          return {
            label: item,
          };
        });
      },
    });
}

module.exports = ConversationStarterTransformer;
