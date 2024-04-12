export class PagerInfo {
    PageNumber: number;
    PageSize: number;
    FirstPage: number;
    LastPage: number;
    TotalPage: number;
    TotalRecords: number;
    NextPage: number;
    PreviousPage: number;
    
    get ShouldShow(): boolean {
        return this.TotalRecords > this.PageSize;
    }
}

export class ResponseData<T> {
    Data: T;
    StatusCode: number;
    Succeed: boolean;
    ErrorList: string[];
    Message: string;
}

export class PagedResponseData<T> extends ResponseData<T> {
    PagerInfo: PagerInfo;
}

export interface Payload {
    [key: string]: any;
}
