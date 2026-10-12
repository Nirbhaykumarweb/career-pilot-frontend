function toggleTheme(){document.body.classList.toggle("light");}
function demoLogin(){alert("Demo login: connect this form to your backend/API for real authentication.");}
function demoRegister(){alert("Demo account created. Connect this form to your backend/API to store users."); return false;}
let q=1,seconds=82;
function nextQuestion(){q=Math.min(q+1,5);document.getElementById("qno").textContent=q+"/5";document.querySelector(".question h3").textContent=["To start, could you briefly introduce yourself and walk me through your technical background?","Explain one project you are most proud of.","What is the difference between a process and a thread?","How would you optimize a slow database query?","Do you have any questions for me?"][q-1];}
function endInterview(){alert("Demo interview ended. Your report would appear here in the production version.");}
setInterval(()=>{if(document.getElementById("timer")){seconds=Math.max(0,seconds-1);let m=String(Math.floor(seconds/60)).padStart(2,"0"),s=String(seconds%60).padStart(2,"0");document.getElementById("timer").textContent=m+":"+s;document.getElementById("sideTimer").textContent=m+":"+s;}},1000);
