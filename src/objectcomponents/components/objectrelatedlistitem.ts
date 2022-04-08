/**
 * @module ObjectComponents
 */
import {Component, Input, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {metadata} from "../../services/metadata.service";
import {footer} from "../../services/footer.service";
import {language} from "../../services/language.service";
import {model} from "../../services/model.service";
import {relatedmodels} from "../../services/relatedmodels.service";
import {layout} from "../../services/layout.service";
import {view} from "../../services/view.service";
import {modal} from '../../services/modal.service';

@Component({
    selector: "[object-related-list-item]",
    templateUrl: "../templates/objectrelatedlistitem.html",
    providers: [model, view]
})
export class ObjectRelatedListItem implements OnInit {
    @Input() public listfields: any[] = [];
    @Input() public listitem: any = {};
    @Input() public module: string = "";
    @Input() public editable: boolean = false;
    @Input() public editcomponentset: string = "";

    /**
     * an oiptional list item actionset that can be passed through
     */
    @Input() public listitemactionset: string;

    /**
     * set to true to hide the actionset menu item being display
     */
    @Input() public hideActions: boolean = false;

    public customEditActions: any[] = [];
    public customActions: any[] = [];
    public expanded: boolean = false;
    public componentconfig: any = {};

    constructor(public metadata: metadata, public footer: footer, public model: model, public relatedmodels: relatedmodels, public view: view, public router: Router, public language: language, public layout: layout, public modalservice: modal) {
    }

    /**
     * initialize
     */
    public ngOnInit() {
        // do not display labels in this view and disable editing
        this.view.displayLabels = false;
        this.view.isEditable = this.editable;

        // initialize the model
        this.model.module = this.module;
        this.model.id = this.listitem.id;
        this.model.setData(this.listitem);

        // load the componentconfig from ObjectRelatedListItem ... if input itemactionset is not defined
        this.componentconfig = this.metadata.getComponentConfig('ObjectRelatedListItem', this.model.module);
    }

    /**
     * returns the actionset that iss either passed in via input from the container or retrieved from the config
     */
    get actionset() {
        return this.listitemactionset ? this.listitemactionset : this.componentconfig.actionset;
    }

    /**
     * go to the detail voie for the model
     */
    public navigateDetail() {
        this.router.navigate(["/module/" + this.model.module + "/" + this.model.id]);
    }

    /**
     * handling the actions
     *
     * ToDo: switch this to proper actionset item handling
     *
     * @param action
     */
    public handleAction(action) {
        switch (action) {
            case "canceledit":
                this.model.cancelEdit();
                this.view.setViewMode();
                break;
            case "edit":
                this.metadata.addComponentDirect("ObjectEditModalWReference", this.footer.footercontainer).subscribe(editModalRef => {
                    editModalRef.instance.model.module = this.module;
                    editModalRef.instance.model.id = this.model.id;
                    editModalRef.instance.model.setData(this.model.data, false);

                    if (this.editcomponentset && this.editcomponentset != "") {
                        editModalRef.instance.componentSet = this.editcomponentset;
                    }
                    this.model.startEdit();
                    editModalRef.instance.modalAction$.subscribe(action => {
                        if (action === false) {
                            editModalRef.destroy();
                            this.model.cancelEdit();
                        } else {
                            this.relatedmodels.setItem(this.model.data);
                            this.model.endEdit();
                            editModalRef.destroy();
                        }
                    });
                });
                break;
            case "remove":
                this.modalservice.confirm(this.language.getLabel('QST_REMOVE_ENTRY'), this.language.getLabel('QST_REMOVE_ENTRY', null, 'short')).subscribe((answer) => {
                    if (answer) this.relatedmodels.deleteItem(this.model.id);
                });
                break;
            case "saverelated":
                if (this.model.validate()) {
                    // get changed Data
                    let changedData: any = this.model.getDirtyFields();
                    // in any case update date modified and set the id for the PUT
                    changedData.date_modified = this.model.getField('date_modified');
                    changedData.id = this.model.id;
                    // save related model
                    this.relatedmodels.setItem(changedData);
                    this.model.endEdit();
                    this.view.setViewMode();
                }
                break;
        }
    }

    public toggleexpanded(e: MouseEvent) {
        e.stopPropagation();
        this.expanded = !this.expanded;
    }

    get isexpanded() {
        return this.layout.screenwidth != 'small' || this.expanded;
    }

    get expandicon() {
        return this.expanded ? 'chevronup' : 'chevrondown';
    }
}
