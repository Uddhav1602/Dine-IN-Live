# Dine-IN-Live: Viva Preparation Guide (Theory Focus)

---

## Section 1: General Project Questions

**Q1. What is the objective of your project?**
The objective of Dine-IN-Live is to bridge the communication gap between students and mess/tiffin service owners. It provides a centralized digital platform where students can discover nearby food services, view daily menus, and place orders online. For mess owners, it offers a way to digitally register their mess, manage menus, and reach more customers. The system eliminates the need for physical visits or phone calls to check menus, saving time for both parties.

**Q2. What problem does this project solve?**
Currently, students living in hostels or PGs struggle to find reliable mess services nearby. There is no centralized system — students rely on word-of-mouth or physically visiting each mess. Mess owners also lack a digital presence to attract customers. Our platform solves this by acting as a one-stop hub for food discovery and ordering in a college ecosystem.

**Q3. What architecture does your project follow?**
The project follows a three-tier Client-Server architecture. The **Presentation Layer** (React frontend) handles the user interface. The **Application Layer** (Node.js/Express backend) contains the business logic and API endpoints. The **Data Layer** (MongoDB) stores all persistent data. The frontend and backend communicate using RESTful APIs over HTTP, with JSON as the data exchange format.

**Q4. What is the MERN stack?**
MERN is an acronym for four technologies: **M**ongoDB (database), **E**xpress.js (backend framework), **R**eact.js (frontend library), and **N**ode.js (runtime environment). The biggest advantage is that all four use JavaScript as their programming language, so developers can work on both frontend and backend using a single language. This reduces context-switching and speeds up development.

**Q5. Who are the users of your system and what can they do?**
There are three user roles:
- **Student (user)**: Can register, login, search for nearby messes, view menus, add items to cart, place orders, view order history, save favorites, and manage their profile.
- **Mess Owner**: Has all student permissions plus the ability to register their mess, add/delete menu items from their dashboard.
- **Admin**: Has full control — can view all registered users, delete users, delete messes, and promote other users to admin.

**Q6. What is the data flow in your application?**
The user interacts with the React frontend which captures their actions. The frontend sends an HTTP request to the Express backend, including a JWT authentication token for protected routes. The backend middleware first verifies the token and checks the user's role. Then the route handler processes the request by querying MongoDB through Mongoose. The database returns the result, which the backend sends back as a JSON response. Finally, React receives the response, updates its component state, and re-renders the UI to reflect the changes.

**Q7. How is this project different from Swiggy/Zomato?**
Our project is specifically designed for the **college/hostel ecosystem**, focusing on mess and tiffin services rather than restaurants. It is a much simpler, localized solution — there is no payment gateway, no delivery tracking, and no complex logistics. It is meant to be a lightweight tool for students to discover and order from nearby mess services within their locality.

---

## Section 2: Frontend — React.js

**Q8. What is React.js?**
React is an open-source JavaScript library developed by Facebook (now Meta) for building user interfaces. It allows developers to create reusable UI components that manage their own state. React uses a declarative approach — you describe what the UI should look like for a given state, and React efficiently updates the DOM when the state changes.

**Q9. Why did you choose React over plain HTML/CSS/JS?**
Plain HTML creates Multi-Page Applications (MPAs) where every navigation causes a full page reload from the server. React creates Single Page Applications (SPAs) where only the content changes dynamically without reloading the page, providing a much smoother and faster user experience. Additionally, React's component-based architecture allows code reuse — for example, our Header and Footer components are written once and used across all pages.

**Q10. What is JSX?**
JSX stands for JavaScript XML. It is a syntax extension for JavaScript that allows you to write HTML-like markup directly inside JavaScript code. Behind the scenes, JSX is transformed into regular JavaScript function calls by a tool called Babel. JSX makes the code more readable and intuitive since you can see the UI structure alongside the logic that controls it.

**Q11. What is the Virtual DOM and how does it work?**
The Virtual DOM is a lightweight, in-memory representation of the actual browser DOM. When a component's state changes, React creates a new Virtual DOM tree and compares it with the previous one — this process is called **diffing**. React identifies the minimum number of changes needed and applies only those changes to the real DOM — this process is called **reconciliation**. This approach is much faster than directly manipulating the real DOM because DOM operations are expensive and slow.

