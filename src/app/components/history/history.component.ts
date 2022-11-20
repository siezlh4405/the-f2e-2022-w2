import { Component, OnInit } from '@angular/core';
import { SignatureService } from 'src/app/services/signature.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  constructor(
    public signautreService: SignatureService
  ) { }

  ngOnInit(): void {
  }

  download(url: string): void {
    var link = document.createElement('a');
    link.download = 'sign.png';
    link.href = url;
    link.click();
  }

}
