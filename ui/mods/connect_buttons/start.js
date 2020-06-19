(function() {
  var numberOfButtons = 3
  var servers = []

  for (var i = 1;i <= numberOfButtons;i++) {
    var host = api.settings.isSet('server', 'connect_to_host_' + i, true)
    var port = api.settings.isSet('server', 'connect_to_port_' + i, true)
    var locked = (api.settings.isSet('server', 'connect_to_locked_' + i, true) == 'ON')

    if (i == 1) {
      if (!host || host == '') {
        host = 'localhost'
      }
      if (!port || port == '') {
        port = '20545'
      }
    }

    if (host && host != '' && port && port != '') {
      servers.push({host: host, port: port, locked: locked})
    }
  }

  var connectToGame = function(server) {
    model.gameHostname(server.host);
    model.gamePort(server.port);
    model.serverType('custom')

    var params = {
      content: api.content.activeContent(),
    };

    window.location.href = 'coui://ui/main/game/connect_to_game/connect_to_game.html?' + $.param(params);
  }

  var staticConnectButtons = servers.map(function(server) {
    return {
      title: [server.host, server.port].join(':'),
      nav: function() {
        if (server.locked) {
          model.connectButtonsPendingServer(server)
          $('#getPassword').modal('show');
        } else {
          connectToGame(server);
        }
      }
    }
  })

  var playfabButton = ko.computed(function() {
    if (model.lobbyId()) {
      return [{
        title: "Reconnect Playfab",
        nav: function() {
          model.rejoinGame();
        }
      }]
    } else {
      return []
    }
  })

  model.connectButtonsPendingServer = ko.observable()

  model.connectButtons = ko.computed(function() {
    return staticConnectButtons.concat(playfabButton())
  })

  model.lobbyId.subscribe(function(lobbyId) {
    sessionStorage['lobbyId'] = encode(lobbyId);
  })

  var updateGameState = function () {
    engine.asyncCall("ubernet.getGameWithPlayer").done(function (data) {
      console.log(data, "getGameWithPlayer");
      data = JSON.parse(data);
      model.lobbyId(data.LobbyID);

      var mode = data.GameMode || '';
      if (mode.indexOf(':') > 0) {
        self.reconnectContent(mode.substr(0, mode.indexOf(':')));
      } else {
        self.reconnectContent(null);
      }
    })
  }

  model.showConnectButtonsMenu = ko.observable(false)
  model.toggleConnectButtonsMenu = function() {
    model.showConnectButtonsMenu(!model.showConnectButtonsMenu())
    if (model.showConnectButtonsMenu()) {
      updateGameState()
    }
  }

  model.joinWithPassword = function () {
    connectToGame(model.connectButtonsPendingServer())
  }

  var loadTemplate = function ($element, url, model) {
    $.get(url, function (html) {
      console.log("Loading html " + url);
      var $item = $(html)
      ko.applyBindings(model, $item.get(0));
      $element.append($item)

      $('#getPassword').modal()
      $('#getPassword').on('shown.bs.modal', function() { console.log('show');$('#password').focus().select();});
    });
  };

  loadTemplate($('#navigation_items'), 'coui://ui/mods/connect_buttons/menu.html', model);
})()
