import UserPage from "../remotes/UserApp";
import PostPage from "../remotes/PostApp";

function App() {
  return (
    <>
      <p className="bg-red-800 font-black">shell app</p>
      <UserPage />
      <PostPage />
    </>
  );
}

export default App;
