(function() {
  var numberOfButtons = 3
  var list = []

  for (var i = 1;i <= numberOfButtons;i++) {
    list.push('server.connect_to_host_'+i)
    api.settings.definitions.server.settings['connect_to_host_' + i] = {
      title: 'host ' + i,
      type: 'text',
      group: i.toString(),
      default: ''
    }
    list.push('server.connect_to_port_'+i)
    api.settings.definitions.server.settings['connect_to_port_' + i] = {
      title: 'port ' + i,
      type: 'text',
      group: i.toString(),
      default: ''
    }
  }

  api.settings.definitions.server.settings['connect_to_host_1'].default = 'localhost'
  api.settings.definitions.server.settings['connect_to_port_1'].default = '6543'

  // force model.settingsLists to update
  model.settingDefinitions(api.settings.definitions)

  var dummy = ko.observable('localhost')
  model.connectButtonsSettingList = list.map(function(s) {
    return model.settingsItemMap()[s]
  })

  var settingsHtml = 
    '<div class="form-group">' +
      '<div class="sub-group" data-bind="foreach: connectButtonsSettingList">' +
        '<div class="option">' +
          '<label data-bind="text: title" >' +
            'title' +
          '</label>' +
          '<input type="text" class="form-control" value="" data-bind="value: value" />' +
        '</div>' + 
      '</div>' + 
    '</div>'
  var $group = $(settingsHtml).appendTo('.option-list.server')
})()

