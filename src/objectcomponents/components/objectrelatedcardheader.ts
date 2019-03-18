/**
 * @module ObjectComponents
 */
import {Component, Input} from '@angular/core';
import {relatedmodels} from '../../services/relatedmodels.service';
import {language} from '../../services/language.service';

/**
 * the header in the object-related-card
 *
 * displays the header with icon for the module, the title, the count and a open/close trigger, and also an actionset
 */
@Component({
    selector: 'object-related-card-header',
    templateUrl: './src/objectcomponents/templates/objectrelatedcardheader.html'
})
export class ObjectRelatedCardHeader {

    /**
     * the component config as key paramater into the component
     */
    @Input() private componentconfig: any = {};

    /**
     * indicates if the panel is open ... this is checked fromt eh vcard to render the content or not
     */
    public isopen: boolean = true;

    constructor(private language: language, private relatedmodels: relatedmodels) {

    }

    /**
     * a getter for the title from the componentconfig
     */
    get title() {
        if (!this.componentconfig.title) {
            this.componentconfig.title = this.language.getModuleName(this.componentconfig.object);
        }
        return this.componentconfig.title ? this.componentconfig.title : "";
    }

    /**
     * a getter for the Title to be displayed. This either translates a tilte if set int he config or it renders the module name
     */
    get panelTitle() {
        return this.title != '' ? this.language.getLabel(this.title, this.module) : this.language.getModuleName(this.module);
    }

    /**
     * a getter to extract the actionset from the componentconfig
     */
    get actionset(){
        return this.componentconfig.actionset;
    }

    /**
     * a getter to extract the module from the componentconfig
     */
    get module(){
        return this.componentconfig.object;
    }

    /**
     * toggle Open or Close the panel
     */
    private toggleOpen() {
        this.isopen = !this.isopen;
    }

    /**
     * a getter function for the open icon to transform it and tilt it via ngStyle
     */
    get iconStyle() {
        if (!this.isopen) {
            return {
                transform: 'scale(1, -1)'
            };
        } else {
            return {};
        }
    }
}
