/**
 * @module ModuleEmails
 */
import {
    Component,
    ViewContainerRef,
    ViewChild,
    AfterViewInit,
    OnInit,
    Input,
    Output,
    EventEmitter
} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";
import {language} from "../../../services/language.service";
import {backend} from "../../../services/backend.service";

@Component({
    selector: "email-to-object-modal",
    templateUrl: "./src/modules/emails/templates/emailtoobjectmodal.html",
    providers: [model, view]
})
export class EmailToObjectModal implements OnInit, AfterViewInit {

    @ViewChild("detailcontainer", {read: ViewContainerRef, static: true}) private detailcontainer: ViewContainerRef;

    private email_model: any = null;
    private self: any = null;
    private componentRefs: Array<any> = [];
    @Output() public save$ = new EventEmitter();

    @Input() public object_module_name: string;
    @Input() public object_fields = [];
    @Input() public object_relation_link_name: string;
    @Input() public object_predefined_fields: any[];

    constructor(
        private language: language,
        private metadata: metadata,
        private view: view,
        private model: model,
        private backend: backend,
    ) {

    }

    public ngOnInit() {
        this.model.module = this.object_module_name;
        this.model.initializeModel(this.email_model);

        // if there are predefined fields
        if(this.object_predefined_fields)
        {
            // set them in model.data...
            for(let fieldname in this.object_predefined_fields)
            {
                this.model.data[fieldname] = this.object_predefined_fields[fieldname];
            }
        }

        this.view.isEditable = true;
        this.view.setEditMode();
    }

    public ngAfterViewInit() {
        this.buildContainer();
    }

    private close() {
        this.self.destroy();
    }

    private buildContainer() {
        // reset any rendered component
        for (let component of this.componentRefs) {
            component.destroy();
        }
        this.componentRefs = [];

        let componentconfig = this.metadata.getComponentConfig("ObjectRecordDetails", this.model.module);
        for (let panel of this.metadata.getComponentSetObjects(componentconfig.componentset)) {
            this.metadata.addComponent(panel.component, this.detailcontainer).subscribe(componentRef => {
                componentRef.instance.componentconfig = panel.componentconfig;
                this.componentRefs.push(componentRef);
            });
        }
    }

    private setField(data) {
        this.model.setFieldValue(data.field, data.value);
    }

    private save() {
        this.model.save().subscribe(
            res => {
                // if a relation link is given
                if(this.object_relation_link_name) {
                    // link this model to emails...
                    this.backend.postRequest("module/Emails/" + this.email_model.id + "/related/" + this.object_relation_link_name, [], [this.model.id]).subscribe(
                        subres => {
                            this.save$.emit(this.model.data);
                            this.close();
                        }
                    );
                } else {
                    this.save$.emit(this.model.data);
                    this.close();
                }

            }
        );
    }

}