endpoints needed:

- sign-up (used for signing in)
  - method: GET
  - query:
    - username: string
    - password: string
    - userType: 'Job Seeker' | 'Job Provider'
  - expected return:
    - response status

- sign-in (used for signing up)
  - method: POST
  - body:
    - username: string
    - password: string
    - name: string
    - userType: 'Job Seeker' | 'Job Provider'
  - expected return:
    - response status

- is-username-exist (used in forgot-password route. app will check if username exist or not, if exist then user can change password)
  - method: GET
  - query:
    - username: string
    - userType: 'Job Seeker' | 'Job Provider'
  - expected return:
    - response status
    - userId

- update-password (will change the user's password)
  - method: PATCH
  - body:
    - userId: uuid
    - userType: 'Job Seeker' | 'Job Provider'
    - password: string
  - expected return:
    - response status

- get-user (get a single user data)
  - method: GET
  - query:
    - userId: uuid
  - expected return:
    - response status
    - user data

- edit-job-seeker-user-data (update job seeker user data)
  - method: PATCH
  - body:
    - userId: uuid
    - username: string
    - password: string
    - name: string
    - birthPlace: string
    - birthDate: string (ISO string date)
    - lastEducation: 'SD' | 'SMP' | 'SMA' | 'Diploma'
  - expected return:
    - response status

- edit-job-provider-user-data (update job provider user data)
  - method: PATCH
  - body:
    - userId: uuid
    - username: string
    - password: string
    - name: string
  - expected return:
    - response status

- get-all-preferences (will get all the preferences)
  - method: GET
  - expected return:
    - response status
    - list of preferences id with value

- post-preferences (will add new preferences data)
  - method: POST
  - body:
    - array of preferences (ex: ['front-end developer', 'back-end developer', 'full stack developer'])
  - expected return:
    - response status

- get-all-jobs (will get all the jobs)
  - method: GET
  - expected return:
    - response status
