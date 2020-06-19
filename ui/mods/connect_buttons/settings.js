(function() {
  var numberOfButtons = 3
  var groups = []

  for (var i = 1;i <= numberOfButtons;i++) {
    api.settings.definitions.server.settings['connect_to_host_' + i] = {
      title: 'Hostname/IP Address ' + i,
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
    api.settings.definitions.server.settings['connect_to_locked_' + i] = {
      title: 'Requries Password ' + i,
      group: i.toString(),
      type: 'select',
      options: ['OFF', 'ON'],
      optionsText: ['!LOC:OFF', '!LOC:ON'],
      default: 'OFF',
    }
  }

  api.settings.definitions.server.settings['connect_to_host_1'].default = 'localhost'
  api.settings.definitions.server.settings['connect_to_port_1'].default = '20545'

  // force model.settingsLists to update
  model.settingDefinitions(api.settings.definitions)

  var dummy = ko.observable('localhost')
  model.connectButtonsSettingGroups = []
  for (var i = 1;i <= numberOfButtons;i++) {
    model.connectButtonsSettingGroups[i-1] = {parts: [
      model.settingsItemMap()['server.connect_to_host_'+i],
      model.settingsItemMap()['server.connect_to_port_'+i],
      model.settingsItemMap()['server.connect_to_locked_'+i]
    ]}
  }

  var settingsHtml = 
    '<div class="form-group" data-bind="foreach: connectButtonsSettingGroups">' +
      '<div class="sub-group" data-bind="foreach: parts">' +
        '<div class="option">' +
          '<label data-bind="text: title" >' +
            'title' +
          '</label>' +
          '<!-- ko if: $data.type() === "select" -->' +
          '<select class="selectpicker form-control" name="dropdown"' +
              'data-bind="options: $data.options,' +
              'optionsValue: function (item) { return item.value },' +
              'optionsText: function (item) { return loc( item.text ) },' +
              'selectPicker: $data.value,' +
              'attr: { disabled: !$data.isEnabled }">' +
          '</select>' +
          '<!-- /ko -->' +
          '<!-- ko if: $data.type() === "text" -->' +
          '<input type="text" class="form-control" value="" data-bind="value: value" />' +
          '<!-- /ko -->' +
        '</div>' + 
      '</div>' + 
    '</div>'
  var $group = $(settingsHtml).appendTo('.option-list.server')
})()

