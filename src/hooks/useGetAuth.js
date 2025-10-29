export const useGetAuth = () => {
    const {name, photoURL, userId, isAuth} = JSON.parse(localStorage.getItem("auth")) || {
        name: "",
        photoURL: "",
        userId: -1,
        isAuth: false
    };
    return {name, photoURL, userId, isAuth};
}