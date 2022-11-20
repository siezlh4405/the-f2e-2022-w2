import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';
import { Observable, fromEvent } from 'rxjs';
import { map, takeUntil, concatAll, merge } from 'rxjs/operators';
import { fabric } from "fabric";
import { SignatureService } from 'src/app/services/signature.service';

@Component({
  selector: 'app-service-sign',
  templateUrl: './service-sign.component.html',
  styleUrls: ['./service-sign.component.scss']
})
export class ServiceSignComponent implements OnInit {
  ctxPdf!: CanvasRenderingContext2D;
  ctxImg!: CanvasRenderingContext2D;
  ctxSign!: CanvasRenderingContext2D;

  @ViewChild('imgCanvas') imgCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('imgCanvasContainer') imgCanvasContainer!: ElementRef<HTMLCanvasElement>;
  @ViewChild('signCanvas') signCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('signCanvasContainer') signCanvasContainer!: ElementRef<HTMLCanvasElement>;
  @ViewChild('mergeContainer') mergeContainer!: ElementRef<HTMLCanvasElement>;
  margeCanvas!:fabric.Canvas;
  resize$: Observable<Event> = fromEvent(window, 'resize');
  // scroll$!: Observable<Event>;
  pdfSrc = '';
  imgSrc = '';
  isFileUploaded = false;
  isPDF = false;
  isIMG = false;
  currentpage = 0;
  totalPages = 1;
  pdfUrl = '';
  imgUrl = '';
  step = 1;
  signImgUrl = '';
  isSign = false;

  constructor(
    private elem: ElementRef,
    public signautreService: SignatureService
  ) { }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // 網頁拖拉大小要調整簽名 CANVAS
    this.resize$.subscribe(() => {
      if (this.step === 2) {
        let temp = this.ctxSign.getImageData(0, 0, this.signCanvas.nativeElement.width, this.signCanvas.nativeElement.height);
        this.ctxSign.canvas.width = this.signCanvasContainer.nativeElement.offsetWidth;
        this.ctxSign.canvas.height = this.signCanvasContainer.nativeElement.offsetHeight;
        this.ctxSign.putImageData(temp, 0, 0);
      }
    });

    // ING CANVAS
    if (this.imgCanvas.nativeElement !== undefined) {
      this.ctxImg = this.imgCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    }

