import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
import { map, takeUntil, concatAll, merge } from 'rxjs/operators';
import { SignatureService } from 'src/app/services/signature.service';

@Component({
  selector: 'app-add-sign',
  templateUrl: './add-sign.component.html',
  styleUrls: ['./add-sign.component.scss']
})
export class AddSignComponent implements OnInit, AfterViewInit {
  ctxSign1!: CanvasRenderingContext2D;
  ctxSign2!: CanvasRenderingContext2D;
  @ViewChild('signCanvas1') signCanvas1!: ElementRef<HTMLCanvasElement>;
  @ViewChild('signCanvasContainer1') signCanvasContainer1!: ElementRef<HTMLCanvasElement>;
  @ViewChild('signCanvas2') signCanvas2!: ElementRef<HTMLCanvasElement>;
  @ViewChild('signCanvasContainer2') signCanvasContainer2!: ElementRef<HTMLCanvasElement>;
  resize$: Observable<Event> = fromEvent(window, 'resize');

  constructor(
    public signautreService: SignatureService
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.signautreService.isSign1Isset && this.signautreService.signatureUrl1 === '') {
      this.signautreService.isSign1Isset = false;
    }

    if (this.signautreService.isSign2Isset && this.signautreService.signatureUrl2 === '') {
      this.signautreService.isSign2Isset = false;
    }

