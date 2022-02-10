/**
 * @module ObjectComponents
 */
import {Component,  OnInit, Pipe} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {modelutilities} from '../../services/modelutilities.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';

@Pipe({
    name: 'objectaddressespipe',
    pure: false
})
export class ObjectAddressesPipe {

    transform(addresses) {
        let retValues = [];

        for (let addressid in addresses) {
            retValues.push(addresses[addressid]);
        }

        return retValues;
    }
}

@Component({
    selector: 'object-addresses',
    templateUrl: '../templates/objectaddresses.html',
    host: {
        '[style.display]': 'getDisplay()'
    },
})
export class ObjectAddresses implements OnInit {

    componentconfig: any = {};
    expanded: boolean = true;

    constructor(public language: language, public metadata: metadata, public model: model, public view: view, public modelutilities: modelutilities) {

    }

    get hasAddresses() {
        try {
            return this.model.data.addresses.beans != undefined;
        } catch (e) {
            return false;
        }
    }

    ngOnInit() {
        if (this.componentconfig.collapsed) {
            this.expanded = false;
        }
    }

    get hidden() {
        return (this.componentconfig.requiredmodelstate && !this.model.checkModelState(this.componentconfig.requiredmodelstate) );
    }

    getDisplay(){
        if(this.addresses.length > 0 || this.view.isEditMode())
            return 'inherit';

        return 'none';
    }

    get addresses() {
        let retValues = [];
        try {
            for (let addressid in this.model.data.addresses.beans) {
                if (this.model.data.addresses.beans[addressid].deleted == false)
                    retValues.push(this.model.data.addresses.beans[addressid]);
            }
        } catch (e) {
            // do nothing
        }
        return retValues;
    }

    togglePanel() {
        this.expanded = !this.expanded;
    }

    getChevronStyle() {
        if (!this.expanded)
            return {
                'transform': 'rotate(45deg)',
                'margin-top': '4px'
            }
    }

    getTabStyle() {
        if (!this.expanded)
            return {
                height: '0px',
                transform: 'rotateX(90deg)'
            }
    }

    addAddress() {
        let newID = this.modelutilities.generateGuid();

        // if no addresses are defined yet .. define the array
        if (this.model.data.addresses == undefined) {
            this.model.data.addresses = {
                beans: []
            };
        }
        this.model.data.addresses.beans[newID] = {
            id: newID,
            deleted: false
        };
    }


}
