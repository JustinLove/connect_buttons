(function() {
  model.connectButtonsGame = ko.observable().extend({local: 'connect_buttons_game'})
  model.connectButtonsLobbyId = ko.observable().extend({local: 'connect_buttons_lobby_id'})
  model.connectButtonsLobbyInfo = ko.observable().extend({local: 'connect_buttons_lobby_info'})
  model.lobbyInfo.subscribe(model.connectButtonsLobbyInfo)

  var originalFail = model.fail
  model.fail = function(desc) {
    model.connectButtonsGame(null)
    model.connectButtonsLobbyId(null)
    model.connectButtonsLobbyInfo(null)
    originalFail(desc)
  }
})()
