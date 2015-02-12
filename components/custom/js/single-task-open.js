Polymer({
	ready:function(){
		if(this.root && this.avatar) this.profilepicture = this.root.domain+'/'+this.avatar;

		this.deadline_date = "";

		//fix for deadline with done tasks
		if(this.deadline){
			this.deadline_date = this.deadline;
		}else{
			this.deadline_date = this.created_at;
		}

		var deadline = new Date(this.deadline_date),
            day = deadline.getDate(),
            month = deadline.getMonth(),
  		    months = ["januari","februari","maart","april","mei","juni","juli", "augustus","september","oktober","november","december"];

        this.deadlineLabel = day+' '+months[month];
	},
	pickTask:function(){
		this.fire('pick-task', {task_id:this.task_id, task_pos:this.task_position});
	}
});
