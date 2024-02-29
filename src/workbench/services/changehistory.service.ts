import {ChangeDetectorRef, Injectable} from '@angular/core';

@Injectable()
export class ChangeHistoryService {
    /**
     * holds the changes in object keys array values
     */
    private changes: {[key: string]: {changedObjects: Map<string, any>, newObjects: Map<string, any>}} = {};

    private history: {id: string, action: 'new' | 'update' | 'updateNew', scope: string, key?: string, previousValue?: any, newValue?: any}[] = [];
    /**
     * holds the history current index
     * @private
     */
    private _historyCurrentIndex: number;

    constructor(private cdRef: ChangeDetectorRef) {
    }

    /**
     * generate a proxy object that implements a change check, when a property set is called
     * @param obj
     * @param dbObject
     * @param scope
     */
    public generateTrackableObject(obj: any, dbObject: any, scope: string): any {

        const check = (obj: any, scope: string) => this.checkForObjectChanges(obj, dbObject, scope);
        return this.generateProxyObject(obj, scope, check);
    }

    /**
     * generate a proxy object of the target object
     * @param obj
     * @param scope
     * @param check
     * @private
     */
    private generateProxyObject(obj: any, scope: string, check: (obj: any, scope: string) => void) {
        return new Proxy(obj, {
            set(target: any, prop: string | symbol, value: any) {
                Reflect.set(target, prop, value);
                check(obj, scope);
                return true;
            }
        });
    }

    /**
     * generate trackable new object that did not exist yet
     * @param obj
     * @param scope
     * @param validator
     */
    public generateTrackableNewObject(obj: any, scope: string, validator?: (obj: any) => boolean) {

        const check = (obj: any, scope: string) => {
            if (!validator || validator(obj)) {
                this.registerOrUpdateNewObject(obj, scope);
            } else {
                this.rollbackNewObject(obj, scope);
            }
        };

        return this.generateProxyObject(obj, scope, check);
    }

    /**
     * get all changes for new and existing objects in one array
     * @param scope
     */
    public getAllChanges(scope: string): any[] {
        return Array.from(this.changes[scope]?.changedObjects.values() ?? []).concat(
            Array.from(this.changes[scope]?.newObjects.values() ?? [])
        );
    }

    /**
     * apply changes to the passed db array
     * @param dbArray
     * @param scope
     */
    public applyChanges(dbArray: any[], scope: string) {

        if (!this.changes[scope]) return;

        this.changes[scope].changedObjects.forEach(changedObj =>
            dbArray.some((dbObj, index: number) => {
                if (dbObj.id != changedObj.id) return false;
                dbArray[index] = changedObj;
                return true;
            })
        );

        this.changes[scope].newObjects.forEach(newObj =>
            dbArray.push(newObj)
        );

        delete this.changes[scope];
    }

    /**
     * initialize scope object
     * @param scope
     * @private
     */
    private initializeScope(scope: string) {
        this.changes[scope] = {changedObjects: new Map<string, any>(), newObjects: new Map<string, any>()};
    }

    /**
     * register a new object in the new objects array
     * @param scope
     * @param obj
     * @private
     */
    public registerOrUpdateNewObject(obj: any, scope: string) {

        if (!this.changes[scope]) this.initializeScope(scope);

        if (!this.changes[scope].newObjects.has(obj.id)) {
            this.changes[scope].newObjects.set(obj.id, {...obj});
            this.history.push({id: obj.id, action: "new", scope: scope});
            this.addNewHistoryRecord(obj.id, 'new', scope);
            this.cdRef.detectChanges();
        } else {
            this.changes[scope].newObjects.set(obj.id, {...obj});
            this.addNewHistoryRecord(obj.id, 'update', scope);
        }
    }

    /**
     * set history current index
     * @param val
     */
    set historyCurrentIndex(val) {
        this._historyCurrentIndex = val;
    }

    /**
     * get history current index
     */
    get historyCurrentIndex() {
        return isNaN(this._historyCurrentIndex) ? this.history.length - 1 : this._historyCurrentIndex;
    }

    private addNewHistoryRecord(id: string, action: 'new' | 'update' | 'updateNew', scope: string, key?: string, previousValue?: any, newValue?: any) {
        this.history.length = this.historyCurrentIndex +1;
        this.history.push({id, action, scope, key, previousValue, newValue});
    }

    /**
     * can undo
     */
    get canUndo() {
        return this.history.length == 0;
    }

    /**
     * can redo
     */
    get canRedo() {
        return this.historyCurrentIndex < this.history.length;
    }

    /**
     * undo a change
     */
    public undo() {

        this.historyCurrentIndex--;

        if (this.historyCurrentIndex < 0) return;

        const lastChange = this.history[this.historyCurrentIndex];

        if (lastChange.action == 'new') {
            this.changes[lastChange.scope].newObjects.delete(lastChange.id);
        } else {
            const key = lastChange.action == 'updateNew' ? 'newObjects' : 'changedObjects';
            const changedObj = this.changes[lastChange.scope][key].get(lastChange.id);
            changedObj[lastChange.key] = lastChange.previousValue;
        }
    }

    /**
     * rollback a new object in the new objects array
     * @param scope
     * @param obj
     * @private
     */
    public rollbackNewObject(obj: any, scope: string) {

        if (!this.changes[scope]) return;

        this.changes[scope].newObjects.delete(obj.id);
    }

    /**
     * check for object changes and write the changes
     */
    public checkForObjectChanges(currentValue: any, dbValue: any, scope: string) {

        if (!this.changes[scope]) this.initializeScope(scope);

        if (JSON.stringify(currentValue) == JSON.stringify(dbValue)) {
            this.changes[scope].changedObjects.delete(currentValue.id);
            return;
        }

        if (this.changes[scope].changedObjects.has(currentValue.id)) {
            this.changes[scope].changedObjects.set(currentValue.id, {...currentValue})
        } else {
            this.changes[scope].changedObjects.set(currentValue.id, {...currentValue})
            this.cdRef.detectChanges();
        }
    }

    /**
     * check if it has changes
     * @param scope
     */
    public hasChanges(scope: string): boolean {
        return this.changes[scope]?.changedObjects.size > 0 || this.changes[scope]?.newObjects.size > 0;
    }
}