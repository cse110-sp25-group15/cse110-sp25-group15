# Issues

## For all
---

- Transition Loading Pictures
- Policies for inserting into user table are resulting in error, investigate and resolve. Same thing with resolving bucket policies. 
- All pictures should be converted into WebP format or compressed for efficiency. 
- 404 Not found error page
- Stop using notify and instead use a custom notify message 
- Handle edge cases, what happens when something is missing? 
- Currently the whole app just presumes that there is only one thumbnail picture associated with a listing, need a comprehensive overview of how to handle multiple pictures, closely work with create listings and product details is necessary. 

## Landing
---

- No profiles page for displaying all listings from a person (design TBD)
- No settings page (design TBD)
- Words are not overlaying the Geisel picture
- Browse and List an item button should be next to Market Place Icon rather than in the middle
- Search bar does nothing right now (maybe backend issue?)
- Start browsing doesn't scroll the page down to the listings
- Landing picture should be converted to WebP

## Listing an Item
---

- No way to preview what a listing would look like, maybe use a product card? 
- Lots of unused space, maybe consider resizing dynamically or utilize space better?
- No button to return to browse page
- Create Listing only allows for listing of one image (when we have multiple it would be preferable to also differentiate between the thumbnail and other pictures)
- Listing creation complete should redirect flow back to browse
- Backend Bucket currently has zero way of distinguishing whose picture is uploaded by whom, security policy is also questionable at best
- Figure out how to convert uploaded pictures to WebP before sending to bucket
- Different error message and handling no  image uploaded (how should it fail?)
- The upload files button needs to look like a button 
- Should prevent uploading of file without any pictures
- Uploading pictures with the same name currently results in an error, maybe serialize and create a new name rather than use same name for files

## Chatwidget
---

- Appearance is good, maybe now implement individual chat windows?
- More integration requires understanding of how chat workflow should go.
- Do we want a fully blown chat service? Maybe there is a third party provider?

## Product Details
---

- Product details overlay needs polish in terms of layout and clarity of information displayed
- No need to fetch a complete new product details on every product detail load, the information should already exist somehow
- Description looks like a chatbox, differentiate it somehow
- Figure out contact seller methods, are we doing built-in chat or displaying window of contact info? How is security flow handled? 
- Does not display category (maybe not necessary?)
- No Obvious escape button, although it is easy to escape anyways
- Could take up more of the screen?

## BrowsePage
---
- Cards are just slightly too tall, need to be shorter vertically at least for MacBookAir view 
- Handle zero results returned, some placeholder message/page
- When refreshing listing there should be black placeholder listings as you are waiting
- When refreshing and there aren't enough listings it will scroll up automatically
- Maybe make it such that you can't scroll back to landing after reaching browse 
- Sort by button is incorrect or sending wrong event, need fix 
- Category pills spacing is inconsistent, I'd rather have multi rows than inconsistent spacing
- Add search feature for searching specific items
