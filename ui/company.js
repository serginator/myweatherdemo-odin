define([
    'dojo/_base/declare',
    'aps/xhr',
    'dijit/registry',
    'aps/_View',
    'aps/ResourceStore',
    'dojo/when',
    'aps/Container',
    'aps/Button',
    './displayError.js'
], function (declare, xhr, registry, _View, Store, when, Container, Button, displayError) {
    return declare(_View, {
        init: function () {
            var cityStore = new Store({
                apsType: 'http://myweatherdemo.srs30.com/city/1.3',
                target: '/aps/2/resources/'
            });

            var remove = function(id) {
                var grid = registry.byId('citiesGrid');
                /* Get confirmation from the user for the delete operation */
                if (!confirm(_('Are you sure you want delete city?', this))) {
                    this.cancel();
                    return;
                } else {
                    /* Remove the city from the APS controller DB */
                    when(cityStore.remove(id),
                        function () {
                            grid.refresh();
                            registry.byId('btnCityDel' + id).cancel();
                        }.bind(this));
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
                            columns: [
                                {field: 'city', name: _('City', this), filter: {title: 'Name'}},
                                {field: 'country', name: _('Country', this)},
                                {field: 'units', name: _('Units of measurement', this)},
                                {field: 'include_humidity', name: _('Include Humidity', this)},
                                {field: 'status', name: _('Status', this), renderCell: function(row, status) {
                                    // if a resource in aps:provisioning status hasn't been updated
                                    // for a long time (3 min) this means that the task has failed
                                    var THREE_MINUTES = 180000,
                                        last_updated = Date.parse(row.aps.modified),
                                        current = Date.now();
                                    return (row.aps.status !== 'aps:provisioning' || last_updated + THREE_MINUTES > current) ? status : 'provisioning_failed';
                                    }},
                                {name: _('Operations'), renderCell: function(row) {
                                    var container = new Container({}),
                                        editButton = new Button({
                                            title: _('Edit', this),
                                            autoBusy: false,
                                            onClick: function() {
                                                aps.apsc.gotoView('city-edit', row.aps.id);
                                            }
                                        }),
                                        deleteButton = new Button({
                                            id: 'btnCityDel' + row.aps.id,
                                            title: _('Delete', this),
                                            autoBusy: true,
                                            onClick: function() {
                                                remove(row.aps.id);
                                            }
                                        });
                                    switch (row.status) {
                                        case 'provisioned':
                                            container.addChild(editButton);
                                            container.addChild(deleteButton);
                                            return container;
                                        case 'country_not_found':
                                            container.addChild(deleteButton);
                                            return container;
                                        default:
                                            return '';
                                    }
                                }}
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
                                    id: 'btnRefreshCities',
                                    iconClass: 'fa-sync',
                                    type: 'primary',
                                    autoBusy: false,
                                    label: _('Refresh', this)
                                }]
                            ]]
                        ]]
                    ]]
                ]]
            ];
        },

        onContext: function() {
            var company = aps.context.vars.company,
                that = this,
                grid = this.byId('citiesGrid');
            this.byId('outputName').set('value', company.username);
            this.byId('outputPassword').set('value', company.password);
            this.byId('externalCompanyIDTile').set('title', company.company_id);
            this.byId('btnRefresh').set('onClick', function() {
                that.getTemperature();
            });
            this.byId('btnRefreshCities').set('onClick', function() {
                grid.refresh();
            });
            this.getTemperature();
            grid.refresh();
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
                displayError(err);
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
