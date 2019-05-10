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
    var city;
    return declare(View, {
        init: function() {
            city = getStateful(JSON.parse(cityModel));

            return ['aps/Panel', {}, [
                ['aps/FieldSet', [
                    ['aps/TextBox', {
                        required: true,
                        label: _('city', this),
                        value: at(city, 'city'),
                        placeHolder: _('ex: Madrid', this),
                        missingMessage: _('Sorry, the field is empty', this)
                    }],
                    ['aps/TextBox', {
                        required: true,
                        label: _('country', this),
                        value: at(city, 'country'),
                        placeHolder: _('ex: Spain', this),
                        missingMessage: _('Sorry, the field is empty', this)
                    }],
                    ['aps/Select', {
                        label: _('System of measurement', this),
                        options: [
                            {value: 'celsius', label: _('Celsius', this), selected: true},
                            {value: 'fahrenheit', label: _('Fahrenheit', this)}
                        ],
                        value: at(city, 'units')
                    }],
                    ['aps/CheckBox', {
                        checked: at(city, 'include_humidity'),
                        description: _('Do you want to see humidity?', this)
                    }]
                ]]
            ]];
        }, // End of Init
        /* Create handlers for the navigation buttons */
        onCancel: function() {
            aps.apsc.gotoView('company');
        },
        onSubmit: function() {
            city.aps.subscription = aps.context.vars.company.aps.subscription;

            var store = new ResourceStore({
                target: '/aps/2/resources/' + aps.context.vars.company.aps.id + '/cities'
            });

            when(store.put(getPlainValue(city)), function() {
                aps.apsc.gotoView('company');
            });
        }
    }); // End of Declare
}); // End of Define
