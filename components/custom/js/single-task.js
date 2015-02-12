Polymer({
	ready:function(){
        var deadline = new Date(this.deadline),
            day = deadline.getDate(),
            month = deadline.getMonth(),
  		    months = ["januari","februari","maart","april","mei","juni","juli", "augustus","september","oktober","november","december"];

        this.deadlineLabel = day+' '+months[month];

		animate = {};
	},
	taskTap:function(event, detail, sender){
		var task = sender;

		if(event.srcElement.tagName == 'CORE-ICON'){ //Button tapped, go to confirm
			this.cancelConfimation();

			var btn = task.firstElementChild;
			var btn_ani = new CoreAnimation();
			btn_ani.duration = 100;
			btn_ani.keyframes = [{
				borderRadius:'50px',
				fontSize:'0px',
				height:'30px',
				padding:'5px 4px',
				top:'23px',
				color:'#808080',
				borderColor:'#808080',
			},{
				borderRadius:'4px',
				fontSize:'12px',
				height:'24px',
				padding:'2px 10px',
				top:'25px',
				color:'#008800',
				borderColor:'#008800',
			}];
			btn_ani.fill = 'forwards';
			btn_ani.target = btn;
			animate['button'] = btn_ani.play();

			var btn_icon_ani = new CoreAnimation();
			btn_icon_ani.duration = 100;
			btn_icon_ani.keyframes = [{
				height:'20px',
				width:'20px',
				opacity:1
			},{
				height:0,
				width:0,
				opacity:0
			}];
			btn_icon_ani.fill = 'forwards';
			btn_icon_ani.target = btn.firstElementChild;
			animate['icon'] = btn_icon_ani.play();

			btn.classList.add('confirm');
			animate['target'] = btn;

		}else if(event.srcElement.classList.contains('btn') && event.srcElement.classList.contains('confirm')){ //Button tapped, confirming

			var task_ani = new CoreAnimation();
			task_ani.duration = 300;
			task_ani.keyframes = [{
				transform:'translateX(0)',
				height:'75px',
				padding:'15px',
				marginBottom:'15px'
			},{
				transform:'translateX(100vw)',
				height:'75px',
				padding:'15px',
				marginBottom:'15px'
			},{
				transform:'translateX(100vw)',
				height:0,
				padding:'0 15px',
				marginBottom:0
			}];
			task_ani.fill = 'forwards';
			task_ani.target = task;
			task_ani.play();

			this_task = this;
			task_ani.addEventListener('core-animation-finish', function(){
            	this_task.fire('finish-task', {task_id:this_task.task_id, task_pos:this_task.task_position});
 			});
		}else{ //Not tapped on button, but on task
			this.cancelConfimation();
		}
	},
	cancelConfimation:function(){
		if(animate.button && animate.icon && animate.target){
			animate.button.reverse();
			animate.icon.reverse();

			//var confirm = document.querySelector('::shadow .confirm');
			//if(confirm) confirm.classList.remove('confirm');
			animate.target.classList.remove('confirm');

			delete animate.button;
			delete animate.icon;
			delete animate.target;
		}
	},
    pickTask:function(){
		this.fire('pick-task', {task_id:this.task_id, task_pos:this.task_position});
	}
});
