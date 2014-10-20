(function() {
  var numberOfButtons = 3
  var servers = []

  for (var i = 1;i <= numberOfButtons;i++) {
    var host = api.settings.isSet('server', 'connect_to_host_' + i, true)
    var port = api.settings.isSet('server', 'connect_to_port_' + i, true)

    if (i == 1) {
      if (!host || host == '') {
        host = 'localhost'
      }
      if (!port || port == '') {
        port = '20545'
      }
    }

    if (host && host != '' && port && port != '') {
      servers.push({host: host, port: port})
    }
  }

  var staticConnectButtons = servers.map(function(server) {
    return {
      title: [server.host, server.port].join(':'),
      nav: function() {
        model.connectButtonsGame(null)
        model.connectButtonsLobbyId(null)
        model.gameHostname(server.host);
        model.gamePort(server.port);
        window.location.href = 'coui://ui/main/game/connect_to_game/connect_to_game.html';
      }
    }
  })

  var playfabButton = ko.computed(function() {
    if (model.lobbyId()) {
      return [{
        title: "Reconnect Playfab",
        nav: function() {
          model.joinGame(model.lobbyId());
        }
      }]
    } else {
      return []
    }
  })

  model.connectButtonsGame = ko.observable().extend({local: 'connect_buttons_game'})
  model.connectButtonsLobbyId = ko.observable().extend({local: 'connect_buttons_lobby_id'})
  model.connectButtonsLobbyInfo = ko.observable().extend({local: 'connect_buttons_lobby_info'})

  var reconnectLastButton = ko.computed(function() {
    if (model.connectButtonsGame()) {
      var game = model.connectButtonsGame()
      return [{
        title: "Last " + game.name,
        nav: function() {
          api.Panel.message('game', 'join_lobby', model.connectButtonsLobbyInfo())
        }
      }]
    } else if (model.connectButtonsLobbyId()) {
      return [{
        title: "Last (PlayFab)",
        nav: function() {
          model.joinGame(model.connectButtonsLobbyId());
        }
      }]
    } else if (model.connectButtonsLobbyInfo()) {
      var info = model.connectButtonsLobbyInfo()
      return [{
        title: "Last " + info.game_hostname + ':' + info.game_port,
        nav: function() {
          api.Panel.message('game', 'join_lobby', info)
        }
      }]
    } else {
      return []
    }
  })

  model.connectButtons = ko.computed(function() {
    return staticConnectButtons.concat(playfabButton()).concat(reconnectLastButton())
  })

  model.lobbyId.subscribe(function(lobbyId) {
    sessionStorage['lobbyId'] = encode(lobbyId);
  })

  var updateGameState = function () {
    engine.asyncCall("ubernet.getGameWithPlayer").done(function (data) {
      console.log(data, "getGameWithPlayer");
      data = JSON.parse(data);
      model.lobbyId(data.LobbyID);
    })
  }

  model.showConnectButtonsMenu = ko.observable(false)
  model.toggleConnectButtonsMenu = function() {
    model.showConnectButtonsMenu(!model.showConnectButtonsMenu())
    if (model.showConnectButtonsMenu()) {
      updateGameState()
    }
  }

  var loadTemplate = function ($element, url, model) {
    $.get(url, function (html) {
      console.log("Loading html " + url);
      var $item = $(html)
      ko.applyBindings(model, $item.get(0));
      $element.append($item)
    });
  };

  loadTemplate($('#navigation_items'), 'coui://ui/mods/connect_buttons/menu.html', model);
})()
