import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SignatureService {
  isSign1Isset = true;
  signatureUrl1 = '../../assets/file/sign1.png';
  isSign2Isset = false;
  signatureUrl2 = '';
  saveUrl = '../../assets/file/pdf4.png';
  saveUrl1 = '../../../assets/file/pdf1.png';
  saveUrl2 = '../../../assets/file/pdf2.png';
  saveUrl3 = '../../../assets/file/pdf3.png';
  work: 'sign' | 'add' = 'sign';
  constructor() { }
}
