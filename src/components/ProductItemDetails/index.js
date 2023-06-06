import Cookies from 'js-cookie'
import {Component} from 'react'
import {Link} from 'react-router-dom'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const initializeStatus = {
  initial: 'INITIAL',
  inprogress: 'IN_PROGRESS',
  failure: 'FAILURE',
  success: 'SUCCESS',
}

class ProductItemDetails extends Component {
  state = {
    productInfo: {},
    similarProductsList: [],
    apiStatus: initializeStatus.initial,
    count: 1,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  parseTheData = data => ({
    id: data.id,
    availability: data.availability,
    brand: data.brand,
    description: data.description,
    imageUrl: data.image_url,
    price: data.price,
    rating: data.rating,
    style: data.style,
    total: data.total,
    totalReviews: data.total_reviews,
    title: data.title,
  })

  getProductDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({apiStatus: initializeStatus.inprogress})
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const url = `https://apis.ccbp.in/products/${id}`
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = this.parseTheData(data)
      const similarProductData = data.similar_products.map(eachProduct =>
        this.parseTheData(eachProduct),
      )
      this.setState({
        productInfo: updatedData,
        similarProductsList: similarProductData,
        apiStatus: initializeStatus.success,
      })
    } else if (response.status === 404) {
      this.setState({apiStatus: initializeStatus.failure})
    }
  }

  renderLoader = () => (
    <div data-testid="loader" className="loader-icon">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderFailureView = () => (
    <div className="no-results-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="no-results-failure-container-image"
      />
      <h1>Product Not Found</h1>
      <Link to="/products">
        <button
          type="button"
          className="add-to-cart-button continue-shopping-button"
        >
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  onClickDecrement = () => {
    const {count} = this.state
    if (count > 1) {
      this.setState(prevState => ({count: prevState.count - 1}))
    }
  }

  onClickIncrement = () => {
    this.setState(prevState => ({count: prevState.count + 1}))
  }

  renderProductsSuccessView = () => {
    const {productInfo, count, similarProductsList} = this.state
    const {
      availability,
      brand,
      description,
      imageUrl,
      price,
      rating,
      style,
      totalReviews,
    } = productInfo
    return (
      <div>
        <div className="product-item-details-container">
          <img src={imageUrl} alt="product" className="product-item-image" />
          <div className="product-text-details-container">
            <h1 className="style-heading">{style}</h1>
            <p className="price-text">Rs {price}/-</p>
            <div className="rating-text-container">
              <div className="rating-star-container">
                <p className="rating-count">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star-icon"
                />
              </div>
              <p className="total-reviews-count">{totalReviews} Reviews</p>
            </div>
            <p className="product-description">{description}</p>
            <div className="available-container">
              <p className="available-text">Available:</p>
              <p className="is-available">{availability}</p>
            </div>
            <div className="available-container">
              <p className="available-text">Brand:</p>
              <p className="is-available">{brand}</p>
            </div>
            <hr className="horizontal-rule" />
            <div className="product-buttons-container">
              <button
                type="button"
                className="each-button"
                onClick={this.onClickDecrement}
                data-testid="minus"
              >
                <BsDashSquare className="button-react-icon" />
              </button>
              <p className="show-count-text">{count}</p>
              <button
                type="button"
                className="each-button"
                onClick={this.onClickIncrement}
                data-testid="plus"
              >
                <BsPlusSquare className="button-react-icon" />
              </button>
            </div>
            <button type="button" className="add-to-cart-button">
              ADD TO CART
            </button>
          </div>
        </div>
        <h1 className="similar-products-text">Similar Products</h1>
        <ul className="similar-products-list-container">
          {similarProductsList.map(eachSimilarProduct => (
            <SimilarProductItem
              productsList={eachSimilarProduct}
              key={eachSimilarProduct.id}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderResults = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case initializeStatus.success:
        return this.renderProductsSuccessView()
      case initializeStatus.failure:
        return this.renderFailureView()
      case initializeStatus.inprogress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="product-item-result-details-container">
          {this.renderResults()}
        </div>
      </>
    )
  }
}
export default ProductItemDetails
