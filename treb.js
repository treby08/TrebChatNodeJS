		function setAudio(src){
		
			var n=src.msg.split("|");
			var music = src.music;
			var str;
			
			if (n[1]!="true"){
				var arrfName = n[0].split("\/");
				var fName = arrfName[arrfName.length-1];
				
				str = '<b> [ Audio queue by <i style="color:#FF0000">'+src.nick+ '</i> : '+decodeURI(fName)+' ] </b>';
				
					
			}else {
				str = '<b style="color:#FF0000">'+src.nick+ ': </b><b style="color:#99ccff"><i>[INTERLUDE]</i></b><audio autoplay>'+
					'<source src="'+n[0]+'" type="audio/mpeg">'+
					'</audio>';
			}
			
			
			return str;
		}
		
		function setImage(src){
			var str;
			str = '<a href="'+src+'" target="_blank" title="Click to enlarge"><img src="'+src+'" width="360" style="margin-left:10px"/></a>';
			return str;
		}
		function nextSong(music, pass){
			var str = "";
			if (pass=="1w3r5"){
				var arrCurrSong = new Array();
				var arrNxtSong = new Array();
				var CurrSong = null;
				var NxtSong = null;
				//alert("Music Count: "+music.length);
				if (music.length > 0){
					 arrCurrSong = music[0].split("\/");
					 CurrSong = arrCurrSong[arrCurrSong.length-1];
				}
				if (music.length > 1){
					arrNxtSong = music[1].split("\/");
					NxtSong = arrNxtSong[arrNxtSong.length-1];
				}
				if (CurrSong==null)
					CurrSong = 'QUEUE A SONG';
				if (NxtSong==null)
					NxtSong = 'NO SONG';
					
				str = "<script>";
				str +=		'document.getElementById("currSongText").innerHTML="'+CurrSong+'";';
				str +=		'document.getElementById("nxtSongText").innerHTML="'+NxtSong+'";';
				str +=		'document.getElementById("aud").pause();';
				str +=		'var mediaSource = document.getElementById("aud").getElementsByTagName("source")[0];';
				str +=		'mediaSource.src = "'+music[0]+'";';
				str +=		'document.getElementById("downLink").href = "dd.php?file='+music[0]+'";';
				str +=		'document.getElementById("aud").load();';
				str +=		'document.getElementById("aud").play();';
				str +=		"</script>";
			}

			return str;
		}
		
		function refresh(){
			location.reload();
		}