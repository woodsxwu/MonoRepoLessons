# Toy Marketplace REST API Project

Build a fun toy marketplace where students can buy and sell their favorite toys! This project teaches RESTful API design through 6 interconnected services that work together to create a complete marketplace experience.
## The 9 Services (One per Team):

### 1. **User Service** 👤
- Manages kid profiles and toy preferences
- **Endpoints**: `/users`, `/users/{id}`, `/users/{id}/favorites`
- **Fun twist**: Users can set their age and favorite toy categories

### 2. **Toy Catalog** 🧸
- Manages toy listings and search
- **Endpoints**: `/toys`, `/toys/{id}`, `/toys/search?category=...`
- **Fun twist**: Toys have fun categories like "Plushies", "Action Figures", "Board Games"

### 3. **Inventory Service** 📦
- Tracks how many toys are available
- **Endpoints**: `/inventory/{toy_id}`, `/inventory/check`, `/inventory/reserve`
- **Fun twist**: Some toys are rare collectibles with limited stock!

### 4. **Shopping Cart Service** 🛒
- Manages users' toy wishlists and carts
- **Endpoints**: `/carts/{user_id}`, `/carts/{user_id}/items`
- **Fun twist**: Carts can be saved as "birthday wishlists"

### 5. **Pricing Service** 💰
- Calculates toy prices and kid-friendly discounts
- **Endpoints**: `/prices/{toy_id}`, `/discounts/active`, `/prices/calculate`
- **Fun twist**: Special discounts for birthdays and good grades!

### 6. **Order Service** 📋
- Processes toy orders and tracks delivery
- **Endpoints**: `/orders`, `/orders/{id}`, `/orders/user/{user_id}`
- **Fun twist**: Orders can be gifts with special wrapping options

### 7. **Payment Service** 💳
- Handles "payment" processing (simulated with play money)
- **Endpoints**: `/payments/process`, `/payments/{id}`, `/payments/allowance`
- **Fun twist**: Kids can pay with "allowance points" or "chore credits"

### 8. **Notification Service** 📧
- Sends fun notifications about orders and new toys
- **Endpoints**: `/notifications/send`, `/notifications/{user_id}/preferences`
- **Fun twist**: Notifications can be sent to parents or kids with different messaging

### 9. **Review & Rating Service** ⭐
- Manages toy reviews and star ratings
- **Endpoints**: `/reviews`, `/reviews/toy/{id}`, `/ratings/toy/{id}`
- **Fun twist**: Kids can leave emoji-based reviews and rate "fun factor"

## How Services Work Together 🔗

### Simple Service Dependencies:
- **Cart Service** calls **Toy Catalog** to verify toys exist
- **Order Service** calls **Cart**, **Pricing**, and **Payment** to complete purchases  
- **Review Service** calls **Order Service** to verify someone bought a toy before reviewing
- **Notification Service** gets called by **Order Service** when orders are placed

### Core Requirements (Keep it Simple!):
Each service must implement:

1. **Proper REST Design** 
   - Use correct HTTP methods (GET, POST, PUT, DELETE)
   - Return appropriate status codes (200, 201, 404, 500)
   - Include proper JSON responses

2. **Basic Error Handling**
   - What happens when a toy doesn't exist?
   - What if a service is temporarily down?
   - Return helpful error messages

3. **Simple Data Validation**
   - Check required fields
   - Validate data types (numbers, strings, etc.)
   - Return clear validation errors

4. **One Fun Feature** (Choose one):
   - Search/filtering capability
   - Basic caching for popular toys
   - Simple pagination for large lists
   - File upload for toy images

## Assessment Criteria 📝

**What we're looking for:**
- ✅ **REST Best Practices**: Correct HTTP methods, status codes, and JSON responses
- ✅ **Working Endpoints**: All required endpoints function properly
- ✅ **Error Handling**: Graceful handling of missing data and service failures
- ✅ **Documentation**: Simple API documentation (can be a README with examples)
- ✅ **Integration**: Successfully calls other teams' services when needed

## Two-Week Timeline 📅

**Week 1**: Build your service with mock data
- Focus on getting your endpoints working
- Use fake data for dependencies (e.g., assume toys exist)
- Test with tools like Postman or curl

**Week 2**: Integration and polish
- Connect to other teams' services
- Handle real errors gracefully
- Add your fun feature
- Final testing and documentation

## Simple Technical Requirements 🛠️

- **Any language/framework** you're comfortable with
- **In-memory storage** is fine (arrays, objects) - no database required!
- **JSON communication** between services
- **Basic error responses** in JSON format
- **One service per team** - make it unique and fun!

## The Fun Part! 🎉

Each team gets to be creative with their service's personality:
- What kinds of toys does your service handle?
- What fun features can you add?
- How can you make the API responses delightful?

**Goal**: Learn REST principles while building something fun that works together as a complete toy marketplace!