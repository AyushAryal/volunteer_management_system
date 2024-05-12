import { token_aware_fetch } from "@api/token";
import { GenericDeserializer, IDeserializer } from "@models/deserializer";

export class PageNumberPaginationPage<T> {
    _count: number;
    _next: string | null;
    _previous: string | null;
    _results: T[];
    _deserializer: IDeserializer<T>;

    constructor({ count, next, previous, results, deserializer }
        : { count: number, next: string | null, previous: string | null, results: T[], deserializer?: IDeserializer<T> }
    ) {
        this._count = count;
        this._next = next;
        this._previous = previous;
        this._results = results;
        this._deserializer = deserializer ?? GenericDeserializer<T>();
    }

    static async fromUrl<W>(url: string, deserializer?: IDeserializer<W>): Promise<PageNumberPaginationPage<W> | null> {
        let response = await token_aware_fetch(url);
        if (response.status == 200) {
            let json = await response.json();
            json["results"] = json["results"].map(deserializer ?? GenericDeserializer<W>());
            return new PageNumberPaginationPage<W>({ ...json });
        }
        return null;
    }

    jump(page: number): Promise<PageNumberPaginationPage<T> | null> | null {
        let url = this._next || this._previous;
        if (!url) return null;
        return PageNumberPaginationPage.fromUrl<T>(url.replace(/[?&]page=(\d+)/, "?page=" + page), this._deserializer);
    }

    getPageNumber(): number {
        let url = this._next || this._previous;
        if (!url) return 1;
        let match = url.match(/[?&]page=(\d+)/);
        let number = match && match.length == 2 ? +match[1] : -1;
        if (number == -1) return 1;
        if (this._next) {
            return number - 1;
        } else {
            return number + 1;
        }
    }

    getPageNumberForIndex(i: number): number | null {
        if (i < 0 || i >= this._count || this._results.length == 0) return null;
        return (i - (i % this._results.length) / this._results.length) + 1;
    }

    async next(): Promise<PageNumberPaginationPage<T> | null> {
        if (this._next == null) return null;
        let response = await token_aware_fetch(this._next);
        if (response.status == 200) {
            let json = await response.json();
            json["results"] = json["results"].map(this._deserializer);
            return new PageNumberPaginationPage<T>({ ...json, deserializer: this._deserializer });
        }
        return null
    }

    async previous(): Promise<PageNumberPaginationPage<T> | null> {
        if (this._previous == null) return null;
        let response = await token_aware_fetch(this._previous);
        if (response.status == 200) {
            let json = await response.json();
            json["results"] = json["results"].map(this._deserializer);
            return new PageNumberPaginationPage<T>({ ...json, deserializer: this._deserializer });
        }
        return null;
    }
}
