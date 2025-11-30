# TalhaVerse - Complete Setup & Testing Checklist

Use this checklist to verify your TalhaVerse installation is working correctly.

## Initial Setup

### 1. Environment Configuration
- [ ] Created `backend/.env` file
- [ ] Set `MONGO_URI` to your MongoDB connection string
- [ ] Generated strong `JWT_SECRET` (32+ characters)
- [ ] Generated strong `JWT_REFRESH_SECRET` (32+ characters)
- [ ] Set `ADMIN_EMAIL` to your email
- [ ] Set `ADMIN_PASSWORD` (min 6 characters)
- [ ] Created `frontend/.env` file
- [ ] Set `VITE_API_URL=http://localhost:5000/api`

### 2. Dependencies Installation
- [ ] Ran `npm install` in backend folder
- [ ] Ran `npm install` in frontend folder
- [ ] No installation errors reported
- [ ] `node_modules` folders created in both directories

### 3. Database Setup
- [ ] MongoDB is running (local or Atlas)
- [ ] Can connect to MongoDB (test with MongoDB Compass or CLI)
- [ ] Database name is correct in connection string

### 4. Admin User Creation
- [ ] Ran `npm run seed` in backend folder
- [ ] Saw success message: "✅ Admin user created successfully"
- [ ] Admin email and role displayed correctly

## Server Startup

### 5. Backend Server
- [ ] Started backend with `npm start` or `npm run dev`
- [ ] Saw "✅ Connected to MongoDB"
- [ ] Saw "🚀 Server running on port 5000"
- [ ] No error messages in console
- [ ] Can access http://localhost:5000/api/health
- [ ] Health check returns `{"status":"ok"}`

### 6. Frontend Server
- [ ] Started frontend with `npm run dev`
- [ ] Saw Vite startup message
- [ ] Server running on http://localhost:5173
- [ ] No compilation errors
- [ ] Browser opens automatically or manually navigate to URL

## Frontend Testing

### 7. Home Page
- [ ] Home page loads without errors
- [ ] TalhaVerse logo visible in navbar
- [ ] Hero section displays with gradient text
- [ ] "Explore Content" button visible
- [ ] Category cards display (7 categories)
- [ ] All category icons render correctly
- [ ] Footer displays at bottom

### 8. Navigation
- [ ] Navbar is sticky on scroll
- [ ] All navigation links work
- [ ] Theme toggle button present (Sun/Moon icon)
- [ ] Theme toggle switches between dark/light mode
- [ ] Mobile menu works (hamburger icon on small screens)
- [ ] Login/Signup buttons visible when not logged in

### 9. Authentication - Signup
- [ ] Navigate to /signup
- [ ] Signup form displays correctly
- [ ] Can enter username, email, password, confirm password
- [ ] Form validation works (password match, min length)
- [ ] Can create new user account
- [ ] Success toast notification appears
- [ ] Redirected to home page after signup
- [ ] Username appears in navbar

### 10. Authentication - Login
- [ ] Navigate to /login
- [ ] Login form displays correctly
- [ ] Can enter email and password
- [ ] Can login with admin credentials
- [ ] Success toast notification appears
- [ ] Redirected to home page after login
- [ ] "Admin" link appears in navbar for admin users

### 11. Authentication - Logout
- [ ] Logout button visible when logged in
- [ ] Click logout button
- [ ] User logged out successfully
- [ ] Redirected appropriately
- [ ] Login/Signup buttons reappear

## Admin Panel Testing

### 12. Admin Access
- [ ] Login as admin user
- [ ] "Admin" link visible in navbar
- [ ] Click "Admin" link
- [ ] Admin dashboard loads
- [ ] No permission errors

### 13. Admin Dashboard
- [ ] Statistics cards display (Users, Items, Downloads, Types)
- [ ] Numbers show correctly (0 initially)
- [ ] Quick action cards visible (Upload, Manage Items, Manage Users)
- [ ] Recent uploads section displays
- [ ] Content distribution section displays

### 14. Upload Content
- [ ] Click "Upload Content" button
- [ ] Upload form displays
- [ ] All form fields present:
  - [ ] Title
  - [ ] Type (dropdown with all types)
  - [ ] Version
  - [ ] Game Version
  - [ ] Author
  - [ ] Tags
  - [ ] Short Description (200 char limit)
  - [ ] Full Description
  - [ ] Installation Instructions
  - [ ] Changelog
  - [ ] Thumbnail upload
  - [ ] Screenshots upload
  - [ ] Content files upload

### 15. Test Upload
- [ ] Fill in all required fields
- [ ] Upload a test image as thumbnail
- [ ] Upload a test .zip file as content
- [ ] Click "Upload Content" button
- [ ] Upload progress shows (if applicable)
- [ ] Success toast notification appears
- [ ] Redirected to admin dashboard
- [ ] New item appears in recent uploads

