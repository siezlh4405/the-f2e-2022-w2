import { Component, OnInit } from '@angular/core';
import { SignatureService } from 'src/app/services/signature.service';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent implements OnInit {
  tab = 'sign';
  constructor(
    public signautreService: SignatureService
  ) {
    this.tab = signautreService.work;
  }

  ngOnInit(): void {}
}

