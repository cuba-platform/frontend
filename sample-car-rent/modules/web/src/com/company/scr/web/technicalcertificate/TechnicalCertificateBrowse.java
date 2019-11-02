package com.company.scr.web.technicalcertificate;

import com.company.scr.entity.TechnicalCertificate;
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

public class TechnicalCertificateBrowse extends AbstractLookup {

    /**
     * The {@link CollectionDatasource} instance that loads a list of {@link TechnicalCertificate} records
     * to be displayed in {@link TechnicalCertificateBrowse#technicalCertificatesTable} on the left
     */
    @Inject
    private CollectionDatasource<TechnicalCertificate, UUID> technicalCertificatesDs;

    /**
     * The {@link Datasource} instance that contains an instance of the selected entity
     * in {@link TechnicalCertificateBrowse#technicalCertificatesDs}
     * <p/> Containing instance is loaded in {@link CollectionDatasource#addItemChangeListener}
     * with the view, specified in the XML screen descriptor.
     * The listener is set in the {@link TechnicalCertificateBrowse#init(Map)} method
     */
    @Inject
    private Datasource<TechnicalCertificate> technicalCertificateDs;

    /**
     * The {@link Table} instance, containing a list of {@link TechnicalCertificate} records,
     * loaded via {@link TechnicalCertificateBrowse#technicalCertificatesDs}
     */
    @Inject
    private Table<TechnicalCertificate> technicalCertificatesTable;

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
     * The {@link FieldGroup} instance that is linked to {@link TechnicalCertificateBrowse#technicalCertificateDs}
     * and shows fields of the selected {@link TechnicalCertificate} record
     */
    @Inject
    private FieldGroup fieldGroup;

    /**
     * The {@link RemoveAction} instance, related to {@link TechnicalCertificateBrowse#technicalCertificatesTable}
     */
    @Named("technicalCertificatesTable.remove")
    private RemoveAction technicalCertificatesTableRemove;

    @Inject
    private DataSupplier dataSupplier;

    /**
     * {@link Boolean} value, indicating if a new instance of {@link TechnicalCertificate} is being created
     */
    private boolean creating;

    @Override
    public void init(Map<String, Object> params) {

        /**
         * Adding {@link com.haulmont.cuba.gui.data.Datasource.ItemChangeListener} to {@link technicalCertificatesDs}
         * The listener reloads the selected record with the specified view and sets it to {@link technicalCertificateDs}
         */
        technicalCertificatesDs.addItemChangeListener(e -> {
            if (e.getItem() != null) {
                TechnicalCertificate reloadedItem = dataSupplier.reload(e.getDs().getItem(), technicalCertificateDs.getView());
                technicalCertificateDs.setItem(reloadedItem);
            }
        });

        /**
         * Adding {@link CreateAction} to {@link technicalCertificatesTable}
         * The listener removes selection in {@link technicalCertificatesTable}, sets a newly created item to {@link technicalCertificateDs}
         * and enables controls for record editing
         */
        technicalCertificatesTable.addAction(new CreateAction(technicalCertificatesTable) {
            @Override
            protected void internalOpenEditor(CollectionDatasource datasource, Entity newItem, Datasource parentDs, Map<String, Object> params) {
                technicalCertificatesTable.setSelected(Collections.emptyList());
                technicalCertificateDs.setItem((TechnicalCertificate) newItem);
                enableEditControls(true);
            }
        });

        /**
         * Adding {@link EditAction} to {@link technicalCertificatesTable}
         * The listener enables controls for record editing
         */
        technicalCertificatesTable.addAction(new EditAction(technicalCertificatesTable) {
            @Override
            protected void internalOpenEditor(CollectionDatasource datasource, Entity existingItem, Datasource parentDs, Map<String, Object> params) {
                if (technicalCertificatesTable.getSelected().size() == 1) {
                    enableEditControls(false);
                }
            }
        });

        /**
         * Setting {@link RemoveAction#afterRemoveHandler} for {@link technicalCertificatesTableRemove}
         * to reset record, contained in {@link technicalCertificateDs}
         */
        technicalCertificatesTableRemove.setAfterRemoveHandler(removedItems -> technicalCertificateDs.setItem(null));

        disableEditControls();
    }

    /**
     * Method that is invoked by clicking Save button after editing an existing or creating a new record
     */
    public void save() {
        getDsContext().commit();

        TechnicalCertificate editedItem = technicalCertificateDs.getItem();
        if (creating) {
            technicalCertificatesDs.includeItem(editedItem);
        } else {
            technicalCertificatesDs.updateItem(editedItem);
        }
        technicalCertificatesTable.setSelected(editedItem);

        disableEditControls();
    }

    /**
     * Method that is invoked by clicking Save button after editing an existing or creating a new record
     */
    public void cancel() {
        TechnicalCertificate selectedItem = technicalCertificatesDs.getItem();
        if (selectedItem != null) {
            TechnicalCertificate reloadedItem = dataSupplier.reload(selectedItem, technicalCertificateDs.getView());
            technicalCertificatesDs.setItem(reloadedItem);
        } else {
            technicalCertificateDs.setItem(null);
        }

        disableEditControls();
    }

    /**
     * Enabling controls for record editing
     * @param creating indicates if a new instance of {@link TechnicalCertificate} is being created
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
        technicalCertificatesTable.requestFocus();
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