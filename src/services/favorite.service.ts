/**
 * @module services
 */
import {Injectable} from '@angular/core';

import {configurationService} from './configuration.service';
import {session} from './session.service';
import {modelutilities} from './modelutilities.service';
import {backend} from './backend.service';
import {broadcast} from './broadcast.service';
import {Router} from '@angular/router';
import {Observable, Subject} from 'rxjs';


@Injectable()
export class favorite {

    public isEnabled: boolean = false;

    /**
     * the module for the current record
     */
    public module: string = '';

    /**
     * the id of the current record
     */
    public id: string = '';

    constructor(
        public backend: backend,
        public broadcast: broadcast,
        public configuration: configurationService,
        public session: session
    ) {
        this.broadcast.message$.subscribe(message => this.handleMessage(message));
    }

    /**
     * returns the favorites
     */
    get favorites() {
        let favorites = this.configuration.getData('favorites');
        return favorites ? favorites : [];
    }

    /**
     * checks if the current record is a favorite
     */
    get isFavorite() {
        return !!this.favorites.find(fav => fav.module_name == this.module && fav.item_id == this.id);
    }

    /**
     * message handler for the save message. If the data is stored in the service and the model is updated this als updates the model data in teh fav service
     * @param message
     */
    public handleMessage(message: any) {
        switch (message.messagetype) {

            case 'model.save':
                this.favorites.some((item, index) => {
                    if (item.module_name === message.messagedata.module && item.item_id == message.messagedata.id) {
                        this.favorites[index].item_summary = message.messagedata.data.summary_text;
                        return true;
                    }
                });

                break;
        }
    }

    /**
     * enable the fav service
     *
     * @param module
     * @param id
     */
    public enable(module: string, id: string) {
        this.isEnabled = true;

        this.module = module;
        this.id = id;
    }

    /**
     * disable the favorite service
     */
    public disable() {
        this.isEnabled = false;
        this.module = undefined;
        this.id = undefined;
    }

    /**
     * gets the favorites for a specific module
     *
     * @param module
     */
    public getFavorites(module) {
        let retArr = [];
        for (let favorite of this.favorites) {
            if (favorite.module_name === module) {
                retArr.push({
                    item_id: favorite.item_id,
                    item_summary: favorite.item_summary
                });
            }
        }

        return retArr;
    }

    /**
     * sets the current record as favorite
     */
    public setFavorite() {
        this.backend.postRequest('common/spicefavorites/' + this.module + '/' + this.id).subscribe((fav: any) => {
            this.favorites.splice(0, 0, {
                item_id: fav.id,
                module_name: fav.module,
                item_summary: fav.summary_text,
                data: fav.data
            });
        });
    }

    /**
     * deletes the favorite with te module and id ... if none is specified it deleted the current one
     *
     * @param module
     * @param id
     */
    public deleteFavorite(module?: string, id?: string) {
        // if none is set, set the current one
        if (!module) module = this.module;
        if (!id) id = this.id;

        // call teh backend
        this.backend.deleteRequest('common/spicefavorites/' + module + '/' + id).subscribe(fav => {
            this.favorites.some((fav, favindex) => {
                if (fav.module_name === module && fav.item_id === id) {
                    this.favorites.splice(favindex, 1);
                    return true;
                }
            });
        });
    }

}
