define(['dojo/_base/declare', 'aps/xhr', 'aps/_PopupView', 'aps/passwdqc/generator'], function(declare, xhr, View, generator) {
    return declare(View, {
        size: 'sm',
        init: function () {
            return ['aps/Panel', { title: _('User info', this)}, [
                ['aps/Password', {
                    id: 'editPassword',
                    label: _('Password', this),
                    generator: function() {
                        return generator({
                            length: 8,
                            pattern: '[A-Za-z]'
                        });
                    }
                }],
                ['aps/FieldSet', [
                    ['aps/TextBox', {
                        id: 'editCity',
                        required: true,
                        label: _('city', this),
                        placeHolder: _('ex: Madrid', this),
                        missingMessage: _('Sorry, the field is empty', this)
                    }],
                    ['aps/TextBox', {
                        id: 'editCountry',
                        required: true,
                        label: _('country', this),
                        placeHolder: _('ex: Spain', this),
                        missingMessage: _('Sorry, the field is empty', this)
                    }],
                    ['aps/Select', {
                        id: 'editUnits',
                        label: _('System of measurement', this),
                        options: [
                            {value: 'celsius', label: _('Celsius', this)},
                            {value: 'fahrenheit', label: _('Fahrenheit', this)}
                        ]
                    }],
                    ['aps/CheckBox', {
                        id: 'editHumidity',
                        description: _('Do you want to see humidity?', this)
                    }]
                ]]
            ]];
        },
        onContext: function() {
            var user = aps.context.vars.user;
            this.byId('editPassword').set('value', user.password);
            this.byId('editCity').set('value', user.city);
            this.byId('editCountry').set('value', user.country);
            this.byId('editUnits').set('value', user.units);
            this.byId('editHumidity').set('checked', user.include_humidity);
            aps.apsc.hideLoading();
        },
        onHide: function() {
        },
        onCancel: function() {
            this.cancel();
        },
        onSubmit: function() {
            if (!this.validate()) {
                aps.apsc.cancelProcessing();
                return;
            }
            var RESOURCE_ID = aps.context.vars.user.aps.id,
                NEW_DATA = {
                    "aps": {
                        "type": "http://myweatherdemo.srs30.com/company/1.4"
                    },
                    "password": this.byId('passwordTextBox').value,
                    "city": this.byId('editCity').value,
                    "country": this.byId('editCountry').value,
                    "units": this.byId('editUnits').value,
                    "include_humidity": this.byId('editHumidity').value
                };
            xhr('/aps/2/resources/' + RESOURCE_ID,
                {
                    method: 'PUT',
                    headers: {"Content-Type": "application/json"},
                    data: JSON.stringify(NEW_DATA)
                }).then(this.submit);
        }
    });
  });
