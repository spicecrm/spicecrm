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

/**
 * renders a related card underneath an object with a model loaded
 *
 * the component will read a componenconfig and reader header and footer and via transclusion expect the content. The COmponent using this needs to provide a relatedmodel service
 */
@Component({
    selector: "object-related-card",
    templateUrl: "./src/objectcomponents/templates/objectrelatedcard.html",
    animations: [
        trigger('displaycard', [
            transition(':enter', [
                style({ opacity: 0 , height: '0px',overflow: 'hidden'}),
                animate('.5s', style({ height: '*', opacity: 1 })),
                style({ overflow: 'unset'})
            ]),
            transition(':leave', [
                style({ overflow: 'hidden'}),
                animate('.5s', style({ height: '0px', opacity: 0 }))
            ])
        ])
    ]
})
export class ObjectRelatedCard {

    /**
     * a selector for the Header in teh card. This will trigger the open or collapsed stated
     */
    @ViewChild(ObjectRelatedCardHeader,{static: true}) private cardheaders: ObjectRelatedCardHeader;

    /**
     * the component config as key paramater into the component
     */
    @Input() private componentconfig;

    constructor(private language: language, private metadata: metadata, private relatedmodels: relatedmodels, private model: model) {    }

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
        if (this.cardheaders && !this.cardheaders.isopen) {
            return false;
        }

        return this.relatedmodels.count > 0 || this.isloading;
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
     * checks if the user has Access per ACL rights
     */
    public aclAccess() {
        if (this.module) {
            return this.metadata.checkModuleAcl(this.module, "list");
        } else {
            return false;
        }
    }

}
