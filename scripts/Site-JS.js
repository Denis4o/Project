const kinveyBaseUrl = "https://baas.kinvey.com/";
const kinveyAppKey = "kid_rk6TU0A9";
const kinveyAppSecret = "844676adc69f447a8366f22e99ae6b10";

function showView(viewName) {
    $('main > div > section').hide();
    $('#' + viewName).show();
}

function showHideMenuLinks() {
    $("#linkHome").show();
    $("#linkHomeF").show();
    if (sessionStorage.getItem('authToken') == null){
        $("#linkLogin").show();
        $("#linkRegister").show();
        $("#linkCars").show();
        $("#linkParts").show();
        $("#linkTires").show();
        $("#linkListPosts").hide();
        $("#linkCreatePost").hide();
        $("#linkContact").show();
        $("#linkLogout").hide();

        $("#linkLoginF").show();
        $("#linkRegisterF").show();
        $("#linkCarsF").show();
        $("#linkPartsF").show();
        $("#linkTiresF").show();
        $("#linkListPostsF").hide();
        $("#linkCreatePostF").hide();
        $("#linkContactF").show();
        $("#linkLogoutF").hide();
        
    }
    else
    {
        $("#linkLogin").hide();
        $("#linkRegister").hide();
        $("#linkCars").show();
        $("#linkParts").show();
        $("#linkTires").show();
        $("#linkListPosts").show();
        $("#linkCreatePost").show();
        $("#linkContact").show();
        $("#linkLogout").show();

        $("#linkLoginF").hide();
        $("#linkRegisterF").hide();
        $("#linkCarsF").show();
        $("#linkPartsF").show();
        $("#linkTiresF").show();
        $("#linkListPostsF").show();
        $("#linkCreatePostF").show();
        $("#linkContactF").show();
        $("#linkLogoutF").show();
    }
}

function showInfo(message) {
    $('#infoBox').text(message);
    $('#infoBox').show();

}

function showError(errorMsg) {
    $('#errorBox').text("Error: " + errorMsg);
    $('#errorBox').show();
}

$(function() {
    showHideMenuLinks();
    showView('viewHome');

    $("#linkHome").click(showHomeView);
    $("#linkLogin").click(showLoginView);
    $("#linkRegister").click(showRegisterView);
    $("#linkCars").click(showCarsView);
    $("#linkParts").click(showPartsView);
    $("#linkTires").click(showTiresView);
    $("#linkContact").click(showContactView);
    $("#linkListPosts").click(listPosts);
    $("#linkCreatePost").click(showCreatePostView);
    $("#linkLogout").click(logout);

    $("#linkHomeF").click(showHomeView);
    $("#linkLoginF").click(showLoginView);
    $("#linkRegisterF").click(showRegisterView);
    $("#linkCarsF").click(showCarsView);
    $("#linkPartsF").click(showPartsView);
    $("#linkTiresF").click(showTiresView);
    $("#linkContactF").click(showContactView);
    $("#linkListPostsF").click(listPosts);
    $("#linkCreatePostF").click(showCreatePostView);
    $("#linkLogoutF").click(logout);

    $("#carsLink").click(showCarsView);
    $("#partsLink").click(showPartsView);
    $("#tiresLink").click(showTiresView);

    $(".moreInfo").click(showContactView);

    $("#formLogin").submit(function(e) {e.preventDefault(); login(); });
    $("#formRegister").submit(function(e) {e.preventDefault(); register(); });
    $("#formCreatePost").submit(function(e) {e.preventDefault(); createPost(); });

    $(document).on({
        ajaxStart: function() {$("#loadingBox").show() },
        ajaxStop: function() {$("#loadingBox").hide() }
    });
});

function showHomeView() {
    showView('viewHome');
}
function showLoginView() {
    showView('viewLogin');
}
function showCarsView() {
    showView('viewCars')
}
function showPartsView() {
    showView('viewParts')
}
function showTiresView() {
    showView('viewTires')
}
function showContactView() {
    showView('viewContact')
}
function login() {
    const kinveyLoginUrl = kinveyBaseUrl + "user/" + kinveyAppKey + "/login";
    const kinveyAuthHeaders = {
        'Authorization': "Basic " + btoa(kinveyAppKey + ":" + kinveyAppSecret),
    };
    let userData = {
        username : $('#loginUser').val(),
        password : $('#loginPass').val()
    };
$.ajax({
    method: "POST",
    url: kinveyLoginUrl,
    headers: kinveyAuthHeaders,
    data: userData,
    success: loginSuccess,
    error: handleAjaxError
});
    function loginSuccess(response) {
        let userAuth = response._kmd.authtoken;
        sessionStorage.setItem('authToken', userAuth);
        showHideMenuLinks();
        listPosts();
        showInfo('Login successful');
    }
}

