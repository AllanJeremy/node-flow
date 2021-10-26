var fractal = require("fractal-transformer")();

/** The prompt DTO/Transformer */
class PromptTransformer {
  /** Transform both prompts and their options into a single data structure ie. `{...promptData, options: [{...promptptionData}]}`
   * @param {Object} data An object representing the prompt records from the database
   */
  static transform = (data) => {
    return fractal(data, {
      id: "dataValues.id",
      question: "dataValues.question",
      is_multiple_choice: function (data) {
        // Ensure data being returned is a boolean
        return data.get("dataValues.is_multiple_choice") === true;
      },
      is_active: function (data) {
        // Ensure data being returned is a boolean
        return data.get("dataValues.is_active") === true;
      },
      options: function (data) {
        //? Any other fields that may need to be returned from options can be destructured here in the map arguments
        const optionList = data.get("options")?.map(({ id, text, emoji }) => {
          return { id, text, emoji };
        });

        return optionList;
      },
    });
  };
}

module.exports = PromptTransformer;
