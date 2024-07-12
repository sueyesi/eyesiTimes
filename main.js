
const API_KEY = `a0670f6b80de4550a0eae589c6cef48e`;
let newsList = [];
const menus = document.querySelectorAll(".menus button");//버튼을 가져온다
const searchInput = document.getElementById("searchInput");
//console.log("eee",menus)
menus.forEach(menu=>menu.addEventListener("click",(event)=>getNewsCategory(event)));
let url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines`);
//let url = new URL( `https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`); 

//리펙토링
const getNews = async() =>{
    try{
        const response = await fetch(url); // await  fetch함수가 완료될 때까지 기다려준다    
        console.log("rrr", response);    
        const data = await response.json();// json파일형식
        if(response.status===200){
            if(data.articles.length === 0){
                throw new Error("No result for this search")
            } 
            newsList = data.articles;
            render();
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
getLatestNews();
// 삼항조건연산자 A ? B : C (A는 참이면 B 거짓이면 C를 실행)
////news.description.length > 0 조건을 사용하여 description이 비어있지 않은 경우에는 말줄임 표시, 비어있는 경우에는 내용없음 표시
//URL 관련문서 https://developer.mozilla.org/en-US/docs/Web/API/URL
//await  비동기 함수 내에서 사용되며, 해당 함수가 완료될 때까지 기다리도록 하는 역할을 한다.