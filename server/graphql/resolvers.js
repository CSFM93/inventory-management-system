// Models
const { User } = require('../models/user')
const { Category } = require('../models/category')
const { Inventory } = require('../models/inventory')
const { Order } = require('../models/order')
const { Product } = require('../models/product')

const { GraphQLScalarType } = require('graphql')
const { Kind } = require('graphql/language')


let productAndCategory = [
    'product',
    {
        path: 'product',
        populate:
        {
            path: 'category',
            model: 'Category'
        }
    }
]

let userAndProduct= [
    'user',
    'product',
    {
        path: 'product',
        populate:
        {
            path: 'category',
            model: 'Category'
        }
    }
]

const resolvers = {
    Date: new GraphQLScalarType({
        name: 'Date',
        description: 'Date custom scalar type',
        parseValue(value) {
            return new Date(value)
        },
        serialize(value) {
            return value.getTime()
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.INT) {
                return new Date(+ast.value) 
            }
            return null
        },
    }),
    Query: {
        getUsers: async () => await User.find(),
        getUser: async (_, { id }) => {
            var result = await User.findById(id)
            return result
        },
        getCategories: () => Category.find(),
        getCategory: async (_, { id }) => {
            var result = await Category.findById(id)
            return result;
        },
        getProducts: () => Product.find().populate('category'),
        getProduct: async (_, { id }) => {
            var result = await Product.findById(id).populate('category');
            return result
        },
        getInventoryItems: () => Inventory.find().populate( productAndCategory ),
        getInventoryItem: async (_, { id }) => {
            var result = await Inventory.findById(id).populate( productAndCategory )
            return result
        },
        
        getOrders: () => Order.find().populate( userAndProduct ),
        getOrder: async (_, { id }) => {
            var result = await Order.findById(id).populate( userAndProduct )
            return result
        }

    },
    Mutation: {
        addUser: async (_, {input}) => {
            const user = new User(input);
            await user.save()
            return user
        },
        updateUser: async (_,{ id, input }) => {
            let user = await User.findOneAndUpdate(
                { _id: id },
                {
                    "$set": input
                },
                { new: true }
            )
            return user
        },
        deleteUser: async (_, { id }) => {
            let promises = []
            promises.push( User.deleteOne({ _id: id }) )
            promises.push( Order.deleteMany({ user: id }) )
            let data = await Promise.all(promises)
            return id
        },
        addCategory: async (_, { input }) => {
            const category = new Category(input);
            await category.save();
            return category
        },
        updateCategory: async (_,{ id, input }) => {
            let category = await Category.findOneAndUpdate(
                { _id: id },
                {
                    "$set": input
                },
                { new: true }
            )
            return category
        },
        deleteCategory: async (_, { id }) => {
            let products = await Product.find({category:id})

            let promises = []
            products.forEach(product =>{
                promises.push( Inventory.deleteOne({product:product._id}) )
                promises.push( Order.deleteMany({product:product._id}) )
            })
            promises.push( Product.deleteMany({category:id}) )
            promises.push( Category.deleteOne({ _id: id }) )

            let data = await Promise.all(promises)
            return id
        },
        addProduct: async (_, { input }) => {
            const product = new Product(input);
            await product.save();
            return Product.findById(product.id).populate('category')
        },
        updateProduct: async (_,{ id, input }) => {
            let product = await Product.findOneAndUpdate(
                { _id: id },
                {
                    "$set": input
                },
                { new: true })
                .populate('category')
            return product
        },
        deleteProduct: async (_, { id }) => {
            let promises = []
            promises.push( Product.deleteOne({ _id: id }) )
            promises.push( Inventory.deleteOne({product:id}) )
            promises.push( Order.deleteMany({product:id}) )
            let data = await Promise.all(promises)
            return id;
        },
        addInventoryItem: async (_, { input }) => {
            const inventory = new Inventory(input);
            await inventory.save();
            return Inventory.findById(inventory.id).populate(productAndCategory)
        },
        updateInventoryItem: async (_,{ id, input }) => {
            let inventory = await Inventory.findOneAndUpdate(
                { _id: id },
                {
                    "$set": input
                },
                { new: true })
            .populate(productAndCategory)

            return inventory
        },
        deleteInventoryItem: async (_, { id }) => {
            let promises = []
            let inventoryItem = await Inventory.findById(id)
            promises.push(await Order.deleteMany({product:inventoryItem.product}))
            promises.push(await Inventory.deleteOne({ _id: id }))
            let data = await Promise.all(promises)
            console.log(data)
            return id;
        },

        addOrder: async (_, { input }) => {
            let inventory = await Inventory.findOne({product:input.product}).populate('product')
            let product = inventory.product
            input.total = input.quantity * product.price
            const order = new Order(input)
            await order.save();
            
            let itemsLeft = inventory.quantity - input.quantity
            await inventory.updateOne({"$set": {quantity:itemsLeft}})
            await inventory.save()

            return Order.findById(order.id).populate( userAndProduct )
        },
        updateOrder: async (_,{ id, input }) => {
           
            let order = await Order.findById(id).populate('product')
            let inventory = await Inventory.findOne({product:order.product.id})
            let itemsLeft = 0
       
            if (input.quantity < order.quantity){
                itemsLeft = inventory.quantity + (order.quantity - input.quantity)
            }else{
                itemsLeft = inventory.quantity - (input.quantity - order.quantity)
            }

            let product = order.product
            input.total = input.quantity * product.price

            await inventory.updateOne({"$set": {quantity:itemsLeft}})
            await inventory.save()

            order = await Order.findOneAndUpdate(
                { _id: id },
                {
                    "$set": input
                },
                { new: true })
                .populate( userAndProduct )

            return order
        },
        deleteOrder: async (_, { id }) => {
            let order = await Order.findById(id).populate('product')
            let product = order.product
            let inventory = await Inventory.findOne({product:product.id})
            let itemsLeft = 0
       
            itemsLeft = inventory.quantity + order.quantity 
           
            await inventory.updateOne({"$set": {quantity:itemsLeft}})
            await inventory.save()
            inventory = await Inventory.findOne({product: product.id})

            await Order.deleteOne({ _id: id })
            return id
        },
    }
}

module.exports = { resolvers }