function handleAjaxError(response) {
    let errorMsg = JSON.stringify(response);
    if(response.readyState == 0)
        errorMsg = "Cannot connect due to network error.";
    if(response.responseJSON && response.responseJSON.description)
        errorMsg = response.responseJSON.description;
    showError(errorMsg);
}

function showRegisterView() {
    showView('viewRegister')
}

function register() {

    if($('#registerUser').val().length < 6){
        showInfo('Error : The username must minimum 6 symbols length.');
        return;
    }

    if($('#full-name').val().length < 6){
        showInfo('Error : The Full name must minimum 6 symbols length.');
        return;
    }

    if($('#registerPass').val() != $('#pass-confirm').val()){
        showInfo('Error : Repeat password!!!');
        return;
    }

    if($('#registerPass').val().length < 6){
        showInfo('Error : Too short password');
        return;
    }
    const kinveyRegisterUrl = kinveyBaseUrl + "user/" + kinveyAppKey + "/";
    const kinveyAuthHeaders = {
        'Authorization': "Basic " + btoa(kinveyAppKey + ":" + kinveyAppSecret),
    };
    let userData = {
        username : $('#registerUser').val(),
        fullName : $('#full-name').val(),
        password : $('#registerPass').val(),
        confirmPassword : $('#pass-confirm').val()
    };
    $.ajax({
        method: "POST",
        url: kinveyRegisterUrl,
        headers: kinveyAuthHeaders,
        data: userData,
        success: registerSuccess,
        error: handleAjaxError
    });
    function registerSuccess(response) {
        let userAuth = response._kmd.authtoken;
        sessionStorage.setItem('authToken', userAuth);
        showHideMenuLinks();
        listPosts();
        showInfo('User registration successful')
    }
}
function listPosts() {
    $('#posts').empty();
    showView('viewPosts');

    const kinveyPostsUrl = kinveyBaseUrl + "appdata/" + kinveyAppKey + "/forum";
    const kinveyAuthHeaders = {
        'Authorization': "Kinvey " + sessionStorage.getItem('authToken'),
    };
    $.ajax({
        method: "GET",
        url: kinveyPostsUrl,
        headers: kinveyAuthHeaders,
        success: loadPostsSuccess,
        error: handleAjaxError
    });
    function loadPostsSuccess(posts) {
        showInfo('Posts loaded.');
        if(posts.length == 0){
            $('#posts').text('No posts in the forum.');
        }else{
            let postsTable = $("<div id='post-style'>");
            for (let post of posts){
                postsTable.append($('<blockquote>')
                    .append($('<img src="images/icon.png" alt="Img" style="margin-right: 10px"></a>'))
                    .append($('<h2></h2>').text(post.author))
                    .append($('<h1></h1>').text(post.title))
                    .append($('<p></p>').text(post.description))
                );
            }
            $('#posts').append(postsTable);
        }
    }
}

function showCreatePostView() {
    showView('viewCreatePost');
}

function createPost() {
    if($('#postTitle').val().length < 6){
        showInfo('Error : The Title must minimum 6 symbols length.');
        return;
    }

    if($('#postAuthor').val().length < 6){
        showInfo('Error : The Author name must minimum 6 symbols length.');
        return;
    }

    if($('#postDescription').val().length < 6){
        showInfo('Error : The Content must minimum 6 symbols length.');
        return;
    }

    const kinveyPostsUrl = kinveyBaseUrl + "appdata/" + kinveyAppKey + "/forum";
    const kinveyAuthHeaders = {
        'Authorization': "Kinvey " + sessionStorage.getItem('authToken')
    };
    let postData = {
        title: $('#postTitle').val(),
        author: $('#postAuthor').val(),
        description: $('#postDescription').val()
    };
    $.ajax({
        method: "POST",
        url: kinveyPostsUrl,
        headers: kinveyAuthHeaders,
        data: postData,
        success: createPostSuccess,
        error: handleAjaxError
    });
    function createPostSuccess(response) {
        listPosts();
        showInfo('Post created.');
    }
}
function logout() {
    sessionStorage.clear();
    showHideMenuLinks();
    showView('viewHome');
}