import { Component, ViewChild, forwardRef, AfterViewInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import SignaturePad from 'signature_pad';

@Component({
  selector: 'signature-field',
  templateUrl: 'signature-field.component.html',
  styleUrls: ['./signature-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SignatureFieldComponent),
      multi: true
    }
  ]
})
export class SignatureFieldComponent
  implements ControlValueAccessor, AfterViewInit {
  @ViewChild('signaturePad') public signaturePad: SignaturePad;

  options: Object = {
    canvasHeight: 200,
    canvasWidth: 400
    // penColor: 'red',
    // backgroundColor:  'rgb(0, 0, 255)',
  };
  disableClearButton = true;

  
  propagateChange: Function = null;  
  private _signature: any = null;
  
  get signature(): any {
    return this._signature;
  }

  set signature(value: any) {
    console.log('set signature')
    this._signature = value;
    this.propagateChange(this.signature);
  }

  writeValue(value: any): void {
    console.log('writeValue, value: ' + value)
    if (this._isUndefinedValue(value)) {
      return;
    }
    this._signature = value;

    if (this._isDefinedSignaturePad()) {
      this.signaturePad.fromDataURL(this.signature);
    }
  }

  private _isUndefinedValue(value: any): boolean {
    return typeof value !== 'undefined' && value !== null;
  }

  private _isDefinedSignaturePad() {
    return typeof this.signaturePad !== 'undefined';
  }

  registerOnChange(fn: any): void {
    console.log('registerOnChange');
    this.propagateChange = fn;
  }

  registerOnTouched() {
    // no-op
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit')
    this.signaturePad.clear();
  }

  drawBegin() {
    this.disableClearButton = false;
    
  }

  drawComplete() {
    console.log('drawcomplete')
    this.signature = this.signaturePad.toDataURL('image/jpeg', 0.5);
  }

  clear() {
    this.signaturePad.clear();
    this.signature = '';
    this.disableClearButton = true;
  }
}
