# ADR 3: Supabase Auth and Postgres
**Date:** 13 May, 2025  
**Status:** Proposed  
**Deciders:** 10X Brogrammers Team (Team 15) - Haoyan Wan


## Context
- As a second-hand selling marketplace we need the ability for users to create listings and delete old posts. These requests cannot be done without authorized roels. Without authorization, we would need to blanketly allow access to our database which presents a massive security concern. We also need a database to begin with which is also a problem that needs to be solved here. 

## Proposal
- We present using Supabase as a comprehensive solution to our database and authentication needs.  


## Rationale
- Supabase covers all of our needs in terms of auth and database. It also bundles the security logic of accessing the database directly using our JWT token. 
- It removes the need of a separate backend to handle these logic which lowers comlexity and concern of server hosting.  
- It provides better security than in-house solutions that we would be able to come up with and saves development time debugging/creating these solutions. 

## Potential Downsides
- Usage of cloud providers creates vendor lock and potential excessive costs after the free tier. 
- Offloading database and authentication adds some developer load since it is new technology that we would need to learn.
- We are limited and vulnerable to their server avalabilities and data safty. 

## Alternatives Considered
- Have considered the use of Firebase which provides similar features 
    - Supabase is open source which allows for future potential changes incase we decide to host in house
    - Supabase provides an arguable better developer experience with user interfaces
    - Supabase free tier is more generous than firebase for small projects like us
---