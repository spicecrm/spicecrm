/**
 * @module ModuleACL
 */
import {Component, ElementRef, OnChanges, OnInit, ViewChild, ViewContainerRef} from "@angular/core";
import {model} from "../../../services/model.service";
import {modelutilities} from "../../../services/modelutilities.service";
import {aclobjectsmanager} from "../services/aclobjectsmanager.service";

@Component({
    selector: 'aclobjects-manager',
    templateUrl: "../templates/aclobjectsmanager.html",
    providers: [aclobjectsmanager, model]
})
export class ACLObjectsManager implements OnInit {

    @ViewChild("managercontent", {read: ViewContainerRef, static: true}) elementmanagercontent: ViewContainerRef;

    public activeobjectid: string = "";
    public activetypeid: string = "";

    /**
     * holds the whole current acl object
     */
    public activeObject: any = {};

    constructor(
        public aclobjectsmanager: aclobjectsmanager,
        public modelutilities: modelutilities,
        public elementRef: ElementRef,
        public model: model
    ) {
        this.model.module = 'SpiceACLObjects';
    }

    public ngOnInit() {
        this.aclobjectsmanager.currentModel = this.model;
    }

    public setObject(objectid){
        this.activeobjectid = objectid;
    }

    public setType(typeid){
        this.activetypeid = typeid;
    }

    /**
     * handles updates to the object when emitted by ACLObjectsManagerObjects
     * i.e. when the status changes
     *
     * @param updatedObject
     */
    public onObjectUpdated(updatedObject: any) {
        if (this.activeobjectid === updatedObject.id) {
            // Update the active object reference in the parent
            this.activeObject = {...updatedObject};
        }
    }
}
