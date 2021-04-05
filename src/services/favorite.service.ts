/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
        private backend: backend,
        private broadcast: broadcast,
        private configuration: configurationService,
        private session: session
    ) {
        this.broadcast.message$.subscribe(message => this.handleMessage(message))
    }

    /**
     * returns the favorites
     */
    get favorites() {
        let favorites = this.configuration.getData('favorites')
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
    private handleMessage(message: any) {
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
        this.backend.postRequest('SpiceFavorites/' + this.module + '/' + this.id).subscribe((fav: any) => {
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
        this.backend.deleteRequest('SpiceFavorites/' + module + '/' + id).subscribe(fav => {
            this.favorites.some((fav, favindex) => {
                if (fav.module_name === module && fav.item_id === id) {
                    this.favorites.splice(favindex, 1);
                    return true;
                }
            });
        });
    }

}