**Q12. What is the difference between Class and Functional Components?**
Class components are ES6 classes that extend React.Component and use lifecycle methods like componentDidMount, componentDidUpdate, etc. Functional components are plain JavaScript functions that return JSX. With the introduction of Hooks in React 16.8, functional components can now manage state and lifecycle, making them the preferred modern approach. Our entire project uses functional components.

**Q13. What are React Hooks?**
Hooks are special functions introduced in React 16.8 that let you use React features (like state and lifecycle) in functional components without writing class components. They follow two rules: they must be called at the top level of a component (not inside loops or conditions), and they can only be called from React function components or custom hooks.

**Q14. Explain the Hooks you used in the project.**
- **useState**: Allows a functional component to hold and update local state. When the setter function is called, the component re-renders with the new value. We used it for form inputs, loading indicators, error messages, cart items, and toggle states.
- **useEffect**: Runs side effects (like API calls, subscriptions, or DOM manipulation) after the component renders. The dependency array controls when it re-runs — an empty array means it runs only once on mount. We used it to fetch data from the backend when pages load.
- **useNavigate**: Provided by React Router, it returns a function that lets you programmatically navigate to different routes. We used it to redirect users after login or after placing an order.
- **useParams**: Extracts dynamic parameters from the URL. For example, when a user visits /mess/abc123, useParams gives us the value "abc123" so we can fetch that specific mess's details.
- **useSearchParams**: Reads query parameters from the URL. We used it on the Search page to read the location parameter passed from the Home page search bar.

**Q15. What is State in React?**
State is a built-in object that stores data belonging to a component. When state changes, the component automatically re-renders to reflect the updated data. State is local and private to the component — other components cannot access it directly. In our project, examples of state include the list of messes fetched from the API, the contents of the shopping cart, loading/error flags, and form input values.

**Q16. What are Props in React?**
Props (short for "properties") are read-only inputs passed from a parent component to a child component, similar to function arguments. They allow data to flow downward through the component tree. Unlike state, props cannot be modified by the receiving component. In our project, we pass children components as props to our ProtectedRoute wrapper.

**Q17. What is the difference between State and Props?**
State is internal, mutable data managed within a component using useState. Props are external, read-only data passed from parent to child. State can be changed by the component itself, causing a re-render. Props cannot be changed by the receiving component — they are controlled by the parent.

**Q18. How does client-side routing work in your project?**
We use React Router DOM for client-side routing. Instead of the browser making a new request to the server for each page, React Router intercepts the URL change and renders the appropriate React component. The browser URL updates but no full page reload happens. This is what makes our app a Single Page Application. We define routes using the Route component, mapping URL paths to page components.

**Q19. What are Protected Routes and why are they needed?**
Protected routes are routes that should only be accessible to authenticated or authorized users. Without protection, anyone could directly type a URL like /admin or /orders and access sensitive pages. We implemented three levels of protection:
- **ProtectedRoute**: Checks if a JWT token exists — if not, redirects to /login.
- **AdminRoute**: Checks token AND role must be "admin" — otherwise redirects away.
- **MessOwnerRoute**: Checks token AND role must be "mess_owner" or "admin".

**Q20. How does the shopping cart work?**
The cart is managed entirely on the frontend using React's useState hook — it is not stored in the database. When a user clicks "Add+", the system checks if that item already exists in the cart. If yes, it increments the quantity; if no, it adds the item with quantity 1. The total amount is calculated dynamically by multiplying each item's price by its quantity and summing everything up. When the user clicks "Place Order", the cart data is sent to the backend API to create an order document in MongoDB.

**Q21. How do Favorites work in your project?**
Favorites are stored in the browser's localStorage, not in the database. When a user clicks the heart/favorite button on a mess, the mess's ID, name, and location are saved as a JSON array in localStorage. The Favorites page reads this array and displays the saved messes. This approach is simple but has a limitation — favorites are device-specific and won't sync across different browsers or devices.

**Q22. What is Conditional Rendering?**
Conditional rendering means showing different UI elements based on certain conditions. We use it extensively — for example, showing a loading spinner while data is being fetched, displaying an error message if the API call fails, showing "No messes found" when search results are empty, and showing different navigation options based on whether the user is logged in or not.

---

## Section 3: Build Tools — Vite & Tailwind CSS

**Q23. What is Vite and why did you use it?**
Vite is a modern frontend build tool created by Evan You (creator of Vue.js). Unlike traditional bundlers like Webpack (used by Create React App), Vite serves source code using native ES modules during development, which means it doesn't need to bundle the entire app before serving. This results in near-instant server startup and extremely fast Hot Module Replacement (HMR) — when you save a file, the change appears in the browser almost instantly.

