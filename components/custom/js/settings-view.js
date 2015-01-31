Polymer({
	ready:function(){
		var auth = {'Authorization': 'Token token='+localStorage.token};
		this.$.ajaxGetTasks.headers = auth;
		this.$.ajaxGetTasks.params = {'house_id':localStorage.house_id};
		this.$.updateTask.headers = auth;
		this.$.deleteTask.headers = auth;
	    this.$.saveTask.headers = auth;

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
        
        this.editTaskList = null;
	},
    sortTasks:function(a,b){
        var a_name = a.name.toUpperCase();
        var b_name = b.name.toUpperCase();

        if (a_name < b_name){
            return -1;
        }else if (a_name > b_name){
            return 1;   
        }else{
            return 0;   
        }
    },
	tasksLoaded:function(){
		this.tasks = this.$.ajaxGetTasks.response;
	    
	    this.tasks.sort(this.sortTasks);
	},
    editTask:function(sender, detail, event){
        this.newTaskName = detail.name;
        this.$.radio.selected = detail.duration;
        
        this.toolbarname = 'Taak bewerken';
        this.$.pages.selected = 1;
        
        this.$.saveTask.method = 'PUT';
        this.$.saveTask.url = 'http://178.62.205.200/api/tasks/'+detail.task_id;
        
        this.editTaskList = detail.list;
    },
	/*updateTask:function(sender, detail, event){
		console.log('update task '+detail.task_id+' ("'+detail.name+'")');

		this.$.updateTask.url = 'http://178.62.205.200/api/tasks/'+detail.task_id;
		this.$.updateTask.params = {'task[name]':detail.name, 'task[points]':detail.points};
		this.$.updateTask.go();
	},
	taskUpdated:function(){
		console.log('task updated');
	},*/
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
            
            this.$.saveTask.method = 'POST';
            this.$.saveTask.url = 'http://178.62.205.200/api/tasks/';
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
	saveTask:function(sender, detail, event){
	    if(this.newTaskName){
	        this.$.saveTask.params = {
	            'task[name]':this.newTaskName,
	            'task[house_id]':localStorage.house_id,
	            'task[duration]':Number(this.$.radio.selected)
	        };

	        this.$.saveTask.go();
	    }else{
	        this.$.name.focus();
	    }
	},
	taskSaved:function(sender, detail, event){   
        
        if(this.editTaskList != null){
            this.tasks[this.editTaskList] = detail.response;
            
            swal('Gelukt!', 'De wijzigingen zijn opgeslagen.', 'success');
            
            this.editTaskList = null;
        }else{
            this.tasks.push(detail.response);
            this.tasks.sort(this.sortTasks);
	   
            swal('Gelukt!', 'De nieuwe taak is toegevoed', 'success');

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
        }
        
        this.toolbarname = 'Taakbeheer';
        this.$.pages.selected = 0;
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