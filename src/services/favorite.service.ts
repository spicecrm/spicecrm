import {Injectable} from '@angular/core';

import {configurationService} from './configuration.service';
import {session} from './session.service';
import {modelutilities} from './modelutilities.service';
import {backend} from './backend.service';
import {broadcast} from './broadcast.service';
import {Router}   from '@angular/router';
import {Observable, Subject} from 'rxjs';


@Injectable()
export class favorite {

    public isFavorite: boolean = false;
    public isEnabled: boolean = false;
    public favorites: Array<any> = [];

    private currentModule: string = '';
    private currentId: string = '';

    constructor(private backend: backend, private broadcast: broadcast, private configurationService: configurationService, private session: session) {
        this.broadcast.message$.subscribe(message => this.handleMessage(message))
    }

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

    enable(module, id) {
        this.isEnabled = true;

        this.currentModule = module;
        this.currentId = id;

        this.favorites.some(fav => {
            if (fav.module_name === module && fav.item_id === id) {
                this.isFavorite = true;
                return true;
            }
        });

    }

    disable() {
        this.isEnabled = false;
        this.isFavorite = false;
    }

    loadFavorites(loadhandler: Subject<string>) {
        if (sessionStorage[window.btoa('favorites'+this.session.authData.sessionId)] && sessionStorage[window.btoa('favorites'+this.session.authData.sessionId)].length > 0 && !this.configurationService.data.developerMode) {
            this.favorites = this.session.getSessionData('favorites');
            loadhandler.next('loadFavorites')
        }else {
            this.backend.getRequest('spiceui/core/favorites').subscribe(fav => {
                this.session.setSessionData('favorites',fav);
                this.favorites = fav;
                loadhandler.next('loadFavorites');
            });
        };
    }


    getFavorites(module) {
        let retArr = [];
        for (let favorite of this.favorites) {
            if (favorite.module_name === module)
                retArr.push({
                    item_id: favorite.item_id,
                    item_summary: favorite.item_summary
                })
        }

        return retArr;
    }

    setFavorite() {
        this.backend.postRequest('spiceui/core/favorites/' + this.currentModule + '/' + this.currentId).subscribe((fav : any) => {
            this.favorites.splice(0, 0, {
                item_id: fav.id,
                module_name: fav.module,
                item_summary: fav.summary_text
            });

            this.isFavorite = true;
        });
    }

    deleteFavorite() {
        this.backend.deleteRequest('spiceui/core/favorites/' + this.currentModule + '/' + this.currentId).subscribe(fav => {
            this.favorites.some((fav, favindex) => {
                if (fav.module_name === this.currentModule && fav.item_id === this.currentId) {
                    this.favorites.splice(favindex, 1);
                    return true;
                }
            });

            this.isFavorite = false;
        });
    }

}
