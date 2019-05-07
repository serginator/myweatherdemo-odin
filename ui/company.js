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
                        gridSize: 'md-8'
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
        }
    });
});
