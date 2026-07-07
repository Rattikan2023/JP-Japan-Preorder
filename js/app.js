
const WEB_APP_URL =
"https://script.google.com/macros/s/AKfycbxnro942m07UwTLfAn9aSG05-UwADOzBJtuOazGunKGWpmCEJjpDuvNUA9-HYkHPxfzFA/exec";

const CUSTOMER_ID = "guest";


// ตรวจสอบว่าเป็นมือถือหรือไม่

function detectMobile(){

    document.body.classList.add("mobile");

}


let products=[];

window.onload = function() {

  detectMobile();

  loadProducts();

  loadCartCount();

};

async function loadProducts(){

    document.getElementById("loading").style.display="block";
    document.getElementById("productGrid").innerHTML="";

    try{

        const res = await fetch(
            WEB_APP_URL + "?action=products"
        );

        products = await res.json();

        renderProducts(products);

    }catch(err){

        console.error(err);

        alert("โหลดสินค้าไม่สำเร็จ");

    }

    document.getElementById("loading").style.display="none";

}

function renderProducts(list){

  const grid=document.getElementById("productGrid");

        grid.innerHTML="";

   if(list.length===0){

        grid.innerHTML="<h3>ไม่พบสินค้า</h3>";
    return;

  }

  list.forEach(function(item){

    const image=item.image||"";

    const html=`

      <div class="card">

        <img src="${image}" loading="lazy">

        <div class="body">

          <div class="title">

            ${item.productName}

          </div>

          <div class="price">

           ฿ ${Number(item.sellingPrice).toLocaleString("th-TH")}

          </div>


          <div class="info">

            Stock :
            ${item.stock}

          </div>


          <div class="actions">

            <input
              id="qty_${item.productId}"
              type="number"
              value="1"
              min="1">

            <button
              onclick="addProduct('${item.productId}')">

              เพิ่มลงตะกร้า

            </button>

          </div>

        </div>

      </div>

    `;

    grid.insertAdjacentHTML(
      "beforeend",
      html
    );

  });

}

function searchProducts(){

  const keyword=document
    .getElementById("searchBox")
    .value
    .trim()
    .toLowerCase();

  if(keyword===""){

    renderProducts(products);
    return;

  }

  const result = products.filter(function(item){

  return (
    String(item.productId || "")
      .toLowerCase()
      .includes(keyword)

    ||

    String(item.productName || "")
      .toLowerCase()
      .includes(keyword)

    ||

    String(item.categoryName || "")
      .toLowerCase()
      .includes(keyword)
  );

});

  renderProducts(result);

}

async function addProduct(productId){

    const qtyInput = document.getElementById("qty_" + productId);

    let qty = 1;

    if(qtyInput){

        qty = parseInt(qtyInput.value,10);

        if(isNaN(qty) || qty < 1){
            qty = 1;
        }

    }

    try{

        const res = await fetch(

            WEB_APP_URL +
            "?action=addCart" +
            "&customerId=" + CUSTOMER_ID +
            "&productId=" + productId +
            "&qty=" + qty

        );

        const data = await res.json();

        if(data.success){

            alert("เพิ่มสินค้าลงตะกร้าเรียบร้อย");

            loadCartCount();

        }else{

            alert(data.message);

        }

    }catch(err){

        console.error(err);

        alert("เกิดข้อผิดพลาด");

    }

}

function reloadProducts(){

  loadProducts();

}

async function loadCartCount(){

    try{

        const res = await fetch(

            WEB_APP_URL +
            "?action=cart" +
            "&customerId=" + CUSTOMER_ID

        );

        const items = await res.json();

        let total = 0;

        items.forEach(function(item){

            total += Number(item.qty);

        });

        document.getElementById("cartCount").innerText = total;

    }catch(err){

        console.error(err);

    }

}


function openCart() {

  window.top.location.href =
    WEB_APP_URL + "?page=cart";

}
