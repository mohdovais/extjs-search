/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('MyApp.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.main',

    init: function (view) {
        var combo = view.lookupReference('user');

        combo.setSelection({
            "login": "mojombo",
            "id": 1,
            "avatar_url": "https://avatars0.githubusercontent.com/u/1?v=4",
            "gravatar_id": "",
            "url": "https://api.github.com/users/mojombo",
            "html_url": "https://github.com/mojombo",
            "followers_url": "https://api.github.com/users/mojombo/followers",
            "following_url": "https://api.github.com/users/mojombo/following{/other_user}",
            "gists_url": "https://api.github.com/users/mojombo/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/mojombo/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/mojombo/subscriptions",
            "organizations_url": "https://api.github.com/users/mojombo/orgs",
            "repos_url": "https://api.github.com/users/mojombo/repos",
            "events_url": "https://api.github.com/users/mojombo/events{/privacy}",
            "received_events_url": "https://api.github.com/users/mojombo/received_events",
            "type": "User",
            "site_admin": false
        });
    },

    onUserChange: function (combo) {
        var selection = combo.getSelection(),
            username = selection && selection.get('login'),
            repoCombo = this.lookupReference('repo'),
            queryMode = username ? 'local' : 'remote',
            repoStore;

        repoCombo.setQueryMode(queryMode);

        if (username) {
            repoStore = repoCombo.getStore();
            repoStore.load({
                params: {
                    q: 'user:' + username
                }
            });
        } else {
            repoCombo.clearValue();
        }
    },

    onRepoChange: function (repoCombo) {
        var selection = repoCombo.getSelection(),
            queryMode = repoCombo.queryMode,
            user = selection && selection.get('owner'),
            userCombo = this.lookupReference('user');

        if (queryMode === 'remote') {
            userCombo.setSelection(user);
        }
    }
});