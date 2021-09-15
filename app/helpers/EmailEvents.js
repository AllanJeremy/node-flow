/**
 * Manages Active Campaign hooks
 *
 * @class EmailEvents
 * @package app
 * @subpackage helpers
 */
class EmailEvents {

  init(action, data) {
    switch(action) {
      case 'signup':
       return this.signup(data);
      case 'profileCompleted':
        return this.profileCompleted(data);
      case 'accountDeactivate':
        return this.accountDeactivate(data);
      case 'accountDelete':
        return this.accountDelete(data);
      case 'firstMatch':
        return this.firstMatch(data);
    }
  }

  signup = (data) => {
    //
  }

  profileCompleted = (data) => {
    //
  }

  accountDeactivate = (data) => {
    //
  }

  accountDelete = (data) => {
    //
  }

  firstMatch = (data) => {
    //
  }

}

module.exports = EmailEvents;
