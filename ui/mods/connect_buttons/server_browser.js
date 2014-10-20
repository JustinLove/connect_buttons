(function() {
  // was trying to set session lobbyId, but it was getting stored as undefined
  model.connectButtonsLobbyId = ko.observable().extend({local: 'connect_buttons_lobby_id'})
  model.connectButtonsGame = ko.observable().extend({local: 'connect_buttons_game'})
  model.currentSelectedGame.subscribe(function(game) {
    model.connectButtonsGame(game)
    console.log(game)
    console.log(model.connectButtonsGame())
    console.log(localStorage.connect_buttons_game)
    if (game && game.lobby_id) {
      model.connectButtonsLobbyId(game.lobby_id)
    }
  })
})()
