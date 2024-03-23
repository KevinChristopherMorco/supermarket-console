class Market {
    constructor() {
        this.marketItem = [{ item: 'APPLE', price: 50, quantity: 200 }, { item: 'MANGO', price: 120, quantity: 100 }, { item: 'GRAPE', price: 300, quantity: 400 }]
    }

    checkMarketInventory() {
        console.log('---------------------------------------------------')
        if (this.marketItem.length > 0) {
            console.log('Market Inventory')
            for (let i = 0; i < this.marketItem.length; i++) {
                console.log(`Market item:${this.marketItem[i].item} | Price:₱${this.marketItem[i].price} | Stocks:${this.marketItem[i].quantity}`)
            }
        } else {
            console.log('Market inventory is empty')
        }
        console.log('---------------------------------------------------')
    }

    addMarketItem() {
        console.log('----Add Market Items----')
        let flag = true
        do {
            let itemName = prompt('Enter Item Name:').toUpperCase()
            let itemPrice = parseFloat(prompt('Enter Item Price:'))
            let itemQuantity = parseFloat(prompt('Enter Stock Quantity:'))

            let marketItem = { item: itemName, price: itemPrice, quantity: itemQuantity }

            if (!this.marketItem.some(marketItemEl => marketItemEl.item === marketItem.item)) {
                if (!isNaN(marketItem.price) && !isNaN(marketItem.quantity)) {
                    this.marketItem.push(marketItem)
                } else {
                    console.log('Invalid input, only numbers are allowed for price and quantity')
                }
            } else {
                console.log('Market item already in inventory')
            }

            this.checkMarketInventory()

            let flagPrompt = prompt('Do you want to add another item?[Y/N]:').toUpperCase()
            if (flagPrompt == 'Y' || flagPrompt == 'Yes') {
                flag = true
            } else {
                flag = false
            }

        } while (flag == true)
    }

    removeMarketItem() {
        if (this.marketItem.length > 0) {
            console.log('----Remove an item----')
            let flag = true
            do {
                this.checkMarketInventory()
                let removeItem = prompt('Remove an item:').toUpperCase()
                if (this.marketItem.some(marketItemEl => marketItemEl.item == removeItem)) {
                    let findItemIndex = this.marketItem.findIndex(marketItemEl => marketItemEl.item == removeItem)
                    this.marketItem.splice(findItemIndex, 1)
                    console.log(`${removeItem} was removed in inventory`)
                    this.checkMarketInventory()
                } else {
                    console.log(`Invalid request, ${removeItem} is not in current inventory`)
                }
                let flagPrompt = prompt('Do you want to remove another item?[Y/N]:').toUpperCase()
                if (flagPrompt == 'Y' || flagPrompt == 'Yes') {
                    flag = true
                } else {
                    flag = false
                }
            } while (flag == true)
        } else {
            console.log('Cannot remove an item, market inventory is empty')
        }


    }
}

class Customer {
    constructor(market) {
        this.finance = 1000
        this.market = market
        this.customerCart = new ShoppingCart()
    }

    addCartItem() {
        let flag = true
        do {
            this.market.checkMarketInventory()
            let itemName = prompt('Add an item to your cart:').toUpperCase()
            let itemIndex = this.market.marketItem.findIndex(marketItemEl => marketItemEl.item == itemName)

            if (!this.customerCart.cartItem.some(cartEl => cartEl.item == itemName)) {
                if (this.market.marketItem.some(marketItemEl => marketItemEl.item == itemName)) {
                    let itemQuantity = parseInt(prompt('Quantity:'))
                    if (this.market.marketItem[itemIndex].quantity >= itemQuantity) {
                        let price = this.market.marketItem[itemIndex].price
                        let cartItem = {
                            item: itemName, price: price, quantity: itemQuantity, grandTotal: function () {
                                return this.price * this.quantity
                            }
                        }

                        let currentStock = this.market.marketItem[itemIndex].quantity - itemQuantity

                        this.customerCart.cartItem.push(cartItem)
                        console.log('---------------------------------------------------')
                        console.log(`${itemName} added to your cart`)
                        console.log('---------------------------------------------------')
                        this.market.marketItem[itemIndex].quantity = currentStock
                        this.customerCart.getCartDetails()

                    } else {
                        console.log(`${itemName} has only ${this.market.marketItem[itemIndex].quantity} left`)
                    }

                } else {
                    console.log(`${itemName} item does not exist in current market inventory\nChoose only in the list`)
                }
            } else {
                console.log(`${itemName} already in cart`)
            }
            console.log('---------------------------------------------------')
            let flagPrompt = prompt('Do you want to add another item to your cart?[Y/N]:').toUpperCase()
            if (flagPrompt == 'Y' || flagPrompt == 'Yes') {
                flag = true
            } else {
                flag = false
            }
        } while (flag == true);
    }

