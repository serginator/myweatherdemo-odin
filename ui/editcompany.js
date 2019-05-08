define(['dojo/_base/declare', 'aps/xhr', 'aps/_PopupView'], function(declare, xhr, View) {
    return declare(View, {
        size: 'sm',
        init: function () {
            return ['aps/Panel', { title: _('Company Settings')}, [
                ['aps/FieldSet', [
                    ['aps/TextBox', {
                        id: 'usernameTextBox',
                        required: true,
                        label: _('username'),
                        placeHolder: _('username'),
                        missingMessage: _('Sorry, the field is empty')
                    }],
                    ['aps/TextBox', {
                        id: 'passwordTextBox',
                        required: true,
                        label: _('password'),
                        placeHolder: _('password'),
                        missingMessage: _('Sorry, the field is empty')
                    }]
                ]]
            ]];
        },
        onContext: function() {
            var company = aps.context.vars.company;
            this.byId('usernameTextBox').set('value', company.username);
            this.byId('passwordTextBox').set('value', company.password);
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
            var RESOURCE_ID = aps.context.vars.company.aps.id,
                NEW_DATA = {
                    "aps": {
                        "type": "http://myweatherdemo.srs30.com/company/1.0"
                    },
                    "username": this.byId('usernameTextBox').value,
                    "password": this.byId('passwordTextBox').value
                };
            xhr('/aps/2/resources/' + RESOURCE_ID,
                {
                    method: 'PUT',
                    headers: {"Content-Type": "application/json"},
                    data: JSON.stringify(NEW_DATA)
                }).then(this.submit);
            //this.Submit();
        }
    });
  });
