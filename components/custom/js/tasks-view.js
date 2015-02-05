  Polymer({
      alltasksChanged:function(){
        //this.domain = "http://localhost:3000";
         this.domain = "http://178.62.205.200";
        if(localStorage.house_id && localStorage.token) {
            this.users = JSON.parse(localStorage.users);

            //user information
            var me = this.users.filter(function(obj){
                return obj.id == localStorage.user_id;
            });

            this.me = me[0];
            this.username = this.me.name;
            this.avatar = this.domain+this.me.avatar;

            this.headername = this.username;

            var auth = {'Authorization': 'Token token='+localStorage.token};
            this.$.ajaxUpdateTask.headers = auth;
            this.$.ajaxAddTaskToLog.headers = auth;
            this.$.ajaxGetLog.headers = auth;

            this.$.ajaxGetLog.url = this.domain+'/api/logs/'+localStorage.house_id;
            this.$.ajaxGetLog.go();

            this.$.tasks_todo.opened = true;
            this.$.tasks_done.opened = true;

            this.tasks = [];
            this.tasks_open = [];
            this.tasks_done = [];

            this.tasks_group = [];
            this.tasks_group_done = [];

            this.header_todo = 0;
            this.header_done = 0;

            this.total_points = 0;

            this.tasksLoaded();
        }
      },
      logLoaded:function(event, detail, sender){
          var done_tasks = detail.response;

          //console.log(done_tasks);

          for(var i = 0; i < done_tasks.length; i++){
              var task = done_tasks[i];
              console.log(task.user_id);

              if(task.user_id != "" && task.user_id == localStorage.user_id){ //Task done by user
                this.tasks_done.push(task);
                this.header_done++;
              }else{ //Task done by groupmember
                this.tasks_group_done.push(task);

                //task.avatar = this.users[task.user_id];

                console.log(this.users);

              }
              // //points
              var user = this.users.filter(function(obj){
                  return obj.id == task.user_id;
              });

              if(user[0]['points']){
                  user[0]['points'] += Number(task.points);
              }else{
                  user[0]['points'] = Number(task.points);
              }

              this.total_points += Number(task.points);
          }
          //localStorage.users = JSON.stringify(this.users);
      },
      tasksLoaded:function(event, detail, sender){
        //var tasks = detail.response;
        var tasks = JSON.parse(this.alltasks);

        for(var i = 0; i < tasks.length; i++){
            var task = tasks[i];
            if(task.user_id == localStorage.user_id){ //Task picked-up by user
              this.tasks.push(task);
              this.header_todo++;
            }else if(task.user_id == null){ //Open task
              this.tasks_open.push(task);
            }else { //Task picked-up by groupmember
              this.tasks_group.push(task);

              this.users.filter(function(obj){

                console.log(obj.id);

                  if(obj.id == task.user_id){
                    console.log(obj.id);
                    task.avatar = this.domain+this.users[obj.id].avatar;
                  }
              });

            }
          //console.log('id: '+task.id+', name: '+task.name+', user: '+task.user_id+', status: '+task.status+', points: '+task.points);
        }
      },
      pickTask:function(event, detail, sender){
        var task = this.tasks_open[detail.task_pos];
        this.tasks.push(task);
        this.tasks_open.splice(detail.task_pos, 1);
        this.header_todo++;

        //update database
        this.$.ajaxUpdateTask.url = this.domain+'/api/tasks/'+detail.task_id;
        this.$.ajaxUpdateTask.params = {'task[user_id]':localStorage.user_id};
        this.$.ajaxUpdateTask.go();
      },
      finishTask:function(event, detail, sender){
          var task = this.tasks[detail.task_pos];

        if(detail.task_id == task.id){

            // //duplicate to done list
            var task_done = (JSON.parse(JSON.stringify(task)));
            task_done.deadline = new Date;
            this.tasks_done.push(task_done);

            //remove from todo list
            this.tasks.splice(detail.task_pos, 1);

            //add to open list
            this.tasks_open.push(task);

            //update header
            this.header_todo--;
            this.header_done++;

            //set new deadline @TODO fix real deadlines
            if(!task.duration) task.duration = 7;
            var date = new Date;
            var next = date.setDate(date.getDate() + task.duration);

            var deadline = new Date(next),
                day = deadline.getDate(),
                month = deadline.getMonth(),
                months =  [
                            "januari",
                            "februari",
                            "maart",
                            "april",
                            "mei",
                            "juni",
                            "juli",
                            "augustus",
                            "september",
                            "oktober",
                            "november",
                            "december"
                          ];

            task.deadline = day+' '+months[month];

            //add task to log
            this.$.ajaxAddTaskToLog.url = this.domain+'/api/logs/';
            this.$.ajaxAddTaskToLog.params = {
              'log[name]': task.name,
              'log[user_id]' : localStorage.user_id,
              'log[points]'  : task.points,
              'log[house_id]': localStorage.house_id
            };

            this.$.ajaxAddTaskToLog.go();

            //points
            if(this.me.points){
                this.me.points += Number(task.points);
            }else{
                this.me.points = Number(task.points);
            }

            //update task date
            this.$.ajaxUpdateTask.url = this.domain+'/api/tasks/'+detail.task_id;
            this.$.ajaxUpdateTask.params = {'task[deadline]':new Date(next), 'task[user_id]':''};
            this.$.ajaxUpdateTask.go();
        }
      },
      taskUpdated:function(event, detail, sender){
        //console.log()
      },
      headerToTodo:function(event, detail, sender){
        sender.classList.add('active');
        this.$.pages.selected = 0;
      },
      headerToDone:function(event, detail, sender){
        sender.classList.add('active');
        this.$.pages.selected = 1;
      },
      headerToPoints:function(){
        this.$.pages.selected = 2;
      },
      showSingle:function(){
        this.$.tasks_todo.opened = true;
        this.$.tasks_done.opened = true;

        this.$.tasks_group.opened = false;
        this.$.tasks_group_done.opened = false;

        this.header_todo = this.tasks.length;
        this.header_done = this.tasks_done.length;

        this.headername = this.username;

        var rotate = new CoreAnimation();
        rotate.duration = 300;
        rotate.keyframes = [{
            transform:'rotateY(180deg)'
        },{
            transform:'rotateY(0deg)'
        }];
        rotate.fill = 'forwards';
        rotate.target = document.querySelector('html /deep/ #photos');
        rotate.play();
      },
      showGroup:function(){
        this.$.tasks_group.opened = true;
        this.$.tasks_group_done.opened = true;

        this.$.tasks_todo.opened = false;
        this.$.tasks_done.opened = false;

        this.header_todo = this.tasks_group.length;
        this.header_done = this.tasks_group_done.length;

        if(localStorage.groupName){
              this.headername = localStorage.groupName;
        }else{
             this.headername = 'GROEP';
        }

        var rotate = new CoreAnimation();
        rotate.duration = 300;
        rotate.keyframes = [{
            transform:'rotateY(0deg)'
        },{
            transform:'rotateY(180deg)'
        }];
        rotate.fill = 'forwards';
        rotate.target = document.querySelector('html /deep/ #photos');
        rotate.play();

      },
      gotoSettings:function(){
          this.fire('go-to', {page:'settings'});
      },
      refresh:function(){
          this.fire('reload');
      }
});


