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
                        title: 'EXTERNAL COMPANY ID',
                        gridSize: 'md-8',
                        buttons: [
                            {
                                id: 'btnLogin',
                                title: _('Login'),
                                iconClass: 'fa-external-link',
                                autoBusy: false,
                                onClick: function(){
                                    window.open('http://myweatherdemo.learn-cloudblue.com/login', '_blank');
                                }
                            }]
                    }, [
                        [ 'aps/FieldSet', [
                            [ 'aps/Output', {
                                id: 'outputName',
                                label: 'Name',
                                gridSize: 'md-6'
                            } ],
                            [ 'aps/Output', {
                                id: 'outputPassword',
                                label: 'Password',
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
