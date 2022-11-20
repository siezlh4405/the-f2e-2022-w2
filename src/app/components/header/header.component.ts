import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss', '../../../assets/styles/_components.scss']
})
export class HeaderComponent implements OnInit {
  isHistory = false;
  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const hrefSplit = window.location.href.split('/');
    if (hrefSplit[hrefSplit.length-1] == 'history') {
      this.isHistory = true;
    }
  }

}
