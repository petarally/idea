// middleware/redirect.js
export default function ({ route, redirect }) {
  if (route.path === "/") {
    return redirect("/hr");
  }
}
