Polymer({
	ready:function(){
		var deadline = new Date(this.deadline),
            day = deadline.getDate(),
            month = deadline.getMonth(),
  		    months = ["januari","februari","maart","april","mei","juni","juli", "augustus","september","oktober","november","december"];
        
        this.deadline = day+' '+months[month];
	},
	pickTask:function(){
		this.fire('pick-task', {task_id:this.task_id, task_pos:this.task_position});
	}
});