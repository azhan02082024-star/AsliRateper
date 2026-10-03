let role='user'; let cart=[]; let orders=[]; 
let products=[
{name:'iPhone 15 Timergara',price:285000,old:300000,cat:'Mobile'},
{name:'Jacket Warm Dir',price:4500,old:6000,cat:'Kapre'},
{name:'LED 32 inch',price:32000,old:40000,cat:'Electronics'},
{name:'Shoes Peshawari',price:3500,old:5000,cat:'Shoes'}
];
let selProducts=JSON.parse(localStorage.getItem('selPros')||'[]');
if(selProducts.length) products=products.concat(selProducts);

function setRole(r){
 role=r;
 document.body.className=r+'-theme';
 document.getElementById('appRoot').className='app '+r+'-theme';
 document.getElementById('userBtn').className=r=='user'?'on':'';
 document.getElementById('sellerBtn').className=r=='seller'?'on':'';
 document.getElementById('modeText').innerText=r=='user'?'User Active ✓ - Blue':'Seller Active ✓ - Orange';
 localStorage.setItem('asli_role',r);
 render();
}

function render(){
 let q=document.getElementById('searchInput')?document.getElementById('searchInput').value.toLowerCase():'';
 let grid=document.getElementById('productGrid'); if(!grid) return;
 let filtered=products.filter(p=>p.name.toLowerCase().includes(q));
 grid.innerHTML=filtered.map((p,i)=>`
 <div class="product">
 <div style="background:#f2f2f2;height:100px;border-radius:8px;display:flex;align-items:center;justify-content:center">🖼️</div>
 <b>${p.name}</b><br>
 <span class="price">Rs ${p.price.toLocaleString()}</span> <span class="old">${p.old? 'Rs '+p.old.toLocaleString():''}</span><br>
 <small>${p.cat||'General'}</small>
 <button onclick="addToCart(${products.indexOf(p)})">Add to Cart</button>
 ${role=='seller'? `<button onclick="delPro(${products.indexOf(p)})" style="background:#444;margin-top:4px">Delete</button>`:''}
 </div>`).join('');
}

function addToCart(idx){
 cart.push(products[idx]);
 document.getElementById('cartCount').innerText=cart.length;
 localStorage.setItem('cart',JSON.stringify(cart));
 alert('Cart me add ho gaya!');
}

function doSearch(){ render(); }

function showHome(){
 document.getElementById('homeView').style.display='block';
 document.getElementById('otherView').style.display='none';
 render();
}

function openPage(p){
 let h=document.getElementById('homeView'); let o=document.getElementById('otherView');
 h.style.display='none'; o.style.display='block';
 if(p=='cart'){
  o.innerHTML=`<div class="card2"><h3>🛒 Cart (${cart.length})</h3>${cart.map(c=>`<div style="padding:8px;border-bottom:1px solid #eee">${c.name} - Rs ${c.price}</div>`).join('')||'<p>Empty</p>'}<br><button onclick="checkout()">Checkout - Cash on Delivery</button><br><br><button onclick="showHome()">Back Home</button></div>`;
 }
 if(p=='orders'){
  let saved=JSON.parse(localStorage.getItem('orders')||'[]');
  o.innerHTML=`<div class="card2"><h3>📦 My Orders</h3>${saved.map(or=>`<div style="padding:8px;border-bottom:1px solid #eee">Order #${or.id} - Rs ${or.total}<br><small>${or.date}</small></div>`).join('')||'<p>Koi order nahi</p>'}<br><button onclick="showHome()">Back</button></div>`;
 }
 if(p=='profile'){
  o.innerHTML=`<div class="card2"><h3>👤 Profile</h3><p>Name: Azhan</p><p>City: Timergara Dir Lower</p><p>Role: ${role}</p><br><button onclick="showHome()">Back Home</button></div>`;
 }
 if(p=='seller'){
  o.innerHTML=`
  <div class="card2"><h3>🏪 Seller Dashboard - Orange Theme</h3>
  <p>Add New Product:</p>
  <input id="pName" placeholder="Product Name e.g. Watch">
  <input id="pPrice" type="number" placeholder="Price e.g. 2500">
  <input id="pOld" type="number" placeholder="Old Price">
  <input id="pCat" placeholder="Category e.g. Mobile">
  <button onclick="addProduct()">+ Product Add Karo</button>
  <br><br><h4>My Products (${products.length})</h4>
  <div>${products.map((pr,i)=>`<div style="padding:6px;border-bottom:1px solid #eee;display:flex;justify-content:space-between"><span>${pr.name}</span><span onclick="delPro(${i})" style="color:red">❌</span></div>`).join('')}</div>
  <br><button onclick="showHome()">Back Home</button>
  </div>`;
 }
}

function addProduct(){
 let n=document.getElementById('pName').value;
 let pr=parseInt(document.getElementById('pPrice').value)||0;
 let old=parseInt(document.getElementById('pOld').value)||0;
 let cat=document.getElementById('pCat').value;
 if(!n||!pr){ alert('Name aur Price likho'); return;}
 products.push({name:n,price:pr,old:old,cat:cat});
 localStorage.setItem('selPros',JSON.stringify(products.slice(4)));
 alert('Product Add ho gaya!'); render(); openPage('seller');
}

function delPro(i){
 if(i<4){ alert('Default product delete nahi hota'); return;}
 products.splice(i,1);
 localStorage.setItem('selPros',JSON.stringify(products.slice(4)));
 render(); openPage('seller');
}

function checkout(){
 if(!cart.length){ alert('Cart khali hai'); return;}
 let total=cart.reduce((s,c)=>s+c.price,0);
 let ords=JSON.parse(localStorage.getItem('orders')||'[]');
 ords.push({id:Date.now().toString().slice(-6),total:total,date:new Date().toLocaleString(),items:cart});
 localStorage.setItem('orders',JSON.stringify(ords));
 cart=[]; localStorage.setItem('cart','[]'); document.getElementById('cartCount').innerText='0';
 alert('Order Ho Gaya! Total Rs '+total+' - Cash on Delivery');
 showHome();
}

let savedRole=localStorage.getItem('asli_role')||'user';
let savedCart=JSON.parse(localStorage.getItem('cart')||'[]'); cart=savedCart;
setTimeout(()=>{ document.getElementById('cartCount').innerText=cart.length; setRole(savedRole); },200);
