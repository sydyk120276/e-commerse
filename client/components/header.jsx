import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { sortProducts } from '../redux/reducers/cards'
import { currensyNames, setSortToggle, getRates } from '../redux/reducers/rate'
import CustomizedBadges from './CustomizedBadges'
import gif from '../assets/images/9.gif'

const Headers = () => {
  const dispatch = useDispatch()

  const { currensyName, rates, sort } = useSelector((s) => s.rate)
  const { totalPrice } = useSelector((s) => s.cart)

  const ratesButton = (name) => {
    dispatch(getRates())
    dispatch(currensyNames(name.toUpperCase()))
  }

  const sortByType = (sortType) => {
    dispatch(setSortToggle(sortType))
    dispatch(sortProducts(sortType, sort[sortType]))
  }

  return (
    <>
      <div className="flex h-20 w-full bg-blue-400 items-center justify-between fixed z-50 ">
        <div className="flex gap-12">
          <div className="flex justify-between w-44 pl-4 pt-2  text-xs">
            {Object.keys(rates).map((name) => (
              <button
                key={name.toLowerCase()}
                type="button"
                className="currency_btn"
                data-name={name.toLowerCase()}
                onClick={(e) => ratesButton(e.target.dataset.name)}
              >
                {name.toUpperCase()}
              </button>
            ))}
          </div>
          {/* <div className="flex justify-between w-44 pl-4  text-xs ">
          <div className="flex bg-red-200 hover:bg-red-400 active:bg-red-700 h-6 w-12 rounded justify-center transform duration-700 scale-100 hover:scale-110 ">
            <button
              className="font-bold "
              type="button"
              onClick={() => dispatch(currensyNames('USD'))}
            >
              USD
            </button>
          </div>
          <div className="flex bg-red-200 hover:bg-red-400 active:bg-red-700 h-6 w-12 rounded justify-center transform duration-700 scale-100 hover:scale-110">
            <button
              className="font-bold"
              type="button"
              onClick={() => dispatch(currensyNames('EUR'))}
            >
              EUR
            </button>
          </div>
          <div className="flex bg-red-200 hover:bg-red-400 active:bg-red-700 h-6 w-12 rounded justify-center transform duration-700 scale-100 hover:scale-110">
            <button
              className="font-bold "
              type="button"
              onClick={() => dispatch(currensyNames('CAD'))}
            >
              CAD
            </button>
          </div>
        </div> */}
          <div className="flex gap-4 bg-gray-200 p-2 rounded-lg">
            <div>Sorting: </div>
            <div className="sorting_btn">
              <button className="font-bold " type="button" onClick={() => sortByType('name')}>
                Name <span>{sort.name ? '▼' : '▲'}</span>
              </button>
            </div>
            <div className="sorting_btn">
              <button className="font-bold " type="button" onClick={() => sortByType('price')}>
                Price <span>{sort.price ? '▼' : '▲'}</span>
              </button>
            </div>
          </div>
        </div>
        <div className="shop_btn">
          <Link to="/" id="#brand-name">
            <img src={gif} alt="" /> Welcome to Shop
          </Link>
        </div>
        <div className="flex flex-col">
          <div className="flex ">
            <Link to="/basket" id="#order-count">
              <CustomizedBadges />
            </Link>
          </div>
          <div className="mr-4">
            <div className="flex font-bold">
              <div className="">{(totalPrice * rates[currensyName]).toFixed(2)}</div>
              <div className="ml-2">{currensyName}</div>
            </div>
            {/* <div className="ml-4 font-semibold">{totalAmount}</div> */}
          </div>
        </div>
      </div>
    </>
  )
}

export default Headers
