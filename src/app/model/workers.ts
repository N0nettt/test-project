export class Worker
{
    public DeletedOn: string;
    public EmployeeName: string;
    public EndTimeUtc: string;
    public EntryNotes: string;
    public Id: string;
    public StarTimeUtc: string;
    public id?: string;
    public Hours: number;

    public calculateDifference()
    {
        var date1 = new Date(this.StarTimeUtc);
        var date2 = new Date(this.EndTimeUtc);
        
        var Time = date2.getTime() - date1.getTime();
        this.Hours = Time/(1000*3600);
    }
    

}