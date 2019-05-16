define([
    'dojo/_base/declare',
    'dojox/mvc/getPlainValue',
    'dojox/mvc/at',
    'dojox/mvc/getStateful',
    'dojo/when',
    'aps/View'
], function(declare, getPlainValue, at, getStateful, when, View ) {
    return declare(View, {
        init: function() {
            return ['aps/Tiles', [
                ['aps/Tile', {
                    title: _('User info', this),
                    gridSize: 'md-8',
                    buttons: [
                        {
                            id: 'btnLogin',
                            title: _('Login', this),
                            iconClass: 'fa-external-link',
                            autoBusy: false,
                            onClick: function(){
                                window.open('http://myweatherdemo.learn-cloudblue.com/login', '_blank');
                            }
                        }, {
                            id: 'btnEdit',
                            title: _('Edit', this),
                            iconClass: 'fa-external-link',
                            autoBusy: false,
                            onClick: function() {
                                aps.apsc.showPopup({
                                    viewId: 'edituser',
                                    resourceId: null,
                                    modal: false
                                });
                            }
                        }]
                }, [
                    [ 'aps/FieldSet', [
                        [ 'aps/Output', {
                            id: 'outputName',
                            label: _('Name', this),
                            gridSize: 'md-6'
                        } ],
                        [ 'aps/Output', {
                            id: 'outputPassword',
                            label: _('Password', this),
                            gridSize: 'md-6'
                        } ]
                    ]]
                ]],
                ['aps/Tile', {
                    title: _('TEMPERATURE', this),
                    gridSize: 'md-8',
                    buttons: [{
                        id: 'btnRefresh',
                        title: _('Refresh', this),
                        iconClass: 'fa-external-link',
                        autoBusy: true
                    }]
                }, [
                    [ 'aps/FieldSet', [
                        [ 'aps/Output', {
                            id: 'outputCity',
                            label: _('City', this),
                            gridSize: 'md-3'
                        } ],
                        [ 'aps/Output', {
                            id: 'outputCountry',
                            label: _('Country', this),
                            gridSize: 'md-3'
                        } ],
                        [ 'aps/Output', {
                            id: 'outputUnits',
                            label: _('Units of measure', this),
                            gridSize: 'md-3'
                        } ],
                        [ 'aps/Output', {
                            id: 'outputHumidity',
                            label: _('Include humidity', this),
                            gridSize: 'md-3'
                        } ]
                    ]]
                ]]
            ]];
        }, // End of Init
        onContext: function() {
            var user = aps.context.vars.user;
            this.byId('outputName').set('value', user.username);
            this.byId('outputPassword').set('value', user.password);
            this.byId('outputCity').set('value', user.city);
            this.byId('outputCountry').set('value', user.country);
            this.byId('outputUnits').set('value', user.units);
            this.byId('outputHumidity').set('value', user.include_humidity);
            aps.apsc.hideLoading();
        }
    }); // End of Declare
}); // End of Define
