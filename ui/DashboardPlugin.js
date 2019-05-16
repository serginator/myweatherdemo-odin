define([
    'dojo/_base/declare',
    'aps/nav/ViewPlugin'
  ], function(declare, ViewPlugin) {
    return declare(ViewPlugin, {
      apsType: 'http://myweatherdemo.srs30.com/company/1.4',
      entryViewId:  'company'
    });
  });
