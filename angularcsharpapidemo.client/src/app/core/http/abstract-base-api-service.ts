import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";

export abstract class AbstractBaseApiService {
  protected readonly http = inject(HttpClient);
  protected readonly baseUrl = '/api';
  readonly abstract controllerUrl: string
}
