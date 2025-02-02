//                                                                                              variables declarations 
//inputs
let title = document.getElementById("title");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let count = document.getElementById("count");
let category = document.getElementById("category");
let search = document.getElementById("search");
let searchMood = "Title";

//errors handling 
let titleError = document.getElementById("titleErrorMsg");
let priceError = document.getElementById("priceErrorMsg");
let countError = document.getElementById("countErrorMsg");
let categoryError = document.getElementById("categoryErrorMsg");

//buttons
let createBtn = document.getElementById("create");
let searchByTitleBtn = document.getElementById("searchByTitle");
let searchByCategoryBtn = document.getElementById("searchByCategory");

//outputs
let total = document.getElementById("total");
let rowNum =0;
let iteamNum = 0;

//get rowNum
if (localStorage.getItem("rowNum"))
    rowNum= localStorage.getItem("rowNum");
    
//get iteamNum
if (localStorage.getItem("iteamNum"))
    iteamNum= localStorage.getItem("iteamNum");
    

showTableContent();
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------  

//                                                                                              Functions Declarations
// get all products from localStorge
function showTableContent(){
    for(let i=1 , iteamNum=1 ; i<=localStorage.getItem("rowNum") ; i++ , iteamNum++){
        //retreive all products
        if (localStorage.getItem("product-"+iteamNum)){
            let product = JSON.parse(localStorage.getItem("product-"+iteamNum));
            docElementsObj(iteamNum,i,product);
        }
        else
            i-=1;
    }
};
//elements reuseability
function docElementsObj (iteamNum ,row_id , parent){
     //table elements
        let obj = {
                "tableBody" : document.getElementById("table-body"),
                "row" : document.createElement("tr"),
                "idCell" : document.createElement("td"),
                "titleCell" : document.createElement("td"),
                "priceCell" : document.createElement("td"),
                "taxeCell" : document.createElement("td"),
                "adsCell" : document.createElement("td"),
                "discountCell" : document.createElement("td"),
                "categoryCell" : document.createElement("td"),
                "totalCell" : document.createElement("td"),
                "countCell" : document.createElement("td"),
                "updateBtnCell" : document.createElement("td"),
                "deleteBtnCell" : document.createElement("td"),
                "updateBtn" : document.createElement("button"),
                "deleteBtn" : document.createElement("button"),
        };

        
        obj.updateBtn.innerHTML = "Update";
        obj.deleteBtn.innerHTML = "Delete";
        obj.updateBtnCell.appendChild(obj.updateBtn);
        obj.deleteBtnCell.appendChild(obj.deleteBtn);
        
        // assign values to each cell
        obj.idCell.innerHTML = row_id;
        obj.titleCell.innerHTML = parent.title;   
        obj.priceCell.innerHTML = parent.price;   
        obj.taxeCell.innerHTML = parent.taxes;   
        obj.adsCell.innerHTML = parent.ads;   
        obj.discountCell.innerHTML = parent.discount!='' ? parent.discount + " %" : "No discount";   
        obj.categoryCell.innerHTML = parent.category; 
        obj.countCell.innerHTML = parent.count;  
        obj.totalCell.innerHTML = parent.total+ " $";
        
        // add cells to row 
        obj.row.appendChild(obj.idCell);
        obj.row.appendChild(obj.titleCell);
        obj.row.appendChild(obj.priceCell);
        obj.row.appendChild(obj.taxeCell);
        obj.row.appendChild(obj.adsCell);
        obj.row.appendChild(obj.discountCell);
        obj.row.appendChild(obj.totalCell);
        obj.row.appendChild(obj.categoryCell);
        obj.row.appendChild(obj.countCell);
        obj.row.appendChild(obj.updateBtnCell);
        obj.row.appendChild(obj.deleteBtnCell);
        //add row to table
        obj.tableBody.appendChild(obj.row);
        
        // Adding onclick event for the update button
        obj.updateBtn.onclick = function() {
            titleError.style.display= "none";
            priceError.style.display= "none";
            countError.style.display= "none";
            categoryError.style.display= "none";
            let product = JSON.parse(localStorage.getItem(`product-${iteamNum}`));
            title.value = product.title;
            price.value = product.price;
            taxes.value = product.taxes;
            ads.value = product.ads;
            discount.value = product.discount;
            count.value = product.count;   
            category.value = product.category; 
            total.value = product.total!='' ? "Total : " + product.total :"Total : ";
            createBtn.innerHTML = "Update";
            sessionStorage.setItem("iteamToUpdate",iteamNum);
        };
        
        // Adding onclick event for the delete button
        obj.deleteBtn.onclick = function() {
            // if count >1 
            let product = JSON.parse(localStorage.getItem(`product-${iteamNum}`));
            if (product.count>1){
                product.count-=1;
                localStorage.setItem(`product-${iteamNum}`,JSON.stringify(product));
                clearTableContent();
                showTableContent();
            }
            else // count = 1 delete entire row and objet
            {
                localStorage.removeItem(`product-${iteamNum}`);
                rowNum-=1;
                localStorage.setItem("rowNum",rowNum);
                clearTableContent();
                showTableContent();
            }
        };
        return obj;
};

