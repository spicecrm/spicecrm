import {Injectable} from '@angular/core';
import {backend} from "./backend.service";
import {GenerativeAIParams} from "../systemcomponents/interfaces/systemcomponents.interfaces";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class GenerativeAIService {

    constructor(private backend: backend) {
    }

    /**
     * submit the prompt input and return the result
     * @param input
     * @param params
     */
    public submitPrompt(input: string, params?: GenerativeAIParams): Observable<{ parts: {text: string}[] }> {
        return this.backend.postRequest('common/ai/content/generate', null, {input, params});
    }

    /**
     * parse the prompt for the given id and the bean context and return the parts
     * @param id
     * @param module
     * @param beanId
     */
    public parsePrompt(id: string, module: string, beanId: string) {
        return this.backend.getRequest(`module/${module}/${beanId}/AIPrompt/${id}`);
    }
}