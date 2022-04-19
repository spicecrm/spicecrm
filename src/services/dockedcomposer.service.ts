/**
 * @module services
 */
import {Injectable} from '@angular/core';
import {modelutilities} from './modelutilities.service';
import {broadcast} from './broadcast.service';
import {model} from "./model.service";

/**
 * holds all current composers
 */
@Injectable()
export class dockedComposer {
    /**
     * the regular composers
     */
    public composers: any[] = [];

    /**
     * the hidden composers. They are folded away in a separate tab
     */
    public hiddenComposers: number[] = [];

    constructor(public modelutilities: modelutilities, public broadcast: broadcast) {

        // subscribe to the logout so we can remove all open composers
        this.broadcast.message$.subscribe(message => this.handleLogout(message));
    }

    public handleLogout(message) {
        if (message.messagetype == 'logout') {
            this.composers = [];
            this.hiddenComposers = [];
        }
    }

    /**
     * adds a composer
     *
     * @param module the module for which the composer is
     * @param model optional a model that can be passed in with the model data
     * @param expanded optional set to true if the composer should automatically expand if expand is possible
     */
    public addComposer(module: string, model?: model, expanded?: boolean) {

        if (model) {
            model.data.acl = model.acl;
            this.composers.splice(0, 0, {
                module,
                id: model.id,
                name: model.getField('summary_text'),
                model: {
                    module,
                    id: model.id,
                    data: model.data
                },
                loadexpanded: expanded
            });

        } else {
            this.composers.splice(0, 0, {
                module,
                id: this.modelutilities.generateGuid(),
                name: '',
                model: {},
                loadexpanded: expanded
            });
        }

    }

    /**
     * focus on a specific composer and bring that one into view
     *
     * @param id the id of the composer
     */
    public focusComposer(id) {
        this.composers.some((composer, index) => {
            if (composer.id == id) {
                let movedComposer = this.composers.splice(index, 1);
                this.composers.unshift(movedComposer.shift());
                return true;
            }
        });
    }

    /**
     * caclulates the number of composers that can max be displayed
     */
    get maxComposers() {
        return Math.floor((window.innerWidth - 70) / 500);
    }
}
