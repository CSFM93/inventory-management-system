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


const typeDefs = `
input UserInput {
  name: String
  username: String
  email: String
  phoneNumber: String
}

input ProductInput {
  name: String
  category: String
  price: Float
}

input CategoryInput {
  name: String
}

input InventoryInput {
  product: String
  quantity: Int
}

input OrderInput {
  user: String
  product: String
  quantity: Int
}

type User {
  id: ID!
  name: String!
  username: String!
  email: String!
  phoneNumber: String!
}

type Product {
  id: ID!
  name: String!
  category: Category!
  price: Float!
  dateAdded: Date
}

type Category {
  id: ID!
  name: String!
}

type Inventory {
  id: ID!
  product: Product
  quantity: Int!
}

type Order {
  id: ID!
  user: User
  product: Product
  quantity: Int!
  total: Float!
  dateAdded: Date
}

scalar Date

type Query {
  getUser(id: ID!): User
  getUsers: [User]
  getCategory(id: ID!): Category
  getCategories: [Category]
  getProduct(id: ID!): Product
  getProducts: [Product]
  getInventoryItem(id: ID!): Inventory
  getInventoryItems: [Inventory]
  getOrder(id: ID!): Order
  getOrders: [Order]
}

type Mutation {
  addUser(input: UserInput): User!,
  updateUser(id: ID!, input: UserInput ): User!
  deleteUser(id: ID!): String

  addCategory(input: CategoryInput): Category!,
  updateCategory(id: ID!, input: CategoryInput ): Category!
  deleteCategory(id: ID!): String

  addProduct(input: ProductInput): Product!,
  updateProduct(id: ID!, input: ProductInput ): Product!
  deleteProduct(id: ID!): String

  addInventoryItem(input: InventoryInput): Inventory!,
  updateInventoryItem(id: ID!, input: InventoryInput ): Inventory!
  deleteInventoryItem(id: ID!): String
  
  addOrder(input: OrderInput): Order!,
  updateOrder(id: ID!, input: OrderInput ): Order!
  deleteOrder(id: ID!): String
}
`

module.exports = { typeDefs }