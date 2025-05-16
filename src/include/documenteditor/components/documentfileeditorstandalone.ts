import {AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, ViewChild} from '@angular/core';
import {model} from "../../../services/model.service";
import {Subscription} from "rxjs";
import {navigationtab} from "../../../services/navigationtab.service";
import {DocumentFileEditor} from "./documentfileeditor";

@Component({
    selector: 'document-file-editor-standalone',
    templateUrl: '../templates/documentfileeditorstandalone.html',
    providers: [model],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class DocumentFileEditorStandalone implements AfterViewInit, OnDestroy {

    /**
     * holds the component subscriptions
     */
    public subscriptions: Subscription = new Subscription();
    /**
     * holds the field name
     */
    public fieldName: string;
    /**
     * holds the attachment id
     */
    public attachmentId: string;

    @ViewChild(DocumentFileEditor) private documentFileEditor: DocumentFileEditor;

    constructor(private navigationTab: navigationtab,
                private model: model) {

        this.subscriptions.add(
            this.navigationTab.activeRoute$.subscribe(route => {
                this.initialize(route.params);
            })
        );
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public ngAfterViewInit() {
        this.documentFileEditor.setEditMode(true);
    }

    /**
     * initialize model
     * @param routeParams
     * @private
     */
    private initialize(routeParams) {
        this.fieldName = routeParams.fieldname;
        this.model.module = routeParams.module;
        this.model.id = routeParams.id;
        this.attachmentId = routeParams.attachmentId;

        this.model.getData().subscribe(() => {
            const fieldValue = !this.attachmentId ? this.model.getField(this.fieldName + '_name') : this.attachmentId;
            this.navigationTab.setTabInfo({
                displayname: fieldValue,
                displayicon: 'attach',
            });

        });
    }
}