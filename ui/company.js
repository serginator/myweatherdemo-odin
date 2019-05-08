define([
    'dojo/_base/declare',
    'aps/_View'
], function (declare, _View) {
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
                    ]]
                ]]
            ];
        },

        onContext: function() {
            var company = aps.context.vars.company;
            this.byId('outputName').set('value', company.username);
            this.byId('outputPassword').set('value', company.password);
            this.byId('externalCompanyIDTile').set('title', company.company_id);
            aps.apsc.hideLoading();
        }
    });
});
