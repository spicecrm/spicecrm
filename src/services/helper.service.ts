/**
 * @module services
 */
import {Injectable} from '@angular/core';
import {Subject, Observable} from 'rxjs';
import {modal} from './modal.service';

@Injectable({
    providedIn: 'root'
})
export class helper {

    public dialog: any = null;

    public _base64_keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

    constructor(public modalservice: modal) {
    } // public metadata: metadata, public footer: footer

    /*
     * for the GUID Generation
     */
    public getRand() {
        return Math.random();
    }

    public S4() {
        /* tslint:disable:no-bitwise */
        return (((1 + this.getRand()) * 0x10000) | 0).toString(16).substring(1);
        /* tslint:enable:no-bitwise */
    }

    public generateGuid() {
        return (this.S4() + this.S4() + "-" + this.S4() + "-" + this.S4() + "-" + this.S4() + "-" + this.S4() + this.S4() + this.S4());
    }

    public confirm(title, message): Observable<boolean> {

        /*
        // For compatibility reasons this method is not deleted. It triggers "prompt" of modal service.
        // This is the old code:
        let retSubject = new Subject();
        this.metadata.addComponent( 'SystemConfirmDialog', this.footer.footercontainer ).subscribe( dialog => {
            dialog.instance['title'] = title;
            dialog.instance['message'] = message;

            dialog.instance['answer'].subscribe( answer => {
                // destroy the dialog
                this.dialog.destroy();
                this.dialog = null;

                // return the answer
                retSubject.next( answer );
                retSubject.complete();
            } )

            this.dialog = dialog;
        } )
        */

        let retSubject = new Subject<any>();
        this.modalservice.confirm(message, title).subscribe((answer) => {
            retSubject.next(answer);
            retSubject.complete();
        });
        return retSubject.asObservable();

    }

    /**
     * Shuffles the elements of an array.
     *
     * @param array The array with the elements to shuffle.
     */
    public shuffle(array: any[]): any[] {
        let m = array.length;
        let t;
        let i;
        // While there remain elements to shuffle …
        while (m) {
            // Pick a remaining element …
            i = Math.floor(Math.random() * m--);
            // And swap it with the current element.
            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }
        return array;
    }

    public encodeBase64(e) {
        let t = '', n, r, i, s, o, u, a, f = 0;
        e = this._utf8_encodeBase64(e);
        /* tslint:disable:no-bitwise */
        while (f < e.length) {
            n = e.charCodeAt(f++);
            r = e.charCodeAt(f++);
            i = e.charCodeAt(f++);
            s = n >> 2;
            o = (n & 3) << 4 | r >> 4;
            u = (r & 15) << 2 | i >> 6;
            a = i & 63;
            if (isNaN(r)) {
                u = a = 64;
            } else if (isNaN(i)) {
                a = 64;
            }
            t = t + this._base64_keyStr.charAt(s) + this._base64_keyStr.charAt(o) + this._base64_keyStr.charAt(u) + this._base64_keyStr.charAt(a);
        }
        /* tslint:enable:no-bitwise */
        return t;
    }

    public decodeBase64(e) {
        let t = '', n, r, i, s, o, u, a, f = 0;
        e = e.replace(/[^A-Za-z0-9\+\/\=]/g, '');
        while (f < e.length) {
            s = this._base64_keyStr.indexOf(e.charAt(f++));
            o = this._base64_keyStr.indexOf(e.charAt(f++));
            u = this._base64_keyStr.indexOf(e.charAt(f++));
            a = this._base64_keyStr.indexOf(e.charAt(f++));
            /* tslint:disable:no-bitwise */
            n = s << 2 | o >> 4;
            r = (o & 15) << 4 | u >> 2;
            i = (u & 3) << 6 | a;
            /* tslint:enable:no-bitwise */
            t = t + String.fromCharCode(n);
            if (u != 64) t = t + String.fromCharCode(r);
            if (a != 64) t = t + String.fromCharCode(i);
        }
        t = this._utf8_decodeBase64(t);
        return t;
    }

