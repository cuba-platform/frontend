export class CubaRestError extends Error {
    public response?: Response;
    public name = 'CubaRestError' as const;

    constructor({message, response}: {
        message: string,
        response?: Response
    }) {
        super(message);
        if(response !== undefined) {
            this.response = response;
        }
    }
}
