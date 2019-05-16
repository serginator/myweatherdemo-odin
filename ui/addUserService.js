define([
    'dojo/_base/declare',
    'dojox/mvc/getPlainValue',
    'dojox/mvc/at',
    'dojox/mvc/getStateful',
    'dojo/when',
    'dojo/text!./user.json',
    'aps/passwdqc/generator',
    'aps/_View'
],
    function(declare, getPlainValue, at, getStateful, when, newuser, generator, _View) {
        return declare(_View, {
            init: function() {
                aps.app.model.set('newUser', getStateful(JSON.parse(newuser)));

                return ['aps/Panel', { id: 'panelUser' }, [
                    ['aps/Output', {
                        label: _('Username', this),
                        value: at(aps.app.model.newUser, 'username'),
                        gridSize: 'md-6'
                    }],
                    ['aps/Password', {
                        label: _('Password', this),
                        value: at(aps.app.model.newUser, 'password'),
                        generator: function() {
                            return generator({
                                length: 8,
                                pattern: '[A-Za-z]'
                            });
                        }
                    }],
                    ['aps/FieldSet', [
                        ['aps/TextBox', {
                            required: true,
                            label: _('city', this),
                            value: at(aps.app.model.newUser, 'city'),
                            placeHolder: _('ex: Madrid', this),
                            missingMessage: _('Sorry, the field is empty', this)
                        }],
                        ['aps/TextBox', {
                            required: true,
                            label: _('country', this),
                            value: at(aps.app.model.newUser, 'country'),
                            placeHolder: _('ex: Spain', this),
                            missingMessage: _('Sorry, the field is empty', this)
                        }],
                        ['aps/Select', {
                            label: _('System of measurement', this),
                            options: [
                                {value: 'celsius', label: _('Celsius', this), selected: true},
                                {value: 'fahrenheit', label: _('Fahrenheit', this)}
                            ],
                            value: at(aps.app.model.newUser, 'units')
                        }],
                        ['aps/CheckBox', {
                            checked: at(aps.app.model.newUser, 'include_humidity'),
                            description: _('Do you want to see humidity?', this)
                        }]
                    ]]
                ]];
            },
            onNext: function() {
                aps.biz.requestUsageChange({
                    deltas: [{
                        apsType: 'http://myweatherdemo.srs30.com/user/1.1',
                        delta: 1
                    }],
                    operations: [{
                        provision: getPlainValue(aps.app.model.newUser)
                    }],
                    subscriptionId: aps.context.vars.company.aps.subscription
                }).then(function() {
                    aps.apsc.next();
                });
            },
            onContext: function() {
                aps.biz.getResourcesToBind().then(
                    function (resources) {
                        var users = resources.users;
                        aps.app.model.newUser.set('username', users[0].email);
                        aps.app.model.newUser.service_user.aps.set('id', users[0].aps.id);
                    }
                );
                aps.apsc.hideLoading();
            }
        });
    });