### 16. Manage Items
- [ ] Navigate to Admin → Manage Items
- [ ] Uploaded item appears in table
- [ ] Thumbnail displays correctly
- [ ] Title, type, downloads, status show correctly
- [ ] Action buttons present (View, Featured, Delete)
- [ ] Can toggle featured status (star icon)
- [ ] Featured badge appears/disappears
- [ ] Can select multiple items (checkboxes)
- [ ] Bulk delete button appears when items selected

### 17. Manage Users
- [ ] Navigate to Admin → Manage Users
- [ ] User list displays
- [ ] Admin user appears in list
- [ ] Can search users
- [ ] Can change user role (dropdown)
- [ ] Can delete users (not yourself)
- [ ] Confirmation dialog appears before delete

## Public Content Testing

### 18. View Uploaded Content
- [ ] Navigate to home page
- [ ] Uploaded item appears in "Latest Uploads"
- [ ] Item card displays correctly:
  - [ ] Thumbnail
  - [ ] Title
  - [ ] Type badge with icon
  - [ ] Short description
  - [ ] Download count (0 initially)
  - [ ] Version number
- [ ] Hover effects work (card lifts, scales)

### 19. Category Pages
- [ ] Click on a category from home page
- [ ] Category page loads
- [ ] Category icon and title display
- [ ] Items of that type display
- [ ] Search bar present
- [ ] Sort dropdown present (Newest, Oldest, Most Downloaded, Top Rated)
- [ ] Can change sort order
- [ ] Items re-sort correctly
- [ ] Pagination appears if more than 12 items

### 20. Item Detail Page
- [ ] Click on an item card
- [ ] Detail page loads
- [ ] Large thumbnail displays
- [ ] Title and metadata show correctly
- [ ] Download button(s) visible
- [ ] Full description renders (markdown)
- [ ] Installation instructions display (if provided)
- [ ] Changelog displays (if provided)
- [ ] Screenshots gallery works (if provided)
- [ ] Can click thumbnails to change main image
- [ ] Sidebar shows:
  - [ ] Type badge
  - [ ] Download count
  - [ ] Rating (if applicable)
  - [ ] Author
  - [ ] Published date
  - [ ] Version
  - [ ] Game version
  - [ ] Tags
  - [ ] File size

### 21. Download Functionality
- [ ] Click download button on item detail page
- [ ] File download starts
- [ ] Success toast notification appears
- [ ] Download count increments by 1
- [ ] Refresh page to verify count persisted
- [ ] Download recorded in user history (if logged in)

### 22. User Dashboard
- [ ] Login as regular user (not admin)
- [ ] Navigate to Dashboard
- [ ] Profile information displays:
  - [ ] Username
  - [ ] Email
  - [ ] Role
- [ ] Download count shows correctly
- [ ] Favorites count shows
- [ ] Recent downloads list displays
- [ ] Downloaded items appear in history

## Search & Filter Testing

### 23. Search Functionality
- [ ] Go to any category page
- [ ] Enter search term in search bar
- [ ] Press Enter or click search
- [ ] Results filter based on search
- [ ] "No items found" shows if no matches
- [ ] Clear search returns all items

### 24. Sorting
- [ ] Test "Newest" sort - items in descending date order
- [ ] Test "Oldest" sort - items in ascending date order
- [ ] Test "Most Downloaded" - items by download count
- [ ] Test "Top Rated" - items by rating (if ratings exist)

## Featured Content

### 25. Featured Items
- [ ] Mark an item as featured in admin panel
- [ ] Go to home page
- [ ] Featured section displays
- [ ] Featured item appears with "Featured" badge
- [ ] Featured badge has gold/orange gradient
- [ ] Featured items appear in carousel/grid

### 26. Trending Items
- [ ] Items with most downloads appear in "Trending Now"
- [ ] Trending section displays on home page
- [ ] Trending icon visible
- [ ] Items sorted by download count

## Responsive Design

### 27. Mobile View (< 768px)
- [ ] Navbar collapses to hamburger menu
- [ ] Mobile menu opens/closes correctly
- [ ] All pages readable on mobile
- [ ] Cards stack vertically
- [ ] Forms are usable
- [ ] Buttons are tappable
- [ ] Images scale appropriately

### 28. Tablet View (768px - 1024px)
- [ ] 2-column grid for items
- [ ] Navbar shows some items, some in menu
- [ ] Admin tables scroll horizontally if needed
- [ ] Forms layout adjusts

### 29. Desktop View (> 1024px)
- [ ] Full navbar visible
- [ ] 3-4 column grid for items
- [ ] Optimal spacing and layout
- [ ] All features accessible

