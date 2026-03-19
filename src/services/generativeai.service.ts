import {Injectable} from '@angular/core';
import {backend} from "./backend.service";
import {GenerativeAIInputI, GenerativeAIParams} from "../systemcomponents/interfaces/systemcomponents.interfaces";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

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
    public submitPrompt(input: GenerativeAIInputI, params?: GenerativeAIParams): Observable<{ parts: {text: string}[] }> {
        return this.backend.postRequest('common/ai/content/generate', null, {input, params});
    }

    /**
     * submit the prompt input and return the result
     * @param id
     * @param inputs
     * @param asJsonArray
     * @param params
     */
    public submitPromptWithInputs(id: string, inputs: GenerativeAIInputI[], asJsonArray?: true, params?: GenerativeAIParams): Observable<any[]>
    public submitPromptWithInputs(id: string, inputs: GenerativeAIInputI[], asJsonArray?: boolean, params?: GenerativeAIParams): Observable<{ parts: {text: string}[] } | any[]> {

        const req = () => this.backend.postRequest(`common/ai/prompt/${id}/submit`, null, {inputs, params});

        if (asJsonArray) {
            return req().pipe(map((res: any) => {
                return !res.parts[0]?.text ? [] : JSON.parse(res.parts[0].text);
            }));
        } else {
            return req();
        }
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