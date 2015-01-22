Polymer({
	ready:function(){
		if(this.deadline.indexOf('T') > -1){
			var date = this.deadline.split('T')[0],
				day = date.split('-')[2],
				month = date.split('-')[1],
				months = ["januari","februari","maart","april","mei","juni","juli", "augustus","september","oktober","november","december"],
				deadline = day+' '+months[month-1];
			this.deadline = deadline;
		}
	},
	pickTask:function(){
		this.fire('pick-task', {task_id:this.task_id, task_pos:this.task_position});
	}
});