**Q24. What is Hot Module Replacement (HMR)?**
HMR is a development feature where code changes are reflected in the browser immediately without a full page reload. Only the changed module is replaced while preserving the application state. This dramatically speeds up the development workflow since you don't lose form inputs or navigation state when making code changes.

**Q25. What is Tailwind CSS and why did you choose it?**
Tailwind CSS is a utility-first CSS framework. Instead of writing custom CSS classes, you compose designs using small, single-purpose utility classes directly in your HTML/JSX. For example, instead of creating a custom class with padding, background color, and rounded corners, you write utility classes. Benefits include faster development, consistent spacing/sizing, built-in responsive design support, and no need to manage separate CSS files.

**Q26. What is responsive design?**
Responsive design is an approach where a website's layout automatically adapts to different screen sizes and devices (mobile, tablet, desktop). We achieved this using Tailwind's responsive breakpoint prefixes (sm, md, lg, xl) which apply styles only at certain screen widths. Our application uses mobile-first design — the base styles target mobile, and additional styles are added for larger screens.

---

## Section 4: Backend — Node.js & Express.js

**Q27. What is Node.js?**
Node.js is an open-source, cross-platform JavaScript runtime environment built on Google Chrome's V8 JavaScript engine. It allows JavaScript to run outside the browser — on servers. Node.js uses an event-driven, non-blocking I/O model, which makes it lightweight and efficient for building scalable network applications. It is particularly well-suited for I/O-heavy operations like database queries and API calls.

**Q28. What is the event-driven, non-blocking I/O model?**
Traditional servers (like Apache) create a new thread for each incoming request, which consumes memory. Node.js uses a single thread with an event loop. When a request involves slow operations (like reading from a database), Node.js doesn't wait — it continues processing other requests and handles the result when the operation completes via a callback. This makes Node.js very efficient for handling many simultaneous connections.

**Q29. What is Express.js and why is it needed?**
Express.js is a minimal and flexible web application framework for Node.js. While Node.js has built-in HTTP capabilities, Express simplifies common tasks like defining routes, handling different HTTP methods, parsing request bodies, serving static files, and managing middleware. Without Express, you would need to write significantly more boilerplate code to handle these tasks manually.

**Q30. What is Middleware in Express.js?**
Middleware functions are functions that have access to the request object, response object, and the next middleware function in the application's request-response cycle. They execute sequentially in the order they are defined. Middleware can perform tasks like logging, authentication, data parsing, error handling, and more. Each middleware can either end the request-response cycle by sending a response, or pass control to the next middleware by calling the next() function.

**Q31. What middleware did you use in your project?**
- **express.json()**: A built-in middleware that parses incoming JSON request bodies so we can access the data via req.body.
- **cors()**: Third-party middleware that adds Cross-Origin Resource Sharing headers to responses, allowing the frontend to communicate with the backend across different origins.
- **verifyToken**: Custom middleware that validates JWT tokens from the Authorization header and attaches user information to the request object.
- **verifyAdmin**: Custom middleware that checks if the authenticated user has the "admin" role.
- **verifyMessOwner**: Custom middleware that checks if the user has the "mess_owner" or "admin" role.

**Q32. What is a REST API?**
REST (Representational State Transfer) is an architectural style for designing web services. A RESTful API uses standard HTTP methods to perform CRUD operations on resources identified by URLs. The key principles are: statelessness (each request is independent), uniform interface (consistent URL patterns), and resource-based design (each URL represents a resource like users, messes, or orders).

**Q33. What HTTP methods did you use and what do they mean?**
- **GET**: Retrieve data without modifying anything (e.g., fetching list of messes, getting user profile)
- **POST**: Create new data or submit data for processing (e.g., user registration, placing an order, adding a menu item)
- **DELETE**: Remove existing data (e.g., deleting a user, removing a menu item)
Each method has a specific semantic meaning, and using them correctly is a REST best practice.

**Q34. What are HTTP Status Codes?**
Status codes are three-digit numbers returned by the server to indicate the result of a request. They are grouped into categories:
- **2xx (Success)**: 200 OK, 201 Created
- **4xx (Client Error)**: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict
- **5xx (Server Error)**: 500 Internal Server Error
Using appropriate status codes helps the frontend understand what happened and respond accordingly.

