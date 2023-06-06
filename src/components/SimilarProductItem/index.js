import './index.css'

const SimilarProductItem = props => {
  const {productsList} = props
  const {brand, imageUrl, title, price, rating} = productsList
  return (
    <li className="each-similar-product-list-container">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="each-similar-product-list-container-image"
      />
      <p className="each-similar-product-title">{title}</p>
      <p className="each-similar-product-brand">by {brand}</p>
      <div className="each-similar-product-text-container">
        <p className="each-similar-product-reviews-price">Rs {price}/-</p>
        <div className="each-similar-product-star-container">
          <p className="each-similar-product-rating">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star-icon"
          />
        </div>
      </div>
    </li>
  )
}
export default SimilarProductItem