## Performance & UX

### 30. Animations
- [ ] Page transitions smooth
- [ ] Card hover animations work
- [ ] Button hover effects work
- [ ] Loading spinners appear during data fetch
- [ ] Stagger animations on lists
- [ ] No janky or laggy animations

### 31. Loading States
- [ ] Loading spinner shows while fetching data
- [ ] Skeleton screens or placeholders (if implemented)
- [ ] No blank screens during loading
- [ ] Error messages display if fetch fails

### 32. Toast Notifications
- [ ] Success toasts appear (green/primary color)
- [ ] Error toasts appear (red color)
- [ ] Toasts auto-dismiss after 3 seconds
- [ ] Toasts positioned correctly (top-right)
- [ ] Multiple toasts stack properly

### 33. Form Validation
- [ ] Required fields show error if empty
- [ ] Email validation works
- [ ] Password length validation works
- [ ] Password match validation works
- [ ] File type validation works
- [ ] File size validation works
- [ ] Error messages are clear

## Security Testing

### 34. Authentication
- [ ] Cannot access admin routes without login
- [ ] Cannot access admin routes as regular user
- [ ] Redirected to login if not authenticated
- [ ] Token refresh works (test by waiting 1 hour)
- [ ] Logout clears tokens

### 35. Authorization
- [ ] Regular users cannot access /admin
- [ ] Regular users cannot upload content
- [ ] Regular users cannot delete items
- [ ] Regular users cannot manage users
- [ ] API returns 403 for unauthorized requests

### 36. File Upload Security
- [ ] Cannot upload non-image files as thumbnail
- [ ] Cannot upload non-allowed file types as content
- [ ] File size limits enforced
- [ ] Malicious file names handled safely

## Error Handling

### 37. Network Errors
- [ ] Backend offline - shows error message
- [ ] Slow connection - shows loading state
- [ ] Failed requests - shows error toast
- [ ] Retry mechanism works (if implemented)

### 38. 404 Pages
- [ ] Invalid item slug shows "Item not found"
- [ ] Invalid routes show 404 or redirect
- [ ] Helpful error messages

### 39. Form Errors
- [ ] Server validation errors display
- [ ] Duplicate username/email shows error
- [ ] Invalid credentials show error
- [ ] Network errors during form submit handled

## Data Persistence

### 40. Database
- [ ] Uploaded items persist after server restart
- [ ] User accounts persist
- [ ] Download counts persist
- [ ] Featured status persists
- [ ] User download history persists

### 41. File Storage
- [ ] Uploaded files saved to backend/uploads
- [ ] Files organized in subdirectories (images, files)
- [ ] Files accessible via URL
- [ ] Deleted items remove associated files

## Browser Compatibility

### 42. Chrome/Edge
- [ ] All features work
- [ ] Animations smooth
- [ ] No console errors

### 43. Firefox
- [ ] All features work
- [ ] Animations smooth
- [ ] No console errors

### 44. Safari (if available)
- [ ] All features work
- [ ] Animations smooth
- [ ] No console errors

## Final Verification

### 45. Complete User Flow
- [ ] New user can signup
- [ ] User can browse content
- [ ] User can search and filter
- [ ] User can view item details
- [ ] User can download files
- [ ] Download history tracked
- [ ] User can logout

### 46. Complete Admin Flow
- [ ] Admin can login
- [ ] Admin can view dashboard stats
- [ ] Admin can upload new content
- [ ] Admin can manage items
- [ ] Admin can manage users
- [ ] Admin can toggle featured items
- [ ] Admin can delete items

### 47. Production Readiness
- [ ] All environment variables documented
- [ ] No hardcoded secrets in code
- [ ] README.md complete
- [ ] SETUP.md guide complete
- [ ] .gitignore configured
- [ ] No sensitive data in repository
- [ ] Error logging implemented
- [ ] Security headers configured (Helmet)
- [ ] CORS configured properly
- [ ] Rate limiting active

## Optional Enhancements (Future)

- [ ] Email verification for new users
- [ ] Password reset via email
- [ ] User avatars
- [ ] Comments on items
- [ ] Rating system
- [ ] Like/favorite items
- [ ] User profiles
- [ ] Advanced search filters
- [ ] AWS S3 integration
- [ ] CDN for images
- [ ] Analytics dashboard
- [ ] Automated backups
- [ ] SSL certificate
- [ ] Custom domain
- [ ] SEO optimization
- [ ] Social media sharing

---

## Summary

**Total Checks**: 47 main sections, 200+ individual checks

**Completion Status**: _____ / 47 sections complete

**Issues Found**: _____

**Notes**:
_____________________________________________
_____________________________________________
_____________________________________________

**Date Tested**: _____________________

**Tested By**: _____________________
