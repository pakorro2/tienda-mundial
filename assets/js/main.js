import { activeProduct } from './components/activeProduct.js'
import { cartMenu } from './components/cartMenu.js'
import { darkTheme } from './components/darkTheme.js'
import { headerScroll } from './components/headerScroll.js'
import { load } from './components/load.js'
// import { navMenu } from './components/navMenu.js'
// import { sectionActive } from './components/sectionActive.js'

import { productos } from './data/db.js'

window.addEventListener('load', function () {
  load()
})

document.addEventListener('DOMContentLoaded', function () {
  darkTheme()
  headerScroll()
  // navMenu()
  cartMenu()
  // sectionActive()

  activeProduct()

  mixitup('.products__content', {
    selectors: {
      target: '.products__card'
    },
    animation: {
      duration: 300
    }
  }).filter('all')
})

/* Productos */
const productList = document.getElementById('products__content');


function pintarProductos() {
  let html = ''

  for (const {id, nombre, precio, unidades, imagen, categoria } of productos) {
    html += `        <article class="products__card ${categoria}">
    <div class="products__shape">
      <img src="${imagen}" alt="${nombre}" class="products__img">
    </div>

    <div class="products__data">
      <h2 class="products__price">$${precio} <span class="products__quantity">| Stock: ${unidades}</span></h2>
      <h3 class="products__name">${nombre}</h3>

      <button class="button products__button" data-id="${id}">
        <i class='bx bx-plus'></i>
      </button>
    </div>
    </article>`
    
  }
  return productList.innerHTML = html
}
pintarProductos()

/* Carrito */
const cantidad = document.getElementById('cart-count')
const cantidad2 = document.getElementById('items-count')
const totalCompra = document.getElementById('cart-total')
const comprarElement = document.getElementById('cart-checkout')

let carrito = []

const cartList = document.querySelector('.cart__container');

function pintarCarrito() {
  let html = ''

  if (carrito.length > 0) {

    for (const {id, cantidad} of carrito) {

      const {nombre,imagen, precio } = productos.find(producto => producto.id === id)
      html += `<article class="cart__card">
      <div class="cart__box">
        <img src="${imagen}" alt="${nombre}" class="cart__img">
      </div>

      <div class="cart__details">
        <h3 class="cart__title">${nombre}</h3>
        <span class="cart__stock">Stock: ${cantidad} | <span class="cart__price">$${precio}</span></span>
        <div class="cart__amount">
          <div class="cart__amount-content">
            <span class="cart__amount-box minus delete" data-id="${id}">
            <i class='bx bx-minus'></i>
            </span>
            <span class="cart__amount-number">${cantidad} units</span>
            <span class="cart__amount-box plus add" data-id="${id}">
            <i class='bx bx-plus'></i>
            </span>
          </div>
          <i class='bx bx-trash-alt cart__amount-trash' data-id="${id}"></i>
        </div>
      </div>
    </article>`
    }
  }
  else {

    html = `<h2 class="products__title">Su carrrito esta vacio</h2>
    <img src="assets/img/vacio.png" width="300px" alt="carrito vacio">`
    document.getElementById("cart-checkout").disabled = true
  }
  cartList.innerHTML = html
  totalCompra.innerHTML = `Total: $${total()}`
  cantidad.innerHTML = contarArticulos()
  cantidad2.innerHTML = contarArticulos()
}
pintarCarrito()


productList.addEventListener('click', function (e) {
  if(e.target.closest(".products__button")){
    agregarAlCarrito(+e.target.closest(".products__button").dataset.id)
    document.getElementById("cart-checkout").disabled = false
  }
  })



cartList.addEventListener ("click", function(e){
    const eliminar = e.target
    if(eliminar.closest(".delete")){
      removerDelCarrito(+eliminar.closest(".delete").dataset.id)
    }
    if(eliminar.closest(".add")){
      agregarAlCarrito(+eliminar.closest(".add").dataset.id)
    }

    if(eliminar.closest(".cart__amount-trash")){
      eliminarDelCarrito(+eliminar.closest(".cart__amount-trash").dataset.id)
    }
  })

  comprarElement.addEventListener ("click", function(){
    comprar()
  })
  



function agregarAlCarrito(id) {
  const cantidad = 1
  // si el producto (x) en su propiedad id es igual al id que pasamos como párametro, retornalo.
  const productoEncontrado = productos.find(producto => producto.id === id)

  if (productoEncontrado && productoEncontrado.unidades > 0) {
    // si el articulo (x) en su propiedad id es igual al id que pasamos como párametro, retornalo.
    const articuloEncontrado = carrito.find(articulo => articulo.id === id)
    if (articuloEncontrado) {
      // verificar las unidades dispobibles
      if (checarUnidades(id, cantidad + articuloEncontrado.cantidad)) {
        articuloEncontrado.cantidad += cantidad
      } else {
        swal("Supera las unidades disponibles", "¡Lo sentimos 😓 intente con otro articulo!", "info")
      }
    } else {
        carrito.push({ id, cantidad })
    }
  } else {
    swal("No contamos con unidades disponibles", "¡Lo sentimos 😓 intente con otro articulo!", "error");
  }
  pintarCarrito()
}



function checarUnidades(id, cantidad) {
  const productoEncontrado = productos.find(producto => producto.id === id)
  return productoEncontrado.unidades - cantidad >= 0
}

function removerDelCarrito(id) {
  const cantidad = 1

  // si el articulo (x) en su propiedad id es igual al id que pasamos como párametro, retornalo.
  const articuloEncontrado = carrito.find(articulo => articulo.id === id)
  if (articuloEncontrado.cantidad - cantidad > 0) {
    articuloEncontrado.cantidad -= cantidad
  } else {
    carrito = carrito.filter(articulo => articulo.id !== id)
  }
  pintarCarrito()
}
function eliminarDelCarrito(id) { 
    carrito = carrito.filter(articulo => articulo.id !== id)
    pintarCarrito()
}

function contarArticulos() {
  let suma = 0
  for (const articulo of carrito) {
    suma += articulo.cantidad
  }
  return suma
}

function total() {
  let suma = 0

  for (let articulo of carrito) {
    const productoEncontrado = productos.find(producto => producto.id === articulo.id)
    suma += articulo.cantidad * productoEncontrado.precio
  }

  return suma
}

function comprar() {
  for (let articulo of carrito) {
    const productoEncontrado = productos.find(producto => producto.id === articulo.id)
    productoEncontrado.unidades -= articulo.cantidad
  }
  swal("¡Gracias 😃 por su compra!", "¡Lo esperamos 👍 de vuelta pronto!", "success")
  carrito = []
  pintarProductos()
  pintarCarrito()
}