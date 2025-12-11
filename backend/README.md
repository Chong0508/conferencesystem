[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/2IJ__7N2)
## Requirements for Assignment #2
[Read the instruction](https://github.com/STIWK2124-A251/class-activity-stiwk2124/blob/main/Assignment-2.md)

## Group Info:

| Photo | Name | Matric No | Phone Number | 
|-------|------|-----------|--------------|
| <img src="https://github.com/user-attachments/assets/e9652f90-518b-4b7f-9b35-539bad5e0da4" width="120"/> | Nurul Aini Binti Ahmad Nazli (Leader) | 299958 | 016-6102445 |
| <img src="https://github.com/user-attachments/assets/f4dcc649-70ea-4cdf-b690-f3eb786e2a6f" width="120"/> | Nurul Nabilah Binti Mohamed Mahathir | 298612 |  011-28942697 |
| <img src="https://github.com/user-attachments/assets/a16e2717-3252-4e0c-9b12-c603276a8bb9" width="120"/> | Nur Syazalina Binti Badrul Hisham | 297527 | 019-4611310 |
| <img src="https://github.com/user-attachments/assets/4dee492c-69cc-40cb-a75c-66a280799366" width="120"/> | Nur Atirah Binti Mohd Ridzuan | 300697 | 011-64489554 |
| <img src="https://github.com/user-attachments/assets/6cc45fc2-38ab-4842-900a-77be754a13f4" width="120"/> | Wan Nur Azimah Binti Wan Rahmat | 297976 | 011-60724726 |


## Title of your application (a unique title)
**ConfEase Backend: A Spring Boot and MySQL-Powered Conference Management API**

## Link for Docker Image

: https://hub.docker.com/r/nrsyzlna/confeasebackend

## Instructions on how to run the Docker.

1. Clone the repo
2. Start project
   - docker-compose up --build
3. Access services
   Backend: http://localhost:8080
   MySQL: port 3307
4. Stop project
   - docker-compose down
5. Pull backend image from Docker Hub
   - docker pull nrsyzlna/confeasebackend:latest
   - docker run -p 8080:8080 nrsyzlna/confeasebackend:latest

## List of all the endpoints

### 1. ReviewScore

**GET / POST**
```bash
http://localhost:8080/api/review-scores
```

**GET / PUT / DELETE**
```bash
http://localhost:8080/api/review-scores/{reviewId}/{criterionId}
```

### 2. Role

**GET / POST**
```bash
http://localhost:8080/api/roles
```

**GET / PUT / DELETE**
```bash
http://localhost:8080/api/roles/{id}
```

### 3. Room

**GET / POST**
```bash
http://localhost:8080/api/rooms
```

**GET / PUT / DELETE**
```bash
http://localhost:8080/api/rooms/{id}
```

### 4. Schedule

**GET / POST**
```bash
http://localhost:8080/api/schedules
```

**GET / PUT / DELETE**
```bash
http://localhost:8080/api/schedules/{id}
```

### 5. ScoreCriterion

**GET / POST**
```bash
http://localhost:8080/api/score-criteria
```

**GET / PUT / DELETE**
```bash
http://localhost:8080/api/score-criteria/{id}
```

### 6. Session

**GET / POST**
```bash
http://localhost:8080/api/sessions
```

**GET / PUT / DELETE**
```bash
http://localhost:8080/api/sessions/{id}
```

### 7. Track

**GET / POST**
```bash
http://localhost:8080/api/tracks
```

**GET / PUT / DELETE**
```bash
http://localhost:8080/api/tracks/{id}
```

### 8. User

**GET / POST**
```bash
http://localhost:8080/api/users
```

**GET / PUT / DELETE**
```bash
http://localhost:8080/api/users/{id}
```

### 9. UserRole

**GET / POST**
```bash
http://localhost:8080/api/user-roles
```

**GET / PUT / DELETE**
```bash
http://localhost:8080/api/user-roles/{userId}/{roleId}
```

### 10. Conference

**GET / POST**
```bash
http://localhost:8080/api/conferences
```

**GET / PUT / DELETE**
```bash
http://localhost:8080/api/conferences/{id}
```

### 11. Discussion

**GET / POST**
```bash
http://localhost:8080/api/discussions
```

**GET / PUT / DELETE**
```bash
http://localhost:8080/api/discussions/{id}
```

### 12. EmailLog

**GET / POST**
```bash
http://localhost:8080/api/email-logs
```

**GET / PUT / DELETE**
```bash
http://localhost:8080/api/review-scores/email-logs/{id}
```

### 13. Event

**GET / POST**
```bash
http://localhost:8080/api/events
```

**GET / PUT / DELETE**
```bash
http://localhost:8080/api/events/{id}
```

### 14. Keyword

**GET / POST**
```bash
http://localhost:8080/api/keywords
```

**GET / PUT / DELETE**
```bash
http://localhost:8080/api/keywords/{id}
```

### 15. LogActivity

**GET / POST**
```bash
http://localhost:8080/api/log-activities
```

**GET / PUT / DELETE**
```bash
http://localhost:8080/api/log-activities/{id}
```

### 16. Notification

**GET / POST**
```bash
http://localhost:8080/api/notifications
```

**GET / PUT / DELETE**
```bash
http://localhost:8080/api/notifications/{id}
```

### 17. Paper

**GET / POST**
```bash
http://localhost:8080/api/papers
```

**GET / PUT / DELETE**
```bash
http://localhost:8080/api/papers/{id}
```

### 18. PaperKeyword

**GET / POST**
```bash
http://localhost:8080/api/paper-keywords
```

**GET / PUT / DELETE**
```bash
http://localhost:8080/api/paper-keywords/{paperId}/{keywordId}
```

### 19. Payment

**GET / POST**
```bash
http://localhost:8080/api/payments
```

**GET / PUT / DELETE**
```bash
http://localhost:8080/api/payments/{id}
```

### 20. Rebuttal

**GET / POST**
```bash
http://localhost:8080/api/rebuttals
```

**GET / PUT / DELETE**
```bash
http://localhost:8080/api/rebuttals/{id}
```

### 21. Registration

**GET / POST**
```bash
http://localhost:8080/api/registrations
```

**GET / PUT / DELETE**
```bash
http://localhost:8080/api/registrations/{id}
```
### 22. Review

**GET / POST**
```bash
http://localhost:8080/api/reviews
```

**GET / PUT / DELETE**
```bash
http://localhost:8080/api/reviews/{id}
```

### 23. Reviewer

**GET / POST**
```bash
http://localhost:8080/api/reviewers
```

**GET / PUT / DELETE**
```bash
http://localhost:8080/api/reviewers/{id}
```

### 24. Author

**GET / POST**
```bash
http://localhost:8080/api/author
```

**GET / PUT / DELETE**
```bash
http://localhost:8080/api/review-scores/author/{id}
```

## Result/Output (Screenshot of the output)

Output API using POSTMAN

**Reviewer Controller**

1. GET all reviewers

   <img width="1919" height="1020" alt="image" src="https://github.com/user-attachments/assets/7ea8130d-4dec-4768-aac1-b53b93f9ed4e" />

2. GET reviewer by ID

   <img width="1918" height="1019" alt="image" src="https://github.com/user-attachments/assets/5d6f39cf-8498-48d6-b17b-507f7a987e29" />

3. POST create reviewer

   <img width="1919" height="1023" alt="image" src="https://github.com/user-attachments/assets/1e20cafe-8aa6-4fe2-ba3a-4836ae140d4e" />

4. PUT update reviewer

   <img width="1917" height="1023" alt="image" src="https://github.com/user-attachments/assets/90d2386b-bc4f-45a2-acf9-04760d0063f0" />


**Review Score Controller**

1. GET all review scores

   <img width="1913" height="1020" alt="image" src="https://github.com/user-attachments/assets/cf05617d-4d50-435d-812d-6bf4576e4353" />

2. GET review score by composite ID

   <img width="1919" height="1020" alt="image" src="https://github.com/user-attachments/assets/ef9b0d42-9f08-485c-b174-4be04fac24b0" />

3. POST create review score

   <img width="1919" height="1023" alt="image" src="https://github.com/user-attachments/assets/84a14c09-f2f2-483f-aba3-d1dc9e25d2ac" />

4. PUT update review score

   <img width="1919" height="1022" alt="image" src="https://github.com/user-attachments/assets/097d05ee-d291-47b0-8e90-6d73b21e34fc" />

5. DELETE review score

   <img width="1919" height="1021" alt="image" src="https://github.com/user-attachments/assets/1918f886-92fd-4301-86e0-6a500baf963d" />

After Deletion

   <img width="1919" height="1026" alt="image" src="https://github.com/user-attachments/assets/29b0cb15-9cc5-4b37-b832-aea79b730e9d" />


**Session Controller**

1. GET all sessions

   <img width="1919" height="1020" alt="image" src="https://github.com/user-attachments/assets/e8dcccd2-eced-44cb-9d0c-3912ca01b5c0" />

2. GET session by ID

   <img width="1919" height="1022" alt="image" src="https://github.com/user-attachments/assets/ff8e8feb-d143-44ad-a310-eb10b591ba7b" />

3. POST create session

   <img width="1919" height="1021" alt="image" src="https://github.com/user-attachments/assets/f552fe45-c524-48b9-92f4-1cce25147a50" />

4. PUT update session

   <img width="1919" height="1023" alt="image" src="https://github.com/user-attachments/assets/b45c8329-3f05-4106-886b-6c46002f8573" />


**Track Controller**

1. GET all tracks

   <img width="1919" height="1018" alt="image" src="https://github.com/user-attachments/assets/3c999707-8699-4f61-a4ea-6a8f96d7f579" />

2. GET track by ID

   <img width="1919" height="1023" alt="image" src="https://github.com/user-attachments/assets/5a763ae4-fd34-4aa0-a05d-ce001140ca34" />

3. POST create track

   <img width="1919" height="1020" alt="image" src="https://github.com/user-attachments/assets/71159131-89b7-469c-8306-305cfc253c7d" />

4. PUT update track

   <img width="1919" height="1022" alt="image" src="https://github.com/user-attachments/assets/003d1ad0-d713-4b7a-95ec-c6b24af9fbdf" />

**Role Controller**

1. GET all roles
   
   <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/bffb3a75-453b-44a7-9a43-3ce4dc2c0f08" />

2. GET role by ID
   
   <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/541e498e-64d2-4853-80b5-a06213917fb7" />

3. POST create role
   
   <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/2a79c978-5910-41ad-aef3-3604cdf0936b" />

4. POST update role
   
   <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/d7aee948-ed0e-4cb0-94e3-c5d7ce43efa1" />





## References (Not less than 10)

1. Building a RESTful Web Service. (n.d.). Spring.io. Retrieved from https://spring.io/guides/gs/rest-service
2. Hequan Shi, Lingyun Ying, Libo Chen, Haixin Duan, Ming Liu, and Zhi Xue. (2025). Dr. Docker: A Large-Scale Security Measurement of Docker Image Ecosystem. In Proceedings of the ACM on Web Conference 2025 (WWW '25) (pp. 2813–2823). Association for Computing Machinery, New York, NY, USA. https://doi-org.eserv.uum.edu.my/10.1145/3696410.3714653
3. Li, N., Wang, J., Chen, C., & Hu, H. (2024). Application of API automation testing based on micro-service mode in industry software. Algorithms, Software Engineering, and Network Security (ASENS 2024) (pp. 460–464). https://doi.org/10.1145/3677182.3677264
4. Michail Pantelelis, & Christos Kalloniatis. (2023). Mapping CRUD to Events - Towards an object to event-sourcing framework. https://doi.org/10.1145/3575879.3576006
5. Minh, N. H. (2022). Spring Data JPA Composite Primary Key Examples. Codejava.net. Retrieved from https://www.codejava.net/frameworks/spring/spring-data-jpa-composite-primary-key-examples
6. Mikael Sabuhi, Petr Musilek, and Cor-Paul Bezemer. (2022). Studying the Performance Risks of Upgrading Docker Hub Images: A Case Study of WordPress. In Proceedings of the 2022 ACM/SPEC on International Conference on Performance Engineering (ICPE '22) (pp. 97–104). Association for Computing Machinery, New York, NY, USA. https://doi-org.eserv.uum.edu.my/10.1145/3489525.3511683
7. Rodríguez, K. S. R., Avellaneda Galindo, J. D., Tárrega Juan, J., Bermejo Higuera, J. R., Bermejo Higuera, J., & Sicilia Montalvo, J. A. (2025). Secure development methodology for full stack web applications: Proof of the methodology applied to Vue.js, Spring Boot and MySQL. Computers, Materials & Continua. Retrieved from https://www.sciencedirect.com/org/science/article/pii/S1546221825008203
8. Zhao, P., Zhang, D., & Lei, S. (2024). Design and Implementation of Office Automation Management System Based on Spring Boot. 37 (pp. 228–233). https://doi.org/10.1145/3686424.3686463
9. Wan Ishak, W. H. W., Mat Yamin, F., Mohamad Mohsin, M. F., & Mansor, M. F. (2023). A comparative review of conference management system. Journal of Technology and Operations Management, 18(2), 87–93. https://doi.org/10.32890/jtom2023.18.2.7
10. Patil, A. H. L., Mahalle, P. N., Patil, V. H., & Bhavsar, S. A. (2022). An efficient and intelligent conference management system- desired services and features. Research Square. Preprint. https://doi.org/10.21203/rs.3.rs-1900925/v1
‌
## Link for the YouTube Presentation

https://youtu.be/HlTsJQya2yA?si=khqiOmxuotqB4gpV 
