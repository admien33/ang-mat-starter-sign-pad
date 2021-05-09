import {
  AfterContentInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  OnDestroy,
} from '@angular/core';

import * as SignaturePadNative from 'signature_pad';

export interface Point {
  x: number;
  y: number;
  time: number;
}

export type PointGroup = Array<Point>;

@Component({
  template: '<canvas></canvas>',
  selector: 'signature-pad',
})
export class SignaturePadComponent implements AfterContentInit, OnDestroy {
  @Input() public options: any;
  @Output() public onBeginEvent: EventEmitter<boolean>;
  @Output() public onEndEvent: EventEmitter<boolean>;

  private signaturePad: any;
  private elementRef: ElementRef;

  constructor(elementRef: ElementRef) {
    this.elementRef = elementRef;
    this.options = this.options || {};
    this.onBeginEvent = new EventEmitter();
    this.onEndEvent = new EventEmitter();
  }

  ngAfterContentInit() {
    console.log('ngAfterContentInit')
    const canvas: any = this.elementRef.nativeElement.querySelector('canvas');

    if ((this.options as any).canvasHeight) {
      canvas.height = (this.options as any).canvasHeight;
    }

    if ((this.options as any).canvasWidth) {
      canvas.width = (this.options as any).canvasWidth;
    }

    this.signaturePad = new SignaturePadNative.default(canvas, this.options);
    this.signaturePad.onBegin = this.onBegin.bind(this);
    this.signaturePad.onEnd = this.onEnd.bind(this);
  }

  ngOnDestroy() {
    const canvas: any = this.elementRef.nativeElement.querySelector('canvas');
    canvas.width = 0;
    canvas.height = 0;
  }

  resizeCanvas() {
    // When zoomed out to less than 100%, for some very strange reason,
    // some browsers report devicePixelRatio as less than 1
    // and only part of the canvas is cleared then.
    const ratio: number = Math.max(window.devicePixelRatio || 1, 1);
    const canvas: any = this.signaturePad.canvas;
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext('2d').scale(ratio, ratio);
    this.signaturePad.clear(); // otherwise isEmpty() might return incorrect value
  }

  // Returns signature image as an array of point groups
  toData(): Array<PointGroup> {
    console.log('todata')
    if (this.signaturePad) {
      return this.signaturePad.toData();
    } else {
      return [];
    }
  }

  // Draws signature image from an array of point groups
  fromData(points: Array<PointGroup>) {
    console.log('fromdata')
    this.signaturePad.fromData(points as any);
  }

  // Returns signature image as data URL (see https://mdn.io/todataurl for the list of possible paramters)
  toDataURL(imageType?: string, quality?: number): string {
    console.log('todataurl')
    return this.signaturePad.toDataURL(imageType, quality); // save image as data URL
  }

  // Draws signature image from data URL
  fromDataURL(dataURL: string, options: any = {}): void {
    console.log('fromdataurl')
    // set default height and width on read data from URL
    if (
      !options.hasOwnProperty('height') &&
      (this.options as any).canvasHeight
    ) {
      options.height = (this.options as any).canvasHeight;
    }
    if (!options.hasOwnProperty('width') && (this.options as any).canvasWidth) {
      options.width = (this.options as any).canvasWidth;
    }
    this.signaturePad.fromDataURL(dataURL, options);
  }

  // Clears the canvas
  clear() {
    this.signaturePad.clear();
  }

  // Returns true if canvas is empty, otherwise returns false
  isEmpty(): boolean {
    return this.signaturePad.isEmpty();
  }

  // Unbinds all event handlers
  off() {
    this.signaturePad.off();
  }

  // Rebinds all event handlers
  on() {
    this.signaturePad.on();
  }

  // set an option on the signaturePad - e.g. set('minWidth', 50);
  set(option: string, value: any) {
    switch (option) {
      case 'canvasHeight':
        this.signaturePad.canvas.height = value;
        break;
      case 'canvasWidth':
        this.signaturePad.canvas.width = value;
        break;
      default:
        this.signaturePad[option] = value;
    }
  }

  // notify subscribers on signature begin
  onBegin() {
    console.log('onbegin')
    this.onBeginEvent.emit(true);
  }

  // notify subscribers on signature end
  onEnd() {
    console.log('onend')
    this.onEndEvent.emit(true);
  }

  queryPad(): any {
    return this.signaturePad;
  }
}
