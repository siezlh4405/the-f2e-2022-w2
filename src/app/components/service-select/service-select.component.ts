import { Component, OnInit } from '@angular/core';
import { SignatureService } from 'src/app/services/signature.service';

@Component({
  selector: 'app-service-select',
  templateUrl: './service-select.component.html',
  styleUrls: ['./service-select.component.scss']
})
export class ServiceSelectComponent implements OnInit {

  constructor(
    public signautreService: SignatureService
  ) { }

  ngOnInit(): void {
  }

}
