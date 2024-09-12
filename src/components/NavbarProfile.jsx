import { Box } from "@chakra-ui/react"
import { Link } from "react-router-dom"


export const NavbarProfile = () => {
  return (
    <Box as="nav" bg={'teal'} p={'5'}> 
        <Box as="ul" display={'flex'} justifyContent={'space-around'}
          fontSize={{base : 'sm', lg : 'xl'}}
          color={'aliceblue'}
          borderRadius={'5'}
        >
            <Link to={`/profile`}>profile</Link>
            <Link to={`/profile/myFavourites`}>favourites </Link>
            <Link to={`/profile/myPosts`}>  posts</Link>
            <Link to={`/profile/formPage`}> create post</Link>
        </Box>
    </Box>
  )
}
