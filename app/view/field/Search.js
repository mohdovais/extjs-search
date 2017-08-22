Ext.define('MyApp.view.field.Search', {
    extend: 'Ext.form.field.ComboBox',

    xtype: 'myappsearch',

    queryMode: 'remote',

    triggers: {
        clear: {
            cls: 'trigger-clear',
            weight: -1, // negative to place before default triggers
            handler: 'onClearTriggerClick',
            scope: 'this',
            focusOnMousedown: true
        }
    },

    constructor: function (_config) {
        var config = Ext.apply({}, _config),
            triggers;

        if (config.externalPicker) {
            triggers = config.triggers || {};
            triggers.external = {
                cls: 'trigger-extenal',
                handler: 'onExternalTriggerClick',
                scope: 'this',
                focusOnMousedown: false
            }

            config.triggers = triggers;
        }

        this.callParent([config]);
    },

    /**
     * Overriden method to convert plain object to
     * selection model
     */
    setSelection: function (selection) {
        var me = this,
            Model;

        if (selection && !selection.isModel) {
            Model = me.getStore().getModel();
            selection = new Model(selection)
        }

        me.callParent([selection])
    },

    afterRender: function (combo) {
        var me = this;

        me.updateTriggerIcon();
        me.updateState();

        me.callParent(arguments);
    },

    beforeQuery: function (queryPlan) {
        var me = this,
            query = queryPlan.query;

        if (me.queryMode === 'remote' && Ext.isEmpty(query)) {
            if (!Ext.isEmpty(me.lastQuery)) {
                me.expand();
            }
            queryPlan.cancel = true;
        }

        return me.callParent(arguments);
    },

    postBlur: function (event) {
        var me = this;

        var selection = me.getSelection();
        if (Ext.isEmpty(selection)) {
            me.clearValue();
        }

        return me.callParent(arguments);
    },

    onClearTriggerClick: function (combo, trigger, event) {
        combo.clearValue();
    },

    onChange: function () {
        var me = this;

        me.callParent(arguments);
        me.updateState();
    },

    setReadOnly: function (readOnly) {
        var me = this;

        me.callParent(arguments);

        if (!readOnly) {
            me.updateState();
        }

    },

    updateState: function () {
        var me = this,
            value = me.getValue(),
            hasValue = !Ext.isEmpty(value),
            picker = me.getTrigger('picker'),
            clear = me.getTrigger('clear');

        if (!me.rendered) {
            return;
        }

        me.inputEl.el.dom.readOnly = hasValue;

        if (hasValue) {
            picker.hide();
            clear.show();
        } else {
            picker.show();
            clear.hide();
        }
    },

    updateTriggerIcon: function () {
        var me = this,
            trigger = me.getTrigger('picker');

        if (!me.rendered) {
            return;
        }

        if (me.queryMode === 'remote') {
            trigger.el.addCls('trigger-search');
        } else {
            trigger.el.removeCls('trigger-search');
        }
    },

    setQueryMode: function (queryMode) {
        var me = this;

        if (queryMode === 'local' || queryMode === 'remote') {
            me.queryMode = queryMode;
        }

        me.updateTriggerIcon();

        return me;
    },

    /*
     * External Picker Code Start
     */
    onExternalTriggerClick: function (combo, trigger, event) {
        var me = this,
            externalPicker = me.getExternalPicker();

        externalPicker.show();
    },

    getExternalPicker: function () {
        var me = this,
            picker = me._externalPicker;

        if (!picker || picker.destroyed) {
            picker = me.createExternalPicker();
        }

        return (me._externalPicker = picker);
    },

    createExternalPicker: function () {
        var me = this,
            picker,
            pickerCfg = me.externalPicker;

        if (typeof pickerCfg === 'string') {
            pickerCfg = {
                xtype: pickerCfg
            }
        }

        pickerCfg = Ext.apply({
            width: 500,
            height: 400
        }, {
            id: me.id + '-externalpicker',
            pickerField: me,
            floating: true,
            hidden: true,
            store: me.getExternalPickerStore(),
            //selectedRecords: me.getSelectedRecords(),
        }, pickerCfg);

        picker = Ext.widget(pickerCfg);

        return picker;

    },

    getSelectedRecords: function () {
        return Ext.Array.from(this.getSelection());
    },

    getExternalPickerStore: function () {
        return this.getStore();
    }
});