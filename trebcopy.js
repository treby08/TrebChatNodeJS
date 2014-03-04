		function setAudio(src){
		
			var n=src.msg.split("|");
			var music = src.music;
			var str;
			
			if (n[1]!="true"){
				var arrfName = n[0].split("\/");
				var fName = arrfName[arrfName.length-1];
				var arrCurrSong = new Array();
				var arrNxtSong = new Array();
				var CurrSong = null;
				var NxtSong = null;
				
				if (music.length > 0){
					 arrCurrSong = music[0].split("\/");
					 CurrSong = arrCurrSong[arrCurrSong.length-1];
				}
				if (music.length > 1){
					arrNxtSong = music[1].split("\/");
					NxtSong = arrNxtSong[arrNxtSong.length-1];
				}
				if (CurrSong==null)
					CurrSong = fName;
				if (NxtSong==null)
					NxtSong = 'NO SONG';
				
				
				var hasQue = false;
				for (i=0; i < music.length; i++){
					if (music[i] == n[0]){
						hasQue = true;
						break;
					}
				}
				
				var playNow = '';
				if (music.length == 0){
					music.push(n[0]);
					playNow = nextSong(music,'1w3r5');
				}
				
				if (hasQue==false){
					//queue(n[0],1);
					str = "<script>"+
						'document.getElementById("currSongText").innerHTML="'+CurrSong+'";'+
						'document.getElementById("nxtSongText").innerHTML="'+NxtSong+'";'+
						
						"</script>"+
					playNow+
					'<b> [ Audio queue by <i style="color:#FF0000">'+src.nick+ '</i> : '+fName+' ] </b>';
				}else{
					str = '<b> [ '+fName+' already in the list ] </b>';
				}
					
			}else {
				str = '<b style="color:#00FF00"><i>[AUDIBLE]</i></b><audio autoplay>'+
					'<source src="'+n[0]+'" type="audio/mpeg">'+
					'</audio>';
			}
			
			
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
				str +=		'document.getElementById("aud").load();';
				str +=		'document.getElementById("aud").play();';
				str +=		"</script>";
			}

			return str;
		}
		
		function refresh(){
			location.reload();
		}