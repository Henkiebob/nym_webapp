$(document).ready(function(){

	//load from localstorage
	if(localStorage.scheme && localStorage.week == weekNumber()){
		$('#generator').addClass('overview');
		createTable(JSON.parse(localStorage.scheme));
		return false;
	}

	if(localStorage.names){
		names = localStorage.names.split(',');

		for(var i = 0; i < names.length; i++){
			if(i < 3){
				$('.person').eq(i).children('input').val(names[i]);
			}else{
				var input = '<div class="person"><input type="text" placeholder="Naam..." value="'+names[i]+'"><i class="md md-clear"></i></div>';
				$('.fields .person:last').after(input);
			}
		}
	}

	if(localStorage.tasks && localStorage.tasks_type && localStorage.tasks_duration && localStorage.tasks_checked){
		tasks = localStorage.tasks.split(',');
		tasks_type = localStorage.tasks_type.split(',');
		tasks_duration = localStorage.tasks_duration.split(',');
		tasks_checked = localStorage.tasks_checked.split(',');

		for(var i = 0; i < tasks.length; i++){
			var task = tasks[i];
			var type = tasks_type[i];
			var checked = tasks_checked[i];
			var duration = tasks_duration[i];

			if(type == 'default' && checked == 'checked'){
				$('.task[data-task="'+task+'"]').children('input').prop('checked', true);
			}else if(type == 'custom'){
				if(checked == 'checked'){
					var check = 'checked';
				}else{
					var check = '';
				}

				if(duration == 'short'){
					var duration_title = 'Kort';
				}else{
					var duration_title = 'Lang';
				}

				var html = '<label class="task" data-task="'+task+'" data-task-duration="'+duration+'" data-task-type="custom"><input type="checkbox" '+check+'><i class="md md-check-box-outline-blank"></i> '+task+' <i class="md md-clear"></i><span>'+duration_title+'</span></label>';
				$('*[data-name="tasks"] .task:last').after(html);
			}
		}
	}

	//names
	$('*[data-name="persons"] .btn.next').on('click', function(){
		names = [];

		users_objects = [];

		$('.person').each(function(e){
			var value = $(this).children('input').val();

			if(value){
				names.push(value);

				//objects for scheme
				users_objects.push({name:value, tasks:[], duration:0});
			}
		});

		if(names.length < 3){
			alert('Er moeten minimaal 3 namen worden ingevuld om gebruik te kunnen maken van deze generator.');
		}else{
			var slide = $(this).parent();
			var next_slide = slide.next();

			next_slide.removeClass('right');

			localStorage.names = names;
		}
	});

	//new person
	$('.newperson').on('click', function(){
		var max = 6;
		if($('.fields .person').length < max){
			var input = '<div class="person"><input type="text" placeholder="Naam..."><i class="md md-clear"></i></div>';
			$('.fields .person:last').after(input);
			$('.fields .person:last').children().focus();
			binClick();
		}else{
			alert(max+' personen maximaal');
		}

		if($('.fields .person').length == max){
			$(this).hide();
		}
	});

	//delete person
	binClick();
	function binClick(){
		$('.person i.md-clear').on('click', function(){
			var person = $(this).parent();

			if($('.person').length > 3){
				person.remove();
			}else{
				person.children('input').val('').focus();
			}

			$('.newperson').show();
		});
	}

	//tasks
	$('*[data-name="tasks"] .btn').on('click', function(){
		tasks = [];
		tasks_type = [];
		tasks_duration = [];
		tasks_checked = [];

		tasks_objects = [];

		$('.task').each(function(e){
			var checkbox = $(this).children('input');

			tasks.push(checkbox.parent().data('task'));
			tasks_duration.push(checkbox.parent().data('task-duration'));
			tasks_type.push(checkbox.parent().data('task-type'));

			if(checkbox.is(':checked')){
				tasks_checked.push('checked');

				//objects for scheme
				if(checkbox.parent().data('task-duration') == 'long'){
					var duration = 10;
				}else{
					var duration = 5;
				}
				var object = {name:checkbox.parent().data('task'), duration:duration};
				tasks_objects.push(object);
			}else{
				tasks_checked.push('unchecked');
			}
		});

		localStorage.tasks = tasks;
		localStorage.tasks_type = tasks_type;
		localStorage.tasks_duration = tasks_duration;
		localStorage.tasks_checked = tasks_checked;

		var scheme = generateSchema(tasks_objects, users_objects);
		localStorage.setItem('scheme', JSON.stringify(scheme));

		localStorage.setItem('week', weekNumber());

		createTable(scheme);
	});

	$('*[data-name="tasks"] .btn-text').on('click', function(){
		$('*[data-name="tasks"]').addClass('right');
	});

	//new task
	$('.newtask').on('click', function(){
		$('*[data-name="newtask"]').removeClass('down');

		setTimeout(function(){
			$('*[data-name="newtask"] .tasktitle').focus();
		}, 500);
	});

	$('*[data-name="newtask"] .btn').on('click', function(){
		var title = $('*[data-name="newtask"] .tasktitle').val();
		var duration = $('*[data-name="newtask"] input[name="duration"]:checked').val();

		if(duration == 'short'){
			var duration_title = 'Kort';
		}else{
			var duration_title = 'Lang';
		}

		if(title){
			var html = '<label class="task" data-task="'+title.toLowerCase()+'" data-task-duration="'+duration+'" data-task-type="custom"><input type="checkbox" checked><i class="md md-check-box-outline-blank"></i> '+title+' <i class="md md-clear"></i><span>'+duration_title+'</span></label>';
			$('*[data-name="tasks"] .task:last').after(html);

			$('*[data-name="newtask"]').addClass('down');

			binClickTask();
		}else{
			alert('Taaktitel is verplicht!');
			$('*[data-name="newtask"] .tasktitle').focus();
		}

		$('*[data-name="newtask"] .tasktitle').val('');
	});

	$('*[data-name="newtask"] .btn-text').on('click', function(){
		$('*[data-name="newtask"]').addClass('down');
		$('*[data-name="newtask"] .tasktitle').val('');
	});

	//delete task
	binClickTask();
	function binClickTask(){
		$('.task .md-clear').on('click', function(){
			var task = $(this).parent();
			task.remove();
		});
	}

	//mobile info window
	$('.btn.mob_info').on('click', function(){
		$('*[data-name="mob_info"]').removeClass('down');
	});

	$('*[data-name="mob_info"] .btn').on('click', function(){
		$('*[data-name="mob_info"]').addClass('down');
	});
	
	//prevent tab key click
	$('body').on('keydown', function(e){
		var last = $('.person:last').children('input').val();
		if(e.keyCode == 9){
			if($('.person').children('input:focus').val() == last){
				return false;
			}
		}
	});
});

