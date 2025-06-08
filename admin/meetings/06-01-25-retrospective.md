# June 1 – Weekly Retro Meeting

## Time: 6:30 - 7 PM 
## Platform: Zoom  

## People Present
- [ ] Haoyan Wan  
- [x] Dhruv Agarwal  
- [x] Aniruddha Dasu  
- [ ] Adam Connor  
- [x] Ahmed Abdullahi  
- [x] Anthony Nguyen  
- [x] Damian Nieto  
- [ ] Hetvi Gandhi  
- [ ] Kiichiro Wang  
- [x] Nasser Al-Nasser  
- [x] Pantea Foroutan  

## Retrospective

## Retrospective

### What Went Well  
- Dhruv fixed several bugs such as error messages for unsupported file types, disclaimer for the chat widget, redirecting to browser after listing creation, and also created 5 new listings. Currently working on writing unit tests for controller layer. 
- Nasser implemented multiple frontend enhancements including fixing the chat widget overlay, resolving the dorm life bug, setting a default for sorting, enabling multiple images per listing, and updating the preview to match the original listing layout.  
- Ahmed is actively clearing out unused CSS and JS and plans to remove all console comments by next week.  
- Ani worked on image caching (which required file changes) and has begun writing 6 unit tests for the model layer.  
- Anthony contributed to backend tech debt and has started preparing tests for the listings form.  
- Damian added email validation logic to prevent non-UCSD users from logging in.  
- Pantea completed functionality to delete all listings and is finalizing API fallback handling.

### What Could Be Improved  
- Several browser alert messages (e.g. listing creation, editing, login errors) need to be replaced with styled disclaimers or toasts for consistency.  
- Animations and UI transitions across the frontend need refinement — some are unfinished or abrupt.  
- Dorm life was previously misspelled in the codebase, which caused functional issues — careful review during development is needed to avoid similar bugs.  
- Review functionality is currently broken and needs fixing.  
- Some component test files are outdated and need revision.

### Action Items  
- Replace browser `alert()` notifications with styled disclaimers or UI toasts.  
- Continue refining animations across the app — Nasser will lead this.  
- Review and clean up any incorrect tags or labels in listings (e.g. dorm life).  
- Fix non-UCSD login logic so browser-based feedback appears instead of terminal errors.  
- Ensure all non-UCSD test accounts previously created are manually deleted.  
- Finish unit tests under `models/testing/` — Ani to complete 6 tests.  
- Remove all unnecessary console logs and comments — Ahmed to lead this cleanup.  
- Update and modernize outdated component test files — Anthony to handle.  
- Finalize API fallback logic — Pantea to complete by tomorrow.

## Note-taker 
Dhruv Agarwal