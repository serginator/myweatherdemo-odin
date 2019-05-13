define([
    'dojo/_base/declare',
    'aps/xhr',
    'dijit/registry',
    'aps/_View',
    'aps/ResourceStore',
    'dojo/when'
], function (declare, xhr, registry, _View, Store, when) {
    return declare(_View, {
        init: function () {
            var cityStore = new Store({
                apsType: 'http://myweatherdemo.srs30.com/city/1.2',
                target: '/aps/2/resources/'
            });

            var remove = function() {
                var grid = registry.byId('citiesGrid');
                var sel = grid.get('selectionArray');
                var counter = sel.length;
                /* Get confirmation from the user for the delete operation */
                if (counter && !confirm(_('Are you sure you want delete city?', this))) {
                    this.cancel();
                    return;
                } else if (counter) {
                    sel.forEach(function (cityID) {
                        /* Remove the city from the APS controller DB */
                        when(cityStore.remove(cityID),
                            /* If success, process the next city until the list is empty */
                            function () {
                                sel.splice(sel.indexOf(cityID), 1);
                                grid.refresh();
                                if (--counter === 0) {
                                    registry.byId('btnCityDel').cancel();
                                }
                            }.bind(this));
                    });
                } else {
                    registry.byId('btnCityDel').cancel();
                }
            };

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
                    ]],
                    ['aps/Tile', {
                        id: 'citiesTile',
                        title: _('CITIES', this),
                        gridSize: 'md-12'
                    }, [
                        ['aps/Grid', {
                            id: 'citiesGrid',
                            store: cityStore,
                            apsResourceViewId: 'city-edit',
                            selectionMode: 'multiple',
                            columns: [
                                {field: 'city', name: _('Name', this), filter: {title: 'Name'}, type: 'resourceName'},
                                {field: 'country', name: _('Country', this)},
                                {field: 'units', name: _('Units of measurement', this)},
                                {field: 'include_humidity', name: _('Include Humidity', this)},
                                {field: 'status', name: _('Status', this)}
                            ]
                        }, [
                            ['aps/Toolbar', [
                                ['aps/ToolbarButton', {
                                    id: 'btnCityNew',
                                    iconClass: 'fa-plus',
                                    type: 'primary',
                                    autoBusy: false,
                                    label: _('New', this),
                                    onClick: function() {
                                        aps.apsc.gotoView('city-new');
                                    }
                                }],
                                ['aps/ToolbarButton', {
                                    id: 'btnCityDel',
                                    iconClass: 'fa-trash',
                                    type: 'danger',
                                    autoBusy: true,
                                    label: _('Delete', this),
                                    onClick: remove
                                }]
                            ]]
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
            this.byId('citiesGrid').refresh();
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
