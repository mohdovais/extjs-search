Ext.define('MyApp.view.field.MultiSearch', {
    extend: 'MyApp.view.field.Search',
    xtype: 'multisearch',

    /**
     * @readonly
     */
    isMultiSearch: true,

    /**
     * @event selectionschange
     * @param {Ext.form.field.Combobox} this
     * @param {Ext.data.Model[]} selections selections
     */

    /**
     * @event beforeremove
     * Fired when a selection is removed, return false to stop the action
     * @param {Ext.form.field.Combobox} this
     * @param {Ext.data.Model} selection selection to be removed
     * @return {Boolean}
     */

    config: {
        selections: []
    },

    publishes: ['selections'],
    twoWayBindable: ['selections'],

    /**
     * @cfg {Boolean} [allowEmptySelections=true]
     * It is equivalent of `{@link #allowBlank}`. When false it will throw error
     * if no selection
     */
    allowEmptySelections: true,

    /**
     * @cfg {String} [displayGridTpl]
     * If defined it will decide the template
     * of the selected items below 
     */
    displayGridTpl: null,

    /**
     * @cfg {String} [displayGridPosition=bottom]
     * - **`'top'`** 
     * - **`'bottm'`** 
     */
    displayGridPosition: 'bottom',

    childEls: ['listWrap'],

    listWrapCls: Ext.baseCSSPrefix + 'form-combo-listwrap',

    listWrapTpl: [
        '<div id="{cmpId}-listWrap" data-ref="listWrap" ',
        'role="presentation" class="{listWrapCls} {listWrapCls}-{ui}">',
        '</div>'
    ],

    displayGridTplPre: [
        '<ul class="x-list-plain"><tpl for=".">',
        '<li role="option" class="displaygrid-item">',
        '<div class="displaygrid-item-text">'
    ],

    displayGridTplPost: [
        '</div>',
        '<div class="displaygrid-item-remove',
        '<tpl if="this.canRemove(values) == false">',
        ' disabled',
        '</tpl>',
        '"></div>',
        '</li>',
        '</tpl></ul>'
    ],

    initConfig: function (config) {
        var me = this;

        me.allowEmptySelections = me.allowEmptySelections && me.allowBlank;
        me.allowBlank = true;

        me.callParent(arguments);
    },

    /**
     * Gets the markup to be inserted into the outer template's bodyEl.
     * Overridden protected method `Ext.form.field.Base.getSubTplMarkup` to inject display grid
     * @protected
     */
    getSubTplMarkup: function (fieldData) {
        var me = this,
            data = Ext.apply(me.getSubTplData(fieldData), {
                listWrapCls: me.listWrapCls
            }),
            listWrapTpl = me.getTpl('listWrapTpl'),
            markup = this.callParent(arguments);

        if (listWrapTpl) {
            if (me.displayGridPosition === 'top') {
                markup = listWrapTpl.apply(data) + markup;
            } else {
                markup += listWrapTpl.apply(data);
            }
        }

        return markup;
    },

    /*
     * Render display grid and attach a clone of search store 
     * to hold selections
     */
    afterRender: function () {
        var me = this,
            store = me.getStore(),
            displayGridStore;

        me.displayGrid = Ext.create('Ext.view.View', {
            store: new Ext.data.Store({
                model: store.model
            }),
            tpl: me.getDisplayGridTpl(),
            itemSelector: 'li.displaygrid-item',
            renderTo: me.listWrap,
            listeners: {
                itemclick: me.onDisplayGridItemClick,
                scope: me
            }
        });

        displayGridStore = me.getDisplayGridStore();
        me.mon(displayGridStore, me.getDisplayGridStoreListeners());

        me.callParent(arguments);

    },

    /**
     * @private
     * @return {String[]}
     */
    getDisplayGridTpl: function () {
        var me = this,
            displayGridTpl = Ext.Array.from(me.displayGridTpl);

        if (displayGridTpl.length === 0) {
            displayGridTpl = ['{' + config.displayField + '}'];
        }

        return me.displayGridTplPre.concat(displayGridTpl, me.displayGridTplPost, [{
            canRemove: me.canRemove
        }]);
    },

    /*
     * Since it is a multiselection, the combo itself does not hold the selection.
     * Once selection made, add it to selection store and remove selection
     */
    onChange: function () {
        var me = this,
            selection;

        me.callParent(arguments);
        selection = me.getSelection();

        if (selection) {
            if (me.fireEvent('beforeselect', me, selection) !== false) {
                me.displayGrid.getStore().add(selection);
            }
            me.clearValue();
            me.getPicker().refresh()
        }
    },

    /*
     * Add validation for allowBlank
     */
    validator: function () {
        var me = this,
            displayGridStore;

        if (!me.allowEmptySelections) {
            displayGridStore = me.getDisplayGridStore();
            return (displayGridStore.count() === 0) ? me.blankText : true;
        } else {
            return true;
        }
    },

    /**
     * Set it to read mode (hide combo)
     * @param {Boolean}
     */
    setReadOnly: function (readOnly) {
        var me = this;

        me.callParent(arguments);

        if (readOnly) {
            me.triggerWrap.hide('display');
        } else {
            me.triggerWrap.show();
        }

    },

    /**
     * Filter the item click event on display grid
     * and take action of remove button
     * @protected
     */
    onDisplayGridItemClick: function (view, record, item, idx, event, opts) {
        var me = this,
            store = view.getStore(),
            target;

        if (me.fireEvent('itemclick', arguments) === false) {
            return;
        }

        target = Ext.fly(event.target);

        if (target.hasCls('displaygrid-item-remove') && !target.hasCls('disabled')) {
            if (me.fireEvent('beforeremove', me, record) !== false) {
                store.remove(record);
            }
        }
    },

    /**
     * List of events on display grid store
     * @return {Object} Listener config
     * @private
     */
    getDisplayGridStoreListeners: function () {
        var me = this;
        return {
            add: me.onDisplayGridAdd,
            remove: me.onDisplayGridRemove,
            scope: me
        }
    },

    /**
     * @return {Ext.data.Store} displayGridStore
     */
    getDisplayGridStore: function () {
        var displayGrid = this.displayGrid;
        return displayGrid && displayGrid.getStore();
    },

    /**
     * @return {Ext.data.Model[]} selections
     */
    getSelections: function () {
        var displayGridStore = this.getDisplayGridStore();
        return displayGridStore && displayGridStore.getRange() || [];
    },

    /**
     * @param {Ext.data.Model[]} selections
     */
    setSelections: function (selections) {
        var displayGridStore = this.getDisplayGridStore();
        displayGridStore && displayGridStore.add(selections);
    },

    /**
     * @event selectionsadd
     * @param {Ext.form.field.Combobox} this
     * @param {Ext.data.Model[]} selections selections added
     */
    onDisplayGridAdd: function (displayStore, records, pos, eopts) {
        var me = this,
            selections = me.getSelections();

        me.fireEvent('selectionsadd', me, records);
        me.fireEvent('selectionschange', me, selections);
        me.publishState('selections', selections);
    },

    /**
     * @event selectionsremove
     * @param {Ext.form.field.Combobox} this
     * @param {Ext.data.Model[]} selections selections removed
     */
    onDisplayGridRemove: function (store, records, index, isMove, eOpts) {
        var me = this,
            selections = me.getSelections();

        me.fireEvent('selectionsremove', me, records);
        me.fireEvent('selectionschange', me, selections);
        me.publishState('selections', me.getSelections());
    },

    /**
     * Override this method to enable/disable remove button in display grid
     * @param {Object} values
     * @return {Boolean}
     */
    canRemove: Ext.emptyFn
});
