# ADR 1: UCSD Online Marketplace

**Date Adopted:** 8 May, 2025  
**Status:** Accepted  
**Deciders:** 10X Brogrammers Team (Team 15)


## Context
- We are building an online UCSD marketplace for buying/selling/trading clickers, school merch, calculators and other academic and non-academic UCSD materials.

## Decision
- Anyone on the internet can view the listings in guest mode 
- Need to sign-in as UCSD student in order to buy, sell, post listings 
- The log-in will be enforced via Student Sign-On (SSO)


## Rationale
- This will be the primary differentiation from existing marketplaces.
- Students find it hard to go off-campus for the buy/sale process.
- Helps avoid scams by limiting bad actors. 
- Keeps the platform trustworthy. 
- Safer peer-to-peer experience. 

## Potential Downsides
- Limits potential reach and impedes scalability.
- Adds complexity to authentication and permissions logic.  

## Alternatives Considered
- ***Open Access to all Users***
  1. Higher risk of scams and lack of trust
  2. Easier to implement 
