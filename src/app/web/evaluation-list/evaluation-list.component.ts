import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { EvaluationService } from 'src/app/services/evaluation.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { ImagesService } from 'src/app/services/images.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSort, Sort } from '@angular/material/sort';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import { Chart } from 'chart.js'
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-evaluation-list',
  templateUrl: './evaluation-list.component.html',
  styleUrls: ['./evaluation-list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})


export class EvaluationListComponent implements AfterViewInit {

  mainUser = JSON.parse(localStorage.getItem('user') || '{}');
  user: any;
  evaluations: any = [];
  sum:any=0;
  averageMark:any;
  marks:any=[];

  dataSource: any;
  displayedColumns: string[] = ['date', 'title', 'mark', 'visualize']

  @ViewChild('lineCanvas') lineCanvas?: ElementRef;
  lineChart:any;

  constructor(private evalService: EvaluationService, 
    private imageService: ImagesService,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar,
    private _liveAnnouncer: LiveAnnouncer) {
    this.route.queryParams.subscribe( () => {
      if (this.router.getCurrentNavigation()?.extras.state){
        this.user = this.router.getCurrentNavigation()?.extras.state?.['selectedUser'];
        console.log("USER EN EVAL: ",this.user)
      }
    })      
   }

  @ViewChild(MatSort) sort: MatSort | undefined;

  ngAfterViewInit() {
    this.getEvals();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

   announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  showGraphs () {
    this.lineChart = new Chart(this.lineCanvas?.nativeElement, {
      type: 'line',
      options: {
        responsive:true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Número de casos realizados',
              align: 'center'
            },
             ticks: {
              maxTicksLimit: this.marks.length
            }, 
            offset:true,
            type: 'linear',
          },
          y: {
            title: {
              display: true,
              text: 'Nota',
              align: 'center'
            },
            beginAtZero:true
          },
        },
        plugins: {
          legend: {
            position: 'top'
          }
        }
      },
      data: {
       labels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,
      34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50],
        datasets: [
          {
            label: 'Nota por intento',
            fill: false,
            backgroundColor: '#4679AA',
            borderColor: '#4679AA',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: '#4679AA',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: '#4679AA',
            pointHoverBorderColor: '#4679AA',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: this.marks,
            spanGaps: false,
          },
          /* {
            label: 'Nota media',
            fill: false,
            backgroundColor: '#008000',
            borderColor: '#008000',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: '#008000',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: '#008000',
            pointHoverBorderColor: '#008000',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: this.averageMark,
            spanGaps: false,
          } */
        ]
      }
    });
  }

  getEvals () {
    console.log("getting evals")
    this.evalService.getEvals(this.user._id).subscribe((res:any) => {
      console.log(res);
      this.evaluations = res;
      this.dataSource = new MatTableDataSource(this.evaluations);
      this.dataSource.sort = this.sort;
      this.getTitle();
      for(let data of this.evaluations) {
        if (data.mark === undefined) {
          data.mark=0;
        }
        this.marks.push(data.mark)
        this.sum += data.mark;
      }
      this.showGraphs()
      console.log(this.marks)
      this.averageMark=(this.sum/this.evaluations.length).toFixed(2);
      console.log(this.averageMark)
    })
  }

  getTitle() {
    for(let data of this.evaluations) {
      console.log(data.case)
      this.imageService.getTitle(data.case).subscribe((res:any) => {
        console.log(res)
        data.case = res.title;
      })
    }
  }

  showEval(evaluation:any) {
    console.log(evaluation)
    this.router.navigate(['/evaluation'], {state: {"eval": evaluation, 'selectedUser': this.user}})
  }

  goBack() {
    if (this.mainUser.role === 0) {
      this.router.navigate(['/teacher'])
    }else {
      this.router.navigate(['/student'])
    }
  }
}