    // SIGN CANVAS EVENT
    if (this.signCanvas !== undefined) {
      const mouseDown$ = fromEvent(this.signCanvas.nativeElement, 'mousedown');
      const mouseMove$ = fromEvent(this.signCanvas.nativeElement, 'mousemove');
      const mouseUp$ = fromEvent(this.signCanvas.nativeElement, 'mouseup');
      const mouseOut$ = fromEvent(this.signCanvas.nativeElement, 'mouseout');

      this.signCanvas.nativeElement.width = this.signCanvasContainer.nativeElement.offsetWidth;
      this.signCanvas.nativeElement.height = this.signCanvasContainer.nativeElement.offsetHeight;

      if (this.signCanvas.nativeElement !== undefined) {
        this.ctxSign = this.signCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
      }

      mouseDown$.pipe(map(donwEvent => {
        const mouseEvent = donwEvent as MouseEvent;
        const mousePosition = this.getMousePos(this.signCanvas.nativeElement, mouseEvent);
        this.ctxSign.beginPath();
        this.ctxSign.moveTo(mousePosition.x, mousePosition.y);
        donwEvent.preventDefault();
        return mouseMove$.pipe(takeUntil(mouseUp$.pipe(merge(mouseOut$))))
      }))
      .pipe(concatAll())
      .subscribe(event=> {
        const mouseEvent = event as MouseEvent;
        const mousePosition = this.getMousePos(this.signCanvas.nativeElement, mouseEvent);
        this.ctxSign.lineCap = 'round';
        this.ctxSign.lineWidth = 2;
        this.ctxSign.lineJoin='round';
        this.ctxSign.shadowBlur = 1; // 邊緣模糊，防止直線邊緣出現鋸齒
        this.ctxSign.shadowColor = 'black';// 邊緣顏色
        this.ctxSign.lineTo(mousePosition.x, mousePosition.y);
        this.ctxSign.stroke();
        this.isSign = true;
      });
    }
  }

  resetUploadFile($e: Event): void {
    const target = $e.target as HTMLInputElement;
    target.value = '';
  }

  /**
   * function purpose: 處理檔案上傳
   */
  uploadFile($e: Event): void {
    const target = $e.target as HTMLInputElement;
    this.isFileUploaded  = false;
    this.isPDF = false;
    this.isIMG = false;
    this.imgSrc = '';
    this.pdfSrc = '';
    this.imgUrl = '';
    this.pdfUrl = '';

    if (target.files !== null && target.files[0].type == 'application/pdf') {
      if (typeof (FileReader) !== 'undefined') {
        this.isPDF = true;
        this.isFileUploaded = true;
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.pdfSrc = e.target.result;
        };
        reader.readAsArrayBuffer(target.files[0]);
      }
    } else if (target.files !== null && target.files[0].type == 'image/png') {
      this.isIMG = true;
      this.isFileUploaded = true;
      let reader = new FileReader();
        reader.onload = (e: any) => {
          this.imgSrc = e.target.result;

          const base_image = new Image();
          base_image.onload = () => {
            this.ctxImg.canvas.width = base_image.width;
            this.ctxImg.canvas.height = base_image.height;

            setTimeout(() => {
              this.ctxImg.drawImage(base_image , 0, 0);
              this.imgUrl = this.imgCanvas.nativeElement.toDataURL();
            }, 0);
          };
          base_image.src = this.imgSrc;
        };
        reader.readAsDataURL(target.files[0]);
    } else{
      alert('Please upload correct file')
    }
  }

  // pdf load complete
  afterLoadComplete(pdf: PDFDocumentProxy): void {
    this.totalPages = pdf.numPages;
  }

  // pdf page change
  pageChange($event: any): void {
    console.log($event);
  }

  // pdf page render, e: CustomEvent
  pageRendered(e: any): void {
    const canvasWrapper = this.elem.nativeElement.querySelectorAll('.canvasWrapper canvas')[0];
    this.pdfUrl = canvasWrapper.toDataURL();
  }

  // SIGN CANVAS
  getMousePos(canvas: HTMLCanvasElement, evt: MouseEvent): { x: number, y: number } {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

  resetCanvas(): void {
    this.ctxSign.canvas.width = this.signCanvasContainer.nativeElement.offsetWidth;
    this.ctxSign.canvas.height = this.signCanvasContainer.nativeElement.offsetHeight;
    this.signImgUrl = '';
    this.isSign = false;
  }

  saveCanvas(): void {
    if (!this.isSign) {
      alert('請先簽屬簽名在儲存');
      return;
    }

    this.signImgUrl = this.ctxSign.canvas.toDataURL();

    alert('儲存成功!');
  }

  // 下一步
  next(): void {
    if (this.step === 1 && (this.pdfUrl === '' && this.imgSrc === '')) {
      alert('請先上傳檔案');
      return;
    }

    if (this.step === 2 && this.signImgUrl === '') {
      alert('請先儲存簽名或是選擇簽名檔');
      return;
    }

    if (this.step === 3) {
      var link = document.createElement('a');
      link.download = 'sign.png';
      link.href = this.margeCanvas.toDataURL();
      link.click();

      return;
    }

    this.step += 1;

    if (this.step === 2) {
      setTimeout(() => {
        this.ctxSign.canvas.width = this.signCanvasContainer.nativeElement.offsetWidth;
        this.ctxSign.canvas.height = this.signCanvasContainer.nativeElement.offsetHeight;
      }, 0);
    }

    if (this.step === 3) {
      setTimeout(() => {
        this.margeCanvas = new fabric.Canvas('margeCanvas');

        const url = this.pdfUrl !== '' ? this.pdfUrl : this.imgSrc;

        fabric.Image.fromURL(url , (img) => {
          setTimeout(() => {
            this.margeCanvas.setWidth(img.width as number);
            this.margeCanvas.setHeight(img.height as number);
            this.margeCanvas.renderAll();

            this.margeCanvas.setBackgroundImage(img, this.margeCanvas.renderAll.bind(this.margeCanvas));
            // img.scaleToWidth(100);
            // img.scaleToHeight(100);

            fabric.Image.fromURL(this.signImgUrl, (signImg) => {
              signImg.scaleToWidth(50);
              signImg.scaleToHeight(50);
              this.margeCanvas.add(signImg).renderAll();
            });
          }, 0);
        });
      }, 0);
    }
  }

  // 上一步
  back(): void {
    if (this.step === 1) {
      return;
    }

    this.step -= 1;

    if (this.step === 2) {
      setTimeout(() => {
        this.ctxSign.canvas.width = this.signCanvasContainer.nativeElement.offsetWidth;
        this.ctxSign.canvas.height = this.signCanvasContainer.nativeElement.offsetHeight;
      }, 0);
    }
  }

  // 待移除
  selectSignature(): void {
    const base_image = new Image();
    base_image.onload = () => {
      this.ctxSign.drawImage(base_image , 0, 0);
    };
    base_image.src = this.signautreService.signatureUrl1;
  }

  test() {
    var link = document.createElement('a'); // create an anchor tag

    // set parameters for downloading
    link.setAttribute('href', this.pdfUrl);
    link.setAttribute('target', '_blank');
    link.setAttribute('download', 'test.png');

    // compat mode for dispatching click on your anchor
    if (document.createEvent) {
        var evtObj = document.createEvent('MouseEvents');
        evtObj.initEvent('click', true, true);
        link.dispatchEvent(evtObj);
    } else if (link.click) {
        link.click();
    }
  }
}
