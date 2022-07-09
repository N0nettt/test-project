import { HttpClient } from '@angular/common/http';
import { ParseSourceFile } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { GoogleChartComponent, GoogleChartInterface, GoogleChartsControlComponent, GoogleChartType } from 'ng2-google-charts';
import { map, subscribeOn } from 'rxjs/operators';
import { Worker } from './model/workers';
declare var google: any;



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
 
  title = 'test-project';
  allWorkers: Worker[];
  sortedWorkers;
 
  constructor(private http: HttpClient) {}

  ngOnInit(){ 
    this.fetchWorkersAndDisplay();
    google.charts.load('current', { packages: ['corechart'] });
  
  } 
private fetchWorkersAndDisplay() {
  this.http.get<{[key: string]: Worker}>('https://rc-vault-fap-live-1.azurewebsites.net/api/gettimeentries?code=vO17RnE8vuzXzPJo5eaLLjXjmRW07law99QTD90zat9FfOQJKKUcgQ==')
  .pipe(map((res) => {
    const workers = [];
    for(const key in res){
      if(res.hasOwnProperty(key))
      {
        workers.push({...res[key]})
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
this.sortedWorkers = result;
var func = (chart: any) => {
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Worker');
  data.addColumn('number', 'Hours');
  this.sortedWorkers.forEach(item => {
    data.addRows([
      [item.name, item.hours]
    ]);
  });
  var options = {
    height: 700,
    weight: 650,
    
  };
  chart().draw(data, options);
}
var chart =()=> new google.visualization.PieChart(document.getElementById('divPieChart'));
var callback=()=>func(chart);
google.charts.setOnLoadCallback(callback);
});
}
}  


