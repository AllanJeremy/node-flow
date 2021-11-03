// Models
const {
  Achievement,
  UserAchievement,
  ListedPeer,
  sequelize,
} = require("../../models");

class AchievementEngine {
  /** @private All the achievements from the database */
  static achievements;

  /**
   * @private
   * List representing triggers as well as actions that need to occur on the triggers
   */
  static triggerQueue = [];

  static async init() {
    //
    this.achievements = await Achievement.findAll();

    this._createTriggerQueue();
    this._setupTriggers();
  }

  /**
   * @private
   * Setup triggers events for all triggers in the trigger queue
   * @return {void}
   */
  static _setupTriggers() {
    const tablesAndModels = this._getAllTablesAndModels();

    this.triggerQueue.forEach((triggerItem) => {
      // Create the event on the given model
      const _TriggerModel = tablesAndModels[triggerItem.trigger_table];
      let hookToAdd;

      switch (triggerItem.trigger_event?.toLowerCase()) {
        case "create":
          hookToAdd = "afterCreate";
          break;
        case "update":
          hookToAdd = "afterUpdate";
          break;
        case "delete":
          hookToAdd = "afterDelete";
          break;
      }
      //* Add lifecycle hook ~ can be tested with `ListedPeer.hasHook('afterCreate')` running before and after this method is called in init

      //TODO: Add bulkCreate/Update/Delete handling
      _TriggerModel.addHook(hookToAdd, (tableRow, options) => {
        this._setupActions(tableRow, _TriggerModel, triggerItem);
      });
    });
  }

  /**
   * @private
   * Programmatically generate  functionality for any actions found in a given trigger queue]
   * @param {Object} tableRow An object representing the table row that has been edited/created/deleted
   * @param {SequelizeModel} triggerModel The model that this particular trigger will act on
   * @param {{trigger_table: string, trigger_event: string, user_id_column:string, actionList: Array<object>}} triggerItem An object representing the trigger item
   */
  static _setupActions(tableRow, triggerModel, triggerItem) {
    const userId = tableRow[triggerItem.user_id_column];

    triggerItem.actionList.forEach(async (action) => {
      let originalValue;
      /* {"achievement_id":1,"action_type":"count_records","action_field":null,"action_operator":"greater_than_or_equal_to","action_comparison_value":"1"} */

      switch (action.action_type) {
        case "column_check":
          originalvalue = tableRow[action.action_field];
          break;
        default:
          //? By default we will be counting records ~ same as adding case 'count_records'
          const recordsFound = await triggerModel.findAndCountAll({
            where: { [triggerItem.user_id_column]: userId },
          });

          originalValue = recordsFound.count;
      }

      const shouldReceiveAchievement = this._evalByOperator(
        originalValue,
        action.action_operator,
        action.action_comparison_value
      );

      // Attempt granting them the achievement 🥇 if they are worthy
      if (shouldReceiveAchievement) {
        this._grantAchievement(userId, action.achievement_id);
      }
    });
  }

  /**
   * @private
   *  Grant an achievement to a user
   * @param {Number} userId The `id` of the user to grant the achievement to
   * @param {Number} achievementId The `id` of the achievement to grant to the user
   */
  static async _grantAchievement(userId, achievementId) {
    const achievementFound = await UserAchievement.findOne({
      where: { achievement_id: achievementId },
    });

    // No point double granting the same achievement to the user
    if (achievementFound) {
      return false;
    }

    //* Getting here means that the user does not already have that achievement ~ grant it to them
    return UserAchievement.create({
      user_id: userId,
      achievement_id: achievementId,
    });
  }

  /** @private Get a list representing the trigger events that should be created
   * @return {void}
   */
  static _createTriggerQueue() {
    const _queueCreatorHelper = {};

    this.achievements.forEach(
      ({ trigger_table, trigger_event, user_id_column }) => {
        const triggerKey = `${trigger_table}_${trigger_event}`;

        _queueCreatorHelper[triggerKey] = {
          trigger_table,
          trigger_event,
          user_id_column,
          actionList: [],
        };
      }
    );

    // Bundle actions with the same trigger table and event together
    this.achievements.forEach((achievement) => {
      const triggerKey = `${achievement.trigger_table}_${achievement.trigger_event}`;

      _queueCreatorHelper[triggerKey].actionList.push({
        achievement_id: achievement.id,

        action_type: achievement.action_type,
        action_field: achievement.action_field,
        action_operator: achievement.action_operator,
        action_comparison_value: achievement.action_comparison_value,
      });
    });

    // Extract internal bundled values into a separate array (we no longer need the key as it was only being used for bundling related events/actions)
    this.triggerQueue = Object.values(_queueCreatorHelper).map((val) => val);
  }

  /**
   * @private
   * Get all tables in the current database (set the names as `keys`) along with their corresponding models (as the `values`)
   * @return {Object} An object where the key is the table name and the value is the model object
   * @example [{model: string, table: string}]
   */
  static _getAllTablesAndModels() {
    const { models } = sequelize;

    const tablesAndModels = {};

    Object.keys(models).forEach((modelKey) => {
      const currentModel = models[modelKey];
      const tableName = currentModel.getTableName();

      tablesAndModels[tableName] = currentModel;
    });

    return tablesAndModels;
  }

  /** Evaluates an operation between two values based on a given operator
   * @private
   * @param {any} originalValue The value we want to evaluate against. For example: `totalNumberOfRecords` or `triggerTable.columnValue`
   * @param {String} operator The operator to evaluate on. Possible values include: `"less_than"` `"less_than_or_equal_to"` `"equal_to"` `"greater_than"` `"greater_than_or_equal_to"`
   * @param {String} comparisonValue The value that needs to be met for the achievement to be awarded
   * @return {Boolean} `true` if the evaluation is truthy and `false` if the evaluation is falsy
   */
  static _evalByOperator(originalValue, operator, comparisonValue) {
    switch (operator) {
      case "less_than":
        return originalValue < comparisonValue;

      case "less_than_or_equal_to":
        return originalValue <= comparisonValue;

      case "equal_to":
        //? Not checking for type equality since we expect all comparison values in db to be strings while we don't know the data type of the `originalValue`
        return originalValue == comparisonValue;

      case "greater_than":
        return originalValue > comparisonValue;

      case "greater_than_or_equal_to":
        return originalValue >= comparisonValue;

      default:
        return false;
    }
  }
}

//
module.exports = AchievementEngine;
