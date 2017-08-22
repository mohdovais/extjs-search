Ext.define('MyApp.view.field.ExternalPicker', {
    extend: 'Ext.window.Window',

    xtype: 'externalpicker',

    referenceHolder: true,

    tbar: {
        xtype: 'combobox',
        itemId: 'searchField',
        reference: 'searchField',
        expand: Ext.emptyFn,
        collapse: Ext.emptyFn
    },

    bbar: ['->', {
        text: 'Cancel',
        //handler: 'onCancelHandler'
    }, {
        text: 'Update',
        //handler: 'onUpdateHandler'
    }],

    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    items: [{
        xtype: 'grid',
        itemId: 'searchGrid',
        reference: 'searchGrid',
        flex: 1,
        setSelectionModel: Ext.emptyFn,
        refresh: function(){
            this.view.refresh();
        }
    }, {
        xtype: 'tbseparator'
    }, {
        xtype: 'grid',
        itemId: 'selectionGrid',
        reference: 'selectionGrid',
        width: 200
    }],

    initComponent: function () {
        var me = this,
            pickerField = me.pickerField,
            store = me.store,
            searchField,
            toSelect;

        me.callParent(arguments);

        me.searchField = me.lookupReference('searchField'),
            me.searchGrid = me.lookupReference('searchGrid'),
            me.selectionGrid = me.lookupReference('selectionGrid');

        me.setupSearchField();
        me.setupSearchGrid();
        me.setupSelectionGrid();
    },

    setupSearchField: function () {
        var me = this,
            store = me.store,
            searchField = me.searchField,
            searchGrid = me.searchGrid,
            searchStore = Ext.create('Ext.data.Store', {
                model: store.model,
                proxy: store.getProxy()
            });


        searchField.picker = searchGrid;
        searchField.setStore(searchStore);
    },

    setupSearchGrid: function () {
        var me = this,
            searchField = me.searchField,
            searchGrid = me.searchGrid,
            searchStore = me.searchField.getStore(),
            columns = me.getSearchGridColumns(searchGrid, searchStore, searchField);

        searchGrid.reconfigure(searchStore, columns);
    },

    getSearchGridColumns: function (searchGrid, searchStore, searchField) {
        return [{
            text: 'Select',
            dataIndex: this.pickerField.displayField,
            flex: 1
        }];
    },

    setupSelectionGrid: function () {
        var me = this,
            selectionGrid = me.lookupReference('selectionGrid'),
            selectionStore = Ext.create('Ext.data.Store', {
                model: me.store.model
            }),
            columns = me.getSelectionGridColumns(selectionGrid, selectionStore);

        selectionGrid.reconfigure(selectionStore, columns);
    },

    getSelectionGridColumns: function (selectionGrid, selectionStore) {
        return [{
            text: 'Selected',
            dataIndex: this.pickerField.displayField,
            flex: 1
        }];
    },

    onCancelHandler: function () {

    },

    onUpdateHandler: function () {
        console.log(this, arguments)
    },

    listeners: {
        show: function (me) {
            var pickerField = me.pickerField;

            //1 Set Query Mode [remote/local]
            me.searchField.queryMode = pickerField.queryMode;

            //2 Set already query records from pickerField
            me.searchGrid.getStore().loadRecords(pickerField.getStore().getRange());

            //3 Set selected records from pickerField
            me.selectionGrid.getStore().loadRecords(pickerField.getSelectedRecords());
        }
    }
});
