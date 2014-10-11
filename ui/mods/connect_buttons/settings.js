(function() {
  var numberOfButtons = 3
  var groups = []

  for (var i = 1;i <= numberOfButtons;i++) {
    api.settings.definitions.server.settings['connect_to_host_' + i] = {
      title: 'host ' + i,
      type: 'text',
      group: i.toString(),
      default: ''
    }
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
  model.connectButtonsSettingGroups = []
  for (var i = 1;i <= numberOfButtons;i++) {
    model.connectButtonsSettingGroups[i-1] = {parts: [
      model.settingsItemMap()['server.connect_to_host_'+i],
      model.settingsItemMap()['server.connect_to_port_'+i]
    ]}
  }

  var settingsHtml = 
    '<div class="form-group" data-bind="foreach: connectButtonsSettingGroups">' +
      '<div class="sub-group" data-bind="foreach: parts">' +
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

