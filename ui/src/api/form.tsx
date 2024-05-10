export class FormState {
    errors: string;
    submitted: boolean;

    constructor({ errors, submitted }: { errors: string, submitted: boolean }) {
        this.errors = errors;
        this.submitted = submitted;
    }

    hasErrors(): boolean { return this.errors != ""; }
    getErrors(): string { return this.errors; }
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

    static fromSubmitted(submitted: boolean) {
        return new FormState({ errors: "", submitted: submitted });
    }

    static fromError(errors: string) {
        return new FormState({ errors: errors, submitted: true });
    }
}
