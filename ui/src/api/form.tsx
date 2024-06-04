export class FormState {
    errors: string;
    submitted: boolean;
    loading?: boolean;
    response: Response;

    constructor({ errors, submitted, response, loading }: { errors: string, submitted: boolean, response?: Response, loading?: boolean }) {
        this.errors = errors;
        this.submitted = submitted;
        this.response = response ?? new Response();
        this.loading = loading;
    }

    isLoading(): boolean { return this.loading ?? false; }
    hasErrors(): boolean { return this.errors != ""; }
    getErrors(): string { return this.errors; }
    getResponse(): Response { return this.response; }
    isSubmitted(): boolean { return this.submitted; }

    getErrorAsElement() {
        return <pre
            className="text-xs"
            style={{
                whiteSpace: "pre-wrap",
                color: "var(--red-600)",
                fontWeight: "bold"
            }}
        >
            {this.getErrors()}
        </ pre>;
    }

    static init() {
        return new FormState({ errors: "", submitted: false });
    }

    static fromSubmitted(submitted: boolean, response = new Response()) {
        return new FormState({ errors: "", submitted: submitted, response: response });
    }

    static fromError(errors: string) {
        return new FormState({
            errors: errors,
            submitted: true,
            response: new Response(errors, {
                status: 400,
            }),
        });
    }

    static fromLoading(loading: boolean) {
        return new FormState({
            errors: "",
            submitted: false,
            loading: loading,
        });
    }
}
