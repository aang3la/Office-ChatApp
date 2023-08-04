const login = async (email, password) => {
    try{
        const res = await axios({
            method: "POST",
            url: "/api/login",
            data: {
                email,
                password
            }
        });
        console.log(res);
        window.location.href = ""; //put url here
    }
    catch(err){
        console.log(err);
    }
};

document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
}) 

