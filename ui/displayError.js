define(['dijit/registry', 'aps/Message'], function(registry, Message) {
    return function(err, type) {
        var errData = err.response ? JSON.parse(err.response.text) : err;
        aps.apsc.cancelProcessing();
        var page = registry.byId('apsPageContainer');
        if (!page) {
            return;
        }
        var messages = page.get('messageList');
        /* Remove all current messages from the screen */
        messages.removeAll();
        /* And display the new message */
        messages.addChild(new Message({
            description: err + (errData.message ? '<br />' + errData.message : ''),
            type: type || 'error'
        }));
    };
});
