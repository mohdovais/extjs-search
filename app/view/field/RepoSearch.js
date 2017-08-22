Ext.define('MyApp.view.field.RepoSearch', {
    extend: 'MyApp.view.field.Search',

    xtype: 'myapp-reposearch',

    tpl: [
        '<ul class="x-list-plain"><tpl for=".">',
        '<li role="option" class="x-boundlist-item">',
        '<strong>{full_name}</strong><br/>',
        '<em>{description}</em>',
        '</li>',
        '</tpl></ul>'
    ],

    displayTpl: [
        '<tpl for=".">' +
        '{name} by {owner.login}' +
        '<tpl if="xindex < xcount">, </tpl>' +
        '</tpl>'
    ]
});