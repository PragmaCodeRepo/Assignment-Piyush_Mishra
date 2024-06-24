# Chat Application (demo video is also attached with name of demo_video.mkv)

This is a full-stack chat application with a Django backend and a React frontend.

## Table of Contents

- [Project Structure](#project-structure)
- [Setup](#setup)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Running the Application](#running-the-application)
- [Functionality](#functionality)
- [Docker Setup](#docker-setup)
- [Login Credentials](#login-credentials)
- [OpenAI API Key](#openai-api-key)

## Project Structure

.
├── backend
│ ├── assignment
│ │ ├── init.py
│ │ ├── settings.py
│ │ ├── urls.py
│ │ ├── wsgi.py
│ ├── myapp
│ │ ├── migrations
│ │ ├── init.py
│ │ ├── admin.py
│ │ ├── apps.py
│ │ ├── models.py
│ │ ├── serializers.py
│ │ ├── views.py
│ │ ├── urls.py
│ ├── Dockerfile
│ ├── manage.py
│ ├── requirements.txt
│ └── ...
├── frontend
│ ├── frontend
│ │ ├── public
│ │ ├── src
│ │ ├── Dockerfile
│ │ ├── package.json
│ │ └── ...
├── docker-compose.yml
└── README.md

markdown


## Setup

### Backend

1. Navigate to the `backend` directory:

    ```bash
    cd backend
    ```

2. Create a virtual environment:

    ```bash
    virtualenv venv
    ```

3. Activate the virtual environment:

    - On Windows:

      ```bash
      venv\Scripts\activate
      ```

    - On macOS/Linux:

      ```bash
      source venv/bin/activate
      ```

4. Install the required packages:

    ```bash
    pip install -r requirements.txt
    ```

5. Add your OpenAI API key in the `settings.py` file:

    ```python
    # backend/assignment/settings.py
    OPENAI_API_KEY = 'your-openai-api-key'
    ```

6. Start the Django development server:

    ```bash
    python manage.py runserver
    ```

### Frontend

1. Navigate to the `frontend/frontend` directory:

    ```bash
    cd frontend/frontend
    ```

2. Install the required packages:

    ```bash
    npm install
    ```

3. Start the React development server:

    ```bash
    npm start
    ```

## Running the Application

- The Django backend will be available at `http://localhost:8000`.
- The React frontend will be available at `http://localhost:3000`.

## Functionality

- **Login:** Users can log in with the username `pc` and password `pc`.
- **Chat:** Once logged in, users can send messages to the AI, which will respond using the integrated GPT model.
- **Logout:** Users can log out, which will invalidate their session.
- **Chat History:** Users' chat history is saved and can be viewed when they log back in.

## Docker Setup

You can also run the application using Docker.

1. Build and run the Docker containers:

    ```bash
    docker-compose up --build
    ```

2. The backend will be available at `http://localhost:8000`.
3. The frontend will be available at `http://localhost:3000`.

## Login Credentials

- **Username:** pc
- **Password:** pc

## OpenAI API Key

The application uses the OpenAI API for the ChatGPT model. To use this functionality, you need to add your OpenAI API key to the Django settings.

1. Open the `backend/assignment/settings.py` file.
2. Add the following line at the end of the file:

    ```python
    OPENAI_API_KEY = 'your-openai-api-key'
    ```

Replace `'your-openai-api-key'` with your actual OpenAI API key.

With these instructions, you should be able to set up and run both the backend and frontend