**Q35. What is CORS and why is it needed?**
CORS (Cross-Origin Resource Sharing) is a browser security feature that blocks web pages from making requests to a different domain/port than the one that served the page. This is called the Same-Origin Policy. In development, our React frontend runs on port 5173 and the Express backend runs on port 5000 — these are different origins. Without the CORS middleware, the browser would block all API requests from the frontend. The cors() middleware adds special headers to the backend's responses telling the browser to allow these cross-origin requests.

**Q36. What is the difference between Authentication and Authorization?**
**Authentication** is verifying WHO a user is — confirming their identity through credentials like username and password. **Authorization** is determining WHAT a user is allowed to do — checking their permissions or role. In our project, the login process handles authentication (verifying credentials), while middleware like verifyAdmin and verifyMessOwner handle authorization (checking if the user has the right role to access a resource).

---

## Section 5: Database — MongoDB & Mongoose

**Q37. What is MongoDB?**
MongoDB is an open-source, document-oriented NoSQL database. Instead of storing data in rows and tables like relational databases (MySQL, PostgreSQL), MongoDB stores data in flexible, JSON-like documents called BSON (Binary JSON). Each document can have a different structure, and documents are grouped into collections (analogous to tables in SQL).

**Q38. What is the difference between SQL and NoSQL databases?**
SQL databases (like MySQL) use structured tables with fixed schemas, support complex joins, and follow ACID properties strictly. NoSQL databases (like MongoDB) use flexible document structures, are schema-less, scale horizontally more easily, and are better suited for rapidly changing data models. SQL uses the SQL query language; MongoDB uses its own query syntax with methods like find(), insertOne(), etc.

**Q39. Why did you choose MongoDB for this project?**
- The data (menus, orders) has varying structures that fit well with flexible documents
- JSON-like documents work naturally with JavaScript/Node.js
- Embedded documents allow us to store menu items directly inside a mess document, reducing the need for joins
- It integrates seamlessly with the rest of the MERN stack
- Easy to set up and use during development with no schema migrations needed

**Q40. What is Mongoose and why use it?**
Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. While MongoDB itself is schema-less, Mongoose lets us define schemas (blueprints) for our data, providing structure and validation. Benefits include data validation (ensuring required fields are present), type casting (converting strings to numbers), query helpers, middleware/hooks, and a cleaner API for database operations compared to the native MongoDB driver.

**Q41. What are Mongoose Schemas and Models?**
A **Schema** defines the structure, data types, validations, and defaults for documents in a collection. For example, our User Schema specifies that username must be a unique, required string. A **Model** is a compiled version of the Schema that provides an interface to perform CRUD operations on the collection. The Schema is like a blueprint, and the Model is like the factory that creates and manages documents based on that blueprint.

**Q42. What is the difference between Embedding and Referencing in MongoDB?**
**Embedding** means storing related data inside the same document. We embed menuItems inside the Mess document because menu items are always accessed along with the mess and don't exist independently.
**Referencing** means storing only the ID of a related document and linking them. We reference the User in the Order document using ObjectId because users and orders are independent entities that may be queried separately.
Embedding is faster for reads (one query gets everything) but can lead to large documents. Referencing keeps documents small but requires additional queries to resolve relationships.

**Q43. What is an ObjectId in MongoDB?**
ObjectId is a special 12-byte data type that MongoDB uses as the default primary key (_id) for every document. It is globally unique and contains embedded information: a timestamp, machine identifier, process ID, and a random counter. This ensures uniqueness even across distributed systems without a central authority.

---

## Section 6: Authentication & Security

**Q44. What is JWT (JSON Web Token)?**
JWT is an open standard for securely transmitting information between two parties as a compact, self-contained token. It consists of three parts separated by dots:
- **Header**: Contains the token type (JWT) and the hashing algorithm (e.g., HS256)
- **Payload**: Contains the claims — data like userId, role, and expiration time
- **Signature**: Created by hashing the header + payload with a secret key, ensuring the token hasn't been tampered with
JWTs are stateless — the server doesn't need to store session data, making them ideal for RESTful APIs.

**Q45. What is the difference between JWT and Session-based authentication?**
In **session-based** auth, the server stores session data in memory or a database and sends a session ID cookie to the client. Each request requires the server to look up the session. In **JWT-based** auth, all user information is encoded in the token itself — the server only needs to verify the token's signature without any database lookup. JWT is better for stateless REST APIs, while sessions are simpler for traditional server-rendered apps.

