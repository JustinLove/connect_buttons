(function() {
  model.connectButtonsGame = ko.observable().extend({session: 'connect_buttons_game'})
  model.currentSelectedGame.subscribe(function(game) {
    model.connectButtonsGame(game)
  })
})()
