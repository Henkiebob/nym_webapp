Polymer({
 	observe:{
		'root.updated':'rootUpdated'
 	},
  	rootUpdated:function(){
      this.$.updateTask.headers = this.root.auth;
      this.$.deleteTask.headers = this.root.auth;
      this.$.saveTask.headers = this.root.auth;
      //this.$.ajaxUploadAvatar.headers = this.root.auth;

      this.toolbarname = 'Taakbeheer';

      /*if(localStorage.users && localStorage.user_id){
          var users = JSON.parse(localStorage.users);

          var me = users.filter(function(obj){
              return obj.id == localStorage.user_id;
          });
          this.me = me[0];

          this.me.avatar = this.domain+this.me.avatar;

          var group = users.filter(function(obj){
              return obj.id != localStorage.user_id;
          });
          this.group = group;

          this.users = users;
      }*/

        this.editTaskId = null;
        this.editTaskList = null;

        //add button animation
        rotate = new CoreAnimation();
      	rotate.duration = 300;
      	rotate.fill = 'forwards';
      	rotate.target = this.$.addBtn;

        this.tasksLoaded();
    },
	tasksLoaded:function(){
		//this.tasks = this.$.ajaxGetTasks.response;
		this.allTasks = this.root.tasks;
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
        this.$.saveTask.url = this.root.domain+'/api/tasks/'+detail.task_id;

        this.editTaskId = detail.task_id;
        this.editTaskList = detail.list;

        rotate.keyframes = [{
            transform:'rotateZ(0deg)'
        },{
            transform:'rotateZ(45deg)'
        }];
        rotate.play();
    },
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
			//that.fire('toggle-loading', {set:'show'});
			that.$.deleteTask.url = that.root.domain+'/api/tasks/'+that.editTaskId;
			that.$.deleteTask.go();
	  });
	},
  taskDeleted:function(sender, detail){
        var tasks = this.root.tasks.filter(function(obj){
            return obj.id != detail.response.id;
        });
        this.root.tasks = tasks;
		
		//this.fire('toggle-loading', {set:'hide'});
		//this.fire('reload');

        this.$.pages.selected = 0;
        this.editTaskList = null;
        swal('Taak is verwijderd!', '', 'success');
	  
	 	this.root.updated = new Date().getTime();
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
            this.$.saveTask.url = this.root.domain+'/api/tasks/';
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

        var date = new Date;
        var next = date.setDate(date.getDate() + duration);
        var deadline = new Date(next);

      if(this.newTaskName){
          this.$.saveTask.params = {
              'task[name]':this.newTaskName,
              'task[house_id]':localStorage.house_id,
              'task[duration]':duration,
                'task[points]':points,
                'task[deadline]':deadline
          };
		  
          this.$.saveTask.go();
      }else{
            //SWAL
          this.$.name.focus();
      }
  },
  taskSaved:function(sender, detail, event){
        if(this.editTaskList != null){
            this.root.tasks[this.editTaskList] = detail.response;

            swal('Gelukt!', 'De wijzigingen zijn opgeslagen.', 'success');

            this.editTaskList = null;
            this.editTaskId = null;
        }else{
            this.root.tasks.push(detail.response);
            this.root.tasks.sort(this.sortTasks);

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

        this.root.updated = new Date().getTime();
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
  goBack:function(){
      this.fire('go-to', {page:'tasks'});
  }
});