import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SignatureService {
  isSign1Isset = true;
  signatureUrl1 = '../../assets/file/sign1.png';
  isSign2Isset = false;
  signatureUrl2 = '';
  constructor() { }
}
