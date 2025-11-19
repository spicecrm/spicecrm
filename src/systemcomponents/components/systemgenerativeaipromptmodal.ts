import {Component, ComponentRef, signal, WritableSignal} from '@angular/core';
import {ModalComponentI} from "../../objectcomponents/interfaces/objectcomponents.interfaces";
import {GenerativeAIService} from "../../services/generativeai.service";
import {modal} from "../../services/modal.service";

@Component({
    selector: 'system-generative-ai-prompt-modal',
    templateUrl: '../templates/systemgenerativeaipromptmodal.html',
    standalone: false
})
export class SystemGenerativeAIPromptModal implements ModalComponentI {
    /**
     * holds the prompt input value
     */
    public input: string;
    /**
     * reference to the component instance
     */
    public self: ComponentRef<this>;
    /**
     * the response text
     */
    public response: WritableSignal<string> = signal(undefined);
    /**
     * signal to emit the confirmed response value
     */
    public confirmedResponse: WritableSignal<string> = signal(undefined);

    constructor(private generativeAIService: GenerativeAIService,
                private modal: modal) {
    }

    /**
     * close the modal
     */
    public close() {
        this.self.destroy();
    }

    /**
     * submit the input to generate a new content
     */
    public submit() {

        const loading = this.modal.await('LBL_GENERATING');

        this.generativeAIService.submitPrompt(this.input).subscribe({
            next: (res: { parts: {text: string}[] }) => {

                this.response.set(res.parts[0].text);

                loading.next(true);
                loading.complete();
            },
            error: () => {
                loading.next(true);
                loading.complete();
                this.modal.toast.sendToast('MSG_AI_SERVICE_UNAVAILABLE', 'warning');

            }
        });
    }

    /**
     * emit the confirmed response
     */
    public confirm() {
        this.confirmedResponse.set(this.response());
        this.close();
    }
}