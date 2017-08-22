Ext.define('MyApp.store.Users', {
    extend: 'Ext.data.Store',

    alias: 'store.users',

    fields: ["avatar_url","events_url","followers_url","following_url","gists_url","gravatar_id","html_url","id","login","organizations_url","received_events_url","repos_url","site_admin","starred_url","subscriptions_url","type","url"],

    proxy: {
        type: 'jsonp',
        url: 'https://api.github.com/users',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
});
