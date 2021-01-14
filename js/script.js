
var ringer = {
  countdown_to: "2/12/2021",
  rings: {
    'DAYS': { 
      s: 86400000, // mseconds in a day,
      max: 365
    },
    'HOURS': {
      s: 3600000, // mseconds per hour,
      max: 24
    },
    'MINUTES': {
      s: 60000, // mseconds per minute
      max: 60
    },
    'SECONDS': {
      s: 1000,
      max: 60
    },
    'MICROSEC': {
      s: 10,
      max: 100
    }
   },
  r_count: 5,
  r_spacing:10, // px
  r_size: 120, // px
  r_thickness: 5, // px
  update_interval: 11, // ms
    
    
  init: function(){
   
    $r = ringer;
    $r.cvs = document.createElement('canvas'); 
    
    $r.size = { 
      w: ($r.r_size + $r.r_thickness) * $r.r_count + ($r.r_spacing*($r.r_count-1)), 
      h: ($r.r_size + $r.r_thickness) 
    };
    


    $r.cvs.setAttribute('width',$r.size.w);           
    $r.cvs.setAttribute('height',$r.size.h);
    $r.ctx = $r.cvs.getContext('2d');
    $(".countdown").append($r.cvs);
    $r.cvs = $($r.cvs);    
    $r.ctx.textAlign = 'center';
    $r.actual_size = $r.r_size + $r.r_thickness;
    $r.countdown_to_time = new Date($r.countdown_to).getTime();
    $r.cvs.css({ width: $r.size.w+"px", height: $r.size.h+"px" });
    $r.go();
  },
  ctx: null,
  go: function(){
    var idx=0;
    
    $r.time = (new Date().getTime()) - $r.countdown_to_time;
    
    
    for(var r_key in $r.rings) $r.unit(idx++,r_key,$r.rings[r_key]);      
    
    setTimeout($r.go,$r.update_interval);
  },
  unit: function(idx,label,ring) {
    var x,y, value, ring_secs = ring.s;
    value = parseFloat($r.time/ring_secs);
    $r.time-=Math.round(parseInt(value)) * ring_secs;
    value = Math.abs(value);
    
    x = ($r.r_size*.5 + $r.r_thickness*.5);
    x +=+(idx*($r.r_size+$r.r_spacing+$r.r_thickness));
    y = $r.r_size*.5;
    y += $r.r_thickness*.5;

    
    // calculate arc end angle
    var degrees = 360-(value / ring.max) * 360.0;
    var endAngle = degrees * (Math.PI / 180);
    
    $r.ctx.save();

    $r.ctx.translate(x,y);
    $r.ctx.clearRect($r.actual_size*-0.5,$r.actual_size*-0.5,$r.actual_size,$r.actual_size);

    // first circle
    $r.ctx.strokeStyle = "#FFFFFF";
    $r.ctx.beginPath();
    $r.ctx.arc(0,0,$r.r_size/2,0,2 * Math.PI, 2);
    $r.ctx.lineWidth =$r.r_thickness;
    $r.ctx.stroke();
   
    // second circle
    $r.ctx.strokeStyle = "rgba(253, 128, 1, 0.9)";
    $r.ctx.beginPath();
    $r.ctx.arc(0,0,$r.r_size/2,0,endAngle, 1);
    $r.ctx.lineWidth =$r.r_thickness;
    $r.ctx.stroke();
    
    // label
    $r.ctx.fillStyle = "#000000";
   
    $r.ctx.font = '13px digital';
    $r.ctx.fillText(label, 0, 23);
    $r.ctx.fillText(label, 0, 23);   
    
    $r.ctx.font = 'bold 40px digital';
    $r.ctx.fillText(Math.floor(value), 0, 10);
    
    $r.ctx.restore();
  }
}
ringer.init();

$(function() {

	var audio = $("audio")[0];

	$('#btn-play-pause').on('click', function() {
		//Play/pause the track
		if (audio.paused == false) {
			audio.pause();
			$(this).children('i').removeClass('fa-pause');
			$(this).children('i').addClass('fa-play');
		} else {
			audio.play();
			$(this).children('i').removeClass('fa-play');
			$(this).children('i').addClass('fa-pause');
		}
	});

	$('#btn-stop').on('click', function() {
		//Stop the track
		audio.pause();
		audio.currentTime = 0;
		$('#btn-play-pause').children('i').removeClass('fa-pause');
		$('#btn-play-pause').children('i').addClass('fa-play');
	});
	
	$('#btn-mute').on('click', function() {
		//Mutes/unmutes the sound
		if(audio.volume != 0) {
			audio.volume = 0;
			$(this).children('i').removeClass('fa-volume-off');
			$(this).children('i').addClass('fa-volume-up');
		} else {
			audio.volume = 1;
			$(this).children('i').removeClass('fa-volume-up');
			$(this).children('i').addClass('fa-volume-off');
		}
	});

	function updateProgress() {
		//Updates the progress bar
		var progress = document.getElementById("progress");
		var value = 0;
		if (audio.currentTime > 0) {
			value = Math.floor((100 / audio.duration) * audio.currentTime);
		}
		progress.style.width = value + "%";
	}

	//Progress Bar event listener
	audio.addEventListener("timeupdate", updateProgress, false);
	
});


