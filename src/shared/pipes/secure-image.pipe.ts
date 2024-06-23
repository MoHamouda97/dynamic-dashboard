import {
  filter,
  switchMap,
  map,
  catchError,
  tap,
  distinctUntilChanged,
  finalize,
} from "rxjs/operators";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { Subscription, BehaviorSubject, of } from "rxjs";
import {
  Pipe,
  PipeTransform,
  OnDestroy,
  ChangeDetectorRef,
  inject,
} from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { TranslateService } from "@ngx-translate/core";
@Pipe({
  name: "secureImage",
  pure: false,
  standalone: true,
})
export class SecureImagePipe implements PipeTransform, OnDestroy {
  translateService = inject(TranslateService);
  httpClient = inject(HttpClient);
  domSanitizer = inject(DomSanitizer);
  cdr = inject(ChangeDetectorRef);
  constructor() {
    this.setUpSubscription();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  private subscription = new Subscription();
  private loadingImagePath: string = "./assets/images/loading-img.jpg";
  private errorImagePath: string = "./assets/images/default-img.png";
  private latestValue!: string | SafeUrl;
  private transformValue = new BehaviorSubject<string>("");
  private loading = true;

  transform(
    imagePath: string,
    noDefault?: boolean,
    loadingImagePath?: string,
    errorImagePath?: string
  ): string {
    this.loadingImagePath = loadingImagePath ?? this.loadingImagePath;
    this.errorImagePath = noDefault
      ? ""
      : errorImagePath ?? this.errorImagePath;

    this.transformValue.next(imagePath);
    // return (this.latestValue as string) || this.loadingImagePath;
    return this.loading ? this.loadingImagePath : (this.latestValue as string);
  }

  private setUpSubscription(): void {
    const transformSubscription = this.transformValue
      .asObservable()
      .pipe(
        distinctUntilChanged(),
        filter((v): v is string => !!v && !v.includes("null")),
        switchMap((imagePath: string) => {
          this.latestValue = "";
          return this.httpClient
            .get(imagePath, {
              observe: "response",
              responseType: "blob",
            })
            .pipe(
              map((response: HttpResponse<any>) =>
                URL.createObjectURL(response.body)
              ),
              map((unsafeBlobUrl: string) =>
                this.domSanitizer.bypassSecurityTrustUrl(unsafeBlobUrl)
              ),
              filter((blobUrl) => blobUrl !== this.latestValue),
              catchError(() => of(this.errorImagePath)),
              finalize(() => (this.loading = false))
            );
        }),
        tap((imagePath: string | SafeUrl) => {
          this.latestValue = imagePath;
          this.cdr.markForCheck();
        })
      )
      .subscribe();
    this.subscription.add(transformSubscription);
  }
}