    public _utf8_encodeBase64(e) {
        let t = '';
        e = e.replace(/\r\n/g, "\n");
        for (let n = 0; n < e.length; n++) {
            let r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r);
            } else if (r > 127 && r < 2048) {
                /* tslint:disable:no-bitwise */
                t += String.fromCharCode(r >> 6 | 192);
                t += String.fromCharCode(r & 63 | 128);
            } else {
                t += String.fromCharCode(r >> 12 | 224);
                t += String.fromCharCode(r >> 6 & 63 | 128);
                t += String.fromCharCode(r & 63 | 128);
                /* tslint:enable:no-bitwise */
            }
        }
        return t;
    }

    public _utf8_decodeBase64(e) {
        let t = '', n = 0, r = 0, c1 = 0, c2 = 0, c3 = 0;
        while (n < e.length) {
            r = e.charCodeAt(n);
            /* tslint:disable:no-bitwise */
            if (r < 128) {
                t += String.fromCharCode(r);
                n++;
            } else if (r > 191 && r < 224) {
                c2 = e.charCodeAt(n + 1);
                t += String.fromCharCode((r & 31) << 6 | c2 & 63);
                n += 2;
            } else {
                c2 = e.charCodeAt(n + 1);
                c3 = e.charCodeAt(n + 2);
                t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                n += 3;
            }
            /* tslint:enable:no-bitwise */
        }
        return t;
    }

    /**
     * Try to determine the proper symbol for a file, based on its mime type.
     *
     * @param mimeType The mime type of the file, in the format 'type/subtype', for example 'application/pdf'.
     * @return Symbol of the icon.
     */
    public determineFileIcon(mimeType: string): string {
        if (mimeType) {
            let type: string, subtype: string;
            [type, subtype] = mimeType.split('/');
            if (!type) return 'unknown'; // The function input is not valid, it is not in the format 'type/subtype'.
            // Check the type part:
            switch (type) {
                case 'image':
                case 'png':
                case 'jpeg':
                    return 'image';
                case "text":
                    switch (subtype) {
                        case 'html':
                            return 'html';
                        default:
                            return 'txt';
                    }
                case 'audio':
                    return 'audio';
                case 'video':
                    return 'video';
                default:
                    break;
            }
            // The determination was not possible with the type part only, so check the subtype part:
            switch (subtype) {
                case 'xml':
                    return 'xml';
                case 'pdf':
                    return 'pdf';
                case 'vnd.ms-excel':
                case 'vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                    return 'excel';
                case 'vnd.openxmlformats-officedocument.wordprocessingml.document':
                case 'vnd.oasis.opendocument.text':
                    return 'word';
                case 'vnd.oasis.opendocument.presentation':
                case 'vnd.openxmlformats-officedocument.presentationml.presentation':
                    return 'ppt';
                case 'x-zip-compressed':
                    return 'zip';
                case 'x-msdownload':
                    return 'exe';
                default:
                    break;
            }
        }
        return 'unknown';
    }


    /**
     * return a size in bytes into a human readable and understandable file size
     *
     * @param filesize
     */
    public humanFileSize(filesize, thresh = 1024) {
        let bytes: number = filesize;
        if (Math.abs(filesize) < thresh) {
            return bytes + " B";
        }
        let units = ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
        let u = -1;
        do {
            bytes /= thresh;
            ++u;
        } while (Math.abs(bytes) >= thresh && u < units.length - 1);
        return bytes.toFixed(1) + " " + units[u];
    }

    /**
     * generates a password that matches the minimal requirements
     * fills it up with lower case chars to the required minimum length
     *
     * @private
     */
    public generatePassword( extConf: any ): string {
        let passwordChars: string[] = [];

        let usedCharTypes: string[] = [];
        ['upper', 'number', 'special', 'lower'].forEach( type => {
            if ( extConf['one'+type] ) usedCharTypes.push(type);
        });

        let sizeRemaining = extConf.minpwdlength;
        usedCharTypes.forEach( ( type, i ) => {
            let dummy;
            if ( i === usedCharTypes.length-1 ) {
                dummy = sizeRemaining;
            } else {
                dummy = Math.floor( Math.random() * ( sizeRemaining - ( usedCharTypes.length - i - 1 ) )) + 1;
            }
            for ( let j = 0; j<dummy; j++ ) passwordChars.push( this.pwRandomChar( type ));
            sizeRemaining = sizeRemaining - dummy;
        });

        return this.shuffle( passwordChars ).join('');
    }

    /**
     * for passwords: returns a random character of a specific type (lower, upper, digit, special).
     * @private
     */
    public pwRandomChar( type: string ): string {
        let specialChars = '!"#$%&\'()*+,-./:;<=>?@[\\]^_{|}~';
        switch( type ) {
            case 'upper':   return String.fromCharCode( Math.floor( Math.random() * 26 ) + 65 );
            case 'lower':   return String.fromCharCode( Math.floor( Math.random() * 26 ) + 97 );
            case 'special': return specialChars.charAt(  Math.floor(Math.random() * specialChars.length ));
            case 'number':  return String.fromCharCode( Math.floor( Math.random() * 10 ) + 48 );
        }
    }

}
