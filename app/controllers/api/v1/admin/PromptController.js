const { Prompt, PromptOption } = require("../../../../models");

/**
 * Helpers
 */
var ResponseHandler = require("../../../../helpers/ResponseHandler");
ResponseHandler = new ResponseHandler();

const language = require("../../../../language/en_default");
const responseLanguage = language.en.admin.response;

/**
 * Transformers
 */
const PromptTransformer = require("../../../../transformers/core/PromptTransformer");

class PromptController {
  /**
   *
   */
  static list = (_, res) => {
    Prompt.findAll({ order: [["id", "DESC"]] })
      .then(async (promptsFound) => {
        const promptsWithOptions = await Promise.all(
          promptsFound.map(async (currPrompt) => {
            const options = await PromptOption.findAll({
              where: { prompt_id: currPrompt.id },
            });

            return { ...currPrompt, options };
          })
        );

        return ResponseHandler.success(
          res,
          "",
          PromptTransformer.transform(promptsWithOptions)
        );
      })
      .catch((err) => {
        return ResponseHandler.error(res, 500, err.message);
      });
  };

  /**
   *
   */
  static store = (req, res) => {
    const { prompt: promptData, options: optionsData } = req.body;

    //
    Prompt.create(promptData, { returning: true })
      .then((createdPrompt) => {
        const optionsList = optionsData.map((option) => {
          option.prompt_id = createdPrompt.id;

          return option;
        });

        PromptOption.bulkCreate(optionsList).then((createdOptions) => {
          createdPrompt.options = createdOptions;

          return ResponseHandler.success(
            res,
            responseLanguage.prompt_store_success,
            PromptTransformer.transform(createdPrompt)
          );
        });
      })
      .catch((err) => {
        return ResponseHandler.error(res, 500, err.message);
      });
  };

  /**
   *
   */
  static updatePrompt = (req, res) => {
    const { question, is_multiple_choice, is_active } = req.body;
    const updateData = { question, is_multiple_choice, is_active };

    Prompt.update(updateData, { where: { id: req.params.id } })
      .then((/* updateStatus */) => {
        /* // TODO: Consider moving this into a lib function ~ Sequelize specific in this case
         // Checks for every single update's success status
        const updateSuccessful = updateStatus.reduce(
          prev,
          curr,
          (val) => val && prev,
          true
        );
         */

        //? Not checking whether the actual update was successful ~ assuming it was
        return ResponseHandler.success(
          res,
          responseLanguage.prompt_update_success,
          {
            id: parseInt(req.params.id),
            ...updateData,
          }
        );
      })
      .catch((err) => {
        return ResponseHandler.error(res, 500, err.message);
      });
  };

  /**
   *
   */
  static updatePromptOption = (req, res) => {
    const updateData = {};

    // Doing it this to allow for optional updating where users don't need to update all fields and undefined fields are filtered out
    updateData.text = req.body.text;
    updateData.emoji = req.body.emoji;

    PromptOption.update(updateData, { where: { id: req.params.id } })
      .then((/* updateStatus */) => {
        //? Not checking whether the actual update was successful ~ assuming it was
        return ResponseHandler.success(
          res,
          responseLanguage.prompt_option_update_success,
          {
            id: parseInt(req.params.id),
            ...updateData,
          }
        );
      })
      .catch((err) => {
        return ResponseHandler.error(res, 500, err.message);
      });
  };

  /**
   *
   */
  static destroyPrompt = (req, res) => {
    Prompt.destroy({ where: { id: req.params.id }, cascade: true })
      .then((_) => {
        return ResponseHandler.success(
          res,
          responseLanguage.prompt_delete_success
        );
      })
      .catch((err) => {
        return ResponseHandler.error(res, 500, err.message);
      });
  };

  /**
   *
   */
  static destroyPromptOption = (req, res) => {
    PromptOption.destroy({ where: { id: req.params.id } })
      .then((_) => {
        return ResponseHandler.success(
          res,
          responseLanguage.prompt_option_delete_success
        );
      })
      .catch((err) => {
        return ResponseHandler.error(res, 500, err.message);
      });
  };
}

//
module.exports = PromptController;
