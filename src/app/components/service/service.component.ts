import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';
import { fromEvent, Observable } from 'rxjs';
import { map, takeUntil, concatAll, merge } from 'rxjs/operators';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent implements OnInit {
  ctx!: CanvasRenderingContext2D;
  @ViewChild('signCanvas') signCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('signCanvasContainer') signCanvasContainer!: ElementRef<HTMLCanvasElement>;
  resize$: Observable<Event> = fromEvent(window, 'resize');
  // scroll$!: Observable<Event>;
  isDisabled = true;
  pdfSrc = '';
  isPdfUploaded = false;
  currentpage = 0;
  totalPages = 1;
  url = '';
  step = 2;

  constructor(
    private renderer: Renderer2,
    private elem: ElementRef
  ) { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.resize$.subscribe(() => {
      let temp = this.ctx.getImageData(0, 0, this.signCanvas.nativeElement.width, this.signCanvas.nativeElement.height);
      this.ctx.canvas.width = this.signCanvasContainer.nativeElement.offsetWidth;
      this.ctx.canvas.height = this.signCanvasContainer.nativeElement.offsetHeight;
      this.ctx.putImageData(temp, 0, 0);
    });

    if (this.signCanvas !== undefined) {
      const mouseDown$ = fromEvent(this.signCanvas.nativeElement, 'mousedown');
      const mouseMove$ = fromEvent(this.signCanvas.nativeElement, 'mousemove');
      const mouseUp$ = fromEvent(this.signCanvas.nativeElement, 'mouseup');
      const mouseOut$ = fromEvent(this.signCanvas.nativeElement, 'mouseout');

      this.signCanvas.nativeElement.width = this.signCanvasContainer.nativeElement.offsetWidth;
      this.signCanvas.nativeElement.height = this.signCanvasContainer.nativeElement.offsetHeight;

      if (this.signCanvas.nativeElement !== undefined) {
        this.ctx = this.signCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
      }

      mouseDown$.pipe(map(donwEvent => {
        const mouseEvent = donwEvent as MouseEvent;
        const mousePosition = this.getMousePos(this.signCanvas.nativeElement, mouseEvent);
        this.ctx.beginPath();
        this.ctx.moveTo(mousePosition.x, mousePosition.y);
        donwEvent.preventDefault();
        return mouseMove$.pipe(takeUntil(mouseUp$.pipe(merge(mouseOut$))))
      }))
      .pipe(concatAll())
      .subscribe(event=> {
        const mouseEvent = event as MouseEvent;
        const mousePosition = this.getMousePos(this.signCanvas.nativeElement, mouseEvent);
        this.ctx.lineCap = 'round';
        this.ctx.lineWidth = 2;
        this.ctx.lineJoin='round';
        this.ctx.shadowBlur = 1; // 邊緣模糊，防止直線邊緣出現鋸齒
        this.ctx.shadowColor = 'black';// 邊緣顏色
        this.ctx.lineTo(mousePosition.x, mousePosition.y);
        this.ctx.stroke();
        console.log(mousePosition.x);
      });
    }
  }


  // testPageChange($event: any): void {
  //   console.log($event);
  // }

  resetUploadFile($e: Event): void {
    const target = $e.target as HTMLInputElement;
    target.value = '';
  }

  /**
   * function purpose: 處理檔案上傳
   */
  uploadFile($e: Event): void {
    const target = $e.target as HTMLInputElement;
    console.log(target.files);
    this.isPdfUploaded  = false;

    if (target.files !== null && target.files[0].type == 'application/pdf'){
      if (typeof (FileReader) !== 'undefined') {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.pdfSrc = e.target.result;
          console.log(this.pdfSrc);

        };
        this.isPdfUploaded = true;
        reader.readAsArrayBuffer(target.files[0]);
      }
    } else{
      alert('Please upload pdf file')
    }
  }

  afterLoadComplete(pdf: PDFDocumentProxy) {
    this.totalPages = pdf.numPages;
    console.log(pdf);
  }

  // e: CustomEvent
  pageRendered(e: any) {
    console.log('(page-rendered)', e.source);

    const canvasWrapper = this.elem.nativeElement.querySelectorAll('.canvasWrapper canvas')[0];
    this.ctx = canvasWrapper.getContext('2d');
    this.ctx.strokeRect(0, 0, 100, 100);
    console.log(canvasWrapper.toDataURL());
    this.url = canvasWrapper.toDataURL();
    const base_image = new Image();
    base_image.src = '../../../assets/images/bg-tablet.png';
    setTimeout(() => {
      this.ctx.drawImage(base_image , 0, 0, base_image.width, base_image.height, 0, 0, canvasWrapper.width, canvasWrapper.height);
      console.log(123);
      this.url = canvasWrapper.toDataURL();

    }, 5000);
  }

  test() {
    var link = document.createElement('a'); // create an anchor tag

    // set parameters for downloading
    link.setAttribute('href', this.url);
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

  // CANVAS
  getMousePos(canvas: HTMLCanvasElement, evt: MouseEvent): { x: number, y: number } {
    var rect = canvas.getBoundingClientRect();
    console.log(rect);

    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }
}
