import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api/", // TODO: CHANGE THIS
    headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("token")
    }
})
export default api