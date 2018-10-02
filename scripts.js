
/*
v.1.0.2 5-21
todo:

fix overflow, roudning, efficiency problems for very large input
make table more mobile friendly
use realfavicongenerator.net

*/

function nchoosek(n,k){
  let result = 1;
  for(let i = 1; i <= k; i++){
    result *= (n+1-i)/i;
  }
  return result;
}

function equal(N, m, n, k) {
  return nchoosek(m,k) * nchoosek(N-m,n-k) / nchoosek(N,n);
}
function less(N, m, n, k) {
  let result = 0;
  for(let i=0; i<k; i++) {
    result += equal(N,m,n,i);
  }
  return result;
}
function greater(N, m, n, k) {
  let result = 0;
  for(let i=n; i>k; i--) {
    result += equal(N,m,n,i);
  }
  return result;
}

// function mean(p,n,x) {
//   return n*p;
// }
// function variance(p,n,x) {
//   return n * p * (1-p);
// }
// function stddev(p,n,x) {
//   return Math.sqrt(variance(p,n,x));
// }

function round(num, digits) {
  return (Math.round(num*Math.pow(10,digits) ) / Math.pow(10,digits) );
}

document.onkeyup = function(e) {
  let code = e.keyCode ? e.keyCode : e.which;
  if(code == 13){ //enter
    calc();
  }
  // else if(code == 73) { //"i"
  //   document.getElementById('infoModalButton').click();
  // }
  else if(code == 78) { //"n"
    document.getElementById('nightButton').click(); 
  }
}

function clear() {
  document.getElementById("NInput").value = '';
  document.getElementById("mInput").value = '';
  document.getElementById("nInput").value = '';
  document.getElementById("kInput").value = '';
  console.log('Cleared');
}

https://stackoverflow.com/questions/3900701/onclick-go-full-screen?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
function toggleFullscreen() {
  if ((document.fullScreenElement && document.fullScreenElement !== null) ||    
   (!document.mozFullScreen && !document.webkitIsFullScreen)) {
    if (document.documentElement.requestFullScreen) {  
      document.documentElement.requestFullScreen();  
    } else if (document.documentElement.mozRequestFullScreen) {  
      document.documentElement.mozRequestFullScreen();  
    } else if (document.documentElement.webkitRequestFullScreen) {  
      document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);  
    }  
  } else {  
    if (document.cancelFullScreen) {  
      document.cancelFullScreen();  
    } else if (document.mozCancelFullScreen) {  
      document.mozCancelFullScreen();  
    } else if (document.webkitCancelFullScreen) {  
      document.webkitCancelFullScreen();  
    }  
  }  
}

