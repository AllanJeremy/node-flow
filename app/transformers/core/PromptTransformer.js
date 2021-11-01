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

      is_multiple_choice: (data) =>
        data.get("dataValues.is_multiple_choice") === true,

      is_active: (data) => data.get("dataValues.is_active") === true,

      options: function (data) {
        //? Any other fields that may need to be returned from options can be destructured here in the map arguments
        const optionList = data.get("options")?.map(({ id, text, emoji }) => {
          return { id, text, emoji };
        });

        return optionList;
      },
    });
  };

  /**
   * Transform a user prompt
   * @param {Object} data An object representing the `user_prompt` records from the database
   */
  static transformUserPrompt = (data) => {
    return fractal(data, {
      id: "id",
      user_id: "user_id",
      custom_value: (data) => data.get("custom_value"),
      show_on_profile: (data) => data.get("show_on_profile") === true,

      prompt: (data) => {
        const promptObj = data.get("prompt");

        // When no prompt could be found ~ fail silently
        if (!promptObj) return null;

        //* Getting here means that a prompt could be found ~ return only the relevant data
        return {
          id: promptObj.id,
          question: promptObj.question,
        };
      },

      prompt_option: (data) => {
        const promptOptionObj = data.get("prompt_option");

        // When no prompt could be found ~ fail silently
        if (!promptOptionObj) return null;

        //* Getting here means that a user prompt response could be found
        return {
          id: promptOptionObj.id,
          text: promptOptionObj.text,
        };
      },
    });
  };
}

module.exports = PromptTransformer;
