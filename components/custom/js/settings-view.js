Polymer({
	ready:function(){
		var auth = {'Authorization': 'Token token='+localStorage.token};
		this.$.ajaxGetTasks.headers = auth;
		this.$.ajaxGetTasks.params = {'house_id':localStorage.house_id};
		this.$.updateTask.headers = auth;
		this.$.deleteTask.headers = auth;
	    this.$.addTask.headers = auth;

	    if(localStorage.house_id && localStorage.token){
	        this.$.ajaxGetTasks.go();
	    }
	    
	    this.toolbarname = 'Taakbeheer';
	    
	    if(localStorage.users){
	        var users = JSON.parse(localStorage.users);
	                            
	        var me = users.filter(function(obj){
	            return obj.id == localStorage.user_id;
	        });
	        this.me = me[0];
	        
	        var group = users.filter(function(obj){
	            return obj.id != localStorage.user_id;
	        });
	        this.group = group;
	        
	        this.users = users;
	    }
	},
	tasksLoaded:function(){
		this.tasks = this.$.ajaxGetTasks.response;
	    
	    console.log(this.tasks);
	},
	updateTask:function(event, detail, sender){
		console.log('update task '+detail.task_id+' ("'+detail.name+'")');

		this.$.updateTask.url = 'http://178.62.205.200/api/tasks/'+detail.task_id;
		this.$.updateTask.params = {'task[name]':detail.name, 'task[points]':detail.points};
		this.$.updateTask.go();
	},
	taskUpdated:function(){
		console.log('task updated');
	},
	deleteTask:function(event, detail, sender){
		this.$.deleteTask.url = 'http://178.62.205.200/api/tasks/'+detail.task_id;

	    this.$.deleteTask.go();
	},
	newTask:function(sender){
	    var rotate = new CoreAnimation();
	    rotate.duration = 300;
	    rotate.fill = 'forwards';
	    rotate.target = this.$.addBtn;
	    
	    if(this.$.pages.selected == 0){
	        this.toolbarname = 'Taak toevoegen';
		    this.$.pages.selected = 1;
	        
	        rotate.keyframes = [{
	            transform:'rotateZ(0deg)'
	        },{
	            transform:'rotateZ(45deg)'
	        }];
	        rotate.play();
	    }else{
	        this.toolbarname = 'Taakbeheer';
		    this.$.pages.selected = 0;
	        
	        rotate.keyframes = [{
	            transform:'rotateZ(45deg)'
	        },{
	            transform:'rotateZ(0deg)'
	        }];
	        rotate.play();
	    }
	},
	addTask:function(event, detail, sender){
	    if(this.newTaskName){
	        this.$.addTask.url = 'http://178.62.205.200/api/tasks/';
	        this.$.addTask.params = {
	            'task[name]':this.newTaskName,
	            'task[house_id]':localStorage.house_id,
	            'task[duration]':Number(this.$.radio.selected)
	        };

	        this.$.addTask.go();
	    }else{
	        this.$.name.focus();
	    }
	},
	taskAdded:function(sender, detail, event){                
	    this.tasks.push(detail.response);
	    swal("Gelukt", "Taak zit erbij!", "success");
	    
	    this.toolbarname = 'Taakbeheer';
	    this.$.pages.selected = 0;
	    
	    var rotate = new CoreAnimation();
	    rotate.duration = 300;
	    rotate.fill = 'forwards';
	    rotate.target = this.$.addBtn;
	    rotate.keyframes = [{
	        transform:'rotateZ(45deg)'
	    },{
	        transform:'rotateZ(0deg)'
	    }];
	    rotate.play();
	},
	taskDeleted:function(){
	  //swal("Good job!", "You clicked the button!", "success")
	},
	showTakskManager:function(){
	    this.toolbarname = 'Taakbeheer';
	    this.$.pages.selected = 0;
	    this.$.addBtn.hidden = false;
	},
	showUsersManager:function(){
	    this.toolbarname = 'Gebruikers';
	    this.$.pages.selected = 2;
	    this.$.addBtn.hidden = true;
	},
	editUser:function(sender, detail, event){
	    this.editUser = detail.id;
	    this.editUsername = detail.username;
	    //this.$.pages.selected = 3;
	},
	updateUser:function(){
	    
	},
	switchUser:function(){
	    swal({
	        title:'Afmelden',   
	        text:'Weet je zeker dat je van gebruiker wilt wisselen?',
	        type:'warning',
	        showCancelButton:true,
	        cancelButtonText:'Nee',
	        confirmButtonColor:"#DC5957",
	        confirmButtonText:'Ja',
	        closeOnConfirm:false 
	    }, function(){
	        localStorage.removeItem('user_id');
	        location.reload(); 
	    });
	},
	logOut:function(){
	    swal({
	        title:'Uitloggen',   
	        text:'Weet je zeker dat je wilt uitloggen?',
	        type:'warning',
	        showCancelButton:true,
	        cancelButtonText:'Nee',
	        confirmButtonColor:"#DC5957",
	        confirmButtonText:'Ja',
	        closeOnConfirm:false 
	    }, function(){
	        localStorage.clear();
	        location.reload();
	    });
	},
	goBack:function(){
	    this.fire('go-to', {page:'tasks'});
	}
});