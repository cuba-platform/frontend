package com.company.scr.web.favoritecar;

import com.company.scr.entity.FavoriteCar;
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

public class FavoriteCarBrowse extends AbstractLookup {

    /**
     * The {@link CollectionDatasource} instance that loads a list of {@link FavoriteCar} records
     * to be displayed in {@link FavoriteCarBrowse#favoriteCarsTable} on the left
     */
    @Inject
    private CollectionDatasource<FavoriteCar, UUID> favoriteCarsDs;

    /**
     * The {@link Datasource} instance that contains an instance of the selected entity
     * in {@link FavoriteCarBrowse#favoriteCarsDs}
     * <p/> Containing instance is loaded in {@link CollectionDatasource#addItemChangeListener}
     * with the view, specified in the XML screen descriptor.
     * The listener is set in the {@link FavoriteCarBrowse#init(Map)} method
     */
    @Inject
    private Datasource<FavoriteCar> favoriteCarDs;

    /**
     * The {@link Table} instance, containing a list of {@link FavoriteCar} records,
     * loaded via {@link FavoriteCarBrowse#favoriteCarsDs}
     */
    @Inject
    private Table<FavoriteCar> favoriteCarsTable;

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
     * The {@link FieldGroup} instance that is linked to {@link FavoriteCarBrowse#favoriteCarDs}
     * and shows fields of the selected {@link FavoriteCar} record
     */
    @Inject
    private FieldGroup fieldGroup;
    
    /**
     * The {@link RemoveAction} instance, related to {@link FavoriteCarBrowse#favoriteCarsTable}
     */
    @Named("favoriteCarsTable.remove")
    private RemoveAction favoriteCarsTableRemove;
    
    @Inject
    private DataSupplier dataSupplier;

    /**
     * {@link Boolean} value, indicating if a new instance of {@link FavoriteCar} is being created
     */
    private boolean creating;

    @Override
    public void init(Map<String, Object> params) {

        /**
         * Adding {@link com.haulmont.cuba.gui.data.Datasource.ItemChangeListener} to {@link favoriteCarsDs}
         * The listener reloads the selected record with the specified view and sets it to {@link favoriteCarDs}
         */
        favoriteCarsDs.addItemChangeListener(e -> {
            if (e.getItem() != null) {
                FavoriteCar reloadedItem = dataSupplier.reload(e.getDs().getItem(), favoriteCarDs.getView());
                favoriteCarDs.setItem(reloadedItem);
            }
        });
        
        /**
         * Adding {@link CreateAction} to {@link favoriteCarsTable}
         * The listener removes selection in {@link favoriteCarsTable}, sets a newly created item to {@link favoriteCarDs}
         * and enables controls for record editing
         */
        favoriteCarsTable.addAction(new CreateAction(favoriteCarsTable) {
            @Override
            protected void internalOpenEditor(CollectionDatasource datasource, Entity newItem, Datasource parentDs, Map<String, Object> params) {
                favoriteCarsTable.setSelected(Collections.emptyList());
                favoriteCarDs.setItem((FavoriteCar) newItem);
                enableEditControls(true);
            }
        });

        /**
         * Adding {@link EditAction} to {@link favoriteCarsTable}
         * The listener enables controls for record editing
         */
        favoriteCarsTable.addAction(new EditAction(favoriteCarsTable) {
            @Override
            protected void internalOpenEditor(CollectionDatasource datasource, Entity existingItem, Datasource parentDs, Map<String, Object> params) {
                if (favoriteCarsTable.getSelected().size() == 1) {
                    enableEditControls(false);
                }
            }
        });
        
        /**
         * Setting {@link RemoveAction#afterRemoveHandler} for {@link favoriteCarsTableRemove}
         * to reset record, contained in {@link favoriteCarDs}
         */
        favoriteCarsTableRemove.setAfterRemoveHandler(removedItems -> favoriteCarDs.setItem(null));
        
        disableEditControls();
    }

    /**
     * Method that is invoked by clicking Save button after editing an existing or creating a new record
     */
    public void save() {
        getDsContext().commit();

        FavoriteCar editedItem = favoriteCarDs.getItem();
        if (creating) {
            favoriteCarsDs.includeItem(editedItem);
        } else {
            favoriteCarsDs.updateItem(editedItem);
        }
        favoriteCarsTable.setSelected(editedItem);

        disableEditControls();
    }

    /**
     * Method that is invoked by clicking Save button after editing an existing or creating a new record
     */
    public void cancel() {
        FavoriteCar selectedItem = favoriteCarsDs.getItem();
        if (selectedItem != null) {
            FavoriteCar reloadedItem = dataSupplier.reload(selectedItem, favoriteCarDs.getView());
            favoriteCarsDs.setItem(reloadedItem);
        } else {
            favoriteCarDs.setItem(null);
        }

        disableEditControls();
    }

    /**
     * Enabling controls for record editing
     * @param creating indicates if a new instance of {@link FavoriteCar} is being created
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
        favoriteCarsTable.requestFocus();
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