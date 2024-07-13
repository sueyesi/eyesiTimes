
const API_KEY = `a0670f6b80de4550a0eae589c6cef48e`;
let newsList = [];
const menus = document.querySelectorAll(".menus button");//버튼을 가져온다
const searchInput = document.getElementById("searchInput");
//console.log("eee",menus)
menus.forEach(menu=>menu.addEventListener("click",(event)=>getNewsCategory(event)));
let url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines`);
//let url = new URL( `https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`); 
let totalResults = 0;
let page = 1;
const pageSize = 10;
const groupSize = 5;

//리펙토링
const getNews = async() =>{
    try{
        //url호출 전에 페이지 쿼리 추가
        url.searchParams.set("page", page);// => &page=page         
        url.searchParams.set("pageSize", pageSize); 

        const response = await fetch(url); // await  fetch함수가 완료될 때까지 기다려준다
        //console.log("rrr", response);    
        const data = await response.json();// json파일형식
        if(response.status===200){
            if(data.articles.length === 0){
                throw new Error("No result for this search");                 
            } 
            newsList = data.articles;
            totalResults = data.totalResults;
            render(); 
            paginationRender();           
        }else{
            throw new Error(data.message);
        }       
        
    }catch(error){        
        errorRender(error.message);
    }    
};

//뉴스를 가져오는 함수 설정
async function getLatestNews() {
    //url = new URL( `https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`); 
    url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines`);
    await getNews();    
}
//category
const getNewsCategory = async(event) => {
    //console.log("category");   
    const category = event.target.textContent.toLowerCase();    
    //url = new URL( `https://newsapi.org/v2/top-headlines?country=kr&category=${category}&apiKey=${API_KEY}`); 
    url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?category=${category}`);      
    await getNews();
    moveToPage(1);  
}
//keyword
const getNewsByKeyword=async()=>{    
    const keyword = document.getElementById("searchInput").value;
    //console.log("keyword", keyword)
    //url = new URL( `https://newsapi.org/v2/top-headlines?country=kr&q=${keyword}&apiKey=${API_KEY}`); 
    url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?q=${keyword}`); 
    let searchValue = searchInput.value;
    if(searchValue == ''){
        alert("키워드가 입력되지 않았습니다.");
        return;
    }
    await getNews();
    searchInput.value = '';    
}
//enter키로 입력
searchInput.addEventListener('keypress', function(event) {        
    if (event.key === 'Enter') {
        searchButton.click();
    }    
});
//뉴스그리기
const render =()=>{
    const newsHTML = newsList.map(news=>`
        <div class="row news">
                <div class="col-lg-4 imgArea">
                    <img class="newsImgSize" src=${news.urlToImage || '../images/noImage.png'}  onError="this.src='../images/noImage.png'" />
                </div>
                <div  class="col-lg-8">
                    <dl>
                        <dt>${news.title}</dt>                        
                        <dd>${news.description ? (news.description.length > 200 ? news.description.slice(0, 200) + '...' : news.description) : '내용없습니다'}</dd>
                        <dd class="source">                        
                        ${news.source ? `<span>${news.source.name}</span>` : '<span>출처가 없습니다.</span>'}
                        <span class="date">
                        ${moment(news.publishedAt).format()};
                        </span>
                        </dd>
                    </dl>
                </div>
            </div>
        `)
        .join("");
        //console.log("html", newsHTML)
    document.getElementById("newsBoard").innerHTML = newsHTML;
}
//에러메세지
const errorRender = (errorMessage) =>{
    const errorHtml =`<div class="alert alert-danger" role="alert">
    ${errorMessage}
    </div>`;
    document.getElementById("newsBoard").innerHTML = errorHtml
};
//Menu
let openNav = () =>{
    document.getElementById("mySidenav").style.width = "50%";  
}
let closeNav = () =>{
    document.getElementById("mySidenav").style.width = "0";
} 
let searchOpen = () =>{    
    document.getElementById("searchArea").style.width = "80%";
    document.getElementById("searchArea").style.opacity = "1";
}

//페이지네이션
const paginationRender= ()=>{
    //totalResult 
    //page
    //pageSizeg    
    //groupSize
    //totalPages
    const totalPages = Math.ceil(totalResults / pageSize);//올림
    //pageGroup
    const pageGroup = Math.ceil(page / groupSize);//올림
    //lastPage
    let lastPage = pageGroup * groupSize;
    //마지막 그룹이 그룹사이즈보다 작을경우 lastpage = totalpage
    if(lastPage > totalPages){
        lastPage = totalPages;
    }
    //firstPage
    let firstPage = lastPage - (groupSize - 1) <= 0? 1 : lastPage - (groupSize - 1); 
    let paginationHTML=``;

    if (page > 1){ 
        paginationHTML = `
        <li class="page-item" onclick="moveToPage(1)"><a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true"><i class="fa-solid fa-angles-left"></i></span></a></li>
        <li class="page-item" onclick="moveToPage(${page-1})"><a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true"><i class="fa-solid fa-angle-left"></i></span></a></li>`
    }  
   
    for(let i=firstPage;i<=lastPage;i++){
        paginationHTML += `<li class="page-item ${i===page?'active':''}" onclick="moveToPage(${i})"><a class="page-link" >${i}</a></li>`
    }
    if(page < totalPages){
        paginationHTML+=`
        <li class="page-item" onclick="moveToPage(${page+1})"><a class="page-link" href="#" aria-label="Next"><span aria-hidden="true"<i class="fa-solid fa-angle-right"></i></span></a></li>
        <li class="page-item" onclick="moveToPage(${totalPages})"><a class="page-link" href="#" aria-label="Next"><span aria-hidden="true"><i class="fa-solid fa-angles-right"></i></span></a></li>
        `
    }    
    document.querySelector(".pagination").innerHTML = paginationHTML;  
};
//page클릭시 URL호출
const moveToPage = async (pageNum) => {
    //console.log("m",pageNum);
    page = pageNum;
    await getNews();
    scrollToTop();
}
function scrollToTop() {
    document.body.scrollTop = 0; // 페이지의 스크롤을 맨 위로 이동
    document.documentElement.scrollTop = 0;
}
//스크롤 위치
// topBtn과 downBtn 요소를 가져옵니다.
const topBtn = document.getElementById("topBtn");
const downBtn = document.getElementById("downBtn");
scrollFunction = ()=>{
    if (document.body.scrollTop > 30 || document.documentElement.scrollTop > 30) {
        topBtn.style.display = "block";
        downBtn.style.display = "block";
    } else {
        topBtn.style.display = "none";
        downBtn.style.display = "none";
    }
}
// 스크롤 이벤트가 발생할 때 scrollFunction 함수를 호출
window.onscroll = () => {
    scrollFunction();
};
getLatestNews();
scrollToTop();

// 삼항조건연산자 A ? B : C (A는 참이면 B 거짓이면 C를 실행)
////news.description.length > 0 조건을 사용하여 description이 비어있지 않은 경우에는 말줄임 표시, 비어있는 경우에는 내용없음 표시
//URL 관련문서 https://developer.mozilla.org/en-US/docs/Web/API/URL
//await  비동기 함수 내에서 사용되며, 해당 함수가 완료될 때까지 기다리도록 하는 역할을 한다.
/* pagination




pageGrop(내가속한페이지그룹) = 내가 현재 보고있는 페이지 / 그룹사이즈

- totalResults = 주어지는 값
- pageSize = 정하는값
- page = 정하는값
- groupSize = 정하는값(몇개씩 보여줄건지)
구해야하는값
- totalPage = (totalResults / pageSize) 반올림해준다. math.ceil()
math.ceil() 함수는 주로 소수점 이하를 올림하여 다음 정수로 반올림하는 경우에 사용
- pageGroup = (page/groupSize) math.ceil() 반올림

마지막페이지값 = pageGroup * groupSize
첫번째페이지 = 마지막 - (groupSize-1)


*/
