import { HttpClient } from '@angular/common/http';
import { ParseSourceFile } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { GoogleChartComponent, GoogleChartInterface, GoogleChartType } from 'ng2-google-charts';
import { map, subscribeOn } from 'rxjs/operators';
import { SortedWorker } from './model/sortedworker';
import { Worker } from './model/workers';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
 
  title = 'test-project';
  allWorkers: Worker[];
  sortedWorkers: SortedWorker[]

  constructor(private http: HttpClient) {}

  ngOnInit(){
    this.fetchWorkers();
  
  }

  pieChart: GoogleChartInterface = {
  chartType: GoogleChartType.PieChart,
  dataTable: [
    ['Workers', 'Hours'],
    ['Patrick Huthinson', 223],
    ['John Black', 206],
    ['Stewart Malachi', 205],
    ['Abhay Singh', 199],
    ['Raju Sunuwar', 103],
    ['Tim Perkinson', 177],
    ['Mary Poppins', 170],
    ['Kavvay Verma', 163],
    ['Tamoy Smith', 96],
    ['Rita Alley', 115]
  ],
  options: {
    'height' : 500,
    'weight' : 400,
    
  },
};

 

private fetchWorkers() {
  this.http.get<{[key: string]: Worker}>('https://rc-vault-fap-live-1.azurewebsites.net/api/gettimeentries?code=vO17RnE8vuzXzPJo5eaLLjXjmRW07law99QTD90zat9FfOQJKKUcgQ==')
  .pipe(map((res) => {
    const workers = [];
    for(const key in res){
      if(res.hasOwnProperty(key))
      {
        workers.push({...res[key], id: key})
      }  
    } 
    return workers;
  }))
  .subscribe((workers) => {
  console.log(workers);
  this.allWorkers = workers;
  var result = [];
  this.allWorkers.reduce(function(res, value) {
  if (!res[value.EmployeeName]) {
    res[value.EmployeeName] = { name: value.EmployeeName, hours: 0 };
    result.push(res[value.EmployeeName])
  }
  var date1 = new Date(value.StarTimeUtc); 
	var date2 = new Date(value.EndTimeUtc); 
  var Time = date2.getTime() - date1.getTime(); 
  var h = Time / (1000 * 3600); //Diference in Hours
  var h = Math.round(h);
  res[value.EmployeeName].hours += h;
  return res;  
}, {});
result = result.sort((function(a,b)
{ 
  if (a.hours > b.hours) {    
  return -1;    
} else if (a.hours < b.hours) {    
  return 1;    
}    
return 0;  

}))
result = result.filter(r => r.name !== null)
this.sortedWorkers = result
console.log(result);
});
}
}  