function calc() {

  let N = parseInt(document.getElementById("NInput").value);
  let m = parseInt(document.getElementById("mInput").value);
  let n = parseInt(document.getElementById("nInput").value);
  let k = parseInt(document.getElementById("kInput").value);


  console.log("Calculating... Inputs: " + N + ", " + m + ", " + n + ", " + k);

  let errorP = document.getElementById("errorP");
  let errorAlert = document.getElementById("errorAlert");

  errorP.innerHTML = "";
  errorAlert.style.display = "none";

  if(isNaN(N) || isNaN(m) || isNaN(n) || isNaN(k) ) {
    errorP.innerHTML = "N, m, n, and k must be numbers";
    errorAlert.style.display = "block";
    return;
  }
  if(N <= 0 || m <= 0 || n <= 0 || k <= 0) {
    errorP.innerHTML = "n and x cannot be less than 0";
    errorAlert.style.display = "block";
    return;
  }
  if(N >= 1000 || m >= 1000 || n >= 1000 || k >= 1000) {
    errorP.innerHTML = "n and x must be less than 1000";
    errorAlert.style.display = "block";
    return;
  }
  if(N < m) {
    errorP.innerHTML = "N must be &ge; m";
    errorAlert.style.display = "block";
    return;
  }
  if(n < k) {
    errorP.innerHTML = "n must be &ge; k";
    errorAlert.style.display = "block";
    return;
  }

  //TODO: check for whole numbers

  //only if valid inputs
  history.replaceState({}, "", "?N=" + N + "&m=" + m + "&n=" + n + "&k=" + k);

  //display results

  // document.getElementById("chooseOutput").value = Math.round(nchoosek(n, x));
  document.getElementById("equalOutput").value = round(equal(N, m, n, k),10);
  document.getElementById("lessOutput").value = round(less(N, m, n, k),10);
  document.getElementById("greaterOutput").value = round(greater(N, m, n, k),10);
  document.getElementById("lessEqualOutput").value = round(equal(N, m, n, k) + less(N, m, n, k),10);
  document.getElementById("greaterEqualOutput").value = round(equal(N, m, n, k) + greater(N, m, n, k),10);
  // document.getElementById("infoP").innerHTML = "Mean (&mu;) = " + round(mean(p, n, x),10) + "<br>Variance (&sigma;) = " + round(variance(p, n, x),10) + "<br>  Standard Deviation (&sigma;<sup>2</sup>) = " + round(stddev(p, n, x),10);

  document.getElementById("demoP").innerHTML = "<b>Example</b>: A deck of <b>" + N + "</b> (N) cards has <b>" + m + "</b> (m) red cards. If we draw <b>" + n + "</b> (n) cards, what are the odds <i>exactly</i> <b>" + k + "</b> (k) of them will be red";

  //google charts
  google.charts.load('current', {'packages':['corechart','bar']});
  google.charts.setOnLoadCallback(drawChart);

  function drawChart() {
    //pie
    let data = google.visualization.arrayToDataTable([
      ['Set', 'Odds'],
      ['P(X=k)', round(equal(N, m, n, k),5)],
      ['P(X<k)', round(less(N, m, n, k),5)],
      ['P(X>k)', round(greater(N, m, n, k),5)]
    ]);

    let options = {
      'title':'Picking Without Replacement Probability Distribution', 
      legend: {textStyle:{color: night ? '#ccc' : '#333'}}, 
      titleTextStyle:{color: night ? '#ccc' : '#333'}, 
      'width':'75%', 
      colors: ['#339', '#933', '#393'], 
      backgroundColor: { fill:'transparent' }
    };

    let chart = new google.visualization.PieChart(document.getElementById('piechart') );
    chart.draw(data, options);

    //bar
    let chartdata = [['','', { role: 'style' } ]];
    for(let i = 0; i<n+1; i++) {
      let color = "#933";
      if(i==k) {color="#339";}
      if(i>k) {color="#393";}
      chartdata.push([i, equal(N, m, n, i), color]);
    }

    data = google.visualization.arrayToDataTable(chartdata);

    options = {
      title: 'Odds by number of distinct items picked (k)', 
      titleTextStyle:{color: night ? '#ccc' : '#333'},
      legend: 'none',
      chartArea: {width: '75%', legend:{position: 'none'} },
      hAxis: {
        title: 'Number of Distinct Items (k)',
        textStyle:{color: night ? '#ccc' : '#333'},
        titleTextStyle:{color: night ? '#ccc' : '#333'}
      },
      vAxis: {
        title: 'P(X=k)',
        textStyle:{color: night ? '#ccc' : '#333'},
        titleTextStyle:{color: night ? '#ccc' : '#333'}
      },
      backgroundColor: { fill:'transparent' }
    };
  
    chart = new google.visualization.ColumnChart(document.getElementById('barchart') );
    chart.draw(data, options);
  } //end drawChart

} //end calc

let night = false;


$(document).ready(function() {

  let url = new URL(window.location.href);
  let N = url.searchParams.get("N");
  let m = url.searchParams.get("m");
  let n = url.searchParams.get("n");
  let k = url.searchParams.get("k");
  console.log("loaded: " + N + ", " + m + ", " + n + ", " + k);
  document.getElementById("NInput").value = N || "60"; //TODO: edit default values
  document.getElementById("mInput").value = m || "22";
  document.getElementById("nInput").value = n || "16";
  document.getElementById("kInput").value = k || "10";

  console.log(document.getElementById("NInput").value);
  console.log(document.getElementById("mInput").value);
  console.log(document.getElementById("nInput").value);
  console.log(document.getElementById("kInput").value);

  document.getElementById("NInput").select();

  calc();

  //copy buttons
  $('button.copy').click(function() {
    let input = $(this).prev('input'); //select adjacent input
    input.prop('disabled',false); //.attr and .disabled didn't work...
    input.select();
    document.execCommand('copy');
    input.prop('disabled',true);
  });

  $('#clearButton').click(function() { //setting onclick in html didn't work for some reason...
    clear();
  });

  $('#fullscreenButton').click(function() {
    toggleFullscreen();
  });

  $('#nightButton').click(function() {
    night = !night;
    if(night) {
      $('#nightStyles').prop('href','styles-night.css');
      $('#metaColor1').prop('content','#333');
      $('#metaColor2').prop('content','#333');
      $('#metaColor3').prop('content','#333');
      calc(); //update google chart with correct color. when your night mode function is O(n^3)...
    }
    else {
      $('#nightStyles').prop('href','');
      $('#metaColor1').prop('content','#ccc');
      $('#metaColor2').prop('content','#ccc');
      $('#metaColor3').prop('content','#ccc');
      calc();
    }
  });

});
