package com.company.scr.web.carrent;

import com.company.scr.entity.CarRent;
import com.haulmont.cuba.core.entity.Entity;
import com.haulmont.cuba.gui.components.*;
import com.haulmont.cuba.gui.components.actions.CreateAction;
import com.haulmont.cuba.gui.components.actions.EditAction;
import com.haulmont.cuba.gui.components.actions.RemoveAction;
import com.haulmont.cuba.gui.data.CollectionDatasource;
import com.haulmont.cuba.gui.data.DataSupplier;
import com.haulmont.cuba.gui.data.Datasource;

import javax.inject.Inject;
import javax.inject.Named;
import java.util.Collections;
import java.util.Map;
import java.util.UUID;

public class CarRentBrowse extends AbstractLookup {

    /**
     * The {@link CollectionDatasource} instance that loads a list of {@link CarRent} records
     * to be displayed in {@link CarRentBrowse#carRentsTable} on the left
     */
    @Inject
    private CollectionDatasource<CarRent, UUID> carRentsDs;

    /**
     * The {@link Datasource} instance that contains an instance of the selected entity
     * in {@link CarRentBrowse#carRentsDs}
     * <p/> Containing instance is loaded in {@link CollectionDatasource#addItemChangeListener}
     * with the view, specified in the XML screen descriptor.
     * The listener is set in the {@link CarRentBrowse#init(Map)} method
     */
    @Inject
    private Datasource<CarRent> carRentDs;

    /**
     * The {@link Table} instance, containing a list of {@link CarRent} records,
     * loaded via {@link CarRentBrowse#carRentsDs}
     */
    @Inject
    private Table<CarRent> carRentsTable;

    /**
     * The {@link BoxLayout} instance that contains components on the left side
     * of {@link SplitPanel}
     */
    @Inject
    private BoxLayout lookupBox;

    /**
     * The {@link BoxLayout} instance that contains buttons to invoke Save or Cancel actions in edit mode
     */
    @Inject
    private BoxLayout actionsPane;

    /**
     * The {@link FieldGroup} instance that is linked to {@link CarRentBrowse#carRentDs}
     * and shows fields of the selected {@link CarRent} record
     */
    @Inject
    private FieldGroup fieldGroup;
    
    /**
     * The {@link RemoveAction} instance, related to {@link CarRentBrowse#carRentsTable}
     */
    @Named("carRentsTable.remove")
    private RemoveAction carRentsTableRemove;
    
    @Inject
    private DataSupplier dataSupplier;

    /**
     * {@link Boolean} value, indicating if a new instance of {@link CarRent} is being created
     */
    private boolean creating;

    @Override
    public void init(Map<String, Object> params) {

        /**
         * Adding {@link com.haulmont.cuba.gui.data.Datasource.ItemChangeListener} to {@link carRentsDs}
         * The listener reloads the selected record with the specified view and sets it to {@link carRentDs}
         */
        carRentsDs.addItemChangeListener(e -> {
            if (e.getItem() != null) {
                CarRent reloadedItem = dataSupplier.reload(e.getDs().getItem(), carRentDs.getView());
                carRentDs.setItem(reloadedItem);
            }
        });
        
        /**
         * Adding {@link CreateAction} to {@link carRentsTable}
         * The listener removes selection in {@link carRentsTable}, sets a newly created item to {@link carRentDs}
         * and enables controls for record editing
         */
        carRentsTable.addAction(new CreateAction(carRentsTable) {
            @Override
            protected void internalOpenEditor(CollectionDatasource datasource, Entity newItem, Datasource parentDs, Map<String, Object> params) {
                carRentsTable.setSelected(Collections.emptyList());
                carRentDs.setItem((CarRent) newItem);
                enableEditControls(true);
            }
        });

        /**
         * Adding {@link EditAction} to {@link carRentsTable}
         * The listener enables controls for record editing
         */
        carRentsTable.addAction(new EditAction(carRentsTable) {
            @Override
            protected void internalOpenEditor(CollectionDatasource datasource, Entity existingItem, Datasource parentDs, Map<String, Object> params) {
                if (carRentsTable.getSelected().size() == 1) {
                    enableEditControls(false);
                }
            }
        });
        
        /**
         * Setting {@link RemoveAction#afterRemoveHandler} for {@link carRentsTableRemove}
         * to reset record, contained in {@link carRentDs}
         */
        carRentsTableRemove.setAfterRemoveHandler(removedItems -> carRentDs.setItem(null));
        
        disableEditControls();
    }

    /**
     * Method that is invoked by clicking Save button after editing an existing or creating a new record
     */
    public void save() {
        getDsContext().commit();

        CarRent editedItem = carRentDs.getItem();
        if (creating) {
            carRentsDs.includeItem(editedItem);
        } else {
            carRentsDs.updateItem(editedItem);
        }
        carRentsTable.setSelected(editedItem);

        disableEditControls();
    }

    /**
     * Method that is invoked by clicking Save button after editing an existing or creating a new record
     */
    public void cancel() {
        CarRent selectedItem = carRentsDs.getItem();
        if (selectedItem != null) {
            CarRent reloadedItem = dataSupplier.reload(selectedItem, carRentDs.getView());
            carRentsDs.setItem(reloadedItem);
        } else {
            carRentDs.setItem(null);
        }

        disableEditControls();
    }

    /**
     * Enabling controls for record editing
     * @param creating indicates if a new instance of {@link CarRent} is being created
     */
    private void enableEditControls(boolean creating) {
        this.creating = creating;
        initEditComponents(true);
        fieldGroup.requestFocus();
    }

    /**
     * Disabling editing controls
     */
    private void disableEditControls() {
        initEditComponents(false);
        carRentsTable.requestFocus();
    }

    /**
     * Initiating edit controls, depending on if they should be enabled/disabled
     * @param enabled if true - enables editing controls and disables controls on the left side of the splitter
     *                if false - visa versa
     */
    private void initEditComponents(boolean enabled) {
        fieldGroup.setEditable(enabled);
        actionsPane.setVisible(enabled);
        lookupBox.setEnabled(!enabled);
    }
}