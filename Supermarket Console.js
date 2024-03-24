const prompt = require('prompt-sync')();

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

            if (this.marketItem.some(marketItemEl => marketItemEl.item === itemName)) {
                console.log('Market item already in inventory')
                return;
            }

            if (isNaN(itemPrice) && isNaN(itemQuantity)) {
                console.log('Invalid input, only numbers are allowed for price and quantity')
                return;
            }

            let marketItem = { item: itemName, price: itemPrice, quantity: itemQuantity }

            this.marketItem.push(marketItem)
            this.checkMarketInventory()

            let flagPrompt = prompt('Do you want to add another item?[Y/N]:').toUpperCase()
            if (flagPrompt == 'Y' || flagPrompt == 'YES') {
                flag = true
            } else if (flagPrompt == 'N' || flagPrompt == 'NO') {
                flag = false
            } else {
                console.log('Invalid response, type "Y" for Yes and "N" for No')
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

                if (!this.marketItem.some(marketItemEl => marketItemEl.item == removeItem)) {
                    console.log(`Invalid request, ${removeItem} is not in current inventory`)
                    return;
                }

                let findItemIndex = this.marketItem.findIndex(marketItemEl => marketItemEl.item == removeItem)
                this.marketItem.splice(findItemIndex, 1)
                console.log(`${removeItem} was removed in inventory`)
                this.checkMarketInventory()

              
                let flagPrompt = prompt('Do you want to remove another item?[Y/N]:').toUpperCase()
                if (flagPrompt == 'Y' || flagPrompt == 'YES') {
                    flag = true
                } else if (flagPrompt == 'N' || flagPrompt == 'NO') {
                    flag = false
                } else {
                    console.log('Invalid response, type "Y" for Yes and "N" for No')
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

            if (this.customerCart.cartItem.some(cartEl => cartEl.item == itemName)) {
                console.log(`${itemName} already in cart`)
                return;
            }

            if (!this.market.marketItem.some(marketItemEl => marketItemEl.item == itemName)) {
                console.log(`${itemName} item does not exist in current market inventory\nChoose only in the list`)
                return;
            }

            let itemQuantity = parseInt(prompt('Preferred Quantity:'))

            if (isNaN(itemQuantity)) {
                console.log(`Invalid request, input must be a number`)
                return;
            }

            if (itemQuantity > this.market.marketItem[itemIndex].quantity || itemQuantity < 0) {
                console.log(`Invalid request,  ${itemName} has insuficcient stocks`)
                return;
            }

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
            console.log('---------------------------------------------------')
            let flagPrompt = prompt('Do you want to add another item to your cart?[Y/N]:').toUpperCase()
            if (flagPrompt == 'Y' || flagPrompt == 'YES') {
                flag = true
            } else if (flagPrompt == 'N' || flagPrompt == 'NO') {
                flag = false
            } else {
                console.log('Invalid response, type "Y" for Yes and "N" for No')
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
                console.log('Select an option below:\n1. Remove all item\n2. Update item quantity')
                let removePrompt = parseInt(prompt('Choose an Action:'))
                console.log('---------------------------------------------------')

                if (removePrompt == 1) {
                    let removeCartItem = prompt('Remove an item from your cart:').toUpperCase()

                    if (!this.customerCart.cartItem.some(cartEl => cartEl.item == removeCartItem)) {
                        console.log(`Invalid request, ${removeCartItem} is not in your cart`)
                        return;
                    }

                    let itemIndex = this.customerCart.cartItem.findIndex(cartEl => cartEl.item == removeCartItem)
                    this.market.marketItem[itemIndex].quantity += this.customerCart.cartItem[itemIndex].quantity
                    this.customerCart.cartItem.splice(itemIndex, 1)
                    console.log(`${removeCartItem} was removed from your cart`)
                    console.log('---------------------------------------------------')
                    this.customerCart.getCartDetails()
                    console.log('---------------------------------------------------')

                    if (this.customerCart.cartItem.length > 0) {
                        let flagPrompt = prompt('Do you want to update the quantity of another item to your cart?[Y/N]:').toUpperCase()
                        if (flagPrompt == 'Y' || flagPrompt == 'YES') {
                            flag = true
                        } else if (flagPrompt == 'N' || flagPrompt == 'NO') {
                            flag = false
                        } else {
                            console.log('Invalid response, type "Y" for Yes and "N" for No')
                        }
                    } else {
                        flag = false
                    }


                } else if (removePrompt == 2) {
                    let removeCartItem = prompt('Select an item from your cart:').toUpperCase()
                    if (!this.market.marketItem.some(marketItemEl => marketItemEl.item == removeCartItem)) {
                        console.log(`Invalid request, ${removeCartItem} is not in your cart`)
                        return;
                    }

                    let marketItemIndex = this.market.marketItem.findIndex(marketEl => marketEl.item == removeCartItem)
                    let cartItemIndex = this.customerCart.cartItem.findIndex(cartEl => cartEl.item == removeCartItem)
                    let itemQuantity = parseInt(prompt('Preferred Quantity:'))

                    if (isNaN(itemQuantity)) {
                        console.log(`Invalid request, input must be a number`)
                        return;
                    }

                    let updateMarketItem = this.market.marketItem[marketItemIndex].quantity + (this.customerCart.cartItem[cartItemIndex].quantity - itemQuantity)

                    if (updateMarketItem < 0) {
                        console.log('Invalid request, exceeded the item stock')
                        return;
                    }

                    this.market.marketItem[marketItemIndex].quantity = updateMarketItem
                    this.customerCart.cartItem[cartItemIndex].quantity = itemQuantity

                    if (this.customerCart.cartItem.length > 0) {
                        let flagPrompt = prompt('Do you want to update the quantity of another item to your cart?[Y/N]:').toUpperCase()
                        if (flagPrompt == 'Y' || flagPrompt == 'YES') {
                            flag = true
                        } else if (flagPrompt == 'N' || flagPrompt == 'NO') {
                            flag = false
                        } else {
                            console.log('Invalid response, type "Y" for Yes and "N" for No')
                        }
                    } else {
                        flag = false
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
            console.log(`Invalid request, insufficient funds`)
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
    do {
        console.log('---------------------------------------------------')
        console.log('Choose your action:\n1. Add Market Items\n2. Remove Market Item')
        console.log('---------------------------------------------------')
        let adminChoice = parseInt(prompt('Choose the number of the above actions:'))
        console.log('---------------------------------------------------')

        switch (adminChoice) {
            case 1:
                market.addMarketItem()
                break;
            case 2:
                market.removeMarketItem()
            default:
                console.log('Invalid Action')
                break;
        }



    } while (loop == true)

} else if (userRoleChoice == 2) {
    let flag = true
    do {
        console.log('---------------------------------------------------')
        console.log('Choose your action:\n1. Add to Cart\n2. Remove/Update in Cart\n3. Check my Cart\n4. Check Market Items\n5. Pay & Checkout\n6. Leave Market')
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
                console.log('Invalid Action')
                break;
        }
    } while (flag == true)

} else {
    console.log('Invalid User Role')
}