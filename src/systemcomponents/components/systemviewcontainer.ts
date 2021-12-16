/**
 * @module SystemComponents
 */
import {Component, Input, Optional} from "@angular/core";
import {view} from '../../services/view.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';

/**
 * a simple view container component. renders a div with a view provided
 */
@Component({
    selector: "system-view-container",
    templateUrl: "../templates/systemviewcontainer.html"
})
export class SystemViewContainer {
    /**
     * input param for the componentconfig to be added when the component is added
     */
    @Input() public componentconfig: any = {};

    constructor(public view: view, public language: language, @Optional() public model: model) {
    }

    /**
     * a simple getter to retrive the componentset from the config
     */
    get componentset() {
        return this.componentconfig.componentset;
    }

    /**
     * a simple getter to check if the config allows to be editable
     */
    get editable() {
        return this.model && this.componentconfig.editable ? true : false;
    }

    /**
     * cancels editing and sets the view back to viewMode
     */
    public cancel() {
        if(this.model) {
            this.model.cancelEdit();
            this.view.setViewMode();
        }
    }

    /**
     * saves the model and sets the view back to view mode
     */
    public save() {
        if (this.model && this.model.validate()) {
            this.model.save(true);
            this.view.setViewMode();
        }
    }
}
