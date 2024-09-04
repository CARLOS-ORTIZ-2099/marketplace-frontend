import { Link } from "react-router-dom"


export const NavbarProfile = () => {
  return (
    <nav> 
        <ul>
            <Link to={`/profile`}> my profile</Link>
            <Link to={`/profile/myFavourites`}>favourites </Link>
            <Link to={`/profile/myPosts`}>  my posts</Link>
            <Link to={`/profile/createPost`}> create post</Link>
            
        </ul>
    </nav>
  )
}
