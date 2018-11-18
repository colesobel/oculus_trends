import { Component, OnInit, ElementRef, Renderer2, ViewChild, OnDestroy, Input } from '@angular/core';
import { Chart } from '../../models/chart.model';
import { ChartService } from '../../services/chart.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, OnDestroy {
  dataSource: object
  @ViewChild('containerRef') containerRef: ElementRef
  @ViewChild('resizeRef') resizeRef: ElementRef
  @Input() chart: Chart
  x: number
  y: number
  height: number
  width: number
  psx: number
  psy: number
  globalEventListenerRef: (event: MouseEvent) => void
  constructor(private element: ElementRef, private renderer: Renderer2, private chartService: ChartService) { }

  ngOnInit() {
    console.log('Running the query')
    this.chartService.runChart(this.chart).then(response => {
      console.log('Successful Query Response!')
      console.log(response)
      this.dataSource = response
    }, 
    error => {
      console.log('The query respoonse had an error')
      console.log(error)
    })
    this.renderer.setStyle(this.containerRef.nativeElement, 'width', 700 + 'px')
    this.renderer.setStyle(this.containerRef.nativeElement, 'height', 400 + 'px')
    this.renderer.setStyle(this.containerRef.nativeElement, 'left', 0 + 'px')
    this.renderer.setStyle(this.containerRef.nativeElement, 'top', 0 + 'px')

    let styles = getComputedStyle(this.containerRef.nativeElement)

    this.x = +styles.top.replace('px', '')
    this.y = +styles.left.replace('px', '')
    this.height = +styles.height.replace('px', '')
    this.width = +styles.width.replace('px', '')

    let drag = (event: MouseEvent) => {
      let xDiff = event.screenX - this.psx
      let yDiff = event.screenY - this.psy

      this.x = Math.max((this.x + xDiff), 0)
      this.y = Math.max((this.y + yDiff), 0)
      
      this.renderer.setStyle(this.containerRef.nativeElement, 'left', this.x + 'px')
      this.renderer.setStyle(this.containerRef.nativeElement, 'top', this.y + 'px')

      this.psx = event.screenX
      this.psy = event.screenY
    }
    let resize = (event: MouseEvent) => {
      let xDiff = event.screenX - this.psx
      let yDiff = event.screenY - this.psy
      
      this.width = this.width + xDiff
      this.height = this.height + yDiff

      this.renderer.setStyle(this.containerRef.nativeElement, 'width', this.width + 'px')
      this.renderer.setStyle(this.containerRef.nativeElement, 'height', this.height + 'px')

      this.psx = event.screenX
      this.psy = event.screenY
    }

    let stopAll = (event: MouseEvent) => {
      console.log('removing all event listener')
      event.preventDefault()
      document.removeEventListener('mousemove', drag)
      document.removeEventListener('mousemove', resize)
    }
    this.globalEventListenerRef = stopAll

    document.addEventListener('mouseup', stopAll)

    this.renderer.listen(this.element.nativeElement, 'mousedown', (event: MouseEvent) => {
      event.preventDefault()
      let target = event.target as HTMLElement
      this.psx = event.screenX
      this.psy = event.screenY
  
      if (target.tagName !== 'rect') {
        return
      }

  
      let stopDrag = (event: MouseEvent) => {
        document.removeEventListener('mousemove', drag)
      }
  
      document.addEventListener('mousemove', drag)
    })

    this.renderer.listen(this.resizeRef.nativeElement, 'mousedown', (event: MouseEvent) => {
      event.preventDefault()
      this.psx = event.screenX
      this.psy = event.screenY
      
      let stopResize = (event: MouseEvent) => {
        document.removeEventListener('mousemove', resize)
      }

      document.addEventListener('mousemove', resize)
    })


  //   this.dataSource = {
  //     "chart": {
  //         "caption": "Countries With Most Oil Reserves [2017-18]",
  //         "subCaption": "In MMbbl = One Million barrels",
  //         "xAxisName": "Country",
  //         "yAxisName": "Reserves (MMbbl)",
  //         "numberSuffix": "K",
  //         "theme": "fusion",
  //     },
  //     "data": [{
  //         "label": "Venezuela",
  //         "value": "290"
  //     }, {
  //         "label": "Saudi",
  //         "value": "260"
  //     }, {
  //         "label": "Canada",
  //         "value": "180"
  //     }, {
  //         "label": "Iran",
  //         "value": "140"
  //     }, {
  //         "label": "Russia",
  //         "value": "115"
  //     }, {
  //         "label": "UAE",
  //         "value": "100"
  //     }, {
  //         "label": "US",
  //         "value": "30"
  //     }, {
  //         "label": "China",
  //         "value": "30"
  //     }
  //   ]
  // }
  }

  ngOnDestroy() {
    document.removeEventListener('mouseup', this.globalEventListenerRef)
  }

  onRefresh() {
    console.log('Refreshing chart!')
  }

}
