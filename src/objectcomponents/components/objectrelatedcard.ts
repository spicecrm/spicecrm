/**
 * @module ObjectComponents
 */
import {Component, ViewChildren, QueryList, Input, ViewChild} from "@angular/core";
import {
    trigger,
    state,
    style,
    animate,
    transition
} from '@angular/animations';

import {relatedmodels} from "../../services/relatedmodels.service";
import {model} from "../../services/model.service";
import {metadata} from "../../services/metadata.service";
import {language} from "../../services/language.service";
import {ObjectRelatedCardHeader} from "./objectrelatedcardheader";
import {ObjectRelatedCardFooter} from "./objectrelatedcardfooter";

/**
 * renders a related card underneath an object with a model loaded
 *
 * the component will read a componenconfig and reader header and footer and via transclusion expect the content. The COmponent using this needs to provide a relatedmodel service
 */
@Component({
    selector: "object-related-card",
    templateUrl: "../templates/objectrelatedcard.html",
    animations: [
        trigger('displaycard', [
            transition(':enter', [
                style({opacity: 0, height: '0px', overflow: 'hidden'}),
                animate('.5s', style({height: '*', opacity: 1})),
                style({overflow: 'unset'})
            ]),
            transition(':leave', [
                style({overflow: 'hidden'}),
                animate('.5s', style({height: '0px', opacity: 0}))
            ])
        ])
    ]
})
export class ObjectRelatedCard {

    /**
     * a selector for the Header in teh card. This will trigger the open or collapsed stated
     */
    @ViewChild(ObjectRelatedCardHeader, {static: false}) public cardheader: ObjectRelatedCardHeader;

    /**
     * catches the card footer
     * @private
     */
    @ViewChild(ObjectRelatedCardFooter, {static: false}) public cardfooter: ObjectRelatedCardFooter;

    /**
     * the component config as key paramater into the component
     */
    @Input() public componentconfig;

    constructor(public language: language, public metadata: metadata, public relatedmodels: relatedmodels, public model: model) {
    }

    /**
     * a simple getter to extract the module out of the component config
     */
    get module() {
        return this.componentconfig.object;
    }

    /**
     * a helper function to determine if the card shoudl be hidden based on the modelstate or the ACL check
     */
    get hidden() {
        return !this.checkModelState() || !this.aclAccess();
    }

    /**
     * a helper function to determine if the list is loading
     */
    get isloading() {
        return this.relatedmodels.isloading;
    }

    /**
     * a helper to get if we have related models and the state is open
     */
    get isopen() {
        if (this.cardheader && !this.cardheader.isopen) {
            return false;
        }

        return this.relatedmodels.count > 0 || this.isloading;
    }

    /**
     * getter to check from the footer if we are paginating
     * in that case put a loading spinner on the grid
     */
    get paginating() {
        // check that we are not loading, we have a footer and the footer is paginating
        if (!this.relatedmodels.isloading && this.cardfooter && this.cardfooter.paginating) return true;

        // return false by default
        return false;
    }


    /**
     * checks the model state if a requiredmodelstate is set in the componentconfig
     */
    public checkModelState() {
        if (this.componentconfig.requiredmodelstate && !this.model.checkModelState(this.componentconfig.requiredmodelstate)) {
            return false;
        }

        // by default return true
        return true;
    }

    /**
     * check if we can list and also if the user has access to the link field
     * the link field can be disabled using the field control in the acl object
     * if the link field is turned off .. the acl access is not granted
     */
    public aclAccess() {
        if (this.module) {
            let linkField = this.relatedmodels.linkName != "" ? this.relatedmodels.linkName : this.relatedmodels.relatedModule?.toLowerCase();
            return (this.metadata.checkModuleAcl(this.module, "list") || this.metadata.checkModuleAcl(this.module, "listrelated")) && this.model.checkAccess('detail') &&  this.model.checkFieldAccess(linkField);
        } else {
            return false;
        }
    }
}
