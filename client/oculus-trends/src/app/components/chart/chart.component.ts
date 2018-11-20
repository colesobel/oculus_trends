import { Component, OnInit, ElementRef, Renderer2, ViewChild, OnDestroy, Input } from '@angular/core';
import { Chart } from '../../models/chart.model';
import { ChartService } from '../../services/chart.service';
import { DashboardService } from '../../services/dashboard.service';
import { Subscription } from 'rxjs';

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
  screenWidth: number
  screenHeight: number
  x: number
  y: number
  height: number
  width: number
  psx: number
  psy: number
  globalEventListenerRef: (event: MouseEvent) => void
  windowSubscription: Subscription

  constructor(private element: ElementRef, private renderer: Renderer2, private chartService: ChartService, private dashboardService: DashboardService) { }

  ngOnInit() {
    this.chartService.runChart(this.chart).then(response => {
      console.log('Successful Query Response!')
      console.log(response)
      this.dataSource = response
    }, 
    error => {
      console.log('The query respoonse had an error')
      console.log(error)
    })
    this.screenWidth = window.outerWidth
    this.screenHeight = window.outerHeight
    
    this.convertChartSpecs()

    // this.renderer.setStyle(this.containerRef.nativeElement, 'width', this.width + 'px')
    // this.renderer.setStyle(this.containerRef.nativeElement, 'height', this.height + 'px')
    // this.renderer.setStyle(this.containerRef.nativeElement, 'left', this.x + 'px')
    // this.renderer.setStyle(this.containerRef.nativeElement, 'top', this.y + 'px')
    console.log(`x: ${this.x}, y: ${this.y}, width: ${this.width}, height: ${this.height}`)

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
      event.preventDefault()
      document.removeEventListener('mousemove', drag)
      document.removeEventListener('mousemove', resize)
      this.chartService.onSizePlacementChange(this.chart, this.x, this.y, this.height, this.width, this.screenWidth, this.screenHeight).then(response => {
        this.chart = response
      }).catch(e => {
        // Chart position did not change. No action needed
      })
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

    this.windowSubscription = this.dashboardService.onWindowChange.subscribe(() => {
      console.log('Weve subscribed to window resize events!!')
      console.log(window.outerWidth)
      console.log(window.outerHeight)
      this.screenWidth = window.outerWidth
      this.screenHeight = window.outerHeight
      this.convertChartSpecs()
    })
  }

  ngOnDestroy() {
    document.removeEventListener('mouseup', this.globalEventListenerRef)
    this.windowSubscription.unsubscribe()
  }

  onRefresh() {
    console.log('Refreshing chart!')
  }

  convertChartSpecs() {
    this.x = (isNaN(this.chart.x)) ? 0.0 : Math.round(this.chart.x * this.screenWidth)
    this.y = (isNaN(this.chart.y)) ? 0.0 : Math.round(this.chart.y * this.screenHeight)
    this.width = (isNaN(this.chart.width) || this.chart.width == 0) ? 700 : Math.round(this.chart.width * this.screenWidth)
    this.height = (isNaN(this.chart.height) || this.chart.height == 0) ? 400 : Math.round(this.chart.height * this.screenHeight)


    this.renderer.setStyle(this.containerRef.nativeElement, 'width', this.width + 'px')
    this.renderer.setStyle(this.containerRef.nativeElement, 'height', this.height + 'px')
    this.renderer.setStyle(this.containerRef.nativeElement, 'left', this.x + 'px')
    this.renderer.setStyle(this.containerRef.nativeElement, 'top', this.y + 'px')
  }

}