function clearTableContent(){
    // Assume you have a table with the id 'myTable'
    let table = document.getElementById('table-body');
    let rowCount = table.rows.length;
    for (let i = rowCount - 1; i >= 0; i--) {
        table.deleteRow(i);
    }
}
function clearAllInputs(){
    title.value = "";
    price.value = "";
    taxes.value = "";
    ads.value = "";
    discount.value = "";
    count.value = "";
    category.value = "";
    total.value = "";
}
function getTotal(){
    
    if(price.value!=''){
        total.value = "Total : "+ (Number(price.value) + Number(taxes.value) + Number(ads.value) - (Number(price.value) * Number(discount.value) / 100)) ;
    }
    else 
    {
        total.value = "Total : ";
    }
}
function searchIteam(id){
    if (id == "searchByTitle")
        searchMood = "Title";
    else 
        searchMood = "Category";
    search.placeholder = "Search By " + searchMood ; 
    search.focus();
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------  
//                                                                                              Events handeling
//create clik event 
createBtn.addEventListener("click", function(){
    if (title.value)
    {
        titleError.style.display= "none";
        if(createBtn.innerHTML == "Update")
        {
            let product = JSON.parse(localStorage.getItem(`product-${sessionStorage.getItem("iteamToUpdate")}`));
            product.title = title.value.toLowerCase();
            product.price = price.value;
            product.taxes = taxes.value =="" ? "No taxes" : taxes.value;
            product.ads = ads.value =="" ? "No ads" : ads.value;
            product.discount = discount.value;
            product.count = count.value;
            product.category = category.value.toLowerCase();
            product.total = ((total.value).split(":")[1]).trim();
    
            localStorage.setItem(`product-${sessionStorage.getItem("iteamToUpdate")}`,JSON.stringify(product));
            sessionStorage.removeItem("iteamToUpdate");
            clearTableContent();
            showTableContent();
            createBtn.innerHTML = "Create";
            clearAllInputs();
        }
        else 
        {  
                if (price.value=="")
                    priceError.style.display= "block";
                else if (count.value=="")
                {
                    priceError.style.display= "none";
                    countError.style.display= "block";
                }
                else if (category.value=="")
                {
                    priceError.style.display= "none";
                    countError.style.display= "none";
                    categoryError.style.display= "block";
                }
                else
                {
                    priceError.style.display= "none";
                    countError.style.display= "none";
                    categoryError.style.display= "none";
                    rowNum++;
                    iteamNum++;
                    let product ={
                            "title" : title.value.toLowerCase(),
                            "price": price.value,
                            "taxes" :taxes.value =="" ? "No taxes" : taxes.value,
                            "ads" :ads.value =="" ? "No ads" : ads.value,
                            "discount":discount.value,
                            "count" :count.value,
                            "category" :category.value.toLowerCase(),
                            "total" :((total.value).split(":")[1]).trim()
                        };
                
                    docElementsObj(iteamNum,rowNum,product);
                    clearAllInputs();
                    localStorage.setItem("product-" + iteamNum, JSON.stringify(product));
                    localStorage.setItem("rowNum",rowNum);
                    localStorage.setItem("iteamNum",iteamNum);
                }

        }
    }
    else 
    {
        titleError.style.display= "block";
    }
});

search.onkeyup = () => {    
    clearTableContent();
    if (searchMood == "Title")
    {
        for(let i =1 , iteam=1 ; i<=rowNum; i++ , iteam++){
        
            //retreive all products
            if (localStorage.getItem("product-"+iteam))
            {
                let product = JSON.parse(localStorage.getItem("product-"+iteam));
                if (product.title.includes(search.value.toLowerCase()) )
                {
                    docElementsObj(iteam,i,product);
                };
            }
            else 
                i-=1;
        };
    }
    else
    {
        for(let i =1 , iteam=1 ; i<=rowNum; i++ , iteam++){
        
            //retreive all products
            if (localStorage.getItem("product-"+iteam))
            {
                let product = JSON.parse(localStorage.getItem("product-"+iteam));
                if (product.category.includes(search.value.toLowerCase()) )
                {
                    docElementsObj(iteam,i,product);
                };
            }
            else 
                i-=1;
        };
    }
}