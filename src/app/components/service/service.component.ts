import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';
import { fromEvent, Observable } from 'rxjs';
import { map, takeUntil, concatAll, merge } from 'rxjs/operators';
import { fabric } from 'fabric';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent implements OnInit {
  ctxPdf!: CanvasRenderingContext2D;
  ctxSign!: CanvasRenderingContext2D;
  @ViewChild('signCanvas') signCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('signCanvasContainer') signCanvasContainer!: ElementRef<HTMLCanvasElement>;
  @ViewChild('mergeContainer') mergeContainer!: ElementRef<HTMLCanvasElement>;
  margeCanvas!:fabric.Canvas;
  resize$: Observable<Event> = fromEvent(window, 'resize');
  // scroll$!: Observable<Event>;
  isDisabled = true;
  pdfSrc = '';
  isPdfUploaded = false;
  currentpage = 0;
  totalPages = 1;
  pdfUrl = '';
  step = 1;
  signImgUrl = '';

  constructor(
    private elem: ElementRef
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
        this.saveCanvas();
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
    this.isPdfUploaded  = false;

    if (target.files !== null && target.files[0].type == 'application/pdf'){
      if (typeof (FileReader) !== 'undefined') {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.pdfSrc = e.target.result;
        };
        this.isPdfUploaded = true;
        reader.readAsArrayBuffer(target.files[0]);
      }
    } else{
      alert('Please upload pdf file')
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

  // 上傳如果是 img 的處理
  uploadImg(): void {
    let canvasWrapper = this.elem.nativeElement.querySelectorAll('.canvasWrapper canvas')[0];  // imgage canvas
    const base_image = new Image();
    base_image.src = '../../../assets/images/bg-tablet.png';
    setTimeout(() => {
      this.ctxPdf.drawImage(base_image , 0, 0, base_image.width, base_image.height, 0, 0, canvasWrapper.width, canvasWrapper.height);
      this.pdfUrl = canvasWrapper.toDataURL();
    }, 1000);
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
  }

  saveCanvas(): void {
    this.signImgUrl = this.ctxSign.canvas.toDataURL();
  }

  // 下一步
  next(): void {
    if (this.step === 1 && this.pdfUrl === '') {
      alert('請先上傳檔案');
      return;
    }

    if (this.step === 2 && this.signImgUrl === '') {
      alert('請先簽屬簽名或是選擇簽名檔');
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

        fabric.Image.fromURL(this.pdfUrl , (img) => {
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
  te(): void {
    const base_image = new Image();
    base_image.onload = () => {
      this.ctxSign.drawImage(base_image , 0, 0);
    };
    base_image.src = this.signImgUrl;
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

