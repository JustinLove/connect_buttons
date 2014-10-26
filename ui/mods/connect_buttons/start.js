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

  // exactly like model.joinGame, except we can get the failure event
  var joinGame = function (lobbyId) {

    model.showConnecting(true);
    $("#msg_progress").text(loc("!LOC(start:reconnecting_to_game.message):Reconnecting to Game"));
    $("#connecting").dialog('open');

    engine.asyncCall("ubernet.joinGame", lobbyId).done(function (data) {

      data = JSON.parse(data);

      model.isLocalGame(false);
      model.gameTicket(data.Ticket);
      model.gameHostname(data.ServerHostname);
      model.gamePort(data.ServerPort);

      window.location.href = 'coui://ui/main/game/connect_to_game/connect_to_game.html';
      return; /* window.location.href will not stop execution. */
    }).fail(function (data) {
      model.connectButtonsConnectionInfo(null)
    }).always(function () {
      if (model.showConnecting()) {
        model.showConnecting(false);
        $("#connecting").dialog("close");
      }
    });
  };


  model.connectButtonsConnectionInfo = ko.observable().extend({local: 'connect_buttons_connection_info'})
  model.privateGamePassword = ko.observable().extend({ session: 'private_game_password' });

  var reconnectLastTitle = function(info) {
    if (info.name && info.name != '') {
      return info.name
    } else {
      return "Last " + info.game_hostname + ':' + info.game_port
    }
  }

  var navToLobby = function(lobby_id) {
    return function() {
      joinGame(lobby_id)
    }
  }

  var navToHostPort = function(info) {
    return function() {
      model.isLocalGame(info.local_game);
      model.gameTicket(info.ticket);
      model.gameHostname(info.game_hostname);
      model.gamePort(info.game_port);
      model.privateGamePassword(info.game_password);

      window.location.href = 'coui://ui/main/game/connect_to_game/connect_to_game.html';
    }
  }

  var reconnectLastNav = function(info) {
    var port = parseInt(info.game_port, 10)
    if (info.lobby_id && port >= 9000 && port < 9100) {
      return navToLobby(info.lobby_id)
    } else {
      return navToHostPort(info)
    }
  }

  var reconnectLastButton = ko.computed(function() {
    if (model.connectButtonsConnectionInfo()) {
      var info = model.connectButtonsConnectionInfo()
      return [{
        title: reconnectLastTitle(info),
        nav: reconnectLastNav(info)
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