    removeCartItem() {
        let flag = true
        this.customerCart.getCartDetails()
        console.log('---------------------------------------------------')
        if (this.customerCart.cartItem.length > 0) {
            do {
                console.log('---------------------------------------------------')
                let removePrompt = parseInt(prompt('Select an option below:\n1. Remove all item\n2. Remove item quantity\nChoose an Action:'))
                console.log('---------------------------------------------------')

                if (removePrompt == 1) {

                    let removeCartItem = prompt('Remove an item from your cart:').toUpperCase()
                    let itemIndex = this.customerCart.cartItem.findIndex(cartEl => cartEl.item == removeCartItem)
                    this.market.marketItem[itemIndex].quantity += this.customerCart.cartItem[itemIndex].quantity
                    this.customerCart.cartItem.splice(itemIndex, 1)
                    console.log(`${removeCartItem} was removed from your cart`)
                    console.log('---------------------------------------------------')
                    this.customerCart.getCartDetails()
                    console.log('---------------------------------------------------')
                    if (this.customerCart.cartItem.length == 0) {
                        flag = false
                    } else {
                        let flagPrompt = prompt('Do you want to remove another item to your cart?[Y/N]:').toUpperCase()
                        if (flagPrompt == 'Y' || flagPrompt == 'Yes') {
                            flag = true
                        } else {
                            flag = false
                        }
                    }
                } else if (removePrompt == 2) {
                    let removeCartItem = prompt('Select an item from your cart:').toUpperCase()
                    let itemIndex = this.customerCart.cartItem.findIndex(cartEl => cartEl.item == removeCartItem)
                    let removeItemQuantity = parseInt(prompt('Quantity:'))
                    this.market.marketItem[itemIndex].quantity += removeItemQuantity
                    this.customerCart.cartItem[itemIndex].quantity -= removeItemQuantity
                    if (this.customerCart.cartItem.length == 0) {
                        flag = false
                    } else {
                        let flagPrompt = prompt('Do you want to remove another item to your cart?[Y/N]:').toUpperCase()
                        if (flagPrompt == 'Y' || flagPrompt == 'Yes') {
                            flag = true
                        } else {
                            flag = false
                        }
                    }

                }
            } while (flag == true);
        }
    }

    checkMarketItems() {
        this.market.checkMarketInventory()
    }

    checkCart() {
        this.customerCart.getCartDetails()
    }

    payCartItem() {
        if (this.finance >= this.customerCart.grandTotal) {
            let change = this.finance - this.customerCart.grandTotal
            this.customerCart.getReceipt()
            console.log(`Given Amount: ₱${this.finance}\nGrandTotal: ₱${this.customerCart.grandTotal}\nChange: ₱${change}\nAll items has already been paid for. Thank you for shopping!`)
            this.finance = change
            this.customerCart.grandTotal = 0
            this.customerCart.cartItem = []
        } else {
            console.log(`Insufficient funds`)
        }


    }

    leaveMarket() {
        if (this.customerCart.grandTotal > 0) {
            console.log('You need to pay first before you leave.')
        } else {
            console.log('Thank you for shopping at Walmart, we have everything you need. Come again!')
        }

    }
}

class ShoppingCart {
    constructor() {
        this.cartItem = []
        this.grandTotal = 0
    }

    getCartDetails() {
        console.log('----Your Cart----')
        if (this.cartItem.length > 0) {
            this.grandTotal = 0
            for (let i = 0; i < this.cartItem.length; i++) {
                console.log(`Item:${this.cartItem[i].item} || Price:₱${this.cartItem[i].price} || Quantity:${this.cartItem[i].quantity} || Total: ₱${this.cartItem[i].grandTotal()}`)
                this.grandTotal += this.cartItem[i].grandTotal()
            }
            console.log(`Grand Total: ₱${this.grandTotal}`)
        } else {
            console.log('Your cart is empty')
        }

    }

    getReceipt() {
        console.log('----Walmart Receipt----')
        for (let i = 0; i < this.cartItem.length; i++) {
            console.log(`Item:${this.cartItem[i].item} || Price:₱${this.cartItem[i].price} || Quantity:${this.cartItem[i].quantity} || Total: ₱${this.cartItem[i].grandTotal()}`)
        }
    }

}

console.log('---------------------------------------------------')
console.log('Welcome to Walmart, We have everything you need!\nTo get started please choose your role:\n1. Admin\n2. Customer')
console.log('---------------------------------------------------')


let userRoleChoice = parseInt(prompt('Choose your role number:'))

let market = new Market()
let customer = new Customer(market)

if (userRoleChoice == 1) {
    let loop = true
    while (loop == true) {
        console.log('---------------------------------------------------')
        console.log('Choose your action:\n1. Add Market Items\n2. Remove Market Item')
        console.log('---------------------------------------------------')
        let adminChoice = parseInt(prompt('Choose the number of the above actions:'))
        console.log('---------------------------------------------------')
        if (adminChoice == 1) {
            market.addMarketItem()
        } else if (adminChoice == 2) {
            market.removeMarketItem()
        } else {
            console.log('Invalid Action')
        }
    }

} else if (userRoleChoice == 2) {
    let flag = true
    do {
        console.log('---------------------------------------------------')
        console.log('Choose your action:\n1. Add to Cart\n2. Remove in Cart\n3. Check my Cart\n4. Check Market Items\n5. Pay & Checkout\n6. Leave Market')
        console.log('---------------------------------------------------')
        let customerChoice = parseInt(prompt('Choose the number of the above actions:'))

        switch (customerChoice) {
            case 1:
                customer.addCartItem()
                break;
            case 2:
                customer.removeCartItem()
                break;
            case 3:
                customer.checkCart()
                break;
            case 4:
                customer.checkMarketItems()
                break;
            case 5:
                customer.payCartItem()
                break;
            case 6:
                customer.leaveMarket()
                break;
            default:
                break;
        }
    } while (flag == true)

} else {
    console.log('Invalid User Role')
}