export const loginMatch = () => {
  const navBar = document.querySelector("#navbar");
  const token = localStorage.getItem("token");
  if (token) {
    const logout = createA("/", "로그아웃");
    const myPage = createA("/mypage", "마이페이지");
    logout.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("token");
      location.reload();
    });
    navBar.prepend(logout, myPage);
  } else {
    const login = createA("/login", "로그인");
    const register = createA("/register", "회원가입");
    navBar.prepend(login, register);
  }
};
function createA(href, text) {
  const liTag = document.createElement("li");
  const aTag = document.createElement("a");
  aTag.href = href;
  aTag.textContent = text;
  liTag.append(aTag);
  return liTag;
}
