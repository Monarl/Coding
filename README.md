
## Backend Setup

1. **Database Configuration**:
    - Open `index.js` in the **back-end** folder.
    - Modify the `host`, `user`, `password`, and `database` settings to match your local MySQL configuration.
    - For simplicity, you can directly input your credentials (avoid using `process.env`).

2. **Creating Routes**:
    - In the **back-end** folder, create `x.route.js` files to handle routes for GET, POST, PUT, and DELETE requests.
    - Import `db` from `index.js` to access the mysql database for GET, POST, PUT, and DELETE requests
    - Each route file should use `export default` to export the router.

3. **Integrating Routes with Server**:
    - In `server.js`, import and use your route files to handle API requests.
    - Example: Use `app.use('/api', xRoute)` to integrate routes with the server.

## Frontend Setup

1. **App.jsx**:
    - In the **src** folder, `App.jsx` serves as the main entry point for the React app.
    - This file will handle routing for the components used across different sections of the app.

2. **Creating Components**:
    - All React components should be stored in the `components` folder.
    - Each component should be self-contained and exported as default.

## Running the Project

### Frontend:
1. Install dependencies:
    ```bash
    npm install
    ```
2. Run the Vite development server:
    ```bash
    npm run dev
    ```

### Backend:
1. Install backend dependencies:
    ```bash
    npm install
    ```
2. Start the backend server:
    ```bash
    nodemon server.js
    ```

## Notes

- Ensure that your MySQL database is running and the credentials are correctly set in `index.js`.
- To better understand the guide, you should watch the code I already did.
- Feel free to improve the setup if you find a better approach or workflow.

---

**Happy Coding!** 🚀
