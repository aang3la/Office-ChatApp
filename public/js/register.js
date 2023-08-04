const register = async (name, email, password) => {
    try{
        const res = await axios({
            method: "POST",
            url: "/api/register",
            data: {
                name,
                email,
                password,
            }
        });
        console.log(res);
        window.location.href = "/api/login"; //check this!
    }
    catch(err) {
        console.log(err);
    }
};

document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    register(name, email, password);
})