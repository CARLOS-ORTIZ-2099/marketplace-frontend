/* eslint-disable react/prop-types */


export const ProductGallery = ({images}) => {
    //console.log(images);
    
  return (
    <div style={{display : 'flex', gap : '1rem'}}>
            {
                images?.map(image => (
                    <div key={image.public_id}>
                        <img width={'250px'} src={image.secure_url} alt="" />
                    </div>
                ))
            }
    </div>
  )
}
