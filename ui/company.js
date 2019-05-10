define([
    'dojo/_base/declare',
    'aps/xhr',
    'dijit/registry',
    'aps/_View'
], function (declare, xhr, registry, _View) {
    return declare(_View, {
        init: function () {
            return [
                ['aps/Tiles', [
                    ['aps/Tile', {
                        id: 'externalCompanyIDTile',
                        title: _('EXTERNAL COMPANY ID', this),
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
                                        viewId: "editcompany",
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
                        id: 'temperatureTile',
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
                                id: 'outputCelsius',
                                label: _('Celsius', this),
                                gridSize: 'md-6'
                            } ],
                            [ 'aps/Output', {
                                id: 'outputFahrenheit',
                                label: _('Fahrenheit', this),
                                gridSize: 'md-6'
                            } ]
                        ]]
                    ]]
                ]]
            ];
        },

        onContext: function() {
            var company = aps.context.vars.company,
                that = this;
            this.byId('outputName').set('value', company.username);
            this.byId('outputPassword').set('value', company.password);
            this.byId('externalCompanyIDTile').set('title', company.company_id);
            this.byId('btnRefresh').set('onClick', function() {
                that.getTemperature();
            });
            this.getTemperature();
            aps.apsc.hideLoading();
        },

        getTemperature: function() {
            var APS_RESOURCE_ID =  aps.context.vars.company.aps.id;

            xhr('/aps/2/resources/' + APS_RESOURCE_ID + '/getTemperature', {
                headers: {"Content-Type": "application/json"},
                method: 'GET'
            }).then(function(data){
                //bind received data to widgets
                registry.byId('temperatureTile').set('title', data.city + ' (' + data.country + ')');
                registry.byId('outputCelsius').set('value', data.celsius);
                registry.byId('outputFahrenheit').set('value', data.fahrenheit);
            }).otherwise(function(err) {
                console.log('Some error happened: ', err);
                registry.byId('temperatureTile').set('title', _('ERROR GETTING TEMPERATURE'));
                registry.byId('outputCelsius').set('value', 'err');
                registry.byId('outputFahrenheit').set('value', 'err');
            }).always(function() {
                aps.apsc.hideLoading(); // Mandatory call
                registry.byId('btnRefresh').set('isBusy', false);
            });
        }
    });
});
