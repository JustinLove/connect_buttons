(function() {
  // was trying to set session lobbyId, but it was getting stored as undefined
  model.connectButtonsLobbyId = ko.observable().extend({local: 'connect_buttons_lobby_id'})
  model.currentSelectedGame.subscribe(function(game) {
    if (game && game.lobby_id) {
      model.connectButtonsLobbyId(game.lobby_id)
    }
  })
})()
