# InvestNaira Backend
###### Author: Jesse-Paul Osemeke
*Still under development*<br/>
This Django application serves as the backend for the InvestNaira web and mobile applications.

### Development
The following are steps to clone and get the project up and running on your computer:
- Clone the repository
- To get started locally (without docker):
    - **Using Pipenv**:
        - `cd` into the directory, and run `pipenv install`
    - **Using Virtualenv**
        - `cd` into the directory, and create a virtual environment.
        - Activate the virtual environment
        - Run `pip install -r requirements.txt`
    *It is advised that project be developed locally with pipenv*
- To get started with docker:
    - Run: `docker-compose build` and then `docker-compose up`
    - Alternatively, you can build and run together using `docker-compose up --build`. This command will buld your docker image and spin up the container afterwards.
    <br/>
    *Note: When running on docker, remove the `psycopg2` library in favour of `psycopg2-binary`. `psycopg2` is only there as a windows dependency*
- Further commands are saved in the commands.txt file

### File Structure and Special Files
- The file structure follows that of a conventional django application. However, there are some "special files/folders" that have been used/created during project configuration. These will be explained below:
- `data/`: This directory is created when spinning up the PostgreSQL image. Do NOT tamper with this directory. I will not be able to help you!!!
- `nginx/`: This directory contains the files for setting up and configuring NGINX, a reverse-proxy used in production to access the app from an external device using IP and Port. DNS is yet to be configured. This folder contains the Dockerfile and `nginx.conf`, which is the main config file.
- `docker-compose.yml` and `docker-compose.prod.yml`: These files are for local and production environments respectfully. They contain configurations for the web, db, celery, redis and nginx services, as needed.
- `Dockerfile`: This contains commands used to run the container when needed activated.
- `Pipfile`: This contains the project dependencies. If packages are installed with pipenv, the command `pipenv run pip freeze > requirements.txt` should be run, to update the `requirements.txt` file, as the docker setup depends on it being up-to-date.

<br/>

*NOTE THAT CELERY CONFIG ALSO EXISTS WITHIN THE PROJECT SETTING*