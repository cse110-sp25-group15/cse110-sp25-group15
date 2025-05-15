import { ListingController } from './controllers/ListingsController.js';
import { AuthController } from './controllers/AuthController.js';
// Initialize the controller
const listingController = new ListingController();
const authController = new AuthController();
authController.init();
listingController.init();
