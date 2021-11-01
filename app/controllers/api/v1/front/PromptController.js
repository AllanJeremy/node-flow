const _ = require("lodash");
const { DateTime } = require("luxon");

const { UserPrompt, Prompt, PromptOption } = require("../../../../models");

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
  /** Get the latest user prompt response (but only if it was created within the past 24 hours)
   * @private
   */
  static async _getLatestUserPromptResponses(userId, extraFilters = {}) {
    const userResponses = await UserPrompt.findAll({
      where: {
        user_id: userId,
        deleted_at: null, //? Only  return non-deleted records
        ...extraFilters,
      },

      include: [
        { model: Prompt, as: "prompt", attributes: ["id", "question"] },
        {
          model: PromptOption,
          as: "prompt_option",
          attributes: ["id", "text"],
        },
      ],

      order: [["updated_at", "DESC"]],
      limit: 100, //! This assumes a maximum of 20 prompts with 5 options each or 10 prompts with 10 options each
    });

    if (!userResponses?.length) return [];

    //* Getting here means some user responses were found
    const lastUserResponses = userResponses.filter((userResponse) => {
      const createdAtDateObj = new Date(userResponse.created_at);

      // Date and time 24 hours after the response was created
      const dayAfterCreatedDate = DateTime.fromJSDate(createdAtDateObj).plus({
        hours: 24,
      });

      const now = DateTime.now();

      // Return the records if 24 hours have not yet elapsed
      return dayAfterCreatedDate > now;
    });

    return lastUserResponses;
  }

  /**
   *
   */
  static list = (req, res) => {
    this._getLatestUserPromptResponses(req.id)
      .then(async (userPromptFound) => {
        return ResponseHandler.success(
          res,
          "",
          PromptTransformer.transformUserPrompt(userPromptFound)
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
    const { prompt_id, prompt_responses } = req.body;

    //? Consider moving this type of check into a validator
    if (!prompt_responses?.length) {
      return ResponseHandler.error(
        res,
        400,
        responseLanguage.prompt_store_failed
      );
    }

    //* Getting here means prompt responses were provided

    // Check if there are any user prompt responses from the past 24 hours
    this._getLatestUserPromptResponses(req.id, { prompt_id })
      .then((userPromptsFound) => {
        //? If user prompt responses were found from the past 24 hours - do not allow them to create a new user prompt response for the same prompt
        if (userPromptsFound?.length) {
          return ResponseHandler.error(
            res,
            403,
            responseLanguage.user_prompt_store_wait
          );
        }

        //
        const userPromptsData = prompt_responses.map((userPromptResponse) => {
          // Add additional information to each prompt response object
          userPromptResponse.prompt_id = prompt_id;
          userPromptResponse.user_id = req.id;

          return userPromptResponse;
        });

        UserPrompt.bulkCreate(userPromptsData, { returning: true }).then(
          (userPromptResponsesCreated) => {
            return ResponseHandler.success(
              res,
              "",
              PromptTransformer.transformUserPrompt(userPromptResponsesCreated)
            );
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
  static update = (req, res) => {
    const { prompt_option_id, custom_value, show_on_profile, skipped } =
      req.body;

    let updateData = {
      prompt_option_id,
      custom_value,
      show_on_profile,
      skipped,
    };

    //
    UserPrompt.update(updateData, {
      where: { id: req.params.id, deletedAt: null },
    })
      .then((updateStatus) => {
        // Something went wrong while trying to update the user prompt
        if (!updateStatus[0]) {
          return ResponseHandler.error(
            res,
            400,
            responseLanguage.user_prompt_update_failed
          );
        }

        //* Getting here means that the update was successful
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
  static destroy = (req, res) => {
    UserPrompt.destroy({ where: { id: req.params.id }, cascade: true })
      .then((_) => {
        return ResponseHandler.success(
          res,
          responseLanguage.user_prompt_delete_success
        );
      })
      .catch((err) => {
        return ResponseHandler.error(res, 500, err.message);
      });
  };
}

//
module.exports = PromptController;
