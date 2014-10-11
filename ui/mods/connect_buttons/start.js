(function() {
  var servers = [
    {host: 'localhost', port: '6543'},
    {host: '176.31.115.99', port: '53999'}
  ]

  model.connectButtons = servers.map(function(server) {
    return {
      title: [server.host, server.port].join(':'),
      nav: function() {
        model.gameHostname(server.host);
        model.gamePort(server.port);
        window.location.href = 'coui://ui/main/game/connect_to_game/connect_to_game.html';
      }
    }
  })

  model.showConnectButtonsMenu = ko.observable(false)
  model.toggleConnectButtonsMenu = function() {
    model.showConnectButtonsMenu(!model.showConnectButtonsMenu())
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
