import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";

export abstract class AbstractBaseService {
  protected readonly http = inject(HttpClient);
  protected readonly baseUrl = '/api';
  readonly abstract controllerUrl: string
}