//Functions
function weekNumber(){
	var today = new Date();
	var onejan = new Date(today.getFullYear(),0,1);
	return Math.ceil((((today - onejan) / 86400000) + onejan.getDay()+1)/7);
}

function createTable(scheme){
	var table = '<tr><th class="name">Naam</th><th class="task">Taak</th><th class="check"><i class="md md-check"></i></th></tr>';
	var row_class = 'dark';

	for(var i = 0; i < scheme.length; i++){
		var tasks_table = '';
		for(var e = 0; e < scheme[i].tasks.length; e++){
			var task = scheme[i].tasks[e];
			if(e > 0) tasks_table += '</tr><tr class="'+row_class+'">';
			tasks_table += '<td>'+task.name+'</td><td class="check"></td>';
		}

		table += '<tr class="'+row_class+'"><th rowspan="'+scheme[i].tasks.length+'">'+scheme[i].name+'</th>';
		table += tasks_table;
		table += '</tr>';

		if(row_class == 'dark'){
			row_class = '';
		}else{
			row_class = 'dark';
		}
	}

	$('#printschema').find('table').html(table);
	$('*[data-name="overview"]').children('table').html(table);
	$('*[data-name="overview"]').removeClass('right');

	$('*[data-name="overview"]').children('h3').text('Week '+weekNumber());
	$('#printschema header h2').html('<i class="md md-today"></i> Week '+weekNumber());
}

function CalculateTotalTaskTime(tasks) {
    return _.reduce(tasks, function (memo, task) {
      return memo + task.duration;
    }, 0);
}

function SortByDuration(tasks){
      return tasks.sort(function(a, b){
          return a['duration']>b['duration']?-1:1;
      });
}

function generateSchema(tasks, users){

    //lang taken eerst en users shufflen
    var sortedTasks = SortByDuration(tasks);
    var users = _.shuffle(users);

    _.each(sortedTasks, function(task, taskIndex) {
      // geef de users met de minste taken terug
      var user = _.min(users, function(user){ return user.duration; });
      user.tasks.push(task)

      // voeg de duration toe aan de user
      user.duration += task.duration
    });

	console.log(users);
	return users;
}

function clearLocalStore(){
	//localStorage.clear();
  	localStorage.scheme = '';
  	localStorage.week = '';
  	location.reload();
}
