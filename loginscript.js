const password=document.getElementById('password');
const toggle=document.getElementById('togglePassword');
toggle.addEventListener('click',()=>{password.type=password.type==='password'?'text':'password';toggle.textContent=password.type==='password'?'◉':'○'});
document.getElementById('loginForm').addEventListener('submit',e=>{e.preventDefault();alert('Login form is ready. Connect your backend/API here.');});