**Q46. Where do you store the JWT on the frontend and what are the tradeoffs?**
We store the JWT in localStorage. This is simple and persists across browser tabs and page refreshes. However, localStorage is vulnerable to XSS (Cross-Site Scripting) attacks — if malicious JavaScript runs on the page, it can read the token. A more secure alternative would be HTTP-only cookies, which cannot be accessed by JavaScript. For our academic project, localStorage is acceptable, but a production application should use HTTP-only cookies.

**Q47. What is password hashing and why is it important?**
Hashing is a one-way mathematical function that converts a password into a fixed-length, irreversible string. We use bcrypt for hashing. If a database is breached, attackers only get the hashes — not the actual passwords. Since hashing is one-way, the original password cannot be recovered from the hash. During login, we hash the entered password and compare it with the stored hash rather than comparing plain-text passwords.

**Q48. What is a Salt in password hashing?**
A salt is a random value added to a password before hashing. Without a salt, two users with the same password would have identical hashes — an attacker could use precomputed tables (rainbow tables) to crack them. With a salt, even identical passwords produce completely different hashes. Bcrypt automatically generates and stores the salt as part of the hash output, so we don't need to manage it separately. The "10" in our bcrypt configuration refers to the cost factor — the number of rounds of hashing, which makes brute-force attacks slower.

**Q49. What is Role-Based Access Control (RBAC)?**
RBAC is a security model where access permissions are assigned to roles rather than individual users. Each user is assigned a role, and each role has a defined set of permissions. In our project, we have three roles: "user" (basic access), "mess_owner" (can manage their mess), and "admin" (full system access). This approach is scalable — instead of managing permissions for each user individually, we simply assign them a role.

**Q50. How does your backend verify the user's role on each request?**
Our verifyToken middleware decodes the JWT to get the userId, then queries the database to fetch the user's current role. We deliberately fetch the role from the database rather than trusting the role stored in the JWT. This is because if an admin promotes a user's role, the change should take effect immediately without requiring the user to log out and log back in. The fresh database lookup ensures the most current role is always used.

---

## Section 7: Conceptual & Theoretical Questions

**Q51. What is a Single Page Application (SPA)?**
An SPA loads a single HTML file and dynamically rewrites the page content using JavaScript as the user navigates. Unlike traditional Multi-Page Applications (MPAs) where each navigation sends a request to the server for a new HTML page, SPAs update the DOM client-side. This results in faster navigation, smoother transitions, and a more app-like experience. Our React application is an SPA — the browser loads index.html once, and React Router handles all subsequent navigation.

**Q52. What is the difference between SPA and MPA?**
In an **MPA**, every page is a separate HTML document served by the server. Each click triggers a full page reload. In an **SPA**, there's one HTML document and JavaScript dynamically swaps the content. SPAs are faster after the initial load, provide a smoother UX, but may have slower initial load times and SEO challenges. MPAs are simpler, better for SEO, but have slower navigation due to full reloads.

**Q53. What is npm and package.json?**
npm (Node Package Manager) is the default package manager for Node.js. It allows you to install, manage, and share reusable JavaScript libraries. The package.json file is the manifest of a Node.js project — it lists the project name, version, scripts (like "start" and "dev"), and most importantly, all dependencies (third-party libraries the project needs). Running "npm install" reads package.json and downloads all listed dependencies into the node_modules folder.

**Q54. What is the difference between dependencies and devDependencies?**
**dependencies** are packages required for the application to run in production (e.g., React, Express, Mongoose). **devDependencies** are packages needed only during development (e.g., Vite, ESLint, Tailwind CSS). When deploying to production, devDependencies can be excluded to reduce the deployment size.

**Q55. What is async/await and why is it needed?**
JavaScript is single-threaded, so operations like API calls and database queries are handled asynchronously to avoid blocking. Async/await is syntactic sugar over Promises that makes asynchronous code look and behave like synchronous code, improving readability. The "async" keyword marks a function as asynchronous, and "await" pauses execution until a Promise resolves, without blocking other operations. We use it for all database queries and API calls in both frontend and backend.

**Q56. What is the Fetch API?**
The Fetch API is a modern, built-in browser interface for making HTTP requests. It replaces the older XMLHttpRequest (XHR). Fetch returns a Promise, making it work naturally with async/await. We use it in all our React components to communicate with the Express backend — sending GET requests to fetch data and POST requests to submit forms or place orders.

