# Video Random Dating Service, TING 💫

### 1️⃣ Project Overview

📌 **Development Period**

Duration: 2023.07.10 - 2023.08.18 (6 weeks)

<br/>

📌 **Team Members**


<table>
 <tr>
  <td>
  <a href="https://github.com/chosim-dvlpr"> 
   <img src="https://avatars.githubusercontent.com/u/121149171?v=4" />
  </a>
  </td>
    <td>
  <a href="https://github.com/dollseok"> 
   <img src="https://avatars.githubusercontent.com/u/122436585?v=4" />
  </a>
  </td>
    <td>
  <a href="https://github.com/giyeonkwon013"> 
   <img src="https://avatars.githubusercontent.com/u/122511574?v=4" />
  </a>
  </td>
    <td>
  <a href="https://github.com/cksghks89"> 
   <img src="https://avatars.githubusercontent.com/u/23161060?v=4" />
  </a>
  </td>
    <td>
  <a href="https://github.com/hayeongK"> 
   <img src="https://avatars.githubusercontent.com/u/83320865?v=4" />
  </a>
  </td>
    <td>
  <a href="https://github.com/sujeong1201"> 
   <img src="https://avatars.githubusercontent.com/u/37768793?v=4" />
  </a>
  </td>
 </tr>
 <tr>
  <td><b>Minji Byun (Team Lead) </b></td>
  <td><b>Eunseok Lee</b></td>
  <td><b>Giyeon Kwon</b></td>
  <td><b>Chanwhan Song</b></td>
  <td><b>Hayoung Kim</b></td>
  <td><b>Sujeong Jung</b></td>
 </tr>
 <tr>
  <td>FrontEnd</td>
  <td>FrontEnd</td>
  <td>FrontEnd</td>
  <td>Infra, BackEnd</td>
  <td>BackEnd</td>
  <td>BackEnd</td>
 </tr>
</table>

<br/>


📌 **Project Purpose**
- What should I say on a blind date?
- I don’t have anyone around to introduce me…
- And sometimes the person looks so different from their photo!

<br/>

📌 **Goals**

- Match users with compatible partners using an algorithm based on preferences and input data.
- Allow real-time conversation with score-based responses on question cards.
- Add successful matches to the friend list for ongoing chat.
- Enable interaction with other users through a community board.
- Provide points for recharging and use in the app.

<br/>

### 2️⃣ Service Introduction

📌 **Key Feature: Random Matching Algorithm**

- Match users based on their selected preferences.
- Match occurs when the combined score of male and female users, adjusted by wait time, exceeds 50 points.
- Prevent users from being matched with the same partner twice.

<br/>

📌 **Key Feature: Question Card Suggestions**

- Present question cards to facilitate conversation.
- Award points based on answers to each card.
- Access a database of 100+ questions divided by category.
- Display 3 mandatory questions and 7 random questions.

<br/>

📌 **Key Feature: Chat Functionality**

- Add successful matches to the friend list to enable chat.
- Real-time chat using WebSocket, with unread and recent messages visible.
- Display “closeness” score based on analyzed chat history on the profile page.

<br/>

📌 **Key Feature: Community**

- Select A vs B options on trending issues through a debate board.
- Seek anonymous dating advice on a relationship advice board.
- Communicate with others using comments and likes.
<br/>

📌 **Key Feature: Item Shop**

- Recharge virtual currency through KakaoPay.
- Use points to buy items like matching tickets and mystery boxes.
<br/>

### 3️⃣ Tech Stack

- Back-End
  - Java
  - Spring Boot
  - Spring JPA
  - Spring Security
  - Stomp
  - JWT
  - OAuth2
  - Openvidu
- Front-End
  - React
  - Redux
  - Redux-Persist
  - JavaScript
  - Node.js
  - Axios
  - Stomp.js
  - Openvidu
- Infra
  - Docker
  - Ngnix
  - Jenkins
  - Amazon S3
- DB
  - MySQL
  - MongoDB
- Team Collaboration Tool
  - Gitlab
  - Jira
  - Notion
  - Figma
  - Mattermost
  - Webex

<br/>

### 4️⃣ ERD

![ERD](img/ERD.png)

<br/>


### 5️⃣ Service Screens

- Landing Page<br>
![Landing Page](img/main.png)
<br>

- Matching<br>
![Matching](img/matching.png)
<br>

- Chat<br>
![Chat](img/chat.png)
<br>

- Item Shop<br>
![Item Shop](img/item.png)
<br>
