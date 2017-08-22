/**
 * This class is the main view for the application. It is specified in app.js as the
 * "mainView" property. That setting automatically applies the "viewport"
 * plugin causing this view to become the body element (i.e., the viewport).
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('MyApp.view.main.Main', {
    extend: 'Ext.panel.Panel',
    xtype: 'app-main',

    requires: [
        'Ext.plugin.Viewport',
        'Ext.window.MessageBox',

        'MyApp.view.main.MainController',
        'MyApp.view.main.MainModel',

        'MyApp.store.Repositories',
        'MyApp.view.field.Search'
    ],

    controller: 'main',
    viewModel: 'main',

    items: [{
        title: 'Search Demo',
        style: {
            padding: '1em',
        },
        items: [{
            xtype: 'myappsearch',
            reference: 'user',
            fieldLabel: 'Choose User',
            labelAlign: 'top',
            displayField: 'login',
            valueField: 'login',
            queryParam: 'q',
            width: 400,
            externalPicker: {
                xtype: 'externalpicker',
                title: 'My External Picker'
            },
            store: {
                type: 'users'
            },
            listeners: {
                change: 'onUserChange'
            }
        },{
            xtype: 'myapp-reposearch',
            reference: 'repo',
            fieldLabel: 'Choose Repo',
            labelAlign: 'top',
            displayField: 'name',
            valueField: 'id',
            queryParam: 'q',
            width: 400,
            externalPicker: 'externalpicker',
            store: {
                type: 'repositories'
            },
            listeners: {
                change: 'onRepoChange'
            }
        }, {
            xtype: 'multisearch',
            reference: 'multi',
            fieldLabel: 'Choose Multiple Repo',
            //labelAlign: 'top',
            displayField: 'name',
            valueField: 'id',
            queryParam: 'q',
            width: 400,
            store: {
                type: 'repositories'
            },
            //displayGridPosition: 'top',
            displayGridTpl: '<strong>{full_name}</strong><br/>{description}',
            canRemove: function(data){
                return data.owner.login !== 'facebook';
            }
        }]
    }]
});