**Q57. What is localStorage?**
localStorage is a Web Storage API that allows web applications to store key-value pairs in the browser persistently. Data in localStorage survives page refreshes and browser restarts (unlike sessionStorage). We use it to store the JWT token, user ID, username, role, and favorite messes. The data is specific to the domain and cannot be accessed by other websites.

**Q58. What is JSON?**
JSON (JavaScript Object Notation) is a lightweight, text-based data interchange format. It is easy for humans to read and write, and easy for machines to parse and generate. It uses key-value pairs and arrays. JSON is the standard format for communication between our React frontend and Express backend — request bodies are sent as JSON, and API responses are returned as JSON.

---

## Section 8: Software Engineering

**Q59. What SDLC model did you follow?**
We followed the Agile/Iterative model. The project was developed in incremental sprints — first we built the authentication system, then mess registration and menu management, then the ordering system, and finally the admin panel. Each sprint resulted in a working feature that was tested before moving to the next. This approach allowed us to get early feedback and make adjustments without waiting for the entire project to be complete.

**Q60. What is the MVC pattern and did you use it?**
MVC stands for Model-View-Controller. The **Model** represents the data layer (our Mongoose schemas — User, Mess, Order). The **View** represents the UI (our React components). The **Controller** handles business logic and processes requests (our Express route handlers). While we didn't follow strict MVC with separate controller files, the conceptual separation is present in our architecture.

**Q61. How did you handle errors in your application?**
On the **backend**, every route handler is wrapped in a try/catch block. If an error occurs, we send an appropriate HTTP status code (400, 401, 404, 500) with a descriptive error message in JSON format. On the **frontend**, we catch errors from fetch calls and store them in an error state variable. The UI then conditionally renders styled error banners to inform the user about what went wrong, rather than crashing the application.

**Q62. What testing did you perform?**
We performed manual testing of all features including user registration, login, mess registration, menu CRUD operations, order placement, order history, favorites, admin operations, and role-based access control. We tested edge cases like duplicate registrations, invalid login credentials, accessing protected routes without a token, and empty search results. We also tested the responsive layout on different screen sizes.

**Q63. What are the limitations of your project?**
- No online payment integration — orders are placed but payment is handled offline
- No real-time order tracking or status updates
- Favorites are stored in localStorage, not synced across devices
- No image upload support for messes or menu items
- No email verification or password reset functionality
- No rating/review system for messes
- Search is client-side only, which doesn't scale for very large datasets

**Q64. What are your planned future enhancements?**
- Integration of Razorpay/Stripe for online payments
- Real-time order status tracking using WebSockets (Socket.io)
- Google Maps API integration for location-based mess discovery
- Push notifications for order confirmations and updates
- Image upload for mess banners and menu items using cloud storage
- Mobile application using React Native
- Rating and review system for messes
- Email/OTP verification during registration

**Q65. What is the significance of the .env file?**
The .env file stores sensitive configuration data (like database connection strings, JWT secret keys, and port numbers) as environment variables. These values should never be hardcoded in source code or pushed to version control (GitHub) because they could be exploited by attackers. The dotenv library loads these variables into the Node.js process at runtime. The .gitignore file ensures the .env file is excluded from Git commits.

**Q66. What is the difference between frontend and backend validation?**
**Frontend validation** provides instant feedback to users (e.g., "All fields are required" before form submission) and improves UX by preventing unnecessary API calls. **Backend validation** is the security layer — it checks data integrity on the server side because frontend validation can be bypassed by tools like Postman or browser developer tools. Both are necessary: frontend for UX, backend for security. We implement both in our project.

**Q67. Explain the concept of Component Reusability in your project.**
Component reusability means creating UI elements that can be used in multiple places without code duplication. Our Header and Footer components are perfect examples — they are defined once and imported into every page (Home, SearchMess, MessDetails, OrderHistory, AdminPanel, etc.). Similarly, our ProtectedRoute component is a reusable wrapper that can protect any route. This reduces code duplication, ensures consistency, and makes maintenance easier.

**Q68. What is the significance of the "key" prop in React lists?**
When rendering lists of elements, React needs a way to identify which items have changed, been added, or removed. The "key" prop gives each element a stable identity. We use unique identifiers like MongoDB's _id field as keys when rendering lists of messes, menu items, and orders. Without proper keys, React may inefficiently re-render entire lists instead of updating only the changed items, leading to poor performance and potential bugs.
