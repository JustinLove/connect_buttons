(function() {
  model.connectButtonsGame = ko.observable().extend({session: 'connect_buttons_game'})
  var lobbyId = ko.computed(function() {
    if (model.connectButtonsGame()) {
      return model.connectButtonsGame().lobby_id
    } else {
      return model.lobbyId()
    }
  })

  var info = ko.computed(function() {
    return {
      'name': model.connectButtonsGame() && model.connectButtonsGame().name,
      'game_hostname': String(model.gameHostname()),
      'game_port': Number(model.gamePort()),
      'local_game': Boolean(model.joinLocalServer()),
      'ticket': String(model.gameTicket()),
      'game_password': model.privateGamePassword(),
      'content': model.gameContent(),
      'lobby_id': lobbyId()
    }
  })
  model.connectButtonsConnectionInfo = ko.observable().extend({local: 'connect_buttons_connection_info'})
  model.connectButtonsConnectionInfo(info())
  info.subscribe(model.connectButtonsConnectionInfo)

  var originalFail = model.fail
  model.fail = function(desc) {
    model.connectButtonsGame(null)
    model.connectButtonsConnectionInfo(null)
    originalFail(desc)
  }
})()
