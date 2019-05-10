define([
    'dojo/_base/declare',
    'dojox/mvc/getPlainValue',
    'dojox/mvc/at',
    'dojox/mvc/getStateful',
    'dojo/when',
    'dojo/text!./city.json',
    'aps/View',
    'aps/ResourceStore'
], function(declare, getPlainValue, at, getStateful, when, cityModel, View, ResourceStore ) {
    return declare(View, {
        init: function() {
            this.store = new ResourceStore({
                target: '/aps/2/resources'
            });
            aps.app.model.set('city', getStateful(JSON.parse(cityModel)));

            return ['aps/Panel', { id: 'panelCityEdit' }, [
                ['aps/FieldSet', [
                    ['aps/TextBox', {
                        required: true,
                        label: _('city', this),
                        value: at(aps.app.model.city, 'city'),
                        placeHolder: _('ex: Madrid', this),
                        missingMessage: _('Sorry, the field is empty', this)
                    }],
                    ['aps/TextBox', {
                        required: true,
                        label: _('country', this),
                        value: at(aps.app.model.city, 'country'),
                        placeHolder: _('ex: Spain', this),
                        missingMessage: _('Sorry, the field is empty', this)
                    }],
                    ['aps/Select', {
                        label: _('System of measurement', this),
                        options: [
                            {value: 'celsius', label: _('Celsius', this), selected: true},
                            {value: 'fahrenheit', label: _('Fahrenheit', this)}
                        ],
                        value: at(aps.app.model.city, 'units')
                    }],
                    ['aps/CheckBox', {
                        checked: at(aps.app.model.city, 'include_humidity'),
                        description: _('Do you want to see humidity?', this)
                    }]
                ]]
            ]];
        }, // End of Init
        onContext: function() {
            this.store.get(aps.context.vars.city.aps.id).then(function (editcity) {
                /* Collect the city properties in the model */
                aps.app.model.set('city', getStateful(editcity));
                aps.apsc.hideLoading(); /* Mandatory call */
            });
        },
        /* Create handlers for the navigation buttons */
        onCancel: function() {
            aps.apsc.gotoView('company');
        },
        onSubmit: function() {
            var form = this.byId('panelCityEdit');
            if (!form.validate()) {
                aps.apsc.cancelProcessing();
                return;
            }
            when(this.store.put(getPlainValue(aps.app.model.city)), function() {
                aps.apsc.gotoView('company');
            });
        },
        onHide: function() {
            aps.app.model.set('city', getStateful(JSON.parse(cityModel)));
        }
    }); // End of Declare
}); // End of Define
