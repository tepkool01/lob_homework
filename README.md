# 📮 Postcard address suggester - Lob
The purpose of this assignment is to showcase a minimally viable product for an address suggester. This assignment
will also open up a dialogue for improving the design towards scalability, security, performance, testability,
among other architecturally significant requirements.

---
## Installation
The installation section will describe the requirements for this project and how to successfully run the application.
Basic programmatic knowledge is required.

### Pre-requisites
Tools, languages, and various software required to run this program. These are the versions of the software used to create the program contained and do not dictate the minimum requirements.

| Tool | Version |
|------|---------|
| Yarn | 1.5.1   |
 | Node | 12.14.1 |

### Running
1. Run `yarn install` from this directory
2. Run `yarn run dev` to run the development version of the application

### Testing
todo

---
## API Design
| Action | Path | Payload | QueryParams                        | Example | Description |
|--------|------|---------|------------------------------------|---------|-------------|
 | GET   | /addresses | None | **str**: String, **limit**: Number | ex | searches |

---

## Project requirements
The project requirements section extrapolates the details from the raw requirements into actionable steps. Assumptions,
guesses, alternative strategies, edge cases, and anything relevant to the project's requirements are included to support
the decisions made.

### Distilled Requirements
- [ ] The system shall have an address field to input the recipient's address.
- [ ] The system shall suggest matching addresses based on user input's partial match of the respective addresses.
- [ ] The API shall filter addresses from the address file based on text input in the address field.
- [ ] The system shall implement basic CRUD (Create, Read, Update, Delete) 'manage' operations on the addresses.json dataset.
- [ ] The API shall run continuously without user-driven fault for the duration of the interview (60 minutes). 

### Non-Functional Requirements
1. Share with the team 'methodology and best practices when designing an API / microservice'.
2. Max time spent on project 1-2 hours.
3. Explain a production-ready solution.
4. Naming should be standardized which promotes readability and maintainability.
5. Solution should be testable/verifiable.
6. Submitted via greenhouse: https://app.greenhouse.io/tests/de86d3ebcd9a2fcc8d513cbe176cc0e2?utm_medium=email&utm_source=TakeHomeTest

### Assumptions
- An 'address' contains only ASCII characters
- Addresses are US-based, no foreign addresses

---
## Future considerations
### Feature improvements and changes
- Dependency Injection and Inversion of the search methods. Inject into the List call, then leverage an interface to swap out different search algorithms, i.e. cosine similarity
- Geolocation to better rank/sort return results, i.e. if client in New Jersey and types 'New', have New Jersey come up ranked higher than New Hampshire.
- Pagination (or re-use suggestions as part of the search API)
- Bolding parts of the match
- Multiple line addresses, i.e. address line 1, line 2, postal code, etc.
- ML added, potentially recommending KNN if address is narrow enough
- Sanitation on both server/client
- CSS added, build for mobile

#### Structural Improvements
- API layer abstraction, i.e. API Gateway, based on OpenAPI standards with swagger
- 100% statement and branch coverage, testing of the API contract
- front-end framework built with best practices, skeleton structure appropriate, separation of client/server
- potentially dockerize/kube/native cloud microservice the backend
- caching of frequent lookups to reduce DB load
- potentially using sockets for performance improvement
- sanitization of inputs for security
- API key, and relevant security headers
- System logging of requests
- Pipeline tests, DAST for security, fuzzers, edge testing
- Protobufs potentially instead of the JSON payloads in our API design
- Improved searching mechanism, i.e. how rainbow tables work (in a way); depending on size, sharding of DB
- TLS, CORS security
- Linting, webpack optimizations (need to compile down to an earlier Javascript, and leverage ESM), new backend language for efficiency (golang, rust, etc), unless goes outside of org's typical knowledge-base
- Code smell checker, i.e. SonarQube, with appropriate rules set
- Terraform or similar to aid deployment and maintain state when deploying to cloud
- Dependency inject the database so we can swap easily