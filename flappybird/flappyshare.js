function share_twitter() {
  status = 'I just scored '+score+' on #FlappyBird - http://www.flappybirds.co.uk';
  window.open("http://twitter.com/home?status="+encodeURIComponent(status),"_blank","toolbar=no,status=no,scrollbars=no,resizable=no,width=640,height=280");
}

function share_facebook() {
  title = 'I just scored '+score+' on FlappyBird!';
  summary = 'Now available for your computer too!';
  url = 'http://www.flappybirds.co.uk/';
  logo = 'http://www.flappybirds.co.uk/images/flappybirds.gif';//'http://a2.mzstatic.com/us/r30/Purple/v4/3f/27/1e/3f271e59-0b19-c8e9-5288-48aeb55f5c25/mzl.xqyzscwo.175x175-75.jpg';
  window.open("http://www.facebook.com/sharer/sharer.php?s=100&p[url]="+encodeURIComponent(url)+"&p[images][0]="+encodeURIComponent(logo)+"&p[title]="+encodeURIComponent(title)+"&p[summary]="+encodeURIComponent(summary)+"","_blank","toolbar=no,status=no,scrollbars=no,resizable=no,width=640,height=340");
}