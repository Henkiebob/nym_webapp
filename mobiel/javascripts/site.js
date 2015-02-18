$(document).ready(function() {

  var hash = window.location.hash.substring(1);

  if(hash){
    $('title').html('Schema voor: '+ hash);
    $('.name').html(hash);
    var tasks = [];
    if(hash == 'aline'){
      var tasks = ['Badkamer schoonmaken'];
    }
    else if(hash == 'christy'){
       var tasks = ['Keuken schoonmaken'];
    }
    else if(hash == 'jan-joris'){
       var tasks = ['WC papier kopen','Oven schoonmaken'];
    }
    else if(hash == 'xander'){
       var tasks = ['Vloeren schoonmaken','WC schoonmaken'];
    }
     else if(hash == 'dorien'){
       var tasks = ['Vuilnis wegbrengen', 'Gasfornuis(folie)'];
    }
  }else{
        var tasks = [];
        $('title').html('Niemand geselecteerd');
        $('.name').html('Niemand');
    }

  $.each(tasks, function( index, value ) {
      $('#tasks').append('<div class="task"><div class="description">'+value+'</div><div class="finish"><input type="checkbox" class="taskcheck" name="task"/></div></div>');
  });


});


