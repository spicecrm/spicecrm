/**
 * @module ServiceComponentsModule
 */
import {Component, OnInit} from "@angular/core";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";

@Component({
    templateUrl: "../templates/serviceorderconfirmmodal.html",
    providers: [view]
})
export class ServiceOrderConfirmModal implements OnInit {

    /**
     * reference to self to allow closing the modal
     */
    public self: any;

    public componentset: string;

    constructor(
        public model: model,
        public metadata: metadata,
        public view: view
    ) {
        this.intiializeView();
    }

    public ngOnInit(): void {
        this.loadConfig();
    }

    public intiializeView() {
        this.view.isEditable = true;
        this.view.setEditMode();

        this.model.startEdit();
    }

    public loadConfig() {
        let compoonentConfig = this.metadata.getComponentConfig('ServiceOrderConfirmModal', this.model.module);
        this.componentset = compoonentConfig.componentset;
    }

    /**
     * closes the modal
     */
    public close() {
        this.model.cancelEdit();
        this.self.destroy();
    }

    /**
     * confirm and close the modal
     */
    public confirm() {
        this.model.setField('serviceorder_status', 'confirmed');
        this.model.save().subscribe(saved => {
            this.self.destroy();
        });
    }

}
