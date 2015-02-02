Polymer({
	ready:function(){
        //this.domain = "http://localhost:3000";
        this.domain = "http://178.62.205.200";
        
		var auth = {'Authorization': 'Token token='+localStorage.token};
		this.$.ajaxGetTasks.headers = auth;
		this.$.ajaxGetTasks.params = {'house_id':localStorage.house_id};
		this.$.updateTask.headers = auth;
		this.$.deleteTask.headers = auth;
	    this.$.saveTask.headers = auth;
        this.$.ajaxUploadAvatar.headers = auth;
        
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
            
            this.me.avatar = 'http://178.62.205.200'+this.me.avatar;
            	        
	        var group = users.filter(function(obj){
	            return obj.id != localStorage.user_id;
	        });
	        this.group = group;
	        
	        this.users = users;
	    }
        
        this.editTaskId = null;
        this.editTaskList = null;
        
        //add button animation
        rotate = new CoreAnimation();
	    rotate.duration = 300;
	    rotate.fill = 'forwards';
	    rotate.target = this.$.addBtn;
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
        
        this.$.deleteBox.hidden = false;
        this.$.btn_delete.hidden = true;
        this.$.btn_save.hidden = false;
        this.$.deleteBox.children[1].checked = false;
        
        this.$.pages.selected = 1;
        
        this.$.saveTask.method = 'PUT';
        this.$.saveTask.url = 'http://178.62.205.200/api/tasks/'+detail.task_id;
        
        this.editTaskId = detail.task_id;
        this.editTaskList = detail.list;
        
        rotate.keyframes = [{
            transform:'rotateZ(0deg)'
        },{
            transform:'rotateZ(45deg)'
        }];
        rotate.play();
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
    checkDelete:function(sender, detail, event){
        if(event.checked === true){
            this.$.btn_delete.hidden = false;
            this.$.btn_save.hidden = true;
        }else{
            this.$.btn_delete.hidden = true;
            this.$.btn_save.hidden = false;
        }
    },
	deleteTask:function(event, detail, sender){
        that = this;
        
        swal({
	        title:'Taak Verwijderen',   
	        text:'Weet je zeker dat je deze taak wilt verwijderen?',
	        type:'warning',
	        showCancelButton:true,
	        cancelButtonText:'Nee',
	        confirmButtonColor:"#DC5957",
	        confirmButtonText:'Ja',
	        closeOnConfirm:false 
	    }, function(){
            that.$.deleteTask.url = 'http://178.62.205.200/api/tasks/'+that.editTaskId;
            that.$.deleteTask.go(); 
	    });
	},
    taskDeleted:function(sender, detail){
        var tasks = this.tasks.filter(function(obj){
            return obj.id != detail.response.id;
        });
        this.tasks = tasks;
        
        this.$.pages.selected = 0;
        this.editTask = null;
        swal('Taak is verwijderd!', '', 'success');
	},
	newTask:function(sender){
	    if(this.$.pages.selected == 0){
	        this.toolbarname = 'Taak toevoegen';
        
            this.newTaskName = '';
            this.$.radio.selected = 1;
            
            this.$.deleteBox.hidden = true;
            this.$.btn_delete.hidden = true;
            this.$.btn_save.hidden = false;
            this.$.deleteBox.children[1].checked = false;
            
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
        var duration = Number(this.$.radio.selected);
        var points = 0;
        
        if(duration == 1){
            points = 5;
        }else if(duration == 7){
            points = 10;
        }else if(duration == 28){
            points = 15;
        }else if(duration == 0){
            points = 5;
        }
        
	    if(this.newTaskName){
	        this.$.saveTask.params = {
	            'task[name]':this.newTaskName,
	            'task[house_id]':localStorage.house_id,
	            'task[duration]':duration,
                'task[points]':points
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
            this.editTaskId = null;
        }else{
            this.tasks.push(detail.response);
            this.tasks.sort(this.sortTasks);
	   
            swal('Gelukt!', 'De nieuwe taak is toegevoed', 'success');

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
    selectAvatar:function(event){
        if(event.target.files[0]){            
            var reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);

            name = event.target.files[0].name;
            type = event.target.files[0].type;
            
            that = this;
            reader.onload = function(e){
                that.me.avatar = e.target.result;
                //that.processAvatar(e.target.result, name, type);
            };
        }
    },
    processAvatar:function(avatar, name, type){
        this.$.ajaxUploadAvatar.url = this.domain+"/api/users/upload/"+localStorage.user_id;
        this.$.ajaxUploadAvatar.params = {'image': avatar, 'name' : name, 'type': type};
        this.$.ajaxUploadAvatar.go();
    },
    updateUsernameBackUp:function(){
        this.usernameBackUp = this.me.name.toString();  
    },
    updateUsername:function(){
        if(this.usernameBackUp != this.me.name){
            this.usernameUpdated();   
        }
    },
    usernameUpdated:function(){
        swal({
	        title:'Gebruikersnaam gewijzigd',   
	        //text:'Weet je zeker dat je van gebruiker wilt wisselen?',
	        type:'success',
	        confirmButtonColor:"#DC5957",
	        confirmButtonText:'Dank je',
	    }, function(){

	    });
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