    if (this.signautreService.isSign2Isset && !this.signautreService.isSign1Isset) {
      this.signautreService.isSign1Isset = true;
      this.signautreService.signatureUrl1 = this.signautreService.signatureUrl2;
      this.signautreService.isSign2Isset = false;
      this.signautreService.signatureUrl2 = '';
    }
  }

  ngAfterViewInit(): void {
    // 網頁拖拉大小要調整簽名 CANVAS
    this.resize$.subscribe(() => {
      if (true) {
        let temp = this.ctxSign1.getImageData(0, 0, this.signCanvas1.nativeElement.width, this.signCanvas1.nativeElement.height);
        this.ctxSign1.canvas.width = this.signCanvasContainer1.nativeElement.offsetWidth;
        this.ctxSign1.canvas.height = this.signCanvasContainer1.nativeElement.offsetHeight;
        this.ctxSign1.putImageData(temp, 0, 0);
      }

      if (true) {
        let temp = this.ctxSign2.getImageData(0, 0, this.signCanvas2.nativeElement.width, this.signCanvas2.nativeElement.height);
        this.ctxSign2.canvas.width = this.signCanvasContainer2.nativeElement.offsetWidth;
        this.ctxSign2.canvas.height = this.signCanvasContainer2.nativeElement.offsetHeight;
        this.ctxSign2.putImageData(temp, 0, 0);
      }
    });

    // SIGN CANVAS EVENT
    if (this.signCanvas1 !== undefined) {
      const mouseDown$ = fromEvent(this.signCanvas1.nativeElement, 'mousedown');
      const mouseMove$ = fromEvent(this.signCanvas1.nativeElement, 'mousemove');
      const mouseUp$ = fromEvent(this.signCanvas1.nativeElement, 'mouseup');
      const mouseOut$ = fromEvent(this.signCanvas1.nativeElement, 'mouseout');

      this.signCanvas1.nativeElement.width = this.signCanvasContainer1.nativeElement.offsetWidth;
      this.signCanvas1.nativeElement.height = this.signCanvasContainer1.nativeElement.offsetHeight;

      if (this.signCanvas1.nativeElement !== undefined) {
        this.ctxSign1 = this.signCanvas1.nativeElement.getContext('2d') as CanvasRenderingContext2D;
      }

      mouseDown$.pipe(map(donwEvent => {
        const mouseEvent = donwEvent as MouseEvent;
        const mousePosition = this.getMousePos(this.signCanvas1.nativeElement, mouseEvent);
        this.ctxSign1.beginPath();
        this.ctxSign1.moveTo(mousePosition.x, mousePosition.y);
        donwEvent.preventDefault();
        return mouseMove$.pipe(takeUntil(mouseUp$.pipe(merge(mouseOut$))))
      }))
      .pipe(concatAll())
      .subscribe(event=> {
        const mouseEvent = event as MouseEvent;
        const mousePosition = this.getMousePos(this.signCanvas1.nativeElement, mouseEvent);
        this.ctxSign1.lineCap = 'round';
        this.ctxSign1.lineWidth = 2;
        this.ctxSign1.lineJoin='round';
        this.ctxSign1.shadowBlur = 1; // 邊緣模糊，防止直線邊緣出現鋸齒
        this.ctxSign1.shadowColor = 'black';// 邊緣顏色
        this.ctxSign1.lineTo(mousePosition.x, mousePosition.y);
        this.ctxSign1.stroke();
        this.saveSignCanvas(1);
      });
    }

    if (this.signCanvas2 !== undefined) {
      const mouseDown$ = fromEvent(this.signCanvas2.nativeElement, 'mousedown');
      const mouseMove$ = fromEvent(this.signCanvas2.nativeElement, 'mousemove');
      const mouseUp$ = fromEvent(this.signCanvas2.nativeElement, 'mouseup');
      const mouseOut$ = fromEvent(this.signCanvas2.nativeElement, 'mouseout');

      this.signCanvas2.nativeElement.width = this.signCanvasContainer2.nativeElement.offsetWidth;
      this.signCanvas2.nativeElement.height = this.signCanvasContainer2.nativeElement.offsetHeight;

      if (this.signCanvas2.nativeElement !== undefined) {
        this.ctxSign2 = this.signCanvas2.nativeElement.getContext('2d') as CanvasRenderingContext2D;
      }

      mouseDown$.pipe(map(donwEvent => {
        const mouseEvent = donwEvent as MouseEvent;
        const mousePosition = this.getMousePos(this.signCanvas2.nativeElement, mouseEvent);
        this.ctxSign2.beginPath();
        this.ctxSign2.moveTo(mousePosition.x, mousePosition.y);
        donwEvent.preventDefault();
        return mouseMove$.pipe(takeUntil(mouseUp$.pipe(merge(mouseOut$))))
      }))
      .pipe(concatAll())
      .subscribe(event=> {
        const mouseEvent = event as MouseEvent;
        const mousePosition = this.getMousePos(this.signCanvas2.nativeElement, mouseEvent);
        this.ctxSign2.lineCap = 'round';
        this.ctxSign2.lineWidth = 2;
        this.ctxSign2.lineJoin='round';
        this.ctxSign2.shadowBlur = 1; // 邊緣模糊，防止直線邊緣出現鋸齒
        this.ctxSign2.shadowColor = 'black';// 邊緣顏色
        this.ctxSign2.lineTo(mousePosition.x, mousePosition.y);
        this.ctxSign2.stroke();
        this.saveSignCanvas(2);
      });
    }

    if (this.signautreService.isSign1Isset) {
      const base_image = new Image();
      base_image.onload = () => {
        this.ctxSign1.drawImage(base_image , 0, 0);
      };
      base_image.src = this.signautreService.signatureUrl1;
    }

    if (this.signautreService.isSign2Isset) {
      const base_image = new Image();
        base_image.onload = () => {
          this.ctxSign2.drawImage(base_image , 0, 0);
        };
        base_image.src = this.signautreService.signatureUrl2;
    }
  }

  // 簽名操作
  addSignature(): void {
    let isAdd = false;

    if (!this.signautreService.isSign1Isset && !isAdd) {
      isAdd = true;
      this.signautreService.isSign1Isset = true;

      setTimeout(() => {
        this.ctxSign1.canvas.width = this.signCanvasContainer1.nativeElement.offsetWidth;
        this.ctxSign1.canvas.height = this.signCanvasContainer1.nativeElement.offsetHeight;
      }, 0);
    }

    if (!this.signautreService.isSign2Isset && !isAdd) {
      isAdd = true;
      this.signautreService.isSign2Isset = true;

      setTimeout(() => {
        this.ctxSign2.canvas.width = this.signCanvasContainer2.nativeElement.offsetWidth;
        this.ctxSign2.canvas.height = this.signCanvasContainer2.nativeElement.offsetHeight;
      }, 0);
    }
  }

  deleteSign(num: number): void {
    if (num === 1) {
      this.signautreService.isSign1Isset = false;
      this.signautreService.signatureUrl1 = '';
      this.ctxSign1.canvas.width = this.signCanvasContainer1.nativeElement.offsetWidth;
      this.ctxSign1.canvas.height = this.signCanvasContainer1.nativeElement.offsetHeight;
    }

    if (num === 2) {
      this.signautreService.isSign2Isset = false;
      this.signautreService.signatureUrl2 = '';
      this.ctxSign2.canvas.width = this.signCanvasContainer2.nativeElement.offsetWidth;
      this.ctxSign2.canvas.height = this.signCanvasContainer2.nativeElement.offsetHeight;
    }
  }

  // SIGN CANVAS
  getMousePos(canvas: HTMLCanvasElement, evt: MouseEvent): { x: number, y: number } {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

  saveSignCanvas(num: number): void {
    if (num === 1) {
      this.signautreService.signatureUrl1 = this.ctxSign1.canvas.toDataURL();
    }

    if (num === 2) {
      this.signautreService.signatureUrl2 = this.ctxSign2.canvas.toDataURL();
    }
  }
}
