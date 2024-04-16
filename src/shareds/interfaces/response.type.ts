export class PagerInfo {
  pageNumber: number;
  pageSize: number;
  firstPage: number;
  lastPage: number;
  totalPage: number;
  totalRecords: number;
  nextPage: number | null;
  previousPage: number | null;

  constructor({
    pageNumber,
    pageSize,
    firstPage,
    lastPage,
    totalPage,
    totalRecords,
    nextPage,
    previousPage,
  }: {
    pageNumber: number;
    pageSize: number;
    firstPage: number;
    lastPage: number;
    totalPage: number;
    totalRecords: number;
    nextPage: number;
    previousPage: number;
  }) {
    this.pageNumber = pageNumber;
    this.pageSize = pageSize;
    this.firstPage = firstPage;
    this.lastPage = lastPage;
    this.totalPage = totalPage;
    this.totalRecords = totalRecords;
    this.nextPage = nextPage;
    this.previousPage = previousPage;
  }

  get shouldShow(): boolean {
    return this.totalRecords > this.pageSize;
  }
}

export class ResponseData<T> {
  data: T;
  statusCode: number;
  succeed: boolean;
  errorList: string[];
  message: string;

  constructor(data: T, statusCode: number, success: boolean, message: string) {
    this.data = data;
    this.statusCode = statusCode;
    this.succeed = success;
    this.message = message;
  }
}

export class PagedResponseData<T> extends ResponseData<T> {
  pagerInfo: PagerInfo;

  constructor(
    data: T,
    statusCode: number,
    succeed: boolean,
    message: string,
    pagerInfo: PagerInfo,
  ) {
    super(data, statusCode, succeed, message);
    this.pagerInfo = pagerInfo;
  }
}

export type Payload = Record<string, any>;
