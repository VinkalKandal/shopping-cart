import { useEffect, useState } from 'react'
import './App.css'

const PRODUCTS = [
  { id: 1, name: "Laptop", price: 500 },
  { id: 2, name: "Smartphone", price: 300 },
  { id: 3, name: "Headphones", price: 100 },
  { id: 4, name: "Smartwatch", price: 150 },
];
const FREE_GIFT = { id: 99, name: "Wireless Mouse", price: 0 };
const THRESHOLD = 1000;

function App() {

  const [cart, setCart] = useState([])
  const subtotal = cart.reduce((acc, item)=> acc + item.price*item.qty, 0)
  const hasGift = cart.some(item=> item.id === FREE_GIFT.id)
  const remaining = THRESHOLD - subtotal

  const addToCart =(product)=>{
    setCart(prev=>{
      const exists = prev.find(item=> item.id === product.id)
      return exists? prev: [...prev, {...product , qty: 1}]
    })

  }
  const updateQty = (id, count)=>{
    setCart(prev=> 
      prev.map(item=>item.id === id? {...item, qty: item.qty + count}: item)
      .filter(item=> item.qty> 0 && (item.id !== FREE_GIFT.id || item.qty === 1))
    )
  }

  useEffect(()=>{
    if(subtotal >= THRESHOLD && !hasGift){
      setCart(prev=>[...prev, {...FREE_GIFT, qty:1}])
    }
    if(subtotal < THRESHOLD && hasGift){
      setCart(prev=>prev.filter(item=> item.id !== FREE_GIFT.id))
    }
  },[subtotal])

console.log("cart: ", cart, subtotal)
  return (
    <div className='p-6 text-grey-800'>
      <h1 className='text-3xl font-bold text-center mb-8'>Shopping Cart</h1>
      {/* Products */}
      <section> 
        <h3 className='text-3xl text-center mb-3'>Products</h3>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4'>
          {PRODUCTS.map(p=>(
            <div className='p-4 shadow bg-grey' key={p.id}>
              <div className='mb-1 font-medium text-lg'>{p.name}</div>
              <div className='mb-3'>{p.price}</div>
              <button className='w-full bg-blue-500 hover:bg-blue-600 text-white py-1 rounded cursor-pointer' onClick={()=> addToCart(p)}>Add to Cart</button>
            </div>
          ))}
        </div>
      </section>

      <section className='mt-10'>
        <h3 className='text-xl font-semibold mb-2'>Cart Summary</h3>
        <div className='text-lg font-semibold mb-2'>Subtotal: <span style={{'fontFamily':"Arial"}}>&#8377;</span> {subtotal}</div>

{subtotal>= THRESHOLD?(<div className='text-green-500 font-medium'>
  You got a FREE Mouse!!!
</div>):cart.length !== 0?(<div>
  <p className='mb-1 text-blue-400'>Add <span style={{'fontFamily':"Arial" }} className='text-grey-500'>&#8377;</span> {remaining} more to get a free Mouse </p>
  <div className='w-full bg-grey-300 h-3 rounded overflow-hidden'>
    <div className='bg-green-700 h-full' style={{width: `${Math.min(100, (subtotal/ THRESHOLD)* 100)}%`}}></div>
  </div>

</div>):""}


        {cart.length === 0?(<div className='text-center p-6 rounded shadow text-grey-600'>Your Cart is empty
            <br/>
            Add some products to see them here!
        </div>):(<div className=''>
          <h4 className='text-lg font-medium mb-2'>cart Items</h4>
          {cart.map(item => <div className='flex items-center justify-between p-4 rounded shadow' key={item.key}>
            <div>
              <div className='font-medium'>
                {item.name}
              </div>
              <div className='text-sm text-grey-500'>
              <span style={{'fontFamily':"Arial" }} className='text-grey-500'>&#8377;</span> {item.price} X {item.qty} = { item.price * item.qty}
              </div>
            </div>
            {item.id !== FREE_GIFT.id ?(<div>
              <button className='bg-red-500 text-white px-2 py-1 rounded cursor-pointer mx-1' onClick={()=>updateQty(item.id, -1)} >-</button>
              <span>{item.qty}</span>
              <button className='bg-green-500 text-white px-2 py-1 rounded cursor-pointer mx-1' onClick={()=>updateQty(item.id, 1)} >+</button>
            </div>):(<div>
              <span className='tex-xs bg-green-100 text-green-700 px-2 py-1 rounded'>FREE GIFT!!</span>
            </div>)}
          </div>)}
        </div>)}

      </section>
   
    </div>
  )
